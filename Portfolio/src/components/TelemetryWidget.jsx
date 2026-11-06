import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Sliders,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const WAVEFORM_MODES = [
  { id: 'pwm', label: 'PWM Motor Drive', icon: Zap, desc: 'TIM1 200kHz Micro-Step Drive' },
  { id: 'adc', label: 'ADC Sensor Stream', icon: Activity, desc: '16-Ch Circular DMA Ingestion' },
  { id: 'laser', label: 'Laser Gate Pulse', icon: Radio, desc: 'DB25 Laser Interlock Modulation' },
];

export default function TelemetryWidget() {
  const [mode, setMode] = useState('pwm');
  const [dutyCycle, setDutyCycle] = useState(65); // 10% - 95%
  const [baudRate, setBaudRate] = useState(921.6); // 115.2 kbps - 2000.0 kbps
  const [isRunning, setIsRunning] = useState(true);
  const [packetLog, setPacketLog] = useState([]);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Mutable refs for 60fps RAF loop without re-triggering React renders
  const isRunningRef = useRef(isRunning);
  const isVisibleRef = useRef(true);
  const modeRef = useRef(mode);
  const dutyCycleRef = useRef(dutyCycle);
  const baudRateRef = useRef(baudRate);
  const phaseRef = useRef(0);
  const lastPacketTimeRef = useRef(0);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    dutyCycleRef.current = dutyCycle;
  }, [dutyCycle]);

  useEffect(() => {
    baudRateRef.current = baudRate;
  }, [baudRate]);

  // Generate dynamic hex packet line
  const generatePacket = useCallback((currentBaud, currentDuty, currentMode) => {
    const timestamp = (performance.now() / 1000).toFixed(3);
    const hexDuty = Math.round((currentDuty / 100) * 255).toString(16).padStart(2, '0').toUpperCase();
    const hexBaud = Math.round(currentBaud).toString(16).padStart(4, '0').toUpperCase();
    const randomByte1 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    const randomByte2 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    const cpuLoad = (1.2 + (currentBaud / 2000) * 0.8).toFixed(1);

    const modeTag = currentMode === 'pwm' ? 'PWM_DRV' : currentMode === 'adc' ? 'ADC_DMA' : 'LSR_GATE';

    return {
      id: Math.random().toString(),
      text: `[${timestamp}s] [${modeTag}] 0xAA 0x55 0x${hexDuty} 0x${hexBaud.slice(0, 2)} 0x${hexBaud.slice(2)} 0x${randomByte1} 0x${randomByte2} | CRC16: OK | CPU: ${cpuLoad}%`,
    };
  }, []);

  // Performance rule: IntersectionObserver pauses RAF when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Canvas Oscilloscope 60fps Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      // Skip render if paused or scrolled off-screen for 100/100 performance
      if (!isVisibleRef.current || !isRunningRef.current) {
        lastTime = now;
        return;
      }

      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Handle DPI scaling
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Speed scaled by baudRate
      const speed = (baudRateRef.current / 400) * 12;
      phaseRef.current += dt * speed;

      // 1. Clear background
      ctx.fillStyle = '#09090b'; // zinc-950
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Oscilloscope Grid / Graticule
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)'; // faint red grid
      ctx.lineWidth = 1;
      const numCols = 10;
      const numRows = 6;
      const colStep = width / numCols;
      const rowStep = height / numRows;

      for (let x = 0; x <= width; x += colStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += rowStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center crosshair (slightly brighter)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // 3. Render Waveform
      const curMode = modeRef.current;
      const curDuty = dutyCycleRef.current / 100;
      const centerY = height / 2;
      const amp = height * 0.34;

      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#ef4444'; // red-500
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;

      const totalPoints = Math.floor(width);
      for (let x = 0; x < totalPoints; x++) {
        const t = (x / width) * 8 + phaseRef.current;
        let y = centerY;

        if (curMode === 'pwm') {
          // Square wave with slight analog slew edge rounding
          const cycle = t % 1;
          const isHigh = cycle < curDuty;
          const targetY = isHigh ? centerY - amp : centerY + amp;
          y = targetY;
        } else if (curMode === 'adc') {
          // Analog multi-harmonic sine stream (representing ADC DMA sensor acquisition)
          const harm1 = Math.sin(t * 3.5);
          const harm2 = Math.sin(t * 7.2) * 0.25;
          const noise = (Math.sin(t * 23.1) * 0.08) * (curDuty * 1.2);
          y = centerY - (harm1 + harm2 + noise) * amp;
        } else if (curMode === 'laser') {
          // Burst pulses (DB25 digital modulation)
          const burstCycle = (t * 0.5) % 1;
          const isBurstActive = burstCycle < 0.65;
          if (isBurstActive) {
            const subCycle = (t * 4) % 1;
            const isPulseHigh = subCycle < curDuty * 0.8;
            y = isPulseHigh ? centerY - amp : centerY + amp * 0.7;
          } else {
            y = centerY + amp * 0.7;
          }
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 4. Oscilloscope HUD Corner Badges
      ctx.shadowBlur = 0;
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f87171'; // red-400

      // Top Left: Channel & Timebase
      ctx.fillText('CH1: 1.00V/div', 12, 20);
      ctx.fillText('TIME: 20.0µs/div', 12, 34);

      // Top Right: Trigger Lock Status
      const trigText = 'TRIG: EXT_RISING [LOCKED]';
      const trigWidth = ctx.measureText(trigText).width;
      ctx.fillText(trigText, width - trigWidth - 12, 20);

      // Bottom Left: Calculated Voltage & Frequency
      const freqKHz = ((baudRateRef.current / 921.6) * 125).toFixed(1);
      ctx.fillText(`Vpp: 3.30V | Freq: ${freqKHz} kHz`, 12, height - 14);

      // Bottom Right: Live Duty
      const statusText = `Duty: ${dutyCycleRef.current}% | Mode: ${curMode.toUpperCase()}`;
      const statusWidth = ctx.measureText(statusText).width;
      ctx.fillText(statusText, width - statusWidth - 12, height - 14);

      ctx.restore();

      // Generate packet log entry every ~350ms
      if (now - lastPacketTimeRef.current > 350) {
        lastPacketTimeRef.current = now;
        const newPacket = generatePacket(baudRateRef.current, dutyCycleRef.current, modeRef.current);
        setPacketLog((prev) => [newPacket, ...prev.slice(0, 3)]);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [generatePacket]);

  const handleToggleRun = () => {
    soundEngine.playRelayClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundEngine.playTabLock();
    setDutyCycle(65);
    setBaudRate(921.6);
    setMode('pwm');
  };

  return (
    <section id="telemetry-simulator" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div
        ref={containerRef}
        className="relative rounded-2xl bg-zinc-950/90 border border-red-500/30 p-5 sm:p-7 md:p-8 backdrop-blur-xl shadow-[0_0_45px_rgba(239,68,68,0.12)] overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Activity className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Live Hardware Telemetry // STM32-DMA-CH1
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs font-mono text-slate-400">
                Interactive real-time oscilloscope & circular DMA bus inspect. Adjust sliders to modulate waveforms live.
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleToggleRun}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-red-950/70 border-red-500 text-red-300'
                  : 'bg-zinc-800 border-zinc-700 text-slate-400'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-red-400" />
                  <span>HALT</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RUN</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Sliders to Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Waveform Selector Chips */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {WAVEFORM_MODES.map((item) => {
            const Icon = item.icon;
            const isCur = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playTabLock();
                  setMode(item.id);
                }}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isCur
                    ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-slate-400 hover:border-red-500/40 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCur ? 'text-red-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span className="hidden sm:inline text-[10px] text-zinc-500">({item.desc})</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Oscilloscope Canvas + Interactive Sliders */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Oscilloscope Canvas Viewport */}
          <div className="lg:col-span-8 rounded-xl bg-zinc-950 border border-zinc-800 relative overflow-hidden flex flex-col justify-between shadow-inner">
            <div className="relative w-full h-56 sm:h-64">
              <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-crosshair"
              />
            </div>

            {/* Bottom Status Ticker */}
            <div className="px-4 py-2 bg-zinc-900/90 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>DMA2_Stream0: CIRCULAR_PING_PONG</span>
              </div>
              <div className="text-emerald-400 font-bold">
                ZERO-CPU BUS LOAD: ~{(1.2 + (baudRate / 2000) * 0.8).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Interactive Sliders & Live Hardware Parameters */}
          <div className="lg:col-span-4 rounded-xl bg-zinc-900/80 border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-400" />
                  <span>Hardware Modulation Sliders</span>
                </span>
                <span className="text-[10px] text-zinc-500">60Hz Real-Time</span>
              </div>

              {/* Slider 1: PWM Duty Cycle / Slew */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">PWM Duty Cycle:</span>
                  <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30">
                    {dutyCycle}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={dutyCycle}
                  onChange={(e) => setDutyCycle(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>10% (Low Pulse)</span>
                  <span>50% (Symmetric)</span>
                  <span>95% (High Pulse)</span>
                </div>
              </div>

              {/* Slider 2: DMA Buffer Clock / Baud Rate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">DMA Clock / Baud:</span>
                  <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30">
                    {baudRate >= 1000 ? `${(baudRate / 1000).toFixed(2)} Mbps` : `${baudRate.toFixed(1)} kbps`}
                  </span>
                </div>
                <input
                  type="range"
                  min="115.2"
                  max="2000"
                  step="10"
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>115.2 kbps</span>
                  <span>921.6 kbps</span>
                  <span>2.0 Mbps</span>
                </div>
              </div>
            </div>

            {/* Hardware Architecture Fact Badge */}
            <div className="p-3 rounded-lg bg-zinc-950/90 border border-red-500/20 text-slate-300 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-CPU DMA Guarantee</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Data transfers stream straight from peripherals to SRAM using Half-Transfer (HT) and Transfer-Complete (TC) interrupts, keeping CPU free for real-time control loops.
              </p>
            </div>
          </div>
        </div>

        {/* Live Auto-scrolling Hex Packet Stream Console */}
        <div className="mt-4 rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/80 pb-2 mb-2">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>LIVE SERIAL DMA PACKET INSPECTION</span>
            </span>
            <span className="text-emerald-400 text-[10px]">RX_STREAM: ACTIVE</span>
          </div>

          <div className="space-y-1 text-[11px]">
            {packetLog.length > 0 ? (
              packetLog.map((pkt) => (
                <div key={pkt.id} className="text-red-400/90 truncate font-mono">
                  {pkt.text}
                </div>
              ))
            ) : (
              <div className="text-zinc-600">Awaiting stream buffer sync...</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Cpu, Sliders, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * HERO HARDWARE TELEMETRY WIDGET
 * 1. 100Hz Closed-Loop PID Response Curve with interactive setpoint error / damping slider.
 * 2. 16-Channel Circular DMA Buffer Status with live animated packet stream.
 */
export default function HeroTelemetryCanvas() {
  // PID Interactive State
  const [setpointDisturbance, setSetpointDisturbance] = useState(25); // kPa error step
  const [kpGain, setKpGain] = useState(2.8);

  // Recalculate PID physical metrics based on Kp
  const simMetrics = useMemo(() => {
    const damping = Math.max(0.4, Math.min(0.95, 1.15 - kpGain * 0.15));
    const calculatedOvershoot = (Math.exp((-Math.PI * damping) / Math.sqrt(1 - damping * damping)) * 100).toFixed(1);
    const calculatedTs = Math.round(4 / (damping * 50) * 1000);
    return {
      overshoot: `${calculatedOvershoot}%`,
      settlingTime: `${calculatedTs} ms`,
      steadyError: '0.00%',
      loopRate: '100.0 Hz',
    };
  }, [kpGain]);

  // DMA Live State
  const [dmaActiveIndex, setDmaActiveIndex] = useState(0);
  const [dmaHalfFlag, setDmaHalfFlag] = useState(false);
  const [dmaCompleteFlag, setDmaCompleteFlag] = useState(false);
  const [dmaChannelData, setDmaChannelData] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      ch: `CH_${i.toString().padStart(2, '0')}`,
      hex: `0x${(950 + i * 22).toString(16).toUpperCase()}`,
      temp: (24.2 + (i * 0.4)).toFixed(1),
    }))
  );

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const simStateRef = useRef({
    disturbance: setpointDisturbance,
    kp: kpGain,
    time: 0,
  });

  useEffect(() => {
    simStateRef.current.disturbance = setpointDisturbance;
    simStateRef.current.kp = kpGain;
  }, [setpointDisturbance, kpGain]);

  // 100Hz PID Canvas Waveform Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let t = 0;
    const render = () => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      t += 0.035;
      simStateRef.current.time = t;
      const w = canvas.width;
      const h = canvas.height;

      // Dark obsidian background with faint oscilloscope grid
      ctx.fillStyle = 'rgba(3, 7, 18, 0.75)';
      ctx.fillRect(0, 0, w, h);

      // Oscilloscope grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Target Setpoint Reference Line (Cyan Dashed)
      const targetY = h * 0.42;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(w, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Process Variable PID Response Curve (Emerald & Cyan Gradient)
      const disturbanceAmp = (simStateRef.current.disturbance / 50) * (h * 0.28);
      const kp = simStateRef.current.kp;
      const damping = Math.max(0.35, 1.15 - kp * 0.15);
      const omega = 0.065 * (kp / 2.5);

      ctx.beginPath();
      ctx.lineWidth = 2.5;
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(0.3, '#06b6d4');
      gradient.addColorStop(1, '#10b981');
      ctx.strokeStyle = gradient;

      let lastY = targetY;

      for (let x = 0; x < w; x++) {
        // Simulating physical 2nd-order step response with dynamic time flow
        const timeOffset = (x * 0.04 - t * 2.2);
        const decay = Math.exp(-damping * (Math.abs(timeOffset) % 12));
        const oscillation = Math.cos(omega * (x - t * 30)) * decay;
        const y = targetY + disturbanceAmp * oscillation;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        lastY = y;
      }
      ctx.stroke();

      // Glowing cursor head at the live tip of the curve
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(w - 6, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // 16-Channel Circular DMA Buffer Scanning Stream
  useEffect(() => {
    const dmaTimer = setInterval(() => {
      setDmaActiveIndex((prev) => {
        const next = (prev + 1) % 16;
        setDmaHalfFlag(next < 8);
        setDmaCompleteFlag(next >= 8);

        // Perturb one random channel hex value slightly to simulate live ADC noise
        setDmaChannelData((old) => {
          const updated = [...old];
          const jitter = Math.floor(Math.random() * 8) - 4;
          const currentHexVal = parseInt(updated[next].hex, 16);
          const newHexVal = Math.max(900, Math.min(1300, currentHexVal + jitter));
          updated[next] = {
            ...updated[next],
            hex: `0x${newHexVal.toString(16).toUpperCase()}`,
            temp: (24.0 + (newHexVal - 900) * 0.015).toFixed(1),
          };
          return updated;
        });

        return next;
      });
    }, 90);

    return () => clearInterval(dmaTimer);
  }, []);

  return (
    <div className="w-full rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/10 shadow-[0_0_35px_rgba(6,182,212,0.12)] p-4 sm:p-5 font-mono text-xs space-y-4">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-cyan-400 font-bold tracking-wider text-xs sm:text-sm">
            HARDWARE TELEMETRY INTERCONNECT // LIVE HARNESS
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            STM32H7 CORE: DETERMINISTIC
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-amber-400 font-bold hidden sm:inline">IWDG: ARMED &lt;500µs</span>
        </div>
      </div>

      {/* Grid: 100Hz PID Curve on Left, 16-Ch Circular DMA on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* PANEL 1: 100Hz Closed-Loop PID Response (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-3.5 rounded-lg bg-black/60 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>100Hz CLOSED-LOOP PID DYNAMICS (MPX5700 TRANSDUCER)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              TIM6 ISR // 10ms
            </span>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative rounded overflow-hidden border border-cyan-500/20 bg-[#030712]/90">
            <canvas
              ref={canvasRef}
              width={480}
              height={140}
              className="w-full h-[120px] sm:h-[135px] block"
            />
            <div className="absolute top-2 left-2 text-[9px] text-slate-400 space-y-0.5 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block" />
                <span>TARGET SETPOINT (340.0 kPa)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
                <span>PV REGULATION (CLOSED-LOOP)</span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
            <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">SAMPLING RATE</span>
              <span className="text-cyan-300 font-bold">{simMetrics.loopRate}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">SETTLING (Ts)</span>
              <span className="text-emerald-400 font-bold">{simMetrics.settlingTime}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">OVERSHOOT (Mp)</span>
              <span className="text-amber-400 font-bold">{simMetrics.overshoot}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">STEADY-STATE ERR</span>
              <span className="text-slate-200 font-bold">{simMetrics.steadyError}</span>
            </div>
          </div>

          {/* Interactive Setpoint Error & Kp Gain Control */}
          <div className="pt-1 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-[11px]">
            <div className="flex-1 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <label className="text-slate-300 whitespace-nowrap text-[10px]">
                INJECT STEP ERROR: <strong className="text-cyan-300">±{setpointDisturbance} kPa</strong>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={setpointDisturbance}
                onChange={(e) => {
                  soundEngine.playHoverBlip();
                  setSetpointDisturbance(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 sm:w-44">
              <span className="text-[10px] text-slate-400 whitespace-nowrap">Kp GAIN:</span>
              <button
                onClick={() => {
                  soundEngine.playHoverBlip();
                  setKpGain((prev) => Math.max(1.2, Number((prev - 0.4).toFixed(1))));
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
              >
                -
              </button>
              <span className="text-amber-400 font-bold text-center w-8">{kpGain.toFixed(1)}</span>
              <button
                onClick={() => {
                  soundEngine.playHoverBlip();
                  setKpGain((prev) => Math.min(4.8, Number((prev + 0.4).toFixed(1))));
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: 16-Channel Circular DMA Buffer Status (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-3.5 rounded-lg bg-black/60 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CIRCULAR DMA BUFFER STREAM (16-CH)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              DMA2_Stream0
            </span>
          </div>

          {/* 16 Channels Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {dmaChannelData.map((channel, idx) => {
              const isActive = dmaActiveIndex === idx;
              return (
                <div
                  key={channel.ch}
                  className={`p-1.5 rounded border transition-all text-center ${
                    isActive
                      ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-105'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`font-bold text-[9px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {channel.ch}
                  </div>
                  <div className={`font-mono text-[9px] ${isActive ? 'text-cyan-300 font-extrabold' : 'text-slate-300'}`}>
                    {channel.hex}
                  </div>
                  <div className="text-[8px] text-slate-500">{channel.temp}°C</div>
                </div>
              );
            })}
          </div>

          {/* DMA Flags & Bus Status */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                BUFFER MODE:
              </span>
              <span className="text-cyan-300 font-bold">CIRCULAR_4X_OVERSAMPLE</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">INTERRUPT FLAGS:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] border transition-colors ${
                    dmaHalfFlag
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  HTIF [CH 0-7]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] border transition-colors ${
                    dmaCompleteFlag
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  TCIF [CH 8-15]
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span>SCAN RATE: <strong className="text-slate-200">2,000 SPS</strong></span>
              <span>CPU LOAD: <strong className="text-emerald-400">0.0% (ZERO-COPY)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


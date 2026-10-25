import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Sliders,
  Minimize2,
  Maximize2,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * LIVE 4-CHANNEL EMBEDDED LOGIC ANALYZER & PID BENCH
 * - CH1 [ANALOG]: 16-Ch Thermistor Peak (°C)
 * - CH2 [ANALOG]: MPX5700 Pneumatic Pressure (kPa - 100Hz PID)
 * - CH3 [DIGITAL]: DB25_LASER_GATE (PWM Square Wave)
 * - CH4 [DIGITAL]: STM32_HARDWARE_WATCHDOG (Active High)
 * Interactive Controls:
 * - [⚡ INJECT THERMAL RUNAWAY] with industrial strobe & automatic 2s watchdog recovery
 * - Real-time sliders for PID Kp, Ki, Kd and Laser PWM Duty Cycle (%)
 */
export default function TelemetryHUDWidget({ isThermalRunaway, setIsThermalRunaway }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpandedBench, setIsExpandedBench] = useState(false);

  // Live Tuning Parameters
  const [kp, setKp] = useState(2.8);
  const [ki, setKi] = useState(0.85);
  const [kd, setKd] = useState(0.45);
  const [laserDuty, setLaserDuty] = useState(65); // 65% PWM Duty Cycle

  // Live Telemetry Readouts
  const [tempPeak, setTempPeak] = useState(38.2);
  const [pressureKpa, setPressureKpa] = useState(346.8);
  const [watchdogActive, setWatchdogActive] = useState(true); // Active High
  const [isRecovering, setIsRecovering] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(16.4);
  const [faultCode, setFaultCode] = useState('0x00_NOMINAL');

  const canvasRef = useRef(null);
  const stateRef = useRef({
    isThermalRunaway,
    isRecovering,
    kp,
    ki,
    kd,
    laserDuty,
    watchdogActive,
    time: 0,
  });

  // Keep stateRef fresh for the 60FPS animation loop
  useEffect(() => {
    stateRef.current = {
      isThermalRunaway,
      isRecovering,
      kp,
      ki,
      kd,
      laserDuty,
      watchdogActive,
      time: stateRef.current.time,
    };
  }, [isThermalRunaway, isRecovering, kp, ki, kd, laserDuty, watchdogActive]);

  // Fault Injection: Thermal Runaway Sequence
  const handleInjectThermalRunaway = () => {
    if (isThermalRunaway || isRecovering) return;

    soundEngine.playWarningPulse();
    soundEngine.playRelayClick();
    setIsThermalRunaway(true);
    setWatchdogActive(false); // CH4 Watchdog immediately drops LOW to cut power
    setFaultCode('0xFA_THERMAL_EXCESS');

    // Simulate thermal surge past 120°C
    let currentT = 38.2;
    const surgeInterval = setInterval(() => {
      currentT += (128.5 - currentT) * 0.35 + (Math.random() * 3 - 1.5);
      setTempPeak(Number(currentT.toFixed(1)));
      setPressureKpa(Number((346.8 + (Math.random() * 80 - 40)).toFixed(1)));
      setCpuLoad(Number((Math.random() * 15 + 82).toFixed(1)));
    }, 70);

    // After 2.0 seconds: Automated recovery sequence kicks in
    setTimeout(() => {
      clearInterval(surgeInterval);
      soundEngine.playRelayClick();
      setFaultCode('0x00_WATCHDOG_RECOV');
      setIsRecovering(true);

      const coolInterval = setInterval(() => {
        currentT -= (currentT - 38.2) * 0.3;
        setTempPeak(Number(currentT.toFixed(1)));
        setPressureKpa(346.8);
        setCpuLoad(Number((Math.random() * 4 + 14).toFixed(1)));

        if (currentT <= 39.0) {
          clearInterval(coolInterval);
          setTempPeak(38.2);
          setWatchdogActive(true); // Watchdog re-arms to Active HIGH
          setIsThermalRunaway(false);
          setIsRecovering(false);
          setFaultCode('0x00_NOMINAL');
          soundEngine.playHoverBlip();
        }
      }, 80);
    }, 2000);
  };

  // 4-Channel Synchronized Logic Analyzer Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Buffer to hold scrolling waveform history
    const historyLength = 180;
    const ch1History = new Array(historyLength).fill(38.2);
    const ch2History = new Array(historyLength).fill(346.8);
    const ch3History = new Array(historyLength).fill(1);
    const ch4History = new Array(historyLength).fill(1);

    const render = () => {
      stateRef.current.time += 0.05;
      const { time, isThermalRunaway: panic, kp: pKp, ki: pKi, kd: pKd, laserDuty: pDuty, watchdogActive: pWd } =
        stateRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // 4 Discrete Waveform Lanes
      const laneH = h / 4;

      // 1. Calculate New Instantaneous Channel Samples
      // CH1: 16-Ch Thermistor Peak (°C)
      let ch1Sample;
      if (panic) {
        ch1Sample = 120 + Math.sin(time * 16) * 12 + (Math.random() - 0.5) * 8;
      } else {
        ch1Sample = 38.2 + Math.sin(time * 1.5) * 1.8 + Math.cos(time * 0.4) * 0.9;
      }

      // CH2: MPX5700 Pneumatic Pressure (kPa - 100Hz PID)
      // Damping dynamically alters step oscillation based on Kp, Ki, Kd
      let ch2Sample;
      const dampingFactor = Math.max(0.1, pKd * 2.2);
      const freqFactor = pKp * 1.8;
      const integralBias = pKi * 4.0;
      if (panic) {
        ch2Sample = 346.8 + Math.sin(time * 22) * 55 + (Math.random() - 0.5) * 30;
      } else {
        ch2Sample =
          346.8 +
          Math.sin(time * freqFactor) * (18 / dampingFactor) +
          Math.cos(time * 0.8) * integralBias;
      }

      // CH3: DB25_LASER_GATE (PWM Square Wave)
      // Duty cycle computed strictly from live slider
      const period = 20; // steps
      const cycleStep = Math.floor(time * 30) % period;
      const highThreshold = Math.floor((pDuty / 100) * period);
      const ch3Sample = panic ? 0 : cycleStep < highThreshold ? 1 : 0;

      // CH4: STM32_HARDWARE_WATCHDOG (Active High)
      const ch4Sample = pWd && !panic ? 1 : 0;

      // Push into scroll buffers
      ch1History.shift();
      ch1History.push(ch1Sample);
      ch2History.shift();
      ch2History.push(ch2Sample);
      ch3History.shift();
      ch3History.push(ch3Sample);
      ch4History.shift();
      ch4History.push(ch4Sample);

      // 2. Clear Screen with Industrial High-Tech Grid
      ctx.fillStyle = panic
        ? `rgba(28, 4, 8, ${0.85 + Math.sin(time * 12) * 0.1})`
        : 'rgba(3, 7, 18, 0.92)';
      ctx.fillRect(0, 0, w, h);

      // Draw Grid Graticules
      ctx.lineWidth = 1;
      for (let lane = 0; lane < 4; lane++) {
        const laneY = lane * laneH;

        // Lane separator line
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(0, laneY);
        ctx.lineTo(w, laneY);
        ctx.stroke();

        // Baseline zero / middle reference line for each lane
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(0, laneY + laneH / 2);
        ctx.lineTo(w, laneY + laneH / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Vertical timebase graticules
      for (let x = 0; x < w; x += 36) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // 3. Render CH1 Waveform: 16-Ch Thermistor Peak (°C)
      ctx.beginPath();
      const lane0Mid = laneH / 2;
      for (let i = 0; i < historyLength; i++) {
        const x = (w / (historyLength - 1)) * i;
        const val = ch1History[i];
        // Scale: 20°C to 140°C mapped to laneH
        const normY = (val - 20) / (140 - 20);
        const y = laneH - normY * (laneH * 0.8) - laneH * 0.1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = panic ? '#ef4444' : '#ff9900';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = panic ? '#ef4444' : '#ff9900';
      ctx.shadowBlur = panic ? 12 : 5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. Render CH2 Waveform: MPX5700 Pneumatic Pressure (kPa)
      ctx.beginPath();
      const lane1Top = laneH;
      for (let i = 0; i < historyLength; i++) {
        const x = (w / (historyLength - 1)) * i;
        const val = ch2History[i];
        // Scale: 250 kPa to 450 kPa mapped to laneH
        const normY = (val - 250) / (450 - 250);
        const y = lane1Top + (laneH - normY * (laneH * 0.8) - laneH * 0.1);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Render CH3 Waveform: DB25_LASER_GATE (Digital Square Wave)
      ctx.beginPath();
      const lane2Top = laneH * 2;
      for (let i = 0; i < historyLength; i++) {
        const x = (w / (historyLength - 1)) * i;
        const val = ch3History[i]; // 0 or 1
        const y = lane2Top + (val === 1 ? laneH * 0.2 : laneH * 0.8);
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevVal = ch3History[i - 1];
          if (prevVal !== val) {
            // Draw clean vertical digital logic rise/fall edge
            ctx.lineTo(x, lane2Top + (prevVal === 1 ? laneH * 0.2 : laneH * 0.8));
          }
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = panic ? '#991b1b' : '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = panic ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 6. Render CH4 Waveform: STM32_HARDWARE_WATCHDOG (Active High)
      ctx.beginPath();
      const lane3Top = laneH * 3;
      for (let i = 0; i < historyLength; i++) {
        const x = (w / (historyLength - 1)) * i;
        const val = ch4History[i]; // 1 (High) or 0 (Low)
        const y = lane3Top + (val === 1 ? laneH * 0.2 : laneH * 0.8);
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevVal = ch4History[i - 1];
          if (prevVal !== val) {
            ctx.lineTo(x, lane3Top + (prevVal === 1 ? laneH * 0.2 : laneH * 0.8));
          }
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = panic ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.shadowColor = panic ? '#ef4444' : '#f59e0b';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 7. Channel Label Overlays
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = panic ? '#ef4444' : '#ff9900';
      ctx.fillText(`CH1 [ANLG]: 16-CH THERMISTOR (${ch1Sample.toFixed(1)}°C)`, 6, 14);

      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`CH2 [ANLG]: MPX5700 PRESSURE (${ch2Sample.toFixed(1)} kPa)`, 6, laneH + 14);

      ctx.fillStyle = panic ? '#991b1b' : '#10b981';
      ctx.fillText(`CH3 [DIGI]: DB25_LASER_GATE (${pDuty}% PWM)`, 6, laneH * 2 + 14);

      ctx.fillStyle = panic ? '#ef4444' : '#f59e0b';
      ctx.fillText(
        `CH4 [DIGI]: STM32_WATCHDOG (${ch4Sample === 1 ? 'HIGH // POWER_ON' : 'LOW // CUT_OFF'})`,
        6,
        laneH * 3 + 14
      );

      // Warning Strobe Overlay across canvas during panic
      if (panic) {
        ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(time * 20) * 0.12})`;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 0, y: 0 }}
      className={`fixed bottom-4 right-4 z-40 transition-shadow ${
        isThermalRunaway ? 'glow-red' : 'glow-cyan-sm'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`rounded-lg overflow-hidden border transition-all duration-300 ${
          isExpandedBench ? 'w-[92vw] sm:w-[540px]' : 'w-84 sm:w-96'
        } ${
          isThermalRunaway
            ? 'bg-[#180509]/95 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] ring-2 ring-red-500/50'
            : 'bg-[#040813]/92 backdrop-blur-xl border-cyan-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Header / Draggable Title Bar */}
        <div
          className={`px-3 py-2 flex items-center justify-between border-b cursor-grab active:cursor-grabbing select-none ${
            isThermalRunaway
              ? 'bg-red-950/70 border-red-500/50 text-red-200'
              : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-display font-semibold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>4-CH LOGIC ANALYZER &amp; PID BENCH</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isThermalRunaway
                  ? 'bg-red-500 text-black animate-pulse'
                  : isRecovering
                  ? 'bg-amber-500 text-black'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isThermalRunaway ? 'RUNAWAY_ACTIVE' : isRecovering ? 'RECOVERING_2S' : '4-CH_SYNCHRONIZED'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundEngine.playHoverBlip();
                setIsExpandedBench(!isExpandedBench);
              }}
              className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title={isExpandedBench ? 'Standard Pod View' : 'Expanded Bench View'}
            >
              {isExpandedBench ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playHoverBlip();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={isMinimized ? 'Expand' : 'Collapse'}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 text-xs font-mono space-y-3"
            >
              {/* High-DPI 4-Channel Waveform Screen */}
              <div className="relative rounded border border-cyan-500/30 overflow-hidden bg-black/85">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={isExpandedBench ? 220 : 170}
                  className="w-full h-[170px] sm:h-[180px] block"
                  style={{ height: isExpandedBench ? '220px' : '170px' }}
                />
                {/* Trigger Status indicator */}
                <div className="absolute top-1 right-2 flex items-center gap-2 text-[9px] font-mono">
                  <span className="text-slate-400">TRIG: AUTO</span>
                  <span
                    className={`font-bold ${
                      isThermalRunaway
                        ? 'text-red-400 animate-pulse'
                        : isRecovering
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {isThermalRunaway ? 'TRIP_HALT' : 'SPS: 2000'}
                  </span>
                </div>
              </div>

              {/* Hardware Telemetry Snapshot Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] bg-slate-900/60 p-2 rounded border border-cyan-500/20">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[9px]">CH1 PEAK:</span>
                  <span
                    className={`font-bold font-mono text-[11px] ${
                      tempPeak > 80 ? 'text-red-400 animate-pulse' : 'text-amber-400'
                    }`}
                  >
                    {tempPeak}°C
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[9px]">CH2 PRESSURE:</span>
                  <span className="text-cyan-300 font-bold font-mono text-[11px]">{pressureKpa} kPa</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[9px]">CH3 DUTY:</span>
                  <span className="text-emerald-400 font-bold font-mono text-[11px]">{laserDuty}% PWM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[9px]">CH4 WATCHDOG:</span>
                  <span
                    className={`font-bold font-mono text-[11px] ${
                      watchdogActive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {watchdogActive ? 'ACTIVE_HIGH' : 'LOW (CUT)'}
                  </span>
                </div>
              </div>

              {/* Auxiliary System Health Readout */}
              <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 bg-black/40 rounded border border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">CPU LOAD:</span>
                  <span className="text-cyan-300 font-bold">{cpuLoad}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">FAULT REG:</span>
                  <span className={isThermalRunaway ? 'text-red-400 font-bold' : 'text-amber-300/80 font-bold'}>
                    {faultCode}
                  </span>
                </div>
              </div>

              {/* Interactive Sliders: PID Kp, Ki, Kd and Laser PWM Duty Cycle */}
              <div className="space-y-1.5 pt-1 border-t border-cyan-500/20">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Sliders className="w-3 h-3" /> HARDWARE PID &amp; LASER PWM COEFFICIENTS
                  </span>
                  <span>100Hz HARD-RT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Kp */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 text-slate-400 text-[10px]">Kp:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={kp}
                      onChange={(e) => setKp(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-right text-cyan-300 font-mono text-[10px]">{kp.toFixed(1)}</span>
                  </div>

                  {/* Ki */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 text-slate-400 text-[10px]">Ki:</span>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.05"
                      value={ki}
                      onChange={(e) => setKi(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-right text-cyan-300 font-mono text-[10px]">{ki.toFixed(2)}</span>
                  </div>

                  {/* Kd */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 text-slate-400 text-[10px]">Kd:</span>
                    <input
                      type="range"
                      min="0.0"
                      max="1.5"
                      step="0.05"
                      value={kd}
                      onChange={(e) => setKd(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-right text-cyan-300 font-mono text-[10px]">{kd.toFixed(2)}</span>
                  </div>

                  {/* Laser PWM Duty Cycle (%) */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 text-emerald-400 text-[10px]">PWM:</span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={laserDuty}
                      onChange={(e) => setLaserDuty(parseInt(e.target.value, 10))}
                      className="flex-1 accent-emerald-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-right text-emerald-300 font-mono text-[10px]">{laserDuty}%</span>
                  </div>
                </div>
              </div>

              {/* Action Trigger Button: [⚡ INJECT THERMAL RUNAWAY] */}
              <button
                onClick={handleInjectThermalRunaway}
                disabled={isThermalRunaway || isRecovering}
                data-target="TRIGGER_FAULT"
                className={`w-full py-2.5 px-3 rounded font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  isThermalRunaway
                    ? 'bg-red-600/40 border-red-500 text-red-200 cursor-not-allowed animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : isRecovering
                    ? 'bg-amber-600/40 border-amber-500 text-amber-200 cursor-not-allowed'
                    : 'bg-red-950/70 hover:bg-red-900/90 border-red-500/70 text-red-400 hover:text-white hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {isThermalRunaway
                    ? '⚡ RUNAWAY ACTIVE: CH4 CUT TO LOW (AUTO-RECOVERING IN 2s)...'
                    : isRecovering
                    ? '⚡ RESTORING NOMINAL WATCHDOG STATE...'
                    : '[⚡ INJECT THERMAL RUNAWAY]'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

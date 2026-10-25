import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, ShieldCheck, Sliders, Minimize2, Maximize2, Zap, Radio } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export default function TelemetryHUDWidget({ isThermalRunaway, setIsThermalRunaway }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [kp, setKp] = useState(2.4);
  const [ki, setKi] = useState(0.85);
  const [kd, setKd] = useState(0.42);
  const [temp, setTemp] = useState(38.2);
  const [watchdogStatus, setWatchdogStatus] = useState('ARMED');
  const [faultCode, setFaultCode] = useState('0x00_NOMINAL');
  const [cpuLoad, setCpuLoad] = useState(14.8);
  const [isRecovering, setIsRecovering] = useState(false);

  const canvasRef = useRef(null);
  const phaseRef = useRef(0);

  // Trigger Thermal Spike runaway simulation
  const handleInjectThermalSpike = () => {
    if (isThermalRunaway || isRecovering) return;

    cyberAudio.playRelayClick();
    cyberAudio.playAlarm();
    setIsThermalRunaway(true);
    setWatchdogStatus('TRIGGERED');
    setFaultCode('0xFA_THERMAL_EXCESS');

    // Simulate thermal surge
    let curTemp = 38.2;
    const heatInterval = setInterval(() => {
      curTemp += (118.6 - curTemp) * 0.35 + (Math.random() * 4 - 2);
      setTemp(Number(curTemp.toFixed(1)));
      setCpuLoad(Number((Math.random() * 20 + 78).toFixed(1)));
    }, 80);

    // After 2.3 seconds, hardware watchdog intervenes
    setTimeout(() => {
      clearInterval(heatInterval);
      cyberAudio.playRelayClick();
      setWatchdogStatus('WATCHDOG_INTERRUPT');
      setFaultCode('0x00_SHUTDOWN_RECOV');
      setIsRecovering(true);

      const coolInterval = setInterval(() => {
        curTemp -= (curTemp - 38.2) * 0.3;
        setTemp(Number(curTemp.toFixed(1)));
        setCpuLoad(Number((Math.random() * 3 + 14).toFixed(1)));

        if (curTemp <= 39.0) {
          clearInterval(coolInterval);
          setTemp(38.2);
          setIsThermalRunaway(false);
          setIsRecovering(false);
          setWatchdogStatus('ARMED');
          setFaultCode('0x00_NOMINAL');
        }
      }, 90);
    }, 2300);
  };

  // Live Oscilloscope Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const renderScope = () => {
      phaseRef.current += 0.08;
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      ctx.fillStyle = 'rgba(4, 9, 18, 0.45)';
      ctx.fillRect(0, 0, w, h);

      // Grid reticle lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      for (let x = 0; x < w; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      ctx.stroke();

      // Oscilloscope Waveform
      ctx.beginPath();
      const numPoints = 80;
      for (let i = 0; i <= numPoints; i++) {
        const x = (w / numPoints) * i;
        const normX = i / numPoints;

        let wave;
        if (isThermalRunaway) {
          // Chaotic runaway oscillation with clipped harmonics
          wave =
            Math.sin(normX * 18 + phaseRef.current * 4) * 28 +
            Math.cos(normX * 36 - phaseRef.current * 6) * 14 +
            (Math.random() - 0.5) * 18;
          // Clip
          wave = Math.max(-midY + 4, Math.min(midY - 4, wave));
        } else {
          // Stable closed-loop PID response with slight damping
          const damping = Math.exp(-normX * kd * 1.8);
          const freq = kp * 2.2;
          wave =
            Math.sin(normX * freq * Math.PI * 2 + phaseRef.current) *
            (midY * 0.58) *
            damping +
            Math.sin(phaseRef.current * 1.5) * (ki * 3.5);
        }

        const y = midY - wave;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = isThermalRunaway ? '#ef4444' : isRecovering ? '#ff9900' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = isThermalRunaway ? '#ef4444' : isRecovering ? '#ff9900' : '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(renderScope);
    };

    renderScope();
    return () => cancelAnimationFrame(animId);
  }, [isThermalRunaway, isRecovering, kp, ki, kd]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 0, y: 0 }}
      className={`fixed bottom-6 right-6 z-40 transition-shadow ${
        isThermalRunaway ? 'glow-red' : 'glow-cyan-sm'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`w-80 md:w-96 rounded-lg overflow-hidden border transition-colors duration-300 ${
          isThermalRunaway
            ? 'bg-[#180509]/95 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
            : 'bg-[#040813]/90 backdrop-blur-xl border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Header / Draggable Bar */}
        <div
          className={`px-3 py-2 flex items-center justify-between border-b cursor-grab active:cursor-grabbing select-none ${
            isThermalRunaway
              ? 'bg-red-950/60 border-red-500/40 text-red-300'
              : 'bg-cyan-950/40 border-cyan-500/20 text-cyan-400'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-display font-semibold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>PID TELEMETRY // POD</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isThermalRunaway
                  ? 'bg-red-500 text-black animate-pulse'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isThermalRunaway ? 'CRITICAL_SPIKE' : isRecovering ? 'WATCHDOG_INTERRUPT' : 'PID_LOCKED'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
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
              {/* Live Oscilloscope Screen */}
              <div className="relative rounded border border-cyan-500/30 overflow-hidden bg-black/80">
                <canvas ref={canvasRef} width={340} height={90} className="w-full h-[90px] block" />
                <div className="absolute top-1 left-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>CH1: FEEDBACK</span>
                  <span className="text-cyan-400">100Hz</span>
                </div>
                <div className="absolute top-1 right-2 text-[10px] font-mono">
                  <span
                    className={
                      isThermalRunaway
                        ? 'text-red-400 font-bold animate-ping'
                        : isRecovering
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {isThermalRunaway ? 'RUNAWAY!' : isRecovering ? 'OVERRIDE' : 'STABLE'}
                  </span>
                </div>
              </div>

              {/* Hardware Telemetry Counters */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/50 p-2 rounded border border-cyan-500/20">
                <div className="flex justify-between">
                  <span className="text-slate-400">CORE TEMP:</span>
                  <span
                    className={`font-bold font-mono ${
                      temp > 70 ? 'text-red-400 animate-pulse' : temp > 45 ? 'text-amber-400' : 'text-cyan-300'
                    }`}
                  >
                    {temp}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WATCHDOG:</span>
                  <span
                    className={`font-bold font-mono ${
                      watchdogStatus === 'ARMED' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {watchdogStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU LOAD:</span>
                  <span className="text-slate-200">{cpuLoad}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FAULT REG:</span>
                  <span className="text-amber-300/80">{faultCode}</span>
                </div>
              </div>

              {/* PID Tuning Sliders */}
              <div className="space-y-1.5 pt-1 border-t border-cyan-500/20">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Sliders className="w-3 h-3" /> PID COEFFICIENTS
                  </span>
                  <span>100Hz DETERMINISTIC</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 text-slate-400 text-[10px]">Kp:</span>
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

                <div className="flex items-center gap-2">
                  <span className="w-6 text-slate-400 text-[10px]">Ki:</span>
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

                <div className="flex items-center gap-2">
                  <span className="w-6 text-slate-400 text-[10px]">Kd:</span>
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
              </div>

              {/* Action Trigger: INJECT THERMAL SPIKE */}
              <button
                onClick={handleInjectThermalSpike}
                disabled={isThermalRunaway || isRecovering}
                data-target="TRIGGER_FAULT"
                className={`w-full py-2 px-3 rounded font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  isThermalRunaway
                    ? 'bg-red-600/40 border-red-500 text-red-200 cursor-not-allowed animate-pulse'
                    : isRecovering
                    ? 'bg-amber-600/40 border-amber-500 text-amber-200 cursor-not-allowed'
                    : 'bg-red-950/60 hover:bg-red-900/80 border-red-500/60 text-red-400 hover:text-white hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {isThermalRunaway
                    ? 'CRITICAL RUNAWAY ACTIVE...'
                    : isRecovering
                    ? 'WATCHDOG RECOVERING...'
                    : '[INJECT THERMAL SPIKE]'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

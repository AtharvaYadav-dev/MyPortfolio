import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

const BOOT_LOGS = [
  { time: '0.000s', text: 'INIT STM32H7_CORE [Cortex-M7 @ 480MHz]...', status: 'OK' },
  { time: '0.180s', text: 'MAPPING VECTOR TABLE TO AXI SRAM (0x24000000)...', status: 'RELOCATED' },
  { time: '0.420s', text: 'CALIBRATING 16-CH THERMISTOR DMA MATRIX...', status: 'LOCKED [12-BIT]' },
  { time: '0.640s', text: 'ARMING INDEPENDENT HARDWARE WATCHDOG (IWDG)...', status: 'ARMED [120ms]' },
  { time: '0.890s', text: 'ENGAGING 100Hz DETERMINISTIC PNEUMATIC PID LOOP...', status: 'ACTIVE' },
  { time: '1.140s', text: 'ESTABLISHING DUAL-MCU LOCKSTEP VIA CUSTOM M118 PROTOCOL...', status: 'SYNCED' },
  { time: '1.400s', text: 'SPAWNING MULTI-THREADED PYSIDE6 + PYOPENGL DIGITAL TWIN...', status: '100%' },
  { time: '1.680s', text: 'CONFIGURING DB25 GALVO LASER SUB-MICROSECOND GATING...', status: 'ONLINE' },
  { time: '1.920s', text: 'CYBER-PHYSICAL OS STACK READY. MOUNTING INTERFACE...', status: 'NOMINAL' }
];

export default function BootSequence({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentLogIndex = 0;
    const startTime = Date.now();
    const duration = 2300; // 2.3s

    cyberAudio.playBootBeep(880, 0.08);

    const logInterval = setInterval(() => {
      if (currentLogIndex < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[currentLogIndex]]);
        cyberAudio.playHoverTick();
        currentLogIndex++;
      }
    }, 210);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(logInterval);
        setTimeout(() => {
          cyberAudio.playRelayClick();
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 200);
      }
    }, 30);

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        skipBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const skipBoot = () => {
    cyberAudio.playRelayClick();
    setProgress(100);
    setIsDone(true);
    setTimeout(onComplete, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-auto select-none bg-black">
        {/* Top Blast Door Panel */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isDone ? '-100%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#040812] border-b-2 border-cyan-500/60 shadow-[0_10px_30px_rgba(0,240,255,0.2)] z-20 flex flex-col justify-end p-6 overflow-hidden"
        >
          {/* Subtle Industrial Grid */}
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
          <div className="absolute top-6 left-8 flex items-center gap-3 text-cyan-400 font-mono text-xs tracking-widest">
            <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <span>MCU_ARCH // CORTEX-M7 DUAL-CORE ATE</span>
          </div>
          <div className="absolute top-6 right-8 text-slate-500 font-mono text-xs tracking-widest">
            <span>MEM: 2048KB FLASH // 1024KB RAM</span>
          </div>
        </motion.div>

        {/* Bottom Blast Door Panel */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isDone ? '100%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#040812] border-t-2 border-cyan-500/60 shadow-[0_-10px_30px_rgba(0,240,255,0.2)] z-20 flex flex-col justify-start p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
          <div className="absolute bottom-6 left-8 text-slate-500 font-mono text-xs tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SAFETY_WATCHDOG: ARMED // 0 ERRORS</span>
          </div>
          <div className="absolute bottom-6 right-8">
            <button
              onClick={skipBoot}
              data-target="BYPASS"
              className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 hover:border-cyan-400 border border-cyan-500/30 px-3 py-1 rounded bg-cyan-950/40 transition-all flex items-center gap-2"
            >
              <span>[BYPASS_BIOS]</span>
              <span className="text-[10px] text-slate-500">(SPACE/ESC)</span>
            </button>
          </div>
        </motion.div>

        {/* Central Terminal Console & Progress Indicator */}
        <motion.div
          animate={{ opacity: isDone ? 0 : 1, scale: isDone ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-30 w-full max-w-2xl px-6"
        >
          <div className="glass-panel p-6 rounded-lg border border-cyan-500/40 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-display text-sm tracking-widest font-bold">
                <Terminal className="w-4 h-4" />
                <span>ATHARVA_OS // HARDWARE_BIOS_v4.8</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono text-slate-400">CLK: 480.000MHz</span>
              </div>
            </div>

            {/* Terminal Log Stream */}
            <div className="font-mono text-xs space-y-1.5 h-44 overflow-y-auto pr-2 scrollbar-none">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start justify-between gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400/70">[{log.time}]</span>
                    <span className="text-slate-200">{log.text}</span>
                  </div>
                  <span className="text-emerald-400 font-bold tracking-wider shrink-0">
                    {log.status}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-cyan-400">
                <span>&gt;</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Progress Bar with Cyan Laser Glow */}
            <div className="mt-5 pt-3 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  DMA CALIBRATION IN PROGRESS
                </span>
                <span className="text-cyan-300 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-amber-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_15px_#00f0ff,0_0_5px_#fff]" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

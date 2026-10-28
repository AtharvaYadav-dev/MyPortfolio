import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown, Terminal, Cpu, ArrowUpRight, Zap, Target } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { cyberAudio } from '../utils/audio';
import { soundEngine } from '../utils/soundEngine';

export default function HeroSection() {
  const scrollTo = (id) => {
    cyberAudio.playRelayClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* Top Telemetry Strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 text-xs font-mono"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <ScrambleText text="OS_KERNEL: ACTIVE // STM32H7" />
          </span>
          <span className="text-slate-400 hidden sm:inline">
            FIRMWARE R&amp;D ENGINEER @ SPECIALISE PRODUCTS (SPPL)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>SYSCLK: 480MHz</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>DMA 16-CH: LOCKED</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>IWDG: ARMED</span>
          </div>
        </div>
      </motion.div>

      {/* Main Kinetic Typography & Positioning */}
      <div className="my-auto py-12 md:py-16">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          <span>EMBEDDED SYSTEMS &amp; INDUSTRIAL AUTOMATION</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[0.95] text-slate-100 uppercase">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            BARE-METAL
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-200 text-glow-cyan">
            SILICON.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-200">
            CLOSED-LOOP
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 text-glow-amber">
            KINEMATICS.
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-400 font-normal tracking-wide mt-2">
            ZERO-LATENCY CONTROL.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-sm sm:text-base md:text-lg font-mono text-slate-300 leading-relaxed border-l-2 border-cyan-500/50 pl-4 py-1">
          I am <span className="text-cyan-300 font-bold">Atharva Yadav</span>. I architect hard real-time firmware,
          high-precision motion control, and headless Automated Test Equipment (ATE) for mission-critical industrial
          hardware. Bridging low-level register silicon with high-performance PySide6/PyOpenGL supervisory twins.
        </p>

        {/* Action Triggers */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={() => scrollTo('machines')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="INSPECT"
            className="group px-6 py-3.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm tracking-wider transition-all flex items-center gap-3 glow-cyan cursor-pointer"
          >
            <span>[INSPECT_8_R&D_SYSTEMS]</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollTo('uart-terminal')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="TERMINAL"
            className="px-6 py-3.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>[EXECUTE_UART_CONSOLE]</span>
          </button>

          <button
            onClick={() => scrollTo('architecture')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="SCHEMATIC"
            className="px-5 py-3.5 rounded bg-transparent hover:bg-cyan-950/30 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 font-mono text-xs tracking-wider transition-all cursor-pointer"
          >
            <span>// VIEW_PCB_SCHEMATIC</span>
          </button>
        </div>
      </div>

      {/* Bottom Hardware Metrics & Scroll Prompt */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-cyan-500/20 text-xs font-mono">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 md:gap-8 text-slate-400">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Architecture</div>
            <div className="text-slate-200 font-bold">STM32 DMA + RTOS</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Closed-Loop PID</div>
            <div className="text-cyan-300 font-bold">100Hz Deterministic</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Galvo Gating</div>
            <div className="text-amber-400 font-bold">DB25 &lt;1μs MarkEzd</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Supervisory Stack</div>
            <div className="text-slate-200 font-bold">PySide6 + PyOpenGL</div>
          </div>
        </div>

        <button
          onClick={() => scrollTo('machines')}
          data-target="SCROLL_DOWN"
          className="flex items-center gap-2 text-cyan-400/80 hover:text-cyan-300 transition-colors animate-bounce cursor-pointer self-center sm:self-auto"
        >
          <span className="text-[11px] tracking-widest font-mono">[SCROLL_TO_INSPECT]</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

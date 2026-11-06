import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ChevronDown,
  Terminal,
  Cpu,
  ArrowUpRight,
  Zap,
  Target,
  FileText,
  Mail,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import HeroTelemetryCanvas from './HeroTelemetryCanvas';
import { soundEngine } from '../utils/soundEngine';
import { smoothScrollTo } from '../utils/scrollHelper';

export default function HeroSection({
  onOpenResume,
  onOpenContact,
  onToggleTerminal,
  onSelectDomain,
}) {
  const scrollTo = (id) => {
    soundEngine.playRelayClick();
    smoothScrollTo(id);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto z-10 space-y-10"
    >
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
            <ScrambleText text="OS_KERNEL: ACTIVE // STM32H7 CORTEX-M7" />
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
            <span>IWDG: ARMED &lt;500µs</span>
          </div>
        </div>
      </motion.div>

      {/* Main Mission Control Hero Headline & Technical Positioning */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Target className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>CYBER-PHYSICAL MISSION CONTROL // EMBEDDED R&amp;D TERMINAL</span>
        </div>

        {/* Hero Title Required: "Architecting Cyber-Physical Systems: Silicon-to-Screen." */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.05] text-slate-100 uppercase">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Architecting Cyber-Physical Systems:
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-glow-cyan mt-1">
            Silicon-to-Screen.
          </span>
        </h1>

        {/* Hero Sub-headline Required */}
        <p className="max-w-4xl text-sm sm:text-base md:text-lg font-mono text-slate-200 leading-relaxed border-l-2 border-cyan-500/60 pl-4 py-1">
          <span className="text-cyan-300 font-bold">
            R&amp;D Firmware &amp; Embedded Systems Engineer
          </span>{' '}
          specializing in{' '}
          <span className="text-white font-semibold">Bare-Metal C/C++ (STM32/ESP32)</span>,{' '}
          <span className="text-amber-300 font-semibold">Sub-pF Precision Instrumentation</span>,{' '}
          <span className="text-cyan-300 font-semibold">High-Power Industrial Lasers</span>, and{' '}
          <span className="text-emerald-300 font-semibold">Multi-Threaded ATE/HIL Suites</span>.
        </p>

        {/* Primary Action Button Cluster */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => scrollTo('machines')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            className="px-6 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2.5 glow-cyan cursor-pointer"
          >
            <span>[INSPECT_8_R&D_SYSTEMS]</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {onOpenResume && (
            <button
              onClick={() => {
                soundEngine.playTabLock();
                onOpenResume();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-5 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              title="View Technical Resume & CV (PDF)"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>[VIEW_TECHNICAL_CV]</span>
            </button>
          )}

          {onToggleTerminal && (
            <button
              onClick={() => {
                soundEngine.playTabLock();
                onToggleTerminal();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-5 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>[&gt;_ TERMINAL]</span>
            </button>
          )}

          {onOpenContact && (
            <button
              onClick={() => {
                soundEngine.playRelayClick();
                onOpenContact();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-5 py-3.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-mono text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>[CONTACT_ATHARVA]</span>
            </button>
          )}
        </div>

        {/* Recruiter Quick Filter Shortcuts in Hero */}
        {onSelectDomain && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold uppercase text-[10px]">QUICK DOMAIN MODE:</span>
            {[
              { id: 'ev', label: 'EV & Battery HIL' },
              { id: 'defense', label: 'Defense & EO/IR' },
              { id: 'laser', label: 'Industrial Lasers' },
              { id: 'robotics', label: 'Robotics Kinematics' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  soundEngine.playTabLock();
                  onSelectDomain(d.id);
                }}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                [{d.label}]
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Live Simulated Interactive Telemetry Widget (Pillar 2) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full"
      >
        <HeroTelemetryCanvas />
      </motion.div>

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
          <span className="text-[11px] tracking-widest font-mono">[SCROLL_TO_INSPECT_SYSTEMS]</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

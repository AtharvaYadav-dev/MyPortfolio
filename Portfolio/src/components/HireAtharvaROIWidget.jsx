import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Compass,
  DollarSign,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * Interactive "Why Hire Atharva" ROI & 3-in-1 Role Consolidation Widget
 * Compares standard siloed engineering hires with Atharva's Unified Hardware-to-UI Pipeline.
 */
export default function HireAtharvaROIWidget() {
  const [viewMode, setViewMode] = useState('atharva'); // 'standard' or 'atharva'
  const [projectMonths, setProjectMonths] = useState(6);

  const handleToggle = (mode) => {
    soundEngine.playTabLock();
    setViewMode(mode);
  };

  // Dynamic ROI calculation metrics
  const standardFTECost = projectMonths * 3 * 6500; // 3 engineers
  const atharvaFTECost = projectMonths * 1 * 7500; // 1 high-impact specialist
  const estimatedSavings = standardFTECost - atharvaFTECost;
  const syncMeetingsSaved = projectMonths * 16; // 16 hours/month of cross-team API alignment meetings

  const scrollToTerminal = () => {
    soundEngine.playRelayClick();
    document.getElementById('uart-terminal')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="roi-bench" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-10">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>04 // ROI_BENCH // CONSOLIDATION_MULTIPLIER</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            WHY HIRE ATHARVA // 3 ROLES IN 1
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-lg border border-cyan-500/40 text-xs font-mono">
          <button
            onClick={() => handleToggle('standard')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
              viewMode === 'standard'
                ? 'bg-red-500/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            [STANDARD SILOED TEAM]
          </button>
          <button
            onClick={() => handleToggle('atharva')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
              viewMode === 'atharva'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            [⚡ ATHARVA FULL-STACK R&amp;D]
          </button>
        </div>
      </div>

      {/* The 3 Consolidated Engineering Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Role 1: Embedded Firmware */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="glass-panel p-5 rounded-xl border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              ROLE 01
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              SILICON
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">
            EMBEDDED FIRMWARE ENGINEER
          </h3>
          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Bare-metal C/C++, STM32 DMA circular buffers, 100Hz closed-loop PID control, FreeRTOS preemption, register-level timers, and hardware independent watchdogs (IWDG).
          </p>
          <div className="text-[10px] font-mono text-cyan-300 pt-1">
            ★ Eliminates: Unreliable open-loop firmware &amp; watchdog panics.
          </div>
        </div>

        {/* Role 2: Desktop ATE & Tooling */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="glass-panel p-5 rounded-xl border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              ROLE 02
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              SOFTWARE ATE
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">
            DESKTOP ATE &amp; TOOLING DEVELOPER
          </h3>
          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Python, PySide6/Qt desktop apps, hardware-accelerated PyOpenGL 3D digital twins, Win32 DLL bindings, multi-threaded serial telemetry workers, and automated pass/fail verification suites.
          </p>
          <div className="text-[10px] font-mono text-emerald-300 pt-1">
            ★ Eliminates: Clunky operator UIs &amp; serial frame desynchronization.
          </div>
        </div>

        {/* Role 3: Mechatronics & Laser Integration */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="glass-panel p-5 rounded-xl border border-amber-500/40 hover:border-amber-400 transition-all shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              ROLE 03
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
              MECHATRONICS
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">
            LASER &amp; MOTION MECHATRONICS SPECIALIST
          </h3>
          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Galvo mirror optical steering, CO2 laser firing synchrony, sub-microsecond DB25 parallel port gating, trapezoidal lookahead kinematics, and pressure sensor DAQ calibration.
          </p>
          <div className="text-[10px] font-mono text-amber-300 pt-1">
            ★ Eliminates: Jittery toolpaths, burned laser corners &amp; hardware mismatch.
          </div>
        </div>
      </div>

      {/* Comparison Matrix & Interactive ROI Calculator */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">INTERACTIVE PIPELINE BENCHMARK</span>
            <h3 className="text-xl font-display font-bold text-white mt-0.5">
              {viewMode === 'atharva' ? 'ATHARVA: ZERO-FRICTION SINGLE PIPELINE' : 'STANDARD SILOED TEAM: 3 DISCONNECTED HIRES'}
            </h3>
          </div>

          {/* Project Duration Slider */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded border border-cyan-500/30 font-mono text-xs">
            <span className="text-slate-400">PROJECT TIMELINE:</span>
            <input
              type="range"
              min="2"
              max="12"
              value={projectMonths}
              onChange={(e) => setProjectMonths(Number(e.target.value))}
              className="w-28 sm:w-36 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-cyan-300 font-bold">{projectMonths} MONTHS</span>
          </div>
        </div>

        {/* Dynamic Comparison Cards */}
        {viewMode === 'atharva' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-1">
              <div className="text-[10px] text-slate-400">CROSS-TEAM LATENCY</div>
              <div className="text-2xl font-display font-black text-cyan-300">0 DAYS</div>
              <p className="text-[11px] text-slate-400">Zero meetings arguing over serial protocols or API schemas.</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-1">
              <div className="text-[10px] text-slate-400">HARDWARE-TO-UI SYNC</div>
              <div className="text-2xl font-display font-black text-emerald-300">100Hz HARD-RT</div>
              <p className="text-[11px] text-slate-400">Hardware registers stream directly into PySide6 without dropped frames.</p>
            </div>

            <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-500/40 space-y-1">
              <div className="text-[10px] text-slate-400">MEETINGS ELIMINATED</div>
              <div className="text-2xl font-display font-black text-purple-300">{syncMeetingsSaved}+ HRS</div>
              <p className="text-[11px] text-slate-400">Time saved from cross-functional status debates redirected to pure engineering.</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-500/40 space-y-1">
              <div className="text-[10px] text-slate-400">ENGINEERING EFFICIENCY</div>
              <div className="text-2xl font-display font-black text-amber-300">3x SPEEDUP</div>
              <p className="text-[11px] text-slate-400">1 engineer with holistic architectural context delivers rapid working hardware.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="text-[10px] text-red-400">CROSS-TEAM LATENCY</div>
              <div className="text-2xl font-display font-black text-red-400">3-4 WEEKS</div>
              <p className="text-[11px] text-slate-400">Constant back-and-forth between firmware, mechanical &amp; software teams.</p>
            </div>

            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="text-[10px] text-red-400">FINGER-POINTING ON JITTER</div>
              <div className="text-2xl font-display font-black text-red-400">COMMON</div>
              <p className="text-[11px] text-slate-400">Firmware claims software lag; software claims MCU dropped packets.</p>
            </div>

            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="text-[10px] text-red-400">HEADCOUNT OVERHEAD</div>
              <div className="text-2xl font-display font-black text-red-400">3 SEPARATE HIRES</div>
              <p className="text-[11px] text-slate-400">Requires 3 distinct salaries, onboarding cycles, and management bandwidth.</p>
            </div>

            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 space-y-1">
              <div className="text-[10px] text-red-400">INTEGRATION BUGS</div>
              <div className="text-2xl font-display font-black text-red-400">HIGH DEFECTS</div>
              <p className="text-[11px] text-slate-400">Mismatched coordinate offsets &amp; uncoordinated timeout handshakes.</p>
            </div>
          </div>
        )}

        {/* Action Prompt */}
        <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-300">
            <span className="text-cyan-300 font-bold">READY TO DEPLOY FOR YOUR HARDWARE TEAM:</span> Full-Time Roles, Advanced R&amp;D Contracts, or Industrial Automation Machine Builds.
          </div>

          <button
            onClick={scrollToTerminal}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="ROI_HIRE_CTA"
            className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center gap-2 glow-cyan cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>[INITIATE_HIRE_TRANSMISSION]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

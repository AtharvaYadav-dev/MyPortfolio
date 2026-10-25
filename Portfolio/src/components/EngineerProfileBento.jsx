import React from 'react';
import {
  TrendingUp,
  GraduationCap,
  Award,
  Cpu,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * "THE COMPLETE BUILDER" BENTO GRID SECTION
 * [03.5 // ENGINEER_PROFILE_MATRIX]
 * Highlights Atharva Yadav's cross-domain depth:
 * Fast-track R&D promotion, Silicon-to-Screen ownership, CAD & laser physics,
 * full-stack web/social impact, and academic rigor in AI/ML & IT.
 */
export default function EngineerProfileBento() {
  return (
    <section id="builder-profile" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-10">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>03.5 // THE_COMPLETE_BUILDER // PROFILE_MATRIX</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            CROSS-DOMAIN SILICON &amp; SYSTEMS MASTERY
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-cyan-500/30">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>PROFILE: <strong className="text-cyan-300">FULL-STACK EMBEDDED R&amp;D</strong></span>
        </div>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* =================================================================== */}
        {/* CARD 1 (7 COLS): Fast-Track R&D Promotion (SPPL, Mumbai) */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-7 glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32 text-cyan-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <span>FAST-TRACK PROMOTION // 4 MONTHS</span>
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                SPPL (MUMBAI) • 2026–PRESENT
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
              GRADUATE TRAINEE TO R&amp;D FIRMWARE DEVELOPER IN 4 MONTHS
            </h3>

            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              Joined <strong className="text-white">Specialise Products Pvt. Ltd. (SPPL)</strong> in January 2026 as a Graduate Engineer Trainee (GET). Promoted in just 4 months (May 2026) to <strong className="text-cyan-300">Firmware Developer (R&amp;D — IoT &amp; Embedded Systems)</strong> based on rapid delivery of mission-critical machine architectures.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">ROLE OWNERSHIP</div>
                <div className="text-cyan-300 font-bold">End-to-End Machines</div>
                <div className="text-[11px] text-slate-400">Architecting firmware for Bioprinters, Laser controllers &amp; DAQ testbenches.</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">DEPLOYMENT STATUS</div>
                <div className="text-emerald-400 font-bold">Active Industrial Deploy</div>
                <div className="text-[11px] text-slate-400">High-reliability production code running on real factory floors.</div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 2 (5 COLS): Academic Rigor (AI/ML + IT) */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-5 glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-purple-400" />
                <span>ACADEMIC FOUNDATION</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">AI / ML + IT</span>
            </div>

            <h3 className="text-lg sm:text-xl font-display font-extrabold text-white leading-tight">
              MASTER OF COMPUTER APPLICATIONS (MCA) — AI &amp; MACHINE LEARNING
            </h3>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between items-center text-white font-bold text-[11px]">
                  <span>Dr. D. Y. Patil Vidyapeeth</span>
                  <span className="text-cyan-400 text-[10px]">2026 – 2028</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Specializing in Edge AI, embedded neural inferencing on ARM Cortex-M, and predictive kinematics.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between items-center text-white font-bold text-[11px]">
                  <span>B.Sc. Information Technology</span>
                  <span className="text-emerald-400 text-[10px]">GRAD MAY 2026</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Thakur College of Science &amp; Commerce, Mumbai. Core computer architecture, OS internals &amp; algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 3 (4 COLS): Silicon-to-Screen Ownership (3 Teams in 1) */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-4 glass-panel p-5 rounded-xl border border-cyan-500/40 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>SILICON-TO-SCREEN OWNERSHIP</span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug">
            DOING THE WORK OF 3 SEPARATE TEAMS
          </h3>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Eliminates inter-team API friction by owning the complete vertical stack:
          </p>

          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span><strong>1. CAD Design &amp; Mechatronics</strong> (Kinematics)</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span><strong>2. Bare-Metal C++ Firmware</strong> (STM32/ESP32)</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span><strong>3. PySide6/OpenGL Desktop ATE</strong> (UI Twins)</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 4 (4 COLS): CAD, Vector Math & Laser Physics */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-4 glass-panel p-5 rounded-xl border border-amber-500/40 relative overflow-hidden group hover:border-amber-400 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>LASER PHYSICS &amp; 3D KINEMATICS</span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug">
            HANDS-ON GALVO &amp; CO2 LASER EXPERTISE
          </h3>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Direct hands-on experience running and tuning industrial laser marking heads and multi-axis CNC gantries:
          </p>

          <ul className="space-y-1 text-[11px] font-mono text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400">•</span>
              <span>Galvo optical mirror deflection &amp; XY-2-100 protocol</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400">•</span>
              <span>Geometric vector transformations &amp; custom G-Code toolpaths</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400">•</span>
              <span>Sub-microsecond DB25 parallel port hardware gating</span>
            </li>
          </ul>
        </div>

        {/* =================================================================== */}
        {/* CARD 5 (4 COLS): Full-Stack & Social Impact Engineering */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-4 glass-panel p-5 rounded-xl border border-emerald-500/40 relative overflow-hidden group hover:border-emerald-400 transition-all duration-300 shadow-xl space-y-3"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>FULL-STACK &amp; SOCIAL IMPACT</span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug">
            WEB PLATFORMS &amp; CLOUD TELEMETRY
          </h3>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Beyond silicon, experienced in building scalable web telemetry and public-benefit software:
          </p>

          <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <strong className="text-emerald-300">Paranubhuti Foundation</strong>
              <div className="text-[10px] text-slate-400">Social Impact Developer building responsive public-good digital platforms.</div>
            </div>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">React</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">Next.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">Node.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">GSAP</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">REST / WebSockets</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

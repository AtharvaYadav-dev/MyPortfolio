import React from 'react';
import {
  TrendingUp,
  GraduationCap,
  Award,
  Cpu,
  GitBranch,
  ExternalLink,
  Zap,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * "SILICON-TO-SCREEN ENGINEER PROFILE" BENTO GRID
 * [03 // SILICON_TO_SCREEN // ENGINEER_PROFILE_MATRIX]
 * Highlights Atharva Yadav's complete profile:
 * - Fast-Track R&D Promotion at SPPL (Mumbai) in 4 months
 * - 3-in-1 Full-Stack Hardware Ownership (Bare-Metal MCU, Optics/Sensors, Desktop ATE)
 * - Direct Open-Source Repositories (InkPrinter, Galvo_Scriber, Metal3-D)
 * - Academic Credentials (MCA in AI/ML & B.Sc. IT)
 */
export default function EngineerProfileBento() {
  const openSourceRepos = [
    {
      name: 'InkPrinter',
      url: 'https://github.com/AtharvaYadav-dev/InkPrinter',
      stars: 'ACTIVE',
      desc: 'Dual-MCU lockstep bioprinter firmware & 100Hz closed-loop pneumatic extruder with MPX5700 transducer & PyOpenGL 3D digital twin.',
      badges: ['STM32 C++', '100Hz PID', 'M118 Protocol', 'PyOpenGL'],
      accent: 'border-cyan-500/40 hover:border-cyan-400',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
    },
    {
      name: 'Galvo_Scriber',
      url: 'https://github.com/AtharvaYadav-dev/Galvo_Scriber',
      stars: 'ACTIVE',
      desc: 'High-speed industrial galvo laser controller with sub-microsecond DB25 parallel hardware gating, XY-2-100 kinematics & MarkEzd.dll bindings.',
      badges: ['DB25 Gating', 'MarkEzd.dll', 'Win32 C++', 'XY-2-100'],
      accent: 'border-amber-500/40 hover:border-amber-400',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    },
    {
      name: 'Metal3-D',
      url: 'https://github.com/AtharvaYadav-dev/Metal3-D',
      stars: 'ACTIVE',
      desc: 'Additive manufacturing kinematics buffer with 16-block trapezoidal lookahead acceleration planner & headless PySide6 ATE verification suite.',
      badges: ['250kHz Servo', 'Trapezoidal S-Curve', 'PySide6 ATE', 'CAN Bus'],
      accent: 'border-emerald-500/40 hover:border-emerald-400',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <section id="builder-profile" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-10">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>03 // SILICON_TO_SCREEN // ENGINEER_PROFILE_MATRIX</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            SILICON-TO-SCREEN ENGINEER PROFILE
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-cyan-500/30">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>PROFILE: <strong className="text-cyan-300">R&amp;D FIRMWARE &amp; EMBEDDED ARCHITECT</strong></span>
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
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
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
              Joined <strong className="text-white">Specialise Products Pvt. Ltd. (SPPL)</strong> in January 2026 as a Graduate Engineer Trainee (GET). Promoted in just 4 months (May 2026) to <strong className="text-cyan-300 font-bold">Firmware Developer — R&amp;D (IoT &amp; Embedded Systems)</strong> based on rapid end-to-end delivery of mission-critical industrial machines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  R&amp;D OWNERSHIP
                </div>
                <div className="text-white font-bold text-xs">End-to-End Machines</div>
                <div className="text-[11px] text-slate-400">
                  Semiconductor wafer laser scribing, DPSS solar scribing, LWIR thermography DAQ, and 3D bioprinting controllers.
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  PRODUCTION DEPLOYMENT
                </div>
                <div className="text-emerald-400 font-bold text-xs">Active Industrial Machines</div>
                <div className="text-[11px] text-slate-400">
                  Deterministic C/C++ firmware running 24/7 on high-throughput factory lines with zero downtime.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 2 (5 COLS): Academic Rigor (MCA AI/ML & B.Sc. IT) */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-5 glass-panel p-6 rounded-xl border border-purple-500/40 relative overflow-hidden group hover:border-purple-400 transition-all duration-300 shadow-xl flex flex-col justify-between"
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
              ADVANCED ACADEMICS &amp; APPLIED RESEARCH
            </h3>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="p-3 rounded bg-slate-900/80 border border-purple-500/30">
                <div className="flex justify-between items-center text-white font-bold text-[11px]">
                  <span>Dr. D. Y. Patil Vidyapeeth</span>
                  <span className="text-cyan-400 text-[10px] font-bold">2026 – 2028</span>
                </div>
                <div className="text-purple-300 font-bold text-[11px] mt-0.5">
                  MCA in AI &amp; Machine Learning (Pursuing)
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Specializing in Edge AI, embedded neural inferencing on ARM Cortex-M silicon, digital signal processing (DSP), and real-time anomaly detection.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between items-center text-white font-bold text-[11px]">
                  <span>Thakur College of Science &amp; Commerce</span>
                  <span className="text-emerald-400 text-[10px] font-bold">GRAD MAY 2026</span>
                </div>
                <div className="text-emerald-300 font-bold text-[11px] mt-0.5">
                  B.Sc. in Information Technology
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Mumbai University. Rigorous grounding in computer architecture, low-level memory management, RTOS scheduling, and distributed protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 3 (12 COLS): 3-in-1 Full-Stack Hardware Ownership */}
        {/* =================================================================== */}
        <div
          onMouseEnter={() => soundEngine.playHoverBlip()}
          className="md:col-span-12 glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300 shadow-xl"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="tracking-widest uppercase">3-IN-1 FULL-STACK HARDWARE OWNERSHIP</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                BRIDGING SILICON REGISTERS TO DESKTOP SUPERVISORY TWINS
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
                DOING THE WORK OF 3 SPECIALIZED ENGINEERING TEAMS
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1 max-w-4xl">
                Eliminates inter-team API drift and integration bottlenecks by single-handedly architecting the low-level silicon drivers, the optical &amp; sensor acquisition hardware, and the high-performance desktop supervisory ATE tooling.
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Pillar 1: Bare-Metal MCU Firmware */}
              <div className="p-4 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    1. BARE-METAL MCU FIRMWARE
                  </span>
                  <span className="text-[10px] text-slate-500">HARD REAL-TIME</span>
                </div>
                <div className="text-white font-bold text-sm">Low-Level Silicon Control</div>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  Deterministic C/C++ firmware on STM32 (ARM Cortex-M4/M7) and ESP32 with zero dynamic memory allocation. Configures multi-channel Circular DMA, sub-millisecond ADC pipelines, hardware watchdog (IWDG) trip interlocks, and 100Hz closed-loop PID control loops.
                </p>
                <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">STM32 / ESP32</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">Circular DMA</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">Hardware IWDG</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">FreeRTOS</span>
                </div>
              </div>

              {/* Pillar 2: Hardware Validation & Optics */}
              <div className="p-4 rounded-lg bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    2. HARDWARE VALIDATION &amp; OPTICS
                  </span>
                  <span className="text-[10px] text-slate-500">PHYSICAL SENSORS</span>
                </div>
                <div className="text-white font-bold text-sm">Optics, Sensors &amp; Fast Buses</div>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  Direct hardware interfacing with sub-microsecond DB25 parallel port gating, high-peak-power Near-Infrared (&gt;5 kW NIR) and DPSS (1064/532/355 nm) laser sources, 100 Mbit Ethernet radiometric LWIR thermal streaming, and sub-picofarad (sub-pF) precision analog front-ends.
                </p>
                <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">DB25 Parallel</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">DPSS / Fiber Lasers</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">LWIR 8-14 µm</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">Sub-pF AFE</span>
                </div>
              </div>

              {/* Pillar 3: Desktop ATE & HIL Tooling */}
              <div className="p-4 rounded-lg bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    3. DESKTOP ATE / HIL TOOLING
                  </span>
                  <span className="text-[10px] text-slate-500">SUPERVISORY UIs</span>
                </div>
                <div className="text-white font-bold text-sm">PySide6 &amp; 3D Digital Twins</div>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  Multi-threaded Python (PySide6) supervisory suites with real-time PyOpenGL 3D digital twins. Integrates Win32 DLL hardware drivers (MarkEzd.dll), headless Automated Test Equipment (ATE) verification harnesses, and high-throughput serial/UDP packet parsers with CRC8/CRC16.
                </p>
                <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">PySide6 GUI</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">PyOpenGL 3D</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">Win32 ctypes</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">Headless ATE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 4 (12 COLS): Direct Open-Source Repositories */}
        {/* =================================================================== */}
        <div className="md:col-span-12 glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span className="tracking-widest uppercase">DIRECT OPEN-SOURCE REPOSITORIES &amp; HARDWARE ENGINES</span>
            </div>
            <a
              href="https://github.com/AtharvaYadav-dev"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>EXPLORE ALL ON GITHUB: @AtharvaYadav-dev</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {openSourceRepos.map((repo, rIdx) => (
              <div
                key={rIdx}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className={`p-4 rounded-lg bg-slate-900/90 border ${repo.accent} transition-all duration-300 flex flex-col justify-between space-y-3 group hover:scale-[1.01]`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      {repo.name}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                      {repo.stars}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {repo.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {repo.badges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${repo.badgeBg}`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    className="w-full py-2 px-3 rounded bg-slate-950 hover:bg-cyan-500 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>[CLONE_OFFICIAL_REPO]</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

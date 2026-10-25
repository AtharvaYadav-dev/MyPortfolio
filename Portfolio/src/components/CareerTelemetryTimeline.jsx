import React from 'react';
import { Briefcase, GraduationCap, Award, ChevronRight, Zap, Globe, Calendar, MapPin } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

const TIMELINE_EVENTS = [
  {
    period: '2026 – PRESENT',
    role: 'FIRMWARE DEVELOPER (R&D — IOT & EMBEDDED SYSTEMS)',
    company: 'Specialise Products Pvt. Ltd. (SPPL)',
    location: 'Mumbai, India',
    status: 'ACTIVE_DEPLOYMENT',
    type: 'WORK',
    icon: Briefcase,
    highlight: 'PROMOTED FROM GRADUATE ENGINEER TRAINEE (GET)',
    details: [
      'Architecting hard real-time firmware in bare-metal C++ on STM32 microcontrollers with circular DMA buffers and sub-millisecond ADC interrupt scanning.',
      'Designed and deployed headless Automated Test Equipment (ATE) integrating multi-threaded PySide6 desktop supervisory UIs with PyOpenGL 3D digital twins.',
      'Developed custom M118 dual-MCU lockstep communication protocol for multi-axis industrial 3D bioprinters with 100Hz deterministic PID pneumatic pressure regulation.',
      'Engineered sub-microsecond DB25 parallel port hardware gating for Galvo laser vector scribing engines using low-level Win32 DLL interfacing (MarkEzd.dll).',
    ],
    tags: ['Bare-Metal C/C++', 'STM32 DMA', 'FreeRTOS', 'PySide6 ATE', '100Hz PID', 'Galvo Laser', 'Win32 DLL'],
  },
  {
    period: '2026 – 2028',
    role: 'MASTER OF COMPUTER APPLICATIONS (MCA) — AI & MACHINE LEARNING',
    company: 'Dr. D. Y. Patil Vidyapeeth',
    location: 'Pune / Mumbai, India',
    status: 'IN_PROGRESS',
    type: 'EDU',
    icon: GraduationCap,
    highlight: 'SPECIALIZATION: EMBEDDED EDGE AI & NEURAL KINEMATICS',
    details: [
      'Researching edge machine learning models for predictive maintenance and real-time anomaly detection directly on ARM Cortex-M hardware.',
      'Studying advanced embedded system modeling, digital signal processing (DSP), and non-linear adaptive closed-loop control algorithms.',
    ],
    tags: ['Edge AI', 'ARM CMSIS-DSP', 'Kinematics', 'Anomaly Detection', 'Distributed Embedded Systems'],
  },
  {
    period: '2026',
    role: 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (B.SC. IT)',
    company: 'Thakur College of Science & Commerce',
    location: 'Mumbai, India',
    status: 'COMPLETED',
    type: 'EDU',
    icon: Award,
    highlight: 'HARDWARE-SOFTWARE CO-DESIGN & EMBEDDED ARCHITECTURE',
    details: [
      'Built strong core foundations in computer architecture, low-level memory management, real-time operating systems, and distributed networking.',
      'Led hardware prototyping and embedded microcontroller laboratory projects involving SPI/I2C communication, sensor matrices, and hardware interrupt handling.',
    ],
    tags: ['Computer Architecture', 'C/C++', 'Embedded Linux', 'Networking Protocols', 'Data Structures'],
  },
  {
    period: '2025',
    role: 'SOCIAL IMPACT DEVELOPER & FULL-STACK PLATFORM ENGINEER',
    company: 'Paranubhuti Foundation',
    location: 'Mumbai, India',
    status: 'COMPLETED_IMPACT',
    type: 'WORK',
    icon: Globe,
    highlight: 'HIGH-IMPACT PUBLIC DIGITAL INFRASTRUCTURE',
    details: [
      'Engineered responsive web applications and data portals using React, Next.js, Node.js, and GSAP for social welfare and educational outreach.',
      'Designed real-time tracking dashboards, mobile-first accessible user flows, and optimized frontend performance with zero downtime.',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'GSAP', 'Cloud Telemetry', 'REST APIs', 'Social Impact'],
  },
];

export default function CareerTelemetryTimeline() {
  return (
    <section id="timeline" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-16">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>05 // R&amp;D_LOG // CAREER_TELEMETRY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            CAREER TELEMETRY &amp; MILESTONES
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded border border-cyan-500/30">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>STATUS: OPEN TO HIGH-IMPACT R&amp;D ROLES (BLR / PUNE / MUMBAI)</span>
        </div>
      </div>

      {/* Vertical Laser Spine Timeline */}
      <div className="relative pl-6 md:pl-10 border-l-2 border-cyan-500/40 space-y-12 before:absolute before:-left-1 before:top-0 before:w-2 before:h-8 before:bg-cyan-400 before:shadow-[0_0_15px_#00f0ff] after:absolute after:-left-1 after:bottom-0 after:w-2 after:h-8 after:bg-cyan-400 after:shadow-[0_0_15px_#00f0ff]">
        {TIMELINE_EVENTS.map((event, index) => {
          const Icon = event.icon;
          return (
            <div key={index} className="relative group">
              {/* Timeline Laser Node on Spine */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 group-hover:text-black transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="glass-panel p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-400/80 transition-all shadow-xl space-y-4">
                {/* Meta Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {event.period}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {event.location}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      event.status === 'ACTIVE_DEPLOYMENT'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : event.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    [{event.status}]
                  </span>
                </div>

                {/* Role & Company */}
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-slate-100 uppercase tracking-wide">
                    <ScrambleText text={event.role} />
                  </h3>
                  <div className="text-sm font-mono text-cyan-400 mt-1 flex items-center gap-2">
                    <span>{event.company}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 text-xs font-bold">{event.highlight}</span>
                  </div>
                </div>

                {/* Engineering Highlights */}
                <ul className="space-y-2 text-xs md:text-sm font-mono text-slate-300 leading-relaxed border-t border-cyan-500/20 pt-3">
                  {event.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                  {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      onMouseEnter={() => soundEngine.playHoverBlip()}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

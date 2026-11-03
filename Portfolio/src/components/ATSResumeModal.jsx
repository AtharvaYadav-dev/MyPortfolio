import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Cpu,
  Award,
  Zap
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { downloadATSResume } from '../utils/resumeData';

export default function ATSResumeModal({ isOpen, onClose, onOpenContact }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundEngine.playRelayClick();
    window.print();
  };

  const handleDownloadTxt = () => {
    soundEngine.playHoverBlip();
    downloadATSResume();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#030712] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)] z-10 overflow-hidden"
        >
          {/* Header Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-cyan-500/20 bg-slate-950/90 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] block">
                  VERIFIED ATS RESUME DOSSIER // HARDWARE R&amp;D
                </span>
                <span className="text-slate-400 text-[10px]">
                  FORMAT: ATS-COMPLIANT SINGLE-PAGE EQUIVALENT • PARSER SCORE: 98/100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTxt}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                title="Download Clean Plain Text Resume"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">DOWNLOAD</span> .TXT
              </button>

              <button
                onClick={handlePrint}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 glow-cyan transition-all cursor-pointer text-xs"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>SAVE / PRINT .PDF</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playHoverBlip();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
                title="Close Modal (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable / Viewable Resume Document Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar text-slate-200 font-sans text-xs sm:text-sm bg-[#040813]">
            {/* Applicant Header */}
            <div className="border-b border-cyan-500/30 pb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
                  ATHARVA YADAV
                </h1>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ATS VERIFIED CANDIDATE (HARDWARE R&amp;D)
                </span>
              </div>

              <div className="text-sm font-mono text-cyan-300 font-semibold">
                FIRMWARE &amp; EMBEDDED SYSTEMS ENGINEER (R&amp;D)
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Mumbai, India (Open to Relocation: BLR / Pune / Mumbai)
                </span>
                <span>•</span>
                <a
                  href="mailto:atharvayadav.dev@gmail.com"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  atharvayadav.dev@gmail.com
                </a>
                <span>•</span>
                <a
                  href="https://github.com/AtharvaYadav-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  github.com/AtharvaYadav-dev
                </a>
                <span>•</span>
                <a
                  href="https://www.linkedin.com/in/atharva-yadav-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  linkedin.com/in/atharva-yadav-dev
                </a>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-1.5">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                R&amp;D Firmware &amp; Embedded Systems Engineer specializing in hard real-time Bare-Metal C/C++ (STM32/ESP32), sub-picofarad precision instrumentation (BARC Standard), high-power industrial lasers (&gt;5kW NIR, DPSS, IPG Fiber), and multi-threaded ATE suites (PySide6/PyOpenGL). Promoted from Graduate Engineer Trainee in 4 months at Specialise Products Pvt. Ltd. (SPPL) to architect production-grade cyber-physical systems from silicon registers to desktop digital twins.
              </p>
            </div>

            {/* Section 2: Core Hardware & Firmware Competencies */}
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                CORE TECHNICAL COMPETENCIES &amp; REGISTERS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-cyan-300 font-bold mb-1">[SILICON &amp; FIRMWARE]</div>
                  <div className="text-slate-300 leading-relaxed">
                    STM32H7 / Cortex-M7, FreeRTOS, Bare-Metal C/C++, Memory-Mapped Registers, Circular DMA, Hardware Watchdogs (IWDG), Interrupt Prioritization (NVIC).
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-amber-300 font-bold mb-1">[PRECISION INSTRUMENTATION]</div>
                  <div className="text-slate-300 leading-relaxed">
                    Sub-pF Capacitance &amp; Impedance Bridge (BARC Standard), Lock-In Phase Sensitive Detection (PSD), 24-bit Sigma-Delta ADC, Steinhart-Hart Thermistor DAQ.
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-emerald-300 font-bold mb-1">[LASERS &amp; MECHATRONICS]</div>
                  <div className="text-slate-300 leading-relaxed">
                    &gt;5kW Peak NIR Lasers, DPSS (1064/532/355 nm), IPG Fiber Lasers, Sub-microsecond DB25 Gating, Win32 MarkEzd.dll, XY-2-100 Galvo Mirrored Heads.
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-teal-300 font-bold mb-1">[CONTROLS, NETWORKING &amp; ATE]</div>
                  <div className="text-slate-300 leading-relaxed">
                    100Hz Closed-Loop PID (MPX5700), Dual-MCU M118 Sync, 640x480 LWIR Radiometric Thermography, 100Mbit Ethernet UDP, Multi-Threaded PySide6 &amp; PyOpenGL.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Professional Experience */}
            <div className="space-y-3">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                PROFESSIONAL EXPERIENCE
              </h2>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between font-mono text-xs">
                  <strong className="text-white text-sm">
                    FIRMWARE DEVELOPER (R&amp;D — IoT &amp; Embedded Systems)
                  </strong>
                  <span className="text-cyan-400 font-bold">2026 – PRESENT</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="text-cyan-300">Specialise Products Pvt. Ltd. (SPPL) — Mumbai, India</span>
                  <span className="text-amber-400 font-semibold">[Promoted from GET in 4 Months]</span>
                </div>

                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-slate-300 pt-1">
                  <li>
                    <strong>Hard Real-Time Bare-Metal C++:</strong> Architected non-blocking circular DMA ADC sampling routines and hardware watchdog (IWDG) trip interlocks on STM32 microcontrollers, eliminating RTOS polling jitter.
                  </li>
                  <li>
                    <strong>Sub-Microsecond Laser Gating:</strong> Engineered low-level Win32 DLL interfacing (MarkEzd.dll) and DB25 parallel port drivers with &lt;1.0µs timing synchronization for Galvo laser vector scribing engines.
                  </li>
                  <li>
                    <strong>Dual-MCU Lockstep Protocol:</strong> Formulated custom bidirectional M118 telemetry packets synchronizing multi-axis motion planning with 100Hz deterministic PID pneumatic extrusion loops on the Bio4D V2 Bioprinter.
                  </li>
                  <li>
                    <strong>100Mbit Radiometric Ethernet Pipeline:</strong> Programmed high-throughput socket streamers parsing raw UDP packets from 640×480 LWIR thermal cameras (-20°C to 1000°C) with Planck calibration lookup tables.
                  </li>
                  <li>
                    <strong>Automated Test Equipment (ATE):</strong> Developed headless Python/PySide6 supervisory suites with real-time PyOpenGL 3D digital twins and automated pass/fail production benches.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4: Flagship Systems & R&D Hardware */}
            <div className="space-y-3">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                FLAGSHIP INDUSTRIAL R&amp;D SYSTEMS
              </h2>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>1. SVNIT 16-Channel Thermal DAQ &amp; Safety Watchdog</span>
                    <span className="font-mono text-[10px] text-cyan-400">STM32 DMA + IWDG</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Continuous circular DMA acquisition across 16 thermistor channels at 2,000 SPS with zero CPU overhead. Hardware Independent Watchdog trips emergency relay in &lt;500µs on dT/dt excess. Multi-threaded PySide6 live heatmap logger.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>2. Bio4D V2 &amp; InkPrinter (Bioprinter &amp; Pneumatic PID Extruder)</span>
                    <span className="font-mono text-[10px] text-cyan-400">Dual-MCU Lockstep + 100Hz PID</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Deterministic 100Hz TIM6 interrupt PID pneumatic regulator (MPX5700) with M118 lockstep dual-MCU synchronization and PyOpenGL 3D kinematics digital twin. Open-source: github.com/AtharvaYadav-dev/InkPrinter.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>3. BARC High-Precision Capacitance &amp; Impedance Bridge</span>
                    <span className="font-mono text-[10px] text-cyan-400">Sub-pF Lock-In PSD</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Nuclear research grade 100 kHz synchronous carrier bridge with 24-bit Sigma-Delta ADC sampling and coherent digital lock-in phase detection (PSD) resolving sub-pF capacitance fluctuations with automated bridge balancing.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>4. SP2L Series: Semiconductor Wafer Scribing &amp; LWIR Thermography</span>
                    <span className="font-mono text-[10px] text-cyan-400">&gt;5kW NIR + 640x480 LWIR</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    &gt;5 kW peak NIR wafer scribers (SP2L-SWPSMS) with DB25 parallel port microsecond gating; 640×480 LWIR radiometric cameras (SP2L-TC) streaming 100Mbit raw UDP packets with Planck calibration; dual 50W diode phase-lock NDT (SP2L-LTWIS).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Education */}
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                EDUCATION &amp; ACADEMIC SPECIALIZATION
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between font-mono">
                  <strong className="text-white">
                    Master of Computer Applications (MCA) — Artificial Intelligence &amp; ML
                  </strong>
                  <span className="text-cyan-400">2026 – 2028 (In Progress)</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Dr. D. Y. Patil Vidyapeeth • Focus: Edge Embedded AI, ARM CMSIS-DSP, Neural Kinematics
                </div>

                <div className="flex flex-wrap items-center justify-between font-mono pt-1">
                  <strong className="text-white">
                    Bachelor of Science in Information Technology (B.Sc. IT)
                  </strong>
                  <span className="text-cyan-400">2026</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Thakur College of Science &amp; Commerce, University of Mumbai • Focus: Computer Architecture &amp; C/C++
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Call to Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-cyan-500/20 bg-slate-950/90 font-mono text-xs">
            <span className="text-slate-400 text-[11px]">
              Ready to verify firmware competencies or schedule an interview?
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => {
                  soundEngine.playRelayClick();
                  onClose();
                  if (onOpenContact) onOpenContact();
                }}
                className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 glow-cyan cursor-pointer transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>[DIRECT CONTACT / INTERVIEW]</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


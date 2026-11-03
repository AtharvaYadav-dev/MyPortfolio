import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Target,
  Flame,
  Crosshair,
  CheckCircle2,
  Sparkles,
  FileText,
  Mail,
  Layers
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const RECRUITER_DOMAINS = [
  {
    id: 'all',
    label: 'All Systems',
    tag: 'DEFAULT_VIEW',
    icon: Layers,
    color: 'cyan',
    activeBadge: 'bg-cyan-500 text-black border-cyan-400',
    title: 'COMPREHENSIVE R&D HARDWARE ECOSYSTEM',
    matchScore: '100% UNIFIED ARCHITECTURE',
    briefing:
      'Architecting end-to-end cyber-physical systems from low-level bare-metal ARM Cortex silicon and sub-microsecond DB25 bus drivers up to multi-threaded PySide6/PyOpenGL supervisory twins.',
    competencies: [
      'Bare-Metal C/C++ on STM32/ESP32 with Zero-Overhead DMA',
      'Lock-in Phase-Sensitive Detection (Sub-pF Impedance & NDT)',
      'High-Power Industrial Laser Drivers (>5kW NIR, DPSS, IPG Fiber)',
      '100Hz Deterministic Closed-Loop Pneumatic PID Regulation',
    ],
    machineIds: ['01', '02', '03', '04', '05', '06', '07', '08'],
  },
  {
    id: 'ev',
    label: 'EV & Battery / HIL',
    tag: 'BMS_THERMAL_WATCHDOG',
    icon: Flame,
    color: 'amber',
    activeBadge: 'bg-amber-500 text-black border-amber-400',
    title: 'EV BATTERY MANAGEMENT & HARDWARE-IN-THE-LOOP (HIL)',
    matchScore: '99.4% DOMAIN MATCH',
    briefing:
      'Immediate senior-level contributor for EV powertrain & battery engineering teams. Extensive track record designing 16-channel thermistor DAQ matrices, active thermal runaway prevention (dT/dt), and sub-500µs hardware watchdog (IWDG) emergency cutoffs.',
    competencies: [
      'Multi-Zone Pack Thermistor DAQ (Circular 12-bit DMA ADC)',
      'Active Thermal Gradient (dT/dt) Runaway Trip Interlocks',
      'Electrochemical Impedance Spectroscopy (Sub-pF EIS Bridge)',
      'Automated Test Equipment (ATE) & Hardware-in-the-Loop suites',
    ],
    machineIds: ['02', '01', '08'],
  },
  {
    id: 'defense',
    label: 'Defense, Aero & EO/IR',
    tag: 'RADIOMETRIC_LWIR_SENSORS',
    icon: Crosshair,
    color: 'emerald',
    activeBadge: 'bg-emerald-500 text-black border-emerald-400',
    title: 'DEFENSE, AEROSPACE & ELECTRO-OPTIC / IR (EO/IR)',
    matchScore: '99.1% DOMAIN MATCH',
    briefing:
      'Specialized in long-wave infrared (LWIR 8-14µm) radiometric sensor integration, high-throughput 100Mbit Ethernet UDP telemetry streaming, Planck curve temperature calibration (-20°C to 1000°C), and sub-surface NDT phase detection.',
    competencies: [
      'LWIR Radiometric Thermography & Planck Curve Calibration LUTs',
      'Lossless 100Mbit UDP Ethernet Frame Reassembly & Telemetry',
      'Lock-In Phase Sensitive Detection (Sub-Surface Weld NDT)',
      'BARC Nuclear Research Grade Sub-pF Instrumentation',
    ],
    machineIds: ['07', '08', '01'],
  },
  {
    id: 'laser',
    label: 'Industrial Lasers & Mechatronics',
    tag: 'GALVO_SUB_US_GATING',
    icon: Zap,
    color: 'cyan',
    activeBadge: 'bg-cyan-500 text-black border-cyan-400',
    title: 'INDUSTRIAL LASERS, PHOTONICS & HIGH-SPEED GALVO GATING',
    matchScore: '99.6% DOMAIN MATCH',
    briefing:
      'Engineered production firmware and kernel interfacing for >5kW peak NIR semiconductor wafer scribers, multi-wavelength DPSS solar scribers, and IPG fiber laser systems with microsecond DB25 parallel port hardware gating.',
    competencies: [
      'Sub-microsecond DB25 Hardware Gating (<1µs Jitter)',
      'Win32 MarkEzd.dll Low-Level Driver & Galvo XY-2-100 Integration',
      'Mark-on-the-Fly (MOTF) Conveyor Encoder Doppler Compensation',
      'Multi-Wavelength DPSS (1064/532/355 nm) Thin-Film Trajectory Engine',
    ],
    machineIds: ['04', '05', '06', '01'],
  },
  {
    id: 'robotics',
    label: 'Additive Mfg & Robotics',
    tag: '100HZ_PID_KINEMATICS',
    icon: Target,
    color: 'purple',
    activeBadge: 'bg-teal-400 text-black border-teal-300',
    title: 'ADDITIVE MANUFACTURING, ROBOTICS & CLOSED-LOOP MOTION',
    matchScore: '99.2% DOMAIN MATCH',
    briefing:
      'Architected hard real-time multi-axis motion controllers, 100Hz deterministic closed-loop pneumatic extrusion loops, custom bidirectional M118 dual-MCU lockstep communication, and real-time PyOpenGL 3D digital twins.',
    competencies: [
      '100Hz Deterministic Closed-Loop PID (MPX5700 Transducer)',
      'Dual-MCU Lockstep Synchronization via M118 Custom Protocol',
      '16-Block Trapezoidal Lookahead Acceleration Kinematics (Metal3-D)',
      'Interactive PySide6 Desktop GUI + PyOpenGL 3D Digital Twin',
    ],
    machineIds: ['03', '02'],
  },
];

export default function RecruiterQuickMode({
  selectedDomain,
  onSelectDomain,
  onOpenResume,
  onOpenContact,
}) {
  const currentDomainData =
    RECRUITER_DOMAINS.find((d) => d.id === selectedDomain) || RECRUITER_DOMAINS[0];

  const handleSelect = (domainId) => {
    soundEngine.playTabLock();
    onSelectDomain(domainId);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Filter Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 px-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            RECRUITER QUICK-MODE:
          </span>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            [Filter by Industry Domain]
          </span>
        </div>

        {/* Domain Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {RECRUITER_DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                onClick={() => handleSelect(domain.id)}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? domain.activeBadge + ' shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>[{domain.label}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recruiter Executive Briefing Card (Animated Reveal on Domain Change) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDomainData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-5 rounded-xl backdrop-blur-md bg-[#030712]/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] font-mono space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                {currentDomainData.tag}
              </span>
              <h3 className="text-xs sm:text-sm font-display font-bold text-slate-100 uppercase tracking-wide">
                {currentDomainData.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {currentDomainData.matchScore}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-l-2 border-cyan-400 pl-3">
            {currentDomainData.briefing}
          </p>

          {/* Key Competencies Matrix */}
          <div className="pt-2">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2">
              Core Verifiable Hardware &amp; Firmware Competencies:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {currentDomainData.competencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded bg-slate-900/70 border border-slate-800 text-slate-300"
                >
                  <span className="text-cyan-400 font-bold mt-0.5">❯</span>
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Quick Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Highlighted Systems: <strong className="text-cyan-300">{currentDomainData.machineIds.length} Flagship Machines</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenResume && (
                <button
                  onClick={() => {
                    soundEngine.playTabLock();
                    onOpenResume();
                  }}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[VIEW_ATS_RESUME]</span>
                </button>
              )}

              {onOpenContact && (
                <button
                  onClick={() => {
                    soundEngine.playRelayClick();
                    onOpenContact();
                  }}
                  className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 cursor-pointer glow-cyan transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>[SCHEDULE INTERVIEW]</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


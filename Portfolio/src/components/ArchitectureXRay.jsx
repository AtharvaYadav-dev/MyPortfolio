import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Layers,
  Terminal,
  Activity,
  Zap,
  Shield,
  Eye,
  CheckCircle2,
  Crosshair,
  Server,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const PROJECTS_DATA = [
  {
    id: 'metal_3d',
    title: 'Commercial Metal 3D Printer Firmware',
    subtitle: 'Specialise Products Pvt. Ltd. (SPPL)',
    domain: 'LASERS & MECHATRONICS',
    badgeColor: 'border-red-500/50 text-red-400 bg-red-950/50',
    summary: {
      role: 'Firmware R&D Developer (Bare-Metal C++ / PySide6)',
      challenge:
        'Industrial metal powder-bed fusion demands sub-50 microsecond synchronization between optical galvo scanning mirrors and multi-kilowatt fiber lasers, while running safety-critical watchdog interlocks to prevent catastrophic thermal runaways.',
      solution:
        'Architected register-level bare-metal C++ firmware on STM32 ARM Cortex-M microcontrollers. Configured TIM1 & TIM8 for micro-step pulse trains, integrated dual-bank fail-safe OTA updates, and designed a multithreaded PySide6 desktop suite for machine diagnostics and layer calibration.',
      metrics: [
        { label: 'Gating Latency', value: '< 35 µs' },
        { label: 'Timer Jitter', value: '< 2.4 ns' },
        { label: 'Laser Interlock Safety', value: '100% Fail-Safe' },
        { label: 'OTA Pipeline', value: 'Dual-Bank CRC16' },
      ],
      stack: ['STM32 (ARM Cortex-M)', 'Bare-Metal C++', 'PySide6 (Qt)', 'DB25 Laser Gating', 'XY2-100 Protocol', 'FreeRTOS/Bare-Metal'],
    },
    xrayNodes: [
      {
        id: 'gui',
        stage: 'STAGE 01',
        name: 'Python / PySide6 Host GUI',
        protocol: 'OPERATOR CONSOLE',
        icon: Terminal,
        chip: 'Host PC / Industrial IPC',
        problem: 'Real-time telemetry rendering without dropping G-code stream execution frames.',
        solution: 'Implemented QThread worker architecture with thread-safe queue ring buffers, decoupling UI draw calls from serial transmissions.',
        metric: '60 FPS GUI Refresh // Zero Dropped G-Code Blocks',
      },
      {
        id: 'bus',
        stage: 'STAGE 02',
        name: 'UART / OTA Pipeline',
        protocol: '921.6 kbps CRC16',
        icon: Radio,
        chip: 'Isolated RS422 / High-Speed UART',
        problem: 'Over-The-Air firmware updates on remote factory floors could brick machines if power drops.',
        solution: 'Built dual-bank flash bootloader with cryptographic CRC16 verification and automatic rollback to Golden Image on checksum mismatch.',
        metric: 'Zero-Brick Dual-Bank Rollback Guarantee',
      },
      {
        id: 'mcu',
        stage: 'STAGE 03',
        name: 'STM32 Bare-Metal C++ Core',
        protocol: 'ARM CORTEX-M @ 480MHz',
        icon: Cpu,
        chip: 'STM32H7 / Black Pill Core',
        problem: 'OS latency and thread scheduling overhead in standard RTOS kernels causing motion stutter.',
        solution: 'Bypassed RTOS abstractions for deterministic bare-metal C++ execution. Direct peripheral register manipulation with zero runtime overhead.',
        metric: 'Deterministic Sub-Microsecond ISR Execution',
      },
      {
        id: 'timer',
        stage: 'STAGE 04',
        name: 'Micro-Step Timers & Watchdog',
        protocol: 'TIM1 / TIM8 HARDWARE SYNC',
        icon: Zap,
        chip: 'Hardware Advanced Control Timers',
        problem: 'Stepper motion resonance and micro-stepping jitter at speeds exceeding 1500 mm/sec.',
        solution: 'Synchronized hardware timers configured in Master-Slave mode with DMA burst generation and hardware window watchdog interlocks.',
        metric: '200 kHz Stepped Pulse Generation // Jitter < 2.4ns',
      },
      {
        id: 'optics',
        stage: 'STAGE 05',
        name: 'Galvo Scanners & Laser Gating',
        protocol: 'XY2-100 & DB25 INTERLOCK',
        icon: Crosshair,
        chip: 'Optical Galvanometer & Fiber Laser',
        problem: 'Laser firing out-of-sync with mirror acceleration resulting in burn marks and defective sintered parts.',
        solution: 'Engineered hardware gating delay compensation via DB25 laser interface, ensuring laser emits exclusively when mirrors reach steady-state velocity.',
        metric: 'Zero Over-Burn Artifacts // Precision < 10 µm',
      },
    ],
  },
  {
    id: 'barc_ate',
    title: 'BARC Nuclear & Defense Capacitance Bridge ATE',
    subtitle: 'Bhabha Atomic Research Centre Research Program',
    domain: 'DEFENSE & NUCLEAR ATE',
    badgeColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/50',
    summary: {
      role: 'Lead ATE & DAQ Software Developer',
      challenge:
        'BARC required an automated diagnostic platform for a High-Frequency Capacitance & Impedance Bridge used in nuclear research, capable of measuring sub-femtofarad variations under severe electrical noise without dropping samples.',
      solution:
        'Developed a multithreaded Python/PySide6 Automated Test Equipment (ATE) desktop suite. Built dedicated background worker pools for real-time telemetry ingestion, designed custom binary packet framing with CRC integrity, and implemented live Cole-Cole & Nyquist impedance plotting.',
      metrics: [
        { label: 'Sampling Throughput', value: '500k samples/sec' },
        { label: 'UI Latency', value: '< 16 ms' },
        { label: 'Packet Drop Rate', value: '0.000%' },
        { label: 'Measurement Precision', value: '0.001 pF' },
      ],
      stack: ['Python', 'PySide6 (Qt)', 'Real-Time DAQ', 'Capacitance Bridge', 'Multithreading', 'NumPy / SciPy'],
    },
    xrayNodes: [
      {
        id: 'bridge',
        stage: 'STAGE 01',
        name: 'Capacitance Bridge Front-End',
        protocol: 'ANALOG RF STAGE',
        icon: Activity,
        chip: 'Precision HF Bridge Oscillator',
        problem: 'Micro-volt signal attenuation and phase drift in high-frequency capacitive sensor nodes.',
        solution: 'Co-developed digital synchronous demodulation filter algorithm in firmware to extract minute in-phase and quadrature vectors.',
        metric: 'Sub-Femtofarad Measurement Accuracy (0.001 pF)',
      },
      {
        id: 'daq',
        stage: 'STAGE 02',
        name: 'Real-Time DAQ Serial Bus',
        protocol: 'DIFFERENTIAL RS485 STREAM',
        icon: Radio,
        chip: 'High-Baud Hardware Transceiver',
        problem: 'High EMI environments causing corrupt packets and buffer overruns during sustained testing.',
        solution: 'Implemented COBS (Consistent Overhead Byte Stuffing) framing with CRC16 error detection and automatic frame re-sync.',
        metric: 'Zero Buffer Overflows @ 500k Samples/sec',
      },
      {
        id: 'workers',
        stage: 'STAGE 03',
        name: 'Multithreaded Worker Pool',
        protocol: 'PRODUCER-CONSUMER QUEUE',
        icon: Server,
        chip: 'QThreadPool / QMutex Ring',
        problem: 'Heavy mathematical FFT filtering operations locking up the operator interface.',
        solution: 'Constructed asynchronous worker threads that consume hardware packets, execute numerical transforms, and push clean datasets to UI.',
        metric: '100% Non-Blocking UI Execution',
      },
      {
        id: 'pyside_ui',
        stage: 'STAGE 04',
        name: 'PySide6 Live Diagnostic UI',
        protocol: '60 FPS TELEMETRY RENDER',
        icon: Terminal,
        chip: 'Qt Graphics Engine / OpenGL',
        problem: 'Scientific graphs lagging when plotting hundreds of thousands of dynamic measurement points.',
        solution: 'Integrated custom downsampled OpenGL viewport renderers for live impedance locus plots and automated tolerance mask evaluation.',
        metric: 'Zero-Freeze Real-Time Diagnostic Dashboard',
      },
    ],
  },
  {
    id: 'bio4d',
    title: 'Industrial Automation & 4D Bio-Printing HMI',
    subtitle: 'Automated Machinery & Mechatronic Platforms',
    domain: 'AUTOMATION & ROBOTICS',
    badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/50',
    summary: {
      role: 'Embedded Firmware & Systems HMI Developer',
      challenge:
        'Automated manufacturing equipment (including food automation machinery and 4D bio-printing hardware) demanded synchronized multi-zone thermal PID regulation, UV photo-curing, and real-time interactive bed coordinate viewports.',
      solution:
        'Programmed Circular DMA ring buffers on 32-bit MCUs to read 16-channel sensor matrices with zero CPU intervention. Coupled this with an interactive cross-platform desktop HMI providing real-time 3D coordinate mapping and recipe automation.',
      metrics: [
        { label: 'CPU Overhead on DAQ', value: '0% (DMA Locked)' },
        { label: 'Thermal Accuracy', value: '± 0.1 °C' },
        { label: 'Sensory Channels', value: '16 Ch Concurrent' },
        { label: 'Reliability', value: 'Industrial Duty' },
      ],
      stack: ['STM32 / ESP32', 'Circular DMA', 'Python / PySide6', '3D Coordinate Viewport', 'PID Thermal Loops'],
    },
    xrayNodes: [
      {
        id: 'sensors',
        stage: 'STAGE 01',
        name: 'Sensors & Actuator Matrix',
        protocol: '16-CH ANALOG & DIGITAL IO',
        icon: Activity,
        chip: 'PT100 RTDs, Load Cells & Endstops',
        problem: 'Reading high-channel-count sensor arrays sequentially introduced phase delays in thermal control loops.',
        solution: 'Engineered hardware analog multiplexing synchronized with ADC conversion triggers for parallel sampling.',
        metric: 'Concurrent 16-Channel Ingestion in < 5 µs',
      },
      {
        id: 'dma',
        stage: 'STAGE 02',
        name: 'Circular DMA Ping-Pong Buffer',
        protocol: 'ZERO-CPU MEMORY TRANSFER',
        icon: Zap,
        chip: 'STM32 DMA2 Stream Controller',
        problem: 'Servicing high-frequency ADC interrupts consumed over 40% of microcontroller CPU cycles.',
        solution: 'Configured Circular DMA in Ping-Pong double-buffering mode. Half-Transfer (HT) and Transfer-Complete (TC) ISRs process blocks with 0% CPU bus stalling.',
        metric: 'CPU Utilization Reduced from 42% down to 1.8%',
      },
      {
        id: 'mcu_core',
        stage: 'STAGE 03',
        name: '32-Bit MCU (STM32/ESP32)',
        protocol: 'PID MOTOR & THERMAL CONTROL',
        icon: Cpu,
        chip: 'ARM Cortex-M / Xtensa Dual-Core',
        problem: 'Thermal overshoot damaging sensitive biological scaffolding and food extrusion consistency.',
        solution: 'Developed anti-windup PID algorithms with auto-tuning feedforward compensation and hardware emergency thermal cutoffs.',
        metric: 'Thermal Ripple Maintained Within ±0.1°C',
      },
      {
        id: 'hmi_view',
        stage: 'STAGE 04',
        name: '3D Viewport / Control HMI',
        protocol: 'PYSIDE6 INTERACTIVE PLATFORM',
        icon: Terminal,
        chip: 'Desktop Host Interface',
        problem: 'Operators needed spatial feedback of extrusion coordinates and recipe states in real time.',
        solution: 'Rendered an interactive wireframe 3D bed viewport alongside automated recipe sequence dispatchers and safety interlock indicators.',
        metric: 'Sub-Millimeter Real-Time Kinematic Tracking',
      },
    ],
  },
];

export default function ArchitectureXRay() {
  const [selectedProjectId, setSelectedProjectId] = useState('metal_3d');
  const [viewMode, setViewMode] = useState('xray'); // 'standard' | 'xray'
  const [activeNodeId, setActiveNodeId] = useState(null);

  const activeProject =
    PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

  const activeNode =
    activeProject.xrayNodes.find((n) => n.id === activeNodeId) ||
    activeProject.xrayNodes[0];

  const handleSelectProject = (id) => {
    soundEngine.playTabLock();
    setSelectedProjectId(id);
    setActiveNodeId(null);
  };

  const handleToggleMode = (mode) => {
    soundEngine.playRelayClick();
    setViewMode(mode);
  };

  const handleSelectNode = (nodeId) => {
    soundEngine.playHoverTick();
    setActiveNodeId(nodeId);
  };

  return (
    <section id="architecture-xray" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="relative rounded-2xl bg-zinc-950/90 border border-red-500/30 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Top Control Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>// DEEP-TECH INSPECTOR: HARDWARE SIGNAL-CHAIN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <span>System Architecture X-Ray</span>
              <Layers className="w-5 h-5 text-red-400" />
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Toggle between the executive project summary and the low-level silicon-to-UI signal chain.
            </p>
          </div>

          {/* Mode Switcher: Standard vs Architecture X-Ray */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start md:self-center font-mono text-xs">
            <button
              onClick={() => handleToggleMode('standard')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'standard'
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard View</span>
            </button>

            <button
              onClick={() => handleToggleMode('xray')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'xray'
                  ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>⚡ Architecture X-Ray</span>
            </button>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
          {PROJECTS_DATA.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj.id)}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-slate-300 hover:border-red-500/40 hover:bg-zinc-900'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-red-400 animate-pulse' : 'bg-zinc-600'
                  }`}
                />
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Presentation Window */}
        <div className="relative z-10 mt-6">
          <AnimatePresence mode="wait">
            {viewMode === 'standard' ? (
              /* STANDARD EXECUTIVE VIEW */
              <motion.div
                key={`standard-${activeProject.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider block mb-1">
                      {activeProject.domain}
                    </span>
                    <h3 className="text-xl font-bold font-display text-white">
                      {activeProject.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {activeProject.subtitle}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-slate-300">
                    {activeProject.summary.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-red-400 tracking-wider mb-1 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Core Engineering Problem:</span>
                      </h4>
                      <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-lg">
                        {activeProject.summary.challenge}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Atharva's Architectural Solution:</span>
                      </h4>
                      <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-lg">
                        {activeProject.summary.solution}
                      </p>
                    </div>
                  </div>

                  {/* Benchmark Metrics & Tech Stack */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                        // Verified Production Benchmarks:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {activeProject.summary.metrics.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-zinc-950 border border-red-500/20 shadow-sm"
                          >
                            <div className="text-[10px] font-mono text-slate-400 uppercase">
                              {m.label}
                            </div>
                            <div className="text-base font-bold font-display text-white mt-0.5">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                        // Implemented Stack:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.summary.stack.map((stk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-slate-300"
                          >
                            {stk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ARCHITECTURE X-RAY VIEW */
              <motion.div
                key={`xray-${activeProject.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Visual Signal-Chain Schematic */}
                <div className="rounded-xl bg-zinc-950/80 border border-red-500/30 p-5 sm:p-7 relative overflow-x-auto">
                  <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      INTERACTIVE SIGNAL-CHAIN FLOW // CLICK ANY HARDWARE NODE TO INSPECT
                    </span>
                    <span className="text-slate-500 hidden sm:inline text-[11px]">
                      DATAFLOW: [HOST] ➔ [BUS] ➔ [SILICON] ➔ [TIMERS] ➔ [ACTUATORS]
                    </span>
                  </div>

                  {/* Horizontal Flow Diagram */}
                  <div className="min-w-[680px] flex items-center justify-between gap-3 relative py-4">
                    {activeProject.xrayNodes.map((node, idx) => {
                      const Icon = node.icon;
                      const isSelected = (activeNodeId || activeProject.xrayNodes[0].id) === node.id;
                      const isLast = idx === activeProject.xrayNodes.length - 1;

                      return (
                        <React.Fragment key={node.id}>
                          {/* Node Box */}
                          <button
                            onClick={() => handleSelectNode(node.id)}
                            onMouseEnter={() => soundEngine.playHoverTick()}
                            className={`flex-1 rounded-xl p-4 text-left transition-all relative group cursor-pointer border ${
                              isSelected
                                ? 'bg-red-950/70 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] scale-105 z-20'
                                : 'bg-zinc-900/80 border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900 z-10'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span
                                className={`text-[10px] font-mono font-bold tracking-widest ${
                                  isSelected ? 'text-red-400' : 'text-slate-500'
                                }`}
                              >
                                {node.stage}
                              </span>
                              <Icon
                                className={`w-4 h-4 ${
                                  isSelected ? 'text-red-400' : 'text-slate-400'
                                }`}
                              />
                            </div>

                            <div className="font-mono font-bold text-xs text-white leading-tight mb-1">
                              {node.name}
                            </div>

                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {node.protocol}
                            </div>

                            {isSelected && (
                              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45 border-b border-r border-red-400" />
                            )}
                          </button>

                          {/* Data-flow Arrow / Connector */}
                          {!isLast && (
                            <div className="flex flex-col items-center justify-center shrink-0 w-8 px-1">
                              <div className="w-full h-0.5 bg-gradient-to-r from-red-600 to-red-400 relative">
                                <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-red-400 rotate-45" />
                              </div>
                              <span className="text-[9px] font-mono text-red-400/80 mt-1">➔</span>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Deep Hardware Inspection Panel */}
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl bg-zinc-900/95 border border-red-500/40 p-6 sm:p-7 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-red-950/80 border-b border-l border-red-500/40 font-mono text-[10px] text-red-400 tracking-wider">
                    DEEP LAYER INSPECTION // {activeNode.stage}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400">
                      <activeNode.icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold font-display text-white">
                        {activeNode.name}
                      </h4>
                      <p className="text-xs font-mono text-red-400">
                        TARGET HARDWARE: {activeNode.chip}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Low-Level Hardware Bottleneck:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                        {activeNode.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Atharva's Firmware Architecture Solution:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                        {activeNode.solution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <Zap className="w-4 h-4 fill-emerald-400" />
                      <span className="font-bold">VERIFIED BENCHMARK:</span>
                      <span className="text-slate-200">{activeNode.metric}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      SYS_BUS: LOCKED // PROTOCOL: {activeNode.protocol}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

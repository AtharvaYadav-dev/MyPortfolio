import React, { useState } from 'react';
import { Cpu, Zap, Activity, HardDrive, Shield, Terminal, Share2, Layers } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { cyberAudio } from '../utils/audio';

const CHIPS_DATA = [
  {
    id: 'stm32',
    name: 'STM32H7 / BARE-METAL C++',
    role: 'Central Processing & DMA Subsystem',
    clock: '480 MHz ARM Cortex-M7',
    bus: 'AXI / AHB Matrix',
    skills: ['Bare-Metal C/C++', 'FreeRTOS Preemption', 'Circular DMA Buffers', 'Hardware Watchdogs (IWDG)'],
    description:
      'Low-level register manipulation, memory-mapped peripherals, interrupt vector table relocation, zero-jitter hardware timers, and deterministic hardware fault handlers.',
    pinouts: ['PA0: ADC_IN0 (Thermal Matrix)', 'PB6: UART1_TX (115200)', 'PC13: WATCHDOG_ALARM', 'PE2: SPI4_MOSI'],
    traceColor: '#00f0ff',
  },
  {
    id: 'pid',
    name: 'CONTROL THEORY & KINEMATICS',
    role: '100Hz Closed-Loop Deterministic Loop',
    clock: '100.000 Hz Hard Real-Time',
    bus: 'Timer Interrupt ISR',
    skills: ['Deterministic PID', 'MPX5700 Pneumatic Transducer', 'Anti-Windup Integrator', 'Feedforward Calibration'],
    description:
      'Pneumatic and thermal regulation using continuous error tracking, low-pass filter derivative smoothing, and emergency shutdown interlocks within sub-millisecond execution deadlines.',
    pinouts: ['IN_PV: Process Variable (ADC)', 'IN_SP: Target Setpoint', 'OUT_CV: PWM Duty Output', 'DI_ESTOP: Emergency Cutoff'],
    traceColor: '#ff9900',
  },
  {
    id: 'pyside',
    name: 'PYSIDE6 & PYOPENGL DIGITAL TWIN',
    role: 'Supervisory ATE & Real-Time Visualization',
    clock: '60 FPS Hardware-Accelerated',
    bus: 'Lockstep Serial / M118 Protocol',
    skills: ['PySide6 / PyQt', 'PyOpenGL 3D Kinematics', 'Multi-Threaded QThread Workers', 'Headless ATE Testing'],
    description:
      'Industrial desktop operator interfaces rendering live 3D toolpath kinematics, automated calibration routines, telemetry logging, and headless pass/fail production verification suites.',
    pinouts: ['SOCK_0: Serial Worker Thread', 'GL_CTX: 3D Viewport Matrix', 'DB_LOG: HDF5/SQLite Stream', 'IPC: Signal/Slot Bus'],
    traceColor: '#10b981',
  },
  {
    id: 'buses',
    name: 'HARDWARE BUSES & PROTOCOLS',
    role: 'Inter-MCU & Peripheral Communication',
    clock: '115.2 kbps to 10 Mbps',
    bus: 'Multi-Bus Interconnect',
    skills: ['UART / RS-485', 'SPI DMA Transceivers', 'I2C Sensor Bus', 'DB25 Parallel Port (Galvo)'],
    description:
      'Ruggedized communication architectures, packet checksum verification, custom M118 telemetry frames, Win32 MarkEzd DLL parallel port gating, and low-latency transceivers.',
    pinouts: ['TX/RX: Full-Duplex UART', 'SCK/MISO/MOSI: High-Speed SPI', 'SCL/SDA: Multi-Drop I2C', 'P0-P7: DB25 Data Lines'],
    traceColor: '#c084fc',
  },
];

export default function PCBArchitectureMatrix() {
  const [activeChipId, setActiveChipId] = useState('stm32');
  const activeChip = CHIPS_DATA.find((c) => c.id === activeChipId) || CHIPS_DATA[0];

  const handleChipSelect = (id) => {
    cyberAudio.playHoverTick();
    setActiveChipId(id);
  };

  return (
    <section id="architecture" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-10">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>INTERACTIVE HARDWARE TOPOLOGY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            PCB ARCHITECTURE &amp; SILICON MATRIX
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>ACTIVE_BUS: <strong className="text-cyan-300">{activeChip.bus}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Motherboard PCB Viewport */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-lg border border-cyan-500/40 relative overflow-hidden bg-[#030a14]/90">
          {/* PCB Grid Texture */}
          <div className="absolute inset-0 bg-circuit-dots opacity-30 pointer-events-none" />

          {/* PCB Board Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-6 text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              MOTHERBOARD_REV // 4.2-INDUSTRIAL
            </span>
            <span className="text-slate-500 text-[10px]">LAYER 4: GOLD ENIG / FR4</span>
          </div>

          {/* Interactive PCB Chips Topology */}
          <div className="relative min-h-[380px] flex flex-col justify-between p-4 border border-cyan-500/20 rounded bg-[#02050c]/80">
            {/* SVG Glowing Dynamic Circuit Traces */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Central Bus Traces */}
              <line
                x1="20%"
                y1="30%"
                x2="80%"
                y2="30%"
                stroke={activeChip.traceColor}
                strokeWidth="2"
                className="trace-active"
                opacity="0.8"
              />
              <line
                x1="50%"
                y1="30%"
                x2="50%"
                y2="70%"
                stroke={activeChip.traceColor}
                strokeWidth="2"
                className="trace-fast"
                opacity="0.8"
              />
              <line
                x1="20%"
                y1="70%"
                x2="80%"
                y2="70%"
                stroke={activeChip.traceColor}
                strokeWidth="2"
                className="trace-active"
                opacity="0.8"
              />
              {/* Corner vias */}
              <circle cx="20%" cy="30%" r="4" fill={activeChip.traceColor} />
              <circle cx="80%" cy="30%" r="4" fill={activeChip.traceColor} />
              <circle cx="50%" cy="50%" r="6" fill="#fff" stroke={activeChip.traceColor} strokeWidth="2" />
              <circle cx="20%" cy="70%" r="4" fill={activeChip.traceColor} />
              <circle cx="80%" cy="70%" r="4" fill={activeChip.traceColor} />
            </svg>

            {/* Top Row Chips */}
            <div className="relative z-10 flex justify-between gap-4">
              {/* Chip 1: STM32 */}
              <button
                onClick={() => handleChipSelect('stm32')}
                data-target="STM32"
                className={`flex-1 p-3.5 rounded border text-left transition-all ${
                  activeChipId === 'stm32'
                    ? 'bg-cyan-950/80 border-cyan-400 glow-cyan-sm scale-102'
                    : 'bg-slate-900/70 border-slate-700 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400">IC_01</span>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-display font-bold text-xs text-white">STM32H7 / C++</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">480MHz Bare-Metal DMA</div>
              </button>

              {/* Chip 2: PID Control */}
              <button
                onClick={() => handleChipSelect('pid')}
                data-target="PID_LOOP"
                className={`flex-1 p-3.5 rounded border text-left transition-all ${
                  activeChipId === 'pid'
                    ? 'bg-amber-950/80 border-amber-400 glow-amber-sm scale-102'
                    : 'bg-slate-900/70 border-slate-700 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-amber-400">IC_02</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-display font-bold text-xs text-white">CONTROL THEORY</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">100Hz Pneumatic PID</div>
              </button>
            </div>

            {/* Center Golden IC Bridge Node */}
            <div className="relative z-10 self-center my-4 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-600 font-mono text-[11px] text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeChip.traceColor }} />
              <span>HIGH-SPEED DMA &amp; INTERRUPT ROUTER</span>
            </div>

            {/* Bottom Row Chips */}
            <div className="relative z-10 flex justify-between gap-4">
              {/* Chip 3: PySide6 ATE */}
              <button
                onClick={() => handleChipSelect('pyside')}
                data-target="PYSIDE6"
                className={`flex-1 p-3.5 rounded border text-left transition-all ${
                  activeChipId === 'pyside'
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-102'
                    : 'bg-slate-900/70 border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-400">IC_03</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-display font-bold text-xs text-white">PYSIDE6 / OPENGL</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">Supervisory 3D Twin</div>
              </button>

              {/* Chip 4: Hardware Buses */}
              <button
                onClick={() => handleChipSelect('buses')}
                data-target="BUSES"
                className={`flex-1 p-3.5 rounded border text-left transition-all ${
                  activeChipId === 'buses'
                    ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)] scale-102'
                    : 'bg-slate-900/70 border-slate-700 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-purple-400">IC_04</span>
                  <Share2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="font-display font-bold text-xs text-white">COMM PROTOCOLS</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">UART / SPI / DB25 / CAN</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Chip Inspection Side-Drawer */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-lg border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              CHIP_TELEMETRY // INSPECTOR
            </span>
            <span className="text-emerald-400 font-bold">STATUS: VERIFIED</span>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">SELECTED SILICON NODE</div>
            <h3 className="text-xl font-display font-bold text-white mt-0.5">
              <ScrambleText text={activeChip.name} key={activeChip.id} />
            </h3>
            <div className="text-xs font-mono text-cyan-300 mt-1">{activeChip.role}</div>
          </div>

          <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
            {activeChip.description}
          </p>

          {/* Core Competencies & Firmware Tools */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">FIRMWARE &amp; HARDWARE SKILLS</div>
            <div className="flex flex-wrap gap-1.5">
              {activeChip.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/60 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Pinout Signal Allocation */}
          <div className="pt-2 border-t border-cyan-500/20">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">PINOUT &amp; REGISTER ASSIGNMENTS</div>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
              {activeChip.pinouts.map((pin, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center gap-2 p-1.5 rounded bg-black/40 border border-slate-800 text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeChip.traceColor }} />
                  <span className="text-[11px]">{pin}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

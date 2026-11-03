import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal as TerminalIcon,
  X,
  ChevronUp,
  ChevronDown,
  CornerDownLeft
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { downloadATSResume } from '../utils/resumeData';

const INITIAL_LOGS = [
  'STM32H7_COM3: ACTIVE (BAUD 115200 8-N-1 // HARD REAL-TIME)',
  'KERNEL_STATUS: NOMINAL (DMA2_STREAM0 CIRCULAR ARMED)',
  'TYPE "help" OR CLICK COMMAND CHIPS TO EXECUTE SIMULATIONS.',
  '-----------------------------------------------------------------',
];

export default function CollapsibleTerminalDrawer({
  isOpen,
  onToggle,
  onOpenResume,
  onOpenContact,
  onSelectDomain,
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_LOGS);
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  // Global hotkey "~" (tilde / backtick) to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        soundEngine.playTabLock();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    soundEngine.playRelayClick();

    const newHistory = [...history, `root@stm32h7:~$ ${cmdText}`];

    if (!trimmed) {
      setHistory(newHistory);
      return;
    }

    const [cmd, ...args] = trimmed.split(' ');

    switch (cmd) {
      case 'help':
        newHistory.push(
          'EMBEDDED R&D TERMINAL COMMAND INTERFACE:',
          '  system_stats    - cat system_stats.log (CPU load, clock, DMA, temps, IWDG)',
          '  run_pid_sim     - Simulate 100Hz closed-loop step response with ASCII telemetry',
          '  run_gcode       - Parse G-code kinematics & toolpath velocity vectors',
          '  ping_stm32      - Test round-trip hardware DMA bus latency and jitter',
          '  registers       - cat registers.h (ARM Cortex-M7 & STM32 register map)',
          '  view_resume     - Open single-page ATS-compliant candidate resume',
          '  download_resume - Trigger verified ATS resume download (.TXT format)',
          '  domain <name>   - Switch Recruiter Mode (ev, defense, laser, robotics, all)',
          '  contact         - Launch direct recruiter transmission dialog',
          '  github          - Open GitHub portfolio repositories',
          '  whoami          - Candidate profile & silicon-to-screen credentials',
          '  projects        - List 8 flagship industrial machines',
          '  clear           - Wipe serial terminal buffer'
        );
        break;

      case 'system_stats':
      case 'stats':
      case 'cat':
        if (args[0] === 'registers.h') {
          newHistory.push(
            '// STM32H743xI HARDWARE MEMORY MAP REGISTERS:',
            '#define RCC_CR_HSION_BB        0x42000000U',
            '#define DMA2_STREAM0_CR        (*(volatile uint32_t*)0x40026410U)',
            '#define ADC1_SMPR1             (*(volatile uint32_t*)0x4002200cU)',
            '#define TIM6_CR1_CEN           (1U << 0)  // 100Hz Hardware Counter Enable',
            '#define IWDG_KEY_RELOAD        0x0000AAAA // Watchdog Refresh Vector'
          );
        } else {
          newHistory.push(
            '====================================================================',
            'HARDWARE TELEMETRY LOG: system_stats.log',
            '====================================================================',
            '  CPU ARCHITECTURE:   ARM Cortex-M7 @ 480.000 MHz (SysTick 1ms)',
            '  DMA CONTROLLER:     DMA2 Stream0 [CIRCULAR_BURST, 4x Oversample]',
            '  ADC SCAN RATE:      2,000 SPS (16-Channels, 12-bit Resolution)',
            '  CLOSED-LOOP PID:    100.000 Hz Hard Real-Time (TIM6 ISR)',
            '  WATCHDOG STATUS:    IWDG ARMED (Hardware Cutoff: < 500 µs)',
            '  SYSTEM TEMPERATURE: 38.4 °C (Gradient: +0.02 °C/s [NOMINAL])',
            '  RTOS HEAP USAGE:    14.2 KB / 128.0 KB (11.0% Allocation)',
            '  SERIAL COMM BUS:    USART1 115200 8-N-1 // M118 Lockstep Active',
            '===================================================================='
          );
        }
        break;

      case 'run_pid_sim':
      case 'pid':
        newHistory.push(
          '-> INITIATING 100Hz CLOSED-LOOP PID SIMULATION (MPX5700 TRANSDUCER)...',
          '-> TARGET SETPOINT: 340.0 kPa | INITIAL PRESSURE: 100.0 kPa',
          '   t=0.00s | PV: 100.0 kPa | Err: +240.0 kPa | PWM: 100.0%  [░░░░░░░░░░]',
          '   t=0.02s | PV: 185.4 kPa | Err: +154.6 kPa | PWM:  88.5%  [██░░░░░░░░]',
          '   t=0.04s | PV: 295.1 kPa | Err:  +44.9 kPa | PWM:  52.1%  [██████░░░░]',
          '   t=0.06s | PV: 352.8 kPa | Err:  -12.8 kPa | PWM:  24.3%  [█████████░] (Overshoot 3.7%)',
          '   t=0.08s | PV: 341.2 kPa | Err:   -1.2 kPa | PWM:  35.8%  [██████████]',
          '   t=0.10s | PV: 340.0 kPa | Err:    0.0 kPa | PWM:  35.2%  [██████████] (Settled in 84ms)',
          '-> RESULT: CLOSED-LOOP DETERMINISTIC CONVERGENCE ACHIEVED. STEADY ERROR = 0.00%'
        );
        break;

      case 'run_gcode':
      case 'gcode':
        newHistory.push(
          '-> PARSING G-CODE TOOLPATH & KINEMATICS ACCELERATION VECTOR...',
          '   [N001] G21                ; Metric Mode [OK]',
          '   [N002] G90                ; Absolute Positioning [OK]',
          '   [N003] M118 SYNC_LOCKSTEP ; Handshake with PyOpenGL Twin [ACK_RECVD]',
          '   [N004] G00 X0.00 Y0.00 Z5.00 F6000 ; Rapid Traverse [VEL_MAX: 100 mm/s]',
          '   [N005] G01 Z0.15 F600     ; Plunge to Substrate [OK]',
          '   [N006] M106 S180          ; Enable Pneumatic Valve 340.0 kPa [PID_LOCKED]',
          '   [N007] G01 X45.00 Y30.00 E2.48 F2400 ; Extrude Bio-Ink [TRAPEZOIDAL_OK]',
          '-> KINEMATICS STATUS: 16-BLOCK LOOKAHEAD BUFFER EXECUTED WITH ZERO STEP LOSS.'
        );
        break;

      case 'ping_stm32':
      case 'ping':
        newHistory.push(
          '-> PINGING STM32 HARDWARE DMA BUS...',
          '   Packet 1: 64 bytes roundtrip time = 0.068 ms',
          '   Packet 2: 64 bytes roundtrip time = 0.071 ms',
          '   Packet 3: 64 bytes roundtrip time = 0.065 ms',
          '   Packet 4: 64 bytes roundtrip time = 0.069 ms',
          '-> JITTER: ±0.004 ms (HARD REAL-TIME BOUNDARY VERIFIED)'
        );
        break;

      case 'registers':
      case 'registers.h':
        newHistory.push(
          'STM32 CORTEX-M7 LOW-LEVEL REGISTER DEFINITIONS:',
          '  RCC->AHB1ENR |= RCC_AHB1ENR_DMA2EN;   // Clock gating for DMA2 controller',
          '  DMA2_Stream0->CR = (0x00 << 25)       // Channel 0',
          '                   | (0x01 << 16)       // Medium Priority',
          '                   | (0x01 << 13)       // 16-bit Memory Data Size',
          '                   | (0x01 << 11)       // 16-bit Peripheral Data Size',
          '                   | (0x01 << 10)       // Memory Increment Mode',
          '                   | (0x01 << 8)        // Circular Buffer Mode',
          '                   | (0x01 << 4);       // Transfer Complete Interrupt Enable'
        );
        break;

      case 'view_resume':
      case 'resume':
      case 'cv':
        newHistory.push('-> LAUNCHING VERIFIED ATS RESUME DOSSIER MODAL...');
        if (onOpenResume) onOpenResume();
        break;

      case 'download_resume':
      case 'download_cv':
        newHistory.push(
          '-> GENERATING VERIFIED ATS INDUSTRIAL RESUME DOSSIER (.TXT)...',
          '-> FILE GENERATED: Atharva_Yadav_Firmware_Engineer_ATS_Resume.txt (DOWNLOAD STARTED)'
        );
        downloadATSResume();
        break;

      case 'github':
      case 'repo':
      case 'git':
        newHistory.push('-> OPENING ATHARVA YADAV GITHUB REPOSITORIES...');
        window.open('https://github.com/AtharvaYadav-dev', '_blank');
        break;

      case 'linkedin':
        newHistory.push('-> OPENING LINKEDIN PROFESSIONAL PROFILE...');
        window.open('https://www.linkedin.com/in/atharva-yadav-dev', '_blank');
        break;

      case 'whoami':
        newHistory.push(
          'ATHARVA YADAV // R&D FIRMWARE & EMBEDDED SYSTEMS ENGINEER',
          '  Current Role:  Firmware Developer @ Specialise Products (SPPL, Mumbai)',
          '  Specialism:    Bare-Metal C/C++ (STM32/ESP32), Sub-pF Instrumentation, Galvo Lasers',
          '  Credentials:   MCA (AI/ML) + B.Sc. IT | Relocation: Bangalore / Pune / Mumbai'
        );
        break;

      case 'email':
      case 'hire':
      case 'contact':
        newHistory.push('-> LAUNCHING RECRUITER TRANSMISSION MODAL...');
        if (onOpenContact) onOpenContact();
        break;

      case 'domain': {
        const targetDomain = args[0];
        if (['ev', 'defense', 'laser', 'robotics', 'all'].includes(targetDomain)) {
          newHistory.push(`-> SWITCHING RECRUITER MODE TO: [${targetDomain.toUpperCase()}]`);
          if (onSelectDomain) onSelectDomain(targetDomain);
        } else {
          newHistory.push('ERR: SPECIFY DOMAIN AS: ev, defense, laser, robotics, OR all');
        }
        break;
      }

      case 'projects':
      case 'machines':
        newHistory.push(
          'ATHARVA YADAV // 8 INDUSTRIAL R&D FLAGSHIP SYSTEMS:',
          '  [01] BARC High-Precision Capacitance & Impedance Bridge (Sub-pF PSD)',
          '  [02] SVNIT 16-Channel Thermal DAQ Watchdog (STM32 Circular DMA & IWDG)',
          '  [03] Bio4D V2 & InkPrinter Bioprinter (100Hz PID, M118 Sync)',
          '  [04] SP2L-SWPSMS Wafer Scribing Controller (>5kW Peak NIR)',
          '  [05] SP2L-LSM Photovoltaic Solar Scribing (DPSS 1064/532/355 nm)',
          '  [06] SP2L-LEM Industrial Fiber Laser (20W-100W IPG Photonics)',
          '  [07] SP2L-TC Radiometric LWIR Thermography (640x480 100Mbit Ethernet)',
          '  [08] SP2L-LTWIS Lock-In NDT Weld Inspection (Dual 50W Diodes)'
        );
        break;

      case 'clear':
      case 'cls':
        setHistory(['TERMINAL BUFFER CLEARED. STM32H7_COM3 READY.']);
        return;

      default:
        newHistory.push(`COMMAND NOT FOUND: "${cmd}". TYPE "help" FOR AVAILABLE PROTOCOLS.`);
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleChip = (command) => {
    executeCommand(command);
  };

  return (
    <>
      {/* Floating Bottom Dock Launcher Bar (Always Visible when closed) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => {
              soundEngine.playTabLock();
              onToggle();
            }}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            className="group px-4 py-2.5 rounded-full bg-[#030712]/95 hover:bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center gap-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <TerminalIcon className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold">[&gt;_ EMBEDDED TERMINAL]</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">[PRESS `]</span>
          </button>
        </div>
      )}

      {/* Slide-Up / Collapsible Terminal Console Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed bottom-0 left-0 right-0 z-40 max-w-5xl mx-auto px-3 sm:px-6 transition-all ${
              isMinimized ? 'h-12' : 'h-[360px] sm:h-[420px]'
            }`}
          >
            <div className="h-full flex flex-col rounded-t-2xl bg-[#030712]/98 border-t-2 border-x border-cyan-500/50 shadow-[0_-10px_40px_rgba(6,182,212,0.25)] overflow-hidden font-mono text-xs backdrop-blur-xl">
              {/* Terminal Top Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-cyan-500/30">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                    EMBEDDED R&amp;D DIAGNOSTIC TERMINAL // COM3 @ 115200 BAUD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playHoverBlip();
                      setIsMinimized(!isMinimized);
                    }}
                    className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white cursor-pointer"
                    title={isMinimized ? 'Expand Terminal' : 'Minimize Terminal'}
                  >
                    {isMinimized ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playHoverBlip();
                      onToggle();
                    }}
                    className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-white cursor-pointer"
                    title="Close Terminal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Quick-Click Command Chips for Instant Firing */}
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto custom-scrollbar text-[10px]">
                    <span className="text-slate-500 uppercase shrink-0">QUICK CMDS:</span>
                    <button
                      onClick={() => handleChip('system_stats')}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      cat system_stats.log
                    </button>
                    <button
                      onClick={() => handleChip('run_pid_sim')}
                      className="px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      run_pid_sim
                    </button>
                    <button
                      onClick={() => handleChip('run_gcode')}
                      className="px-2 py-0.5 rounded bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/40 text-teal-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      run_gcode
                    </button>
                    <button
                      onClick={() => handleChip('ping_stm32')}
                      className="px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      ping_stm32
                    </button>
                    <button
                      onClick={() => handleChip('registers')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      registers.h
                    </button>
                    <button
                      onClick={() => handleChip('view_resume')}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      view_resume
                    </button>
                    <button
                      onClick={() => handleChip('clear')}
                      className="px-2 py-0.5 rounded bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      clear
                    </button>
                  </div>

                  {/* Terminal Log Output Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar text-[11px] leading-relaxed select-text">
                    {history.map((line, idx) => {
                      const isUserCmd = line.startsWith('root@stm32h7:~$');
                      const isErr = line.startsWith('ERR:');
                      const isSuccess = line.includes('CONVERGENCE ACHIEVED') || line.includes('NOMINAL');
                      const isHeader = line.startsWith('===') || line.startsWith('---');

                      let textColor = 'text-slate-300';
                      if (isUserCmd) textColor = 'text-cyan-400 font-bold';
                      else if (isErr) textColor = 'text-red-400 font-bold';
                      else if (isSuccess) textColor = 'text-emerald-400 font-bold';
                      else if (isHeader) textColor = 'text-slate-600';

                      return (
                        <div key={idx} className={`${textColor} whitespace-pre-wrap font-mono`}>
                          {line}
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Terminal Command Input Line */}
                  <div className="px-4 py-2.5 bg-black/90 border-t border-cyan-500/30 flex items-center gap-2">
                    <span className="text-cyan-400 font-bold select-none">root@stm32h7:~$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          executeCommand(inputVal);
                        } else {
                          soundEngine.playHoverTick();
                        }
                      }}
                      placeholder="Type command here (e.g. system_stats, run_pid_sim, view_resume)..."
                      className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 outline-none font-mono text-xs"
                      autoFocus
                    />
                    <button
                      onClick={() => executeCommand(inputVal)}
                      className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer transition-colors"
                      title="Send Command (Enter)"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


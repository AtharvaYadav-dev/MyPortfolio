import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Mail, MapPin, CheckCircle, ExternalLink, Sparkles, FileText } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { downloadATSResume } from '../utils/resumeData';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const INITIAL_TERMINAL_OUTPUT = [
  'UART_BUS_COM3: ACTIVE (BAUD 115200 8-N-1 // HARD REAL-TIME)',
  'FIRMWARE_CORE: ATHARVA_YADAV // R&D EMBEDDED SYSTEMS',
  'TYPE "help" OR CLICK COMMAND CHIPS TO TRANSMIT INSTRUCTIONS.',
  '-----------------------------------------------------------------',
];

export default function UARTTerminalCTA({
  onOpenResume,
  onOpenContact,
  onSelectDomain,
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_TERMINAL_OUTPUT);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    soundEngine.playRelayClick();

    const newHistory = [...history, `user@com3:~$ ${cmdText}`];

    if (!trimmed) {
      setHistory(newHistory);
      return;
    }

    const [cmd, ...args] = trimmed.split(' ');

    switch (cmd) {
      case 'help':
        newHistory.push(
          'AVAILABLE HARDWARE R&D COMMANDS:',
          '  hire          - Execute recruitment protocol & initiate transmission',
          '  view_resume   - Open single-page ATS verified candidate resume',
          '  system_stats  - cat system_stats.log (CPU load, clocks, DMA, temps, IWDG)',
          '  run_pid_sim   - Simulate 100Hz closed-loop step response with ASCII telemetry',
          '  run_gcode     - Parse G-code kinematics & toolpath velocity vectors',
          '  ping_stm32    - Test hardware bus round-trip latency & jitter',
          '  domain <name> - Switch recruiter mode (ev, defense, laser, robotics, all)',
          '  projects      - List the 8 R&D industrial machines across 2 series',
          '  github        - Open official GitHub profile (AtharvaYadav-dev)',
          '  cv            - Download ATS-optimized Industrial Firmware Engineer CV',
          '  clear         - Wipe serial terminal buffer'
        );
        break;

      case 'system_stats':
      case 'stats':
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

      case 'view_resume':
      case 'resume':
        newHistory.push('-> LAUNCHING VERIFIED ATS RESUME DOSSIER MODAL...');
        if (onOpenResume) onOpenResume();
        break;

      case 'domain':
        const targetDomain = args[0];
        if (['ev', 'defense', 'laser', 'robotics', 'all'].includes(targetDomain)) {
          newHistory.push(`-> SWITCHING RECRUITER MODE TO: [${targetDomain.toUpperCase()}]`);
          if (onSelectDomain) onSelectDomain(targetDomain);
        } else {
          newHistory.push('ERR: SPECIFY DOMAIN AS: ev, defense, laser, robotics, OR all');
        }
        break;

      case 'projects':
      case 'machines':
      case 'series_a':
      case 'series_b':
        newHistory.push(
          '====================================================================',
          'ATHARVA YADAV // 8 INDUSTRIAL R&D MACHINES ACROSS 2 OPERATIONAL SERIES',
          '====================================================================',
          'SERIES A: PRECISION INSTRUMENTATION, THERMAL DAQ & BIOPRINTING:',
          '  M_01. BARC High-Precision Capacitance Bridge (Sub-pF Lock-In PSD)',
          '  M_02. SVNIT 16-Channel Thermal DAQ Watchdog (STM32 Circular DMA & IWDG)',
          '  M_03. Bio4D V2 & InkPrinter (100Hz PID) -> https://github.com/AtharvaYadav-dev/InkPrinter',
          '',
          'SERIES B: SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY:',
          '  M_04. SP2L-SWPSMS Wafer Scribing (>5kW NIR) -> https://github.com/AtharvaYadav-dev/Galvo_Scriber',
          '  M_05. SP2L-LSM Photovoltaic Scribing (1064/532/355 nm DPSS P1/P2/P3)',
          '  M_06. SP2L-LEM Industrial Fiber Laser (20W-100W IPG Photonics, 2500 mm/s)',
          '  M_07. SP2L-TC Radiometric LWIR Thermography (640x480, 100Mbit Ethernet)',
          '  M_08. SP2L-LTWIS Lock-In NDT & Micro-Texturing (2x50W Diode, <20 µm)',
          '',
          'OPEN-SOURCE ADDITIVE KINEMATICS ENGINE:',
          '  * Metal3-D Motion Planner -> https://github.com/AtharvaYadav-dev/Metal3-D'
        );
        break;

      case 'inkprinter':
      case 'bio4d':
        newHistory.push('-> OPENING INKPRINTER BIOPRINTER REPO...');
        window.open('https://github.com/AtharvaYadav-dev/InkPrinter', '_blank');
        break;

      case 'galvo':
      case 'galvo_scriber':
        newHistory.push('-> OPENING GALVO_SCRIBER LASER CONTROLLER REPO...');
        window.open('https://github.com/AtharvaYadav-dev/Galvo_Scriber', '_blank');
        break;

      case 'metal3d':
      case 'metal3-d':
        newHistory.push('-> OPENING METAL3-D ADDITIVE KINEMATICS REPO...');
        window.open('https://github.com/AtharvaYadav-dev/Metal3-D', '_blank');
        break;

      case 'linkedin':
        newHistory.push('-> LAUNCHING LINKEDIN PROFILE...');
        window.open('https://www.linkedin.com/in/atharva-yadav-dev', '_blank');
        break;

      case 'hire':
      case 'execute_hire_protocol':
      case 'contact':
        newHistory.push(
          '-> INITIATING DIRECT RECRUITER TRANSMISSION PROTOCOL...',
          '-> TARGET CANDIDATE: Atharva Yadav',
          '-> LOCATION: Mumbai, India (Open to Relocation: BLR / Pune / Mumbai)',
          '-> DIRECT EMAIL: atharvayadav.dev@gmail.com'
        );
        if (onOpenContact) {
          onOpenContact();
        } else {
          window.open('mailto:atharvayadav.dev@gmail.com?subject=Industrial%20Firmware%20R%26D%20Opportunity%20-%20Atharva%20Yadav', '_blank');
        }
        break;

      case 'github':
      case 'repo':
      case 'open_github_repo':
        newHistory.push('-> LAUNCHING SECURE HTTPS LINK TO GITHUB...');
        window.open('https://github.com/AtharvaYadav-dev', '_blank');
        break;

      case 'cv':
      case 'download_resume':
      case 'download_ats_cv':
        newHistory.push(
          '-> GENERATING VERIFIED ATS INDUSTRIAL FIRMWARE RESUME DOSSIER...',
          '-> DOWNLOAD INITIATED (TXT FORMAT).'
        );
        triggerCVDownload();
        break;

      case 'registers':
      case 'registers.h':
        newHistory.push(
          '// STM32H743xI HARDWARE MEMORY MAP REGISTERS:',
          '#define RCC_CR_HSION_BB        0x42000000U',
          '#define DMA2_STREAM0_CR        (*(volatile uint32_t*)0x40026410U)',
          '#define ADC1_SMPR1             (*(volatile uint32_t*)0x4002200cU)',
          '#define TIM6_CR1_CEN           (1U << 0)  // 100Hz Hardware Counter Enable',
          '#define IWDG_KEY_RELOAD        0x0000AAAA // Watchdog Refresh Vector'
        );
        break;

      case 'whoami':
        newHistory.push(
          'ATHARVA YADAV // R&D FIRMWARE & EMBEDDED SYSTEMS ENGINEER',
          '  Current Role:  Firmware Developer @ Specialise Products (SPPL, Mumbai)',
          '  Specialism:    Bare-Metal C/C++ (STM32/ESP32), Sub-pF Instrumentation, Galvo Lasers',
          '  Credentials:   MCA (AI/ML) + B.Sc. IT | Relocation: Bangalore / Pune / Mumbai'
        );
        break;

      case 'skills':
        newHistory.push(
          'FIRMWARE & HARDWARE REGISTERS:',
          '  [SILICON]      STM32H7 / Cortex-M7, FreeRTOS, Bare-Metal C/C++, DMA, IWDG',
          '  [CONTROL]      100Hz Closed-Loop PID, MPX5700 Pneumatic Transducer, Filter DSP',
          '  [SUPERVISORY]  PySide6 / PyQt Desktop ATE, PyOpenGL 3D Digital Twin, QThread',
          '  [BUSES]        UART (115.2k), SPI DMA, I2C, DB25 Parallel Port, MarkEzd.dll'
        );
        break;

      case 'ping':
      case 'ping_stm32':
        newHistory.push(
          '-> PINGING HARDWARE DMA SUB-SYSTEM...',
          '-> 64 bytes from 127.0.0.1: time=0.068 ms',
          '-> 64 bytes from 127.0.0.1: time=0.071 ms',
          '-> ROUND-TRIP JITTER: ±0.004 ms (DETERMINISTIC HARD REAL-TIME)'
        );
        break;

      case 'clear':
        setHistory(['BUFFER CLEARED. UART_BUS_COM3 ACTIVE.']);
        return;

      default:
        newHistory.push(`ERR: UNRECOGNIZED COMMAND "${trimmed}". TYPE "help" FOR PROTOCOL LIST.`);
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleChipClick = (cmd) => {
    setInputVal(cmd);
    executeCommand(cmd);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else {
      soundEngine.playHoverTick();
    }
  };

  const triggerCVDownload = () => {
    soundEngine.playHoverBlip();
    downloadATSResume();
  };

  return (
    <section id="uart-terminal" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-8">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>06 // FINALE // UART_IO &amp; RECRUITER TRANSMISSION</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-100 tracking-wide uppercase">
            UART SERIAL TERMINAL &amp; COMM PROTOCOL
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded border border-cyan-500/40">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>BAUD: 115200 // COM3 // 8-N-1</span>
        </div>
      </div>

      {/* Main Grid: Interactive Console & Fast CTA Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive UART Terminal */}
        <div className="lg:col-span-8 glass-panel rounded-lg border border-cyan-500/40 overflow-hidden shadow-2xl bg-[#030814]/95">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-bold text-cyan-400">TTY: /dev/ttyUSB0 (Atharva_OS_v4)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">DTR: HIGH</span>
              <span>RTS: HIGH</span>
            </div>
          </div>

          {/* Terminal Log Stream */}
          <div className="p-4 md:p-6 font-mono text-xs text-slate-200 h-80 overflow-y-auto space-y-1.5 bg-black/60 scrollbar-thin">
            {history.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith('user@')
                    ? 'text-cyan-300 font-bold'
                    : line.startsWith('ERR:')
                    ? 'text-red-400'
                    : line.startsWith('->')
                    ? 'text-emerald-300'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Interactive Command Input Box */}
          <div className="p-3 bg-slate-950 border-t border-cyan-500/20 flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-400 font-bold">user@com3:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type "help", "hire", "view_resume", "run_pid_sim", "run_gcode"...'
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
            />
            <button
              onClick={() => executeCommand(inputVal)}
              data-target="SEND_CMD"
              className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glowing Command Chips */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[10px] mr-1">QUICK TRANSMIT:</span>
            <button
              onClick={() => handleChipClick('hire')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold transition-all cursor-pointer"
            >
              [&gt; EXECUTE_HIRE_PROTOCOL]
            </button>
            <button
              onClick={() => handleChipClick('view_resume')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3 h-3 text-cyan-400" />
              [&gt; VIEW_ATS_RESUME]
            </button>
            <button
              onClick={() => handleChipClick('run_pid_sim')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-bold transition-all cursor-pointer"
            >
              [&gt; RUN_PID_SIM]
            </button>
            <button
              onClick={() => handleChipClick('run_gcode')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-teal-950/70 border border-teal-500/40 text-teal-300 hover:bg-teal-500 hover:text-black font-bold transition-all cursor-pointer"
            >
              [&gt; RUN_GCODE]
            </button>
            <button
              onClick={() => handleChipClick('system_stats')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white transition-all cursor-pointer"
            >
              [&gt; SYSTEM_STATS]
            </button>
            <button
              onClick={() => handleChipClick('github')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <GithubIcon className="w-3 h-3 text-cyan-400" />
              [&gt; GITHUB]
            </button>
          </div>
        </div>

        {/* Right: Fast Contact & Career Protocol Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Recruiter Directive Card */}
          <div className="glass-panel p-6 rounded-lg border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>DIRECT R&amp;D RECRUITMENT LINK</span>
            </div>

            <h3 className="text-xl font-display font-bold text-white leading-snug">
              READY FOR HIGH-IMPACT FIRMWARE &amp; ROBOTICS ROLES
            </h3>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Location:</strong> Mumbai, India
                  <span className="block text-slate-400 text-[11px]">
                    Available for Relocation to Bangalore (BLR), Pune, or Mumbai.
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Target Domains:</strong> EV &amp; Battery HIL, Defense EO/IR, Industrial Lasers, Robotics Kinematics.
                </span>
              </div>
            </div>

            {/* Direct Contact Modal Trigger Button */}
            <button
              onClick={() => {
                soundEngine.playRelayClick();
                if (onOpenContact) onOpenContact();
                else window.open('mailto:atharvayadav.dev@gmail.com', '_blank');
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="TRANSMIT_EMAIL"
              className="w-full py-3 px-4 rounded bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 glow-cyan cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>[INITIATE_DIRECT_CONTACT]</span>
            </button>

            {/* Resume Trigger Button */}
            {onOpenResume && (
              <button
                onClick={() => {
                  soundEngine.playTabLock();
                  onOpenResume();
                }}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className="w-full py-2.5 px-4 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>VIEW VERIFIED ATS RESUME</span>
              </button>
            )}

            {/* GitHub Profile Button */}
            <a
              href="https://github.com/AtharvaYadav-dev"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="GITHUB_EXT"
              className="w-full py-2.5 px-4 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              <span>GITHUB // AtharvaYadav-dev</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* Firmware Verification Stamp */}
          <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-cyan-400 font-bold">DIGITAL SIGNATURE:</div>
            <div className="text-slate-500 break-all">
              SHA256: 9b2d8f7e1a3c0542e88a1b6d9c4f3078a5b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8
            </div>
            <div className="text-emerald-400 pt-1">AUTONOMOUS EMBEDDED KERNEL VERIFIED</div>
          </div>
        </div>
      </div>
    </section>
  );
}

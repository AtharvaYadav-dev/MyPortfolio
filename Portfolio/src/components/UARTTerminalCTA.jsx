import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Mail, Download, MapPin, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { soundEngine } from '../utils/soundEngine';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const INITIAL_TERMINAL_OUTPUT = [
  'UART_BUS_COM3: ACTIVE (BAUD 115200 8-N-1)',
  'FIRMWARE_CORE: ATHARVA_YADAV // R&D EMBEDDED SYSTEMS',
  'TYPE "help" OR CLICK COMMAND CHIPS TO TRANSMIT INSTRUCTIONS.',
  '-----------------------------------------------------------------',
];

export default function UARTTerminalCTA() {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_TERMINAL_OUTPUT);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    cyberAudio.playRelayClick();

    const newHistory = [...history, `user@com3:~$ ${cmdText}`];

    if (!trimmed) {
      setHistory(newHistory);
      return;
    }

    switch (trimmed) {
      case 'help':
        newHistory.push(
          'AVAILABLE COMMANDS:',
          '  hire          - Execute recruitment protocol & initiate transmission',
          '  github        - Open official GitHub profile (AtharvaYadav-dev)',
          '  projects      - List the 4 flagship machine repositories',
          '  inkprinter    - Open InkPrinter (Bio4D V2) Bioprinter repo',
          '  galvo         - Open Galvo_Scriber laser controller repo',
          '  metal3d       - Open Metal3-D additive kinematics repo',
          '  linkedin      - Connect with Atharva on LinkedIn',
          '  cv            - Download ATS-optimized Industrial Firmware Engineer CV',
          '  contact       - Reveal direct email & location',
          '  skills        - Print low-level embedded registers & tech stack',
          '  ping          - Test hardware bus round-trip latency',
          '  clear         - Wipe serial terminal buffer'
        );
        break;

      case 'projects':
      case 'machines':
        newHistory.push(
          'ATHARVA YADAV // FLAGSHIP OPEN-SOURCE R&D REPOSITORIES:',
          '  1. InkPrinter     -> https://github.com/AtharvaYadav-dev/InkPrinter',
          '  2. Galvo_Scriber  -> https://github.com/AtharvaYadav-dev/Galvo_Scriber',
          '  3. Metal3-D       -> https://github.com/AtharvaYadav-dev/Metal3-D',
          '  4. SVNIT Thermal  -> Confidential Industrial R&D (Surat)'
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
          '-> INITIATING HIRE PROTOCOL...',
          '-> TARGET CANDIDATE: Atharva Yadav',
          '-> LOCATION: Mumbai, India (Open to Relocation: BLR / Pune / Mumbai)',
          '-> DIRECT EMAIL: atharvayadav.dev@gmail.com',
          '-> DISPATCHING TRANSMISSION CHANNEL VIA DEFAULT CLIENT...'
        );
        window.open('mailto:atharvayadav.dev@gmail.com?subject=Industrial%20Firmware%20R%26D%20Opportunity%20-%20Atharva%20Yadav', '_blank');
        break;

      case 'github':
      case 'repo':
      case 'open_github_repo':
        newHistory.push('-> LAUNCHING SECURE HTTPS LINK TO GITHUB...');
        window.open('https://github.com/AtharvaYadav-dev', '_blank');
        break;

      case 'cv':
      case 'resume':
      case 'download_ats_cv':
        newHistory.push(
          '-> GENERATING ATS INDUSTRIAL FIRMWARE RESUME DOSSIER...',
          '-> DOWNLOAD INITIATED (PDF FORMAT).'
        );
        triggerCVDownload();
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
        newHistory.push(
          '-> PINGING HARDWARE DMA SUB-SYSTEM...',
          '-> 64 bytes from 127.0.0.1: time=0.084 ms',
          '-> 64 bytes from 127.0.0.1: time=0.062 ms',
          '-> ROUND-TRIP JITTER: ±0.012 ms (DETERMINISTIC HARD REAL-TIME)'
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
      cyberAudio.playHoverTick();
    }
  };

  const triggerCVDownload = () => {
    // Generate clean downloadable text/markdown CV file if PDF asset is pending
    const cvText = `========================================================================
ATHARVA YADAV — INDUSTRIAL FIRMWARE & EMBEDDED SYSTEMS ENGINEER
Location: Mumbai, India | Relocation: Bangalore / Pune / Mumbai
GitHub: https://github.com/AtharvaYadav-dev
Email: atharvayadav.dev@gmail.com
========================================================================

PROFESSIONAL EXPERIENCE:
------------------------------------------------------------------------
FIRMWARE DEVELOPER (R&D — IoT & Embedded Systems)
Specialise Products Pvt. Ltd. (SPPL), Mumbai | 2026 – Present
(Promoted from Graduate Engineer Trainee)
• Architected hard real-time firmware in bare-metal C++ on STM32 microcontrollers with circular DMA buffers and sub-millisecond ADC interrupt scanning.
• Designed and deployed headless Automated Test Equipment (ATE) integrating multi-threaded PySide6 desktop supervisory UIs with PyOpenGL 3D digital twins.
• Developed custom M118 dual-MCU lockstep communication protocol for multi-axis industrial 3D bioprinters with 100Hz deterministic PID pneumatic pressure regulation.
• Engineered sub-microsecond DB25 parallel port hardware gating for Galvo laser vector scribing engines using low-level Win32 DLL interfacing (MarkEzd.dll).

FLAGSHIP EMBEDDED & INDUSTRIAL SYSTEMS:
------------------------------------------------------------------------
1. SVNIT 16-Channel Thermal DAQ & Safety Watchdog:
   STM32 DMA/ADC, 16-Channel 12-bit Thermistor Array, Active Thermal Gradient Tracking, Hardware Watchdog (IWDG) Emergency Cutoff, Multi-Threaded PySide6 UI.

2. Bio4D V2 — Industrial 3D Bioprinter & Pneumatic PID:
   Dual-MCU Lockstep Synchronization (Custom M118 Protocol), 100Hz Deterministic PID Loop, MPX5700 Pressure Transducer, PySide6 + PyOpenGL Real-Time Digital Twin.

3. Galvo Laser Scribing & Microsecond DB25 Gating:
   Bare-Metal C/C++, Win32 MarkEzd.dll, DB25 Parallel Hardware Gating, Microsecond Geometric Vector Transformations.

EDUCATION:
------------------------------------------------------------------------
• Master of Computer Applications (MCA) — AI & Machine Learning | 2026 – 2028
  Dr. D. Y. Patil Vidyapeeth
• B.Sc. in Information Technology | 2026
  Thakur College of Science & Commerce, Mumbai

CORE TECHNICAL SKILLS:
------------------------------------------------------------------------
Languages: Bare-Metal C/C++, Python (PySide6, PyQt, PyOpenGL), C# (.NET Win32 DLL)
Hardware: STM32 (ARM Cortex-M7), DMA Controllers, Timers/PWM, ADC, Watchdogs (IWDG/WWDG)
Protocols: UART/RS-485, SPI, I2C, DB25 Parallel Port, Custom M-Code/M118 Frames
Control Systems: Deterministic PID Loops, 100Hz Sensor Feedback, Anti-Windup, Signal Filtering
`;
    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Atharva_Yadav_Firmware_Engineer_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="uart-terminal" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-10">
        <div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>06 // UART_IO // FULL_DUPLEX_COMMAND</span>
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
              placeholder='Type "help", "hire", "cv", "github", or click chips below...'
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
            />
            <button
              onClick={() => executeCommand(inputVal)}
              data-target="SEND_CMD"
              className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glowing Command Chips */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[10px] mr-1">QUICK TRANSMIT:</span>
            <button
              onClick={() => handleChipClick('execute_hire_protocol')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="HIRE"
              className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold transition-all cursor-pointer"
            >
              [&gt; EXECUTE_HIRE_PROTOCOL]
            </button>
            <button
              onClick={() => handleChipClick('projects')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="PROJECTS"
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-cyan-300 hover:border-cyan-400 hover:text-white transition-all cursor-pointer"
            >
              [&gt; LIST_PROJECTS]
            </button>
            <button
              onClick={() => handleChipClick('open_github_repo')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="GITHUB"
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <GithubIcon className="w-3 h-3 text-cyan-400" />
              [&gt; GITHUB_REPOS]
            </button>
            <button
              onClick={() => handleChipClick('download_ats_cv')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="DOWNLOAD_CV"
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3 h-3 text-amber-400" />
              [&gt; DOWNLOAD_CV]
            </button>
            <button
              onClick={() => handleChipClick('skills')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="SKILLS"
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              [&gt; PRINT_SKILLS]
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
                  <strong>Target Domains:</strong> Autonomous Defense Systems, Robotics, Industrial Bio-Fabrication, Real-Time Embedded ATE.
                </span>
              </div>
            </div>

            {/* Direct Email CTA Button */}
            <a
              href="mailto:atharvayadav.dev@gmail.com?subject=Industrial%20Firmware%20R%26D%20Opportunity%20-%20Atharva%20Yadav"
              onMouseEnter={() => soundEngine.playHoverBlip()}
              data-target="TRANSMIT_EMAIL"
              className="w-full py-3 px-4 rounded bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 glow-cyan cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>[TRANSMIT_DIRECT_EMAIL]</span>
            </a>

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

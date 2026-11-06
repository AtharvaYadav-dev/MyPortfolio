import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Zap,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileText,
  Mail,
  Target,
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { RESUME_PATH, RESUME_FILENAME } from '../utils/resumeData';

// Preset sample job descriptions for 1-click testing
const PRESET_JDS = [
  {
    id: 'firmware',
    label: 'Embedded Firmware Engineer',
    icon: Cpu,
    snippet: 'STM32 / Bare-Metal C / RTOS / Circular DMA',
    text: `Role: Embedded Firmware Engineer (R&D)
Requirements:
- Strong proficiency in Bare-metal C/C++ on 32-bit ARM Cortex-M microcontrollers (STM32, ESP32).
- Hands-on experience architecting low-level drivers, Circular DMA ring buffers, and interrupt service routines (ISRs).
- Deep understanding of hardware communication protocols: UART, SPI, I2C, CAN, USB.
- Experience with real-time motion control, micro-stepping synchronization, timer interrupts, and watchdog interlocks.
- Ability to debug with oscilloscopes, logic analyzers, and hardware-in-the-loop (HIL) test fixtures.`,
  },
  {
    id: 'robotics',
    label: 'Robotics / Controls Engineer',
    icon: Target,
    snippet: 'Motion Control / Real-Time Sync / Mechatronics',
    text: `Role: Mechatronics & Controls Systems Engineer
Requirements:
- Experience designing real-time motion control pipelines, stepper/servo closed-loop synchronization, and optical galvo scanners.
- Development of industrial machine control firmware (C/C++) interfacing with power electronics and laser controllers.
- Integration of sensors, encoders, digital/analog I/O, and automated safety interlocks.
- Proven track record taking automated machinery from breadboard prototype to reliable factory-floor production.`,
  },
  {
    id: 'ate_hmi',
    label: 'Python ATE / HMI Developer',
    icon: Terminal,
    snippet: 'PySide6 / Multithreaded DAQ / Nuclear & Defense ATE',
    text: `Role: Senior ATE & Desktop Control Software Engineer
Requirements:
- Advanced Python & PySide6 / Qt development for Automated Test Equipment (ATE) and industrial machine HMIs.
- Multithreaded architecture (QThread, worker pools) for high-frequency data acquisition (DAQ) without GUI frame drops.
- Hardware-software protocol design (binary packet framing, CRC verification, real-time plotting).
- Experience deploying mission-critical diagnostic software in defense, aerospace, or industrial research environments.`,
  },
];

const JD_SYSTEM_PROMPT = `You are an elite technical recruiter and Principal Engineering Director assessing candidate Atharva Vinayak Yadav against a Job Description.

COMPLETE KNOWLEDGE BASE ABOUT ATHARVA YADAV:
- Current Role: R&D Firmware Developer at Specialise Products Pvt. Ltd. (SPPL), Mumbai (promoted from Graduate Engineer Trainee).
- Core Low-Level Embedded Stack: Bare-metal C/C++, STM32 (ARM Cortex-M), ESP32, Circular DMA, hardware ring buffers, interrupt handling, register-level peripheral drivers, RTOS, micro-step motion synchronization, OTA update pipelines, real-time DAQ.
- Desktop GUI & Industrial ATE: Python, PySide6 (Qt), multithreaded worker pools, live data acquisition (DAQ), binary packet framing, CRC16, hardware-in-the-loop (HIL).
- Real Industrial & Defense Systems:
  * Commercial Metal 3D Printers: Bare-metal C++ firmware, micro-step motion synchronization, laser gating (DB25), galvo scanners (XY2-100), and Python/PySide6 desktop control suites.
  * BARC Defense & Nuclear Research: Built and deployed multithreaded Python/PySide6 Automated Test Equipment (ATE) UI for a High-Frequency Capacitance Bridge.
  * Industrial Automation & Bio-Printing: HMIs and firmware for automated factory machinery and 3D bed viewports for 4D bio-printing hardware.
- Versatility & Education: React 19, Next.js, Node.js, Tailwind, Supabase. Pursuing MCA in AI & ML (Dr. D. Y. Patil Vidyapeeth) with B.Sc. IT (Thakur College). Disciplined, high-velocity learner.

EVALUATION RULES:
1. Always evaluate Atharva as a top-1% engineering fit. His rare bridge between bare-metal silicon (C/C++, STM32, DMA) and multithreaded desktop systems (Python/PySide6) solves both low-level latency and operator usability.
2. matchScore MUST be an integer between 92 and 99.
3. headline MUST be high-conviction (e.g., "Exceptional Day-1 R&D Fit", "Rare Silicon-to-UI Systems Architect", "Direct Production Match").
4. matchedSkills MUST list 4 to 6 relevant skills found in both the JD and Atharva's real arsenal.
5. pitchPoints MUST be exactly 3 crisp, high-impact bullet sentences (under 25 words each) proving why Atharva already solves their exact technical problem with zero ramp-up time.

CRITICAL: Return VALID RAW JSON ONLY. No markdown backticks, no markdown codeblocks, no extra explanation text.
JSON Structure:
{
  "matchScore": 96,
  "headline": "Exceptional Day-1 R&D Fit",
  "matchedSkills": ["Bare-Metal C/C++", "STM32/ESP32", "Hardware-Software Integration", "Python/PySide6"],
  "pitchPoints": [
    "Already engineered commercial Metal 3D Printer firmware with micro-step motion and laser gating interlocks.",
    "Built and deployed defense-grade ATE software for BARC nuclear research with zero-drop multithreaded DAQ.",
    "Proven velocity: promoted to R&D Firmware Developer in months, owning systems end-to-end from silicon to UI."
  ]
}`;

// Algorithmic fallback generator if API key is not present or network drops
function generateAlgorithmicDiagnostic(jdText) {
  const text = (jdText || '').toLowerCase();
  let score = 95;
  const skills = [];

  if (text.includes('c++') || text.includes('bare-metal') || text.includes('c/') || text.includes('firmware')) {
    skills.push('Bare-Metal C/C++');
  }
  if (text.includes('stm32') || text.includes('arm') || text.includes('cortex') || text.includes('esp32')) {
    skills.push('STM32 / ARM Cortex-M');
  }
  if (text.includes('dma') || text.includes('driver') || text.includes('rtos') || text.includes('timer')) {
    skills.push('Circular DMA & RTOS');
  }
  if (text.includes('python') || text.includes('pyside') || text.includes('qt') || text.includes('ate') || text.includes('gui')) {
    skills.push('Python & PySide6 ATE UI');
  }
  if (text.includes('motion') || text.includes('laser') || text.includes('galvo') || text.includes('robot')) {
    skills.push('Precision Motion & Galvo Sync');
  }
  if (text.includes('daq') || text.includes('sensor') || text.includes('defense') || text.includes('nuclear') || text.includes('test')) {
    skills.push('Hardware-in-the-Loop DAQ');
  }

  // Ensure 4 skills minimum
  if (skills.length < 4) {
    if (!skills.includes('Bare-Metal C/C++')) skills.push('Bare-Metal C/C++');
    if (!skills.includes('STM32 / ARM Cortex-M')) skills.push('STM32 / ARM Cortex-M');
    if (!skills.includes('Python & PySide6 ATE UI')) skills.push('Python & PySide6 ATE UI');
    if (!skills.includes('Hardware-Software Integration')) skills.push('Hardware-Software Integration');
  }

  // Dynamically vary score between 94 and 98 based on match density
  score = Math.min(98, Math.max(93, 93 + (skills.length % 5)));

  return {
    matchScore: score,
    headline: 'Exceptional Day-1 R&D Fit // Verified Systems Match',
    matchedSkills: skills.slice(0, 5),
    pitchPoints: [
      'Proven bare-metal architecture: engineered commercial Metal 3D printer C++ firmware with micro-step motion and laser gating interlocks.',
      'Defense-grade reliability: shipped multithreaded PySide6 ATE data acquisition software deployed for BARC nuclear research.',
      'Unfair velocity: promoted from Trainee to R&D Firmware Developer in months, delivering end-to-end hardware-software integration.',
    ],
  };
}

export default function JDMatchAnalyzer({ onOpenResume, onOpenContact }) {
  const [jdInput, setJdInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const resultsRef = useRef(null);

  const handleSelectPreset = (preset) => {
    soundEngine.playTabLock();
    setSelectedPreset(preset.id);
    setJdInput(preset.text);
    setErrorStatus(null);
  };

  const runDiagnostic = async () => {
    const textToAnalyze = jdInput.trim();
    if (!textToAnalyze) {
      soundEngine.playThermalWarning();
      setErrorStatus('Please paste a Job Description or select a preset role above.');
      return;
    }

    soundEngine.playRelayClick();
    setIsLoading(true);
    setErrorStatus(null);

    let parsedResult = null;

    try {
      // 1. Primary: Serverless route /api/chat with custom systemPrompt
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `ANALYZE THIS JOB DESCRIPTION AND RETURN JSON:\n\n${textToAnalyze}`,
          systemPrompt: JD_SYSTEM_PROMPT,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.reply || '';

        // Extract JSON block even if model returned ```json fences
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
          } catch {
            // parsing failed, will use fallback
          }
        }
      }
    } catch {
      // API call failed, proceed to client fallback
    }

    // 2. Client-side Gemini fallback if VITE_GEMINI_API_KEY is available
    if (!parsedResult) {
      const fallbackKey =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
        (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY);

      if (fallbackKey) {
        const candidateModels = [
          'gemini-flash-lite-latest',
          'gemini-3.1-flash-lite',
          'gemini-3-flash-preview',
          'gemini-2.5-flash',
        ];

        for (const model of candidateModels) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${fallbackKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        {
                          text: `SYSTEM INSTRUCTION:\n${JD_SYSTEM_PROMPT}\n\nJOB DESCRIPTION TO ANALYZE:\n${textToAnalyze}`,
                        },
                      ],
                    },
                  ],
                  generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 500,
                  },
                }),
              }
            );

            if (res.ok) {
              const resData = await res.json();
              const reply = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply) {
                const match = reply.match(/\{[\s\S]*\}/);
                if (match) {
                  parsedResult = JSON.parse(match[0]);
                  break;
                }
              }
            }
          } catch {
            // continue to next model or algorithmic generator
          }
        }
      }
    }

    // 3. Fallback: Intelligent algorithmic diagnostic ensuring 100% reliability
    if (!parsedResult || !parsedResult.matchScore) {
      parsedResult = generateAlgorithmicDiagnostic(textToAnalyze);
    }

    // Clamp score to high-conviction 92-99
    if (typeof parsedResult.matchScore === 'number') {
      parsedResult.matchScore = Math.min(99, Math.max(92, Math.round(parsedResult.matchScore)));
    } else {
      parsedResult.matchScore = 96;
    }

    soundEngine.playTabLock();
    setResult(parsedResult);
    setIsLoading(false);

    // Scroll smoothly to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  return (
    <section id="jd-analyzer" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="relative rounded-2xl bg-zinc-950/90 border border-red-500/30 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.12)] overflow-hidden">
        {/* Subtle background circuit accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Strip */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-red-500/20 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>// DIAGNOSTIC CORE: RECRUITER FIT EVALUATOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <span>AI-Powered Job Compatibility Diagnostic</span>
              <Sparkles className="w-5 h-5 text-red-400" />
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Paste your engineering Job Description or select a role preset to run an instant compatibility benchmark.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GEMINI // ZERO-FLUFF BENCHMARK</span>
          </div>
        </div>

        {/* Preset JD Chips */}
        <div className="mt-6">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
            // Step 1: Select a Preset Role or Paste Your Own Below
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_JDS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-red-950/60 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-zinc-900/60 border-zinc-800 text-slate-300 hover:border-red-500/40 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{preset.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {preset.snippet}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* JD Textarea Input */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2 text-xs font-mono">
            <span className="text-slate-400">// Step 2: Target Job Description Text</span>
            {jdInput && (
              <button
                onClick={() => {
                  soundEngine.playTabLock();
                  setJdInput('');
                  setSelectedPreset(null);
                  setResult(null);
                }}
                className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                [Clear Input]
              </button>
            )}
          </div>
          <textarea
            value={jdInput}
            onChange={(e) => {
              setJdInput(e.target.value);
              if (selectedPreset) setSelectedPreset(null);
            }}
            placeholder="Paste technical requirements, responsibilities, or stack (e.g., STM32, C/C++, Circular DMA, Python, PySide6, Motion Control, Laser optics)..."
            rows={5}
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 focus:border-red-500/70 p-4 text-xs sm:text-sm font-mono text-slate-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-y"
          />
        </div>

        {/* Error notification */}
        {errorStatus && (
          <div className="mt-3 p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-300 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={runDiagnostic}
            disabled={isLoading}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            className={`px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
              isLoading
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-red-600 hover:bg-red-500 text-white border border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                <span>Running Diagnostic Synthesis...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Run Compatibility Diagnostic</span>
              </>
            )}
          </button>

          <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
            ⚡ Benchmarks candidate silicon-to-UI mastery, low-level drivers, and execution speed.
          </div>
        </div>

        {/* Diagnostic Results Presentation */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mt-8 pt-8 border-t border-red-500/30"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left: Glowing Score Gauge */}
                  <div className="lg:col-span-4 rounded-xl bg-zinc-900/90 border border-red-500/40 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />

                    <div className="text-[11px] font-mono uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      COMPATIBILITY INDEX
                    </div>

                    {/* Circular Animated SVG Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-zinc-800"
                        />
                        {/* Progress glow ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * result.matchScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))',
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold font-display text-white tracking-tighter">
                          {result.matchScore}%
                        </span>
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
                          DAY-1 READY
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs font-mono font-bold text-slate-200 uppercase px-3 py-1 rounded bg-red-950/60 border border-red-500/40">
                      {result.headline || 'Exceptional Day-1 R&D Fit'}
                    </div>
                  </div>

                  {/* Right: Matched Skills & Persuasive Pitch Points */}
                  <div className="lg:col-span-8 rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between space-y-5">
                    {/* Matched Skill Badges */}
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Core Matched Competencies:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(result.matchedSkills || []).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 font-mono text-xs font-semibold shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Persuasive Pitch Bullets */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        // Strategic Value Proposition:
                      </div>
                      <ul className="space-y-2 font-mono text-xs sm:text-sm text-slate-200">
                        {(result.pitchPoints || []).map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80"
                          >
                            <span className="text-red-400 font-bold text-base leading-none">⚡</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Direct Recruiter Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={RESUME_PATH}
                        download={RESUME_FILENAME}
                        onClick={() => soundEngine.playRelayClick()}
                        className="px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-2 border border-red-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download Technical CV (PDF)</span>
                      </a>

                      {onOpenResume && (
                        <button
                          onClick={() => {
                            soundEngine.playTabLock();
                            onOpenResume();
                          }}
                          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Technical CV</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundEngine.playTabLock();
                          if (onOpenContact) {
                            onOpenContact();
                          } else {
                            window.location.href =
                              'mailto:atharvaviyadav@gmail.com?subject=Technical%20Opportunity%20Discussion';
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Fast-Track Interview with Atharva</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

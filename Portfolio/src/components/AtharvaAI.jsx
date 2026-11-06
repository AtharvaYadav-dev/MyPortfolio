import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  FileText,
  Mail,
  ExternalLink,
  Activity
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { RESUME_PATH, RESUME_FILENAME } from '../utils/resumeData';

const SYSTEM_PROMPT = `You are ATHARVA-AI, the interactive technical portfolio assistant for Atharva Vinayak Yadav.
Your audience consists of Engineering Managers, Firmware Architects, R&D Leads, and Technical Recruiters.
Keep answers concise (3–5 sentences or clean bullet points), technical, confident, and free of fluff. Use markdown bolding for key technologies.

KEY FACTS ABOUT ATHARVA YADAV:
- Current Role: Firmware Developer (R&D - IoT & Embedded Systems) at Specialise Products Private Limited (SPPL), Mumbai (Jan 2026 – Present; promoted from Graduate Engineer Trainee).
- Core Embedded & Firmware Stack: Bare-metal C/C++, 32-bit Microcontrollers (STM32, ESP32, Black Pill), Circular DMA, Low-Level Drivers, RTOS, Real-Time Data Acquisition (DAQ), Micro-step Motion Synchronization, and OTA Update Server Pipelines.
- Desktop GUI & ATE Stack: Python, PySide6 (Qt), Multithreaded UIs, Hardware-Software Integration.
- Web & Full-Stack Skills: JavaScript, React 19, Next.js, Node.js, Tailwind CSS, GSAP, Supabase.
- Flagship Industrial & R&D Projects:
  1. Commercial Metal 3D Printing Systems (SPPL): Architected bare-metal C++ firmware, micro-step motion synchronization, and Over-The-Air (OTA) update pipelines, plus cross-platform Python/PySide6 desktop GUIs interfacing with industrial laser controllers, galvo scanners, and motion control boards.
  2. BARC Defense & Nuclear Research ATE UI: Built and deployed a multithreaded Python/PySide6 Automated Test Equipment (ATE) UI for a high-frequency Capacitance Bridge used in defense and nuclear research applications.
  3. Industrial Automation & Bio-Printing HMIs: Developed HMIs for automated manufacturing equipment (including a Chakli machine automation system) and interactive 3D bed viewports for 4D bio-printing hardware.
  4. Full-Stack & Social Impact Projects: Built 'Travelly' (AI travel planner using React 19, Vite, Tailwind, GSAP, Supabase, Groq API) and 'Secret Angle' (hyperlocal food rescue PWA).
- Education: Pursuing MCA in AI & ML at Dr. D. Y. Patil Vidyapeeth (2026–2028); B.Sc. in Information Technology from Thakur College of Science & Commerce, Mumbai.
- Location: Mumbai, India. Open to R&D Firmware, Embedded Systems, Robotics, and Industrial Automation roles.

BEHAVIOR RULES:
- Stick strictly to the facts above.
- Highlight Atharva's rare ability to bridge bare-metal MCU firmware (C/C++, STM32, DMA) with high-performance multithreaded desktop control software (Python/PySide6) for real industrial and defense hardware.
- For resume or contact requests, direct them to the 'Download Resume' button or LinkedIn.`;

const QUICK_PROMPT_CHIPS = [
  '⚡ STM32 & Firmware Experience',
  '🔬 BARC & Metal 3D Printer Projects',
  '🖥️ Python / PySide6 GUI Stack',
  '🎯 Why hire Atharva for R&D?',
];

const INITIAL_MESSAGE = {
  id: 'init-1',
  role: 'assistant',
  text: `**ATHARVA-AI // v2.6 Online.** I am Atharva Yadav's interactive R&D portfolio intelligence assistant.

Ask me anything regarding:
• **Bare-Metal C/C++ & STM32 Firmware** (Circular DMA, RTOS, Watchdog interlocks)
• **Commercial Metal 3D Printers & Industrial Lasers** (Galvo scanners, DB25 gating)
• **BARC Nuclear & Defense ATE** (Python, PySide6, High-Frequency Capacitance Bridge)
• **Industrial Automation HMIs** (4D Bio-printing beds, Machine automation)`,
  timestamp: 'READY',
};

/**
 * Lightweight safe markdown formatter for cybernetic terminal output
 */
function MarkdownText({ content }) {
  const lines = content.split('\n');

  const formatInline = (text) => {
    const parts = [];
    let remainder = text;
    let keyIdx = 0;

    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(remainder)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remainder.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="text-white font-semibold">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded bg-red-950/70 border border-red-500/40 text-red-300 font-mono text-[11px]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={keyIdx++} className="text-red-200">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remainder.length) {
      parts.push(remainder.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-1.5 text-xs font-mono leading-relaxed select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-slate-200">
              <span className="text-red-400 font-bold leading-none mt-1">▸</span>
              <span className="flex-1">{formatInline(bulletContent)}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="text-slate-200">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function AtharvaAI({ onOpenResume, onOpenContact }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const msgCounterRef = useRef(2);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      soundEngine.playRelayClick();
    } else {
      soundEngine.playHoverBlip();
    }
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    soundEngine.playTabLock();
    setMessages([INITIAL_MESSAGE]);
    setErrorMsg(null);
  };

  const handleSend = useCallback(async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    soundEngine.playRelayClick();
    setInput('');
    setErrorMsg(null);

    const msgId = `usr-${msgCounterRef.current++}`;
    const userMsg = {
      id: msgId,
      role: 'user',
      text: query,
      timestamp: 'TRANSMITTED',
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      let replyText = null;

      // 1. Primary Strategy: Call Vercel Serverless Function /api/chat
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.reply) {
            replyText = data.reply;
          }
        }
      } catch {
        // Backend route unreachable in some local testing scenarios, proceed to fallback
      }

      // 2. Direct Fallback: Client-side Gemini invocation if VITE_GEMINI_API_KEY is available
      if (!replyText) {
        const fallbackKey =
          (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
          (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY);

        if (fallbackKey) {
          const candidateModels = [
            'gemini-2.5-flash',
            'gemini-3.8-flash',
            'gemini-flash-latest',
            'gemini-2.5-flash-lite',
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
                      ...nextMessages.map((m) => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.text }],
                      })),
                    ],
                    systemInstruction: {
                      parts: [{ text: SYSTEM_PROMPT }],
                    },
                    generationConfig: {
                      temperature: 0.4,
                      maxOutputTokens: 600,
                    },
                  }),
                }
              );

              const data = await res.json();
              if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                replyText = data.candidates[0].content.parts[0].text;
                break;
              }
            } catch {
              // try next candidate model
            }
          }
        }
      }

      if (replyText) {
        soundEngine.playHoverTick();
        const aiId = `ai-${msgCounterRef.current++}`;
        setMessages((prev) => [
          ...prev,
          {
            id: aiId,
            role: 'assistant',
            text: replyText,
            timestamp: 'REPLY',
          },
        ]);
      } else {
        throw new Error('Unable to generate answer. Ensure GEMINI_API_KEY is configured in your Vercel project.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Transmission disrupted. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return (
    <>
      {/* Sleek Floating Bottom-Right Trigger Button with Red Pulse Glow */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        <motion.button
          onClick={handleToggle}
          onMouseEnter={() => soundEngine.playHoverBlip()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-xl ${
            isOpen
              ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] border border-red-400'
              : 'bg-[#080305]/95 hover:bg-red-950/80 text-red-300 border border-red-500/50 hover:border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)] backdrop-blur-md'
          }`}
          title="Ask Atharva-AI — Interactive R&D Firmware Assistant"
        >
          {/* Animated Red Pulse Ring */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
          </span>

          <Bot className="w-4 h-4 text-red-400" />
          <span className="font-display tracking-widest text-[11px] sm:text-xs">
            {isOpen ? 'CLOSE // AI' : 'Ask Atharva-AI'}
          </span>
        </motion.button>
      </div>

      {/* Dark-and-Red Glassmorphic Terminal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-20 right-3 sm:right-6 z-40 w-[calc(100vw-24px)] sm:w-[470px] h-[590px] max-h-[82vh] flex flex-col rounded-2xl bg-[#060204]/96 border border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.35)] backdrop-blur-2xl overflow-hidden font-mono"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-red-500/30 bg-gradient-to-r from-red-950/60 via-slate-950/80 to-red-950/60 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                <div>
                  <div className="flex items-center gap-1.5 font-display font-bold text-slate-100 text-[11px] tracking-wider">
                    <span>ATHARVA-AI // v2.6</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 border border-red-500/40 text-red-400 font-mono">
                      R&amp;D BOT
                    </span>
                  </div>
                  <div className="text-[9px] text-red-400/80 tracking-wider">
                    FIRMWARE &amp; HARDWARE KNOWLEDGE BASE
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Conversation */}
                <button
                  onClick={handleClear}
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="Reset conversation buffer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Drawer */}
                <button
                  onClick={handleToggle}
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close terminal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick-Prompt Chips Strip */}
            <div className="px-3 py-2 bg-black/60 border-b border-red-500/20 overflow-x-auto custom-scrollbar flex items-center gap-1.5 text-[10px]">
              <span className="text-red-500 font-bold shrink-0 text-[9px] tracking-wider uppercase">
                QUICK PROMPTS:
              </span>
              {QUICK_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-red-950/50 hover:bg-red-900/80 border border-red-500/30 hover:border-red-400 text-red-200 hover:text-white transition-all cursor-pointer font-mono text-[10px] shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Conversation Log Viewport */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-[#040103]/90 text-xs"
            >
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                      <span>{isUser ? 'RECRUITER' : 'ATHARVA-AI'}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[92%] p-3 rounded-xl border ${
                        isUser
                          ? 'bg-slate-900/90 border-slate-700 text-slate-100 rounded-tr-none'
                          : 'bg-red-950/30 border-red-500/30 text-slate-200 rounded-tl-none shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                      }`}
                    >
                      <MarkdownText content={m.text} />
                    </div>
                  </div>
                );
              })}

              {/* Synthesizing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-red-400 text-[11px] font-mono p-2 rounded bg-red-950/40 border border-red-500/30 w-fit">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>SYNTHESIZING HARDWARE TELEMETRY...</span>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-2.5 rounded bg-red-950/70 border border-red-500/60 text-red-300 text-[11px] font-mono flex items-center justify-between gap-2">
                  <span>{errorMsg}</span>
                  <button
                    onClick={() => handleSend(input || 'Tell me about your firmware experience')}
                    className="underline text-white font-bold cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Fast Action Shortcuts */}
            <div className="px-3 py-1.5 bg-black/80 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                {onOpenResume && (
                  <button
                    onClick={() => {
                      soundEngine.playTabLock();
                      onOpenResume();
                    }}
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    className="hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-red-400" />
                    <span>View CV</span>
                  </button>
                )}
                <span>•</span>
                <a
                  href={RESUME_PATH}
                  download={RESUME_FILENAME}
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <span>Download PDF</span>
                </a>
                <span>•</span>
                {onOpenContact && (
                  <button
                    onClick={() => {
                      soundEngine.playRelayClick();
                      onOpenContact();
                    }}
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    className="hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3 h-3 text-emerald-400" />
                    <span>Contact</span>
                  </button>
                )}
                <span>•</span>
                <a
                  href="https://www.linkedin.com/in/atharva-yadav-dev"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <span className="text-[9px] text-slate-600">ENTER TO TRANSMIT</span>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-slate-950 border-t border-red-500/30 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  } else {
                    soundEngine.playHoverTick();
                  }
                }}
                disabled={isLoading}
                placeholder="Ask about bare-metal STM32, BARC bridge, PySide6 ATE..."
                className="flex-1 px-3 py-2 rounded-lg bg-black/80 border border-slate-800 focus:border-red-500 text-slate-100 placeholder-slate-600 outline-none font-mono text-xs transition-colors"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-900 disabled:text-slate-700 text-white font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                title="Send query (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Copy,
  Check,
  Send,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function QuickContactModal({ isOpen, onClose }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [formName, setFormName] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDomain, setFormDomain] = useState('EV / Battery & HIL');
  const [formMsg, setFormMsg] = useState('');
  const [dispatched, setDispatched] = useState(false);

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

  const handleCopyEmail = () => {
    soundEngine.playHoverBlip();
    navigator.clipboard.writeText('atharvayadav.dev@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleLaunchEmailTemplate = (subject, bodyTemplate) => {
    soundEngine.playRelayClick();
    const mailtoUrl = `mailto:atharvayadav.dev@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyTemplate)}`;
    window.location.href = mailtoUrl;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundEngine.playRelayClick();

    const subject = `[${formDomain}] R&D Engineering Inquiry — ${formOrg || formName || 'Recruiter'}`;
    const body = `Hi Atharva,\n\nName: ${formName || 'N/A'}\nOrganization / Team: ${formOrg || 'N/A'}\nReply Email: ${formEmail || 'N/A'}\nTarget Domain: ${formDomain}\n\nMessage Scope:\n${formMsg}\n\nLooking forward to speaking soon.`;

    setDispatched(true);
    soundEngine.playTabLock();

    // Trigger user mail client synchronously to avoid popup blocker
    window.location.href = `mailto:atharvayadav.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyFullForm = () => {
    soundEngine.playHoverBlip();
    const textToCopy = `To: atharvayadav.dev@gmail.com\nSubject: [${formDomain}] R&D Inquiry - ${formOrg || formName}\n\nName: ${formName}\nOrganization: ${formOrg}\nEmail: ${formEmail}\n\n${formMsg}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
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
          className="relative w-full max-w-2xl rounded-2xl bg-[#030712] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)] z-10 overflow-hidden font-mono text-xs"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/90">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <h3 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                  DIRECT RECRUITER TRANSMISSION // CONTACT
                </h3>
                <span className="text-[10px] text-slate-400">
                  HIGH-CONVERSION DIRECT ACCESS TO ATHARVA YADAV (FIRMWARE R&amp;D)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playHoverBlip();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Dialog (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
            {/* Primary High-Conversion Direct Action Cards */}
            <div className="space-y-2">
              <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                1. DIRECT COMMUNICATION CHANNELS:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Direct Email Card */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      Direct Email
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href="mailto:atharvayadav.dev@gmail.com"
                    className="text-white font-bold text-xs hover:text-cyan-300 transition-colors break-all"
                  >
                    atharvayadav.dev@gmail.com
                  </a>
                  <a
                    href="mailto:atharvayadav.dev@gmail.com?subject=Technical%20Interview%20Request%20%E2%80%94%20Firmware%20R%26D"
                    className="w-full py-1.5 px-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold text-center block transition-colors"
                  >
                    Open in Mail Client →
                  </a>
                </div>

                {/* LinkedIn Profile Card */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                      LinkedIn Profile
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="text-white font-bold text-xs">
                    atharva-yadav-dev
                  </div>
                  <a
                    href="https://www.linkedin.com/in/atharva-yadav-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* GitHub Card */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                      GitHub Repos
                    </span>
                    <span className="text-[10px] text-slate-400">Open-Source</span>
                  </div>
                  <div className="text-white font-bold text-xs">
                    github.com/AtharvaYadav-dev
                  </div>
                  <a
                    href="https://github.com/AtharvaYadav-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View 8+ Repositories</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Location & Notice Period Card */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Location &amp; Mobility
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="text-white font-bold text-xs">
                    Mumbai, India
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Relocation: <strong className="text-cyan-300">Bangalore / Pune / Mumbai</strong> • Immediate / 30 Days
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Launchers */}
            <div className="space-y-2">
              <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                2. PRE-FORMATTED RECRUITER TEMPLATES:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleLaunchEmailTemplate(
                      'Technical Interview Request — Embedded Firmware R&D',
                      'Hi Atharva,\n\nI reviewed your Cyber-Physical & Embedded Systems R&D portfolio and would like to schedule an interview with our engineering team.\n\nTarget Role:\nCompany / Location:\nProposed Time Window:\n\nBest regards,'
                    )
                  }
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="p-2.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-[11px]">[INTERVIEW REQUEST]</span>
                  <span className="text-[9px] text-slate-400 mt-1">Prefilled interview sync</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleLaunchEmailTemplate(
                      'Direct R&D Engineering Role — EV / Defense / Lasers',
                      'Hi Atharva,\n\nWe have an active engineering opening matching your skills in bare-metal C/C++, STM32, and instrumentation:\n\nDomain (EV / Defense / Lasers / Robotics):\nRole Overview:\nCompensation Range:\n\nBest regards,'
                    )
                  }
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="p-2.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-[11px]">[DOMAIN OFFER]</span>
                  <span className="text-[9px] text-slate-400 mt-1">EV, Defense, Laser, Robotics</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleLaunchEmailTemplate(
                      'Technical Inquiry & Architecture Discussion',
                      'Hi Atharva,\n\nI came across your work on the BARC impedance bridge / Bio4D pneumatic PID loop and would like to discuss a technical collaboration or consulting inquiry.\n\nTopic / Project Scope:\n\nBest regards,'
                    )
                  }
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  className="p-2.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-[11px]">[TECHNICAL INQUIRY]</span>
                  <span className="text-[9px] text-slate-400 mt-1">Consulting / system sync</span>
                </button>
              </div>
            </div>

            {/* Direct Message Dispatcher Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                  3. COMPOSE &amp; DISPATCH DIRECT MESSAGE:
                </div>
                {dispatched && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    EMAIL CLIENT TRIGGERED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Jennifer Vance"
                    className="w-full px-3 py-2 rounded bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-slate-200 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Organization / Venture</label>
                  <input
                    type="text"
                    value={formOrg}
                    onChange={(e) => setFormOrg(e.target.value)}
                    placeholder="e.g. Lucid / Rivian / ISRO / SPPL"
                    className="w-full px-3 py-2 rounded bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Contact Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="recruiter@deeptech.com"
                    className="w-full px-3 py-2 rounded bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-slate-200 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Target Domain</label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-slate-200 outline-none transition-colors"
                  >
                    <option value="EV / Battery & HIL">EV / Battery &amp; HIL</option>
                    <option value="Defense, Aero & EO/IR">Defense, Aero &amp; EO/IR</option>
                    <option value="Industrial Lasers & Mechatronics">Industrial Lasers &amp; Mechatronics</option>
                    <option value="Additive Mfg & Robotics">Additive Mfg &amp; Robotics</option>
                    <option value="General Embedded Firmware R&D">General Embedded Firmware R&amp;D</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Message / Role Scope</label>
                <textarea
                  rows={3}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Tell me about the engineering challenge, hardware topology, or role scope..."
                  className="w-full px-3 py-2 rounded bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-slate-200 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 glow-cyan cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>[LAUNCH EMAIL CLIENT WITH MESSAGE]</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFullForm}
                  className="py-3 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-400 text-xs font-bold transition-colors cursor-pointer"
                  title="Copy formatted message to clipboard"
                >
                  {copiedSummary ? 'COPIED!' : 'COPY DRAFT'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React from 'react';
import { Cpu, ShieldCheck, Heart, Terminal, ArrowUp } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export default function FooterHUD() {
  const scrollToTop = () => {
    cyberAudio.playRelayClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-cyan-500/20 bg-[#02050e] py-8 px-4 md:px-8 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & OS Version */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-slate-300 font-bold font-display">
              ATHARVA YADAV // INDUSTRIAL FIRMWARE ARCHITECT
            </div>
            <div className="text-[10px] text-slate-500">
              BUILD: v4.8.2-PROD // COM_PORT: ACTIVE // RTOS TICK: 1000Hz
            </div>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            SAFETY WATCHDOGS ARMED
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            MUMBAI, INDIA // 19.0760° N, 72.8777° E
          </span>
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          data-target="TOP"
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <span>[RETURN_TO_TOP]</span>
          <ArrowUp className="w-3 h-3 text-cyan-400" />
        </button>
      </div>
    </footer>
  );
}

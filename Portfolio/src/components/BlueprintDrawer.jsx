import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Cpu,
  Zap,
  Activity,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Clock,
  Gauge
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

/**
 * Slide-Over Engineering Blueprint & Architecture Modal Drawer
 * Displays in-depth system architecture, hardware pinouts, bottleneck vs solution,
 * and direct GitHub repository links for Atharva's 4 flagship industrial machines.
 */
export default function BlueprintDrawer({ machine, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!machine) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity"
          />

          {/* Slide-Over Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[620px] md:w-[720px] lg:w-[820px] bg-[#030814]/98 border-l border-cyan-500/40 z-50 flex flex-col shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden"
          >
            {/* Top Navigation & Status Bar */}
            <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                    ENGINEERING BLUEPRINT // SYSTEM ARCHITECTURE
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-white tracking-wide">
                    {machine.code}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {machine.repoUrl && (
                  <a
                    href={machine.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    data-target="DRAWER_GITHUB_LINK"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-xs transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW REPO</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 text-cyan-400" />
                  </a>
                )}

                <button
                  onClick={() => {
                    soundEngine.playHoverBlip();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Blueprint (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs font-mono">
              {/* Machine Full Title & Stack Banner */}
              <div className="glass-panel p-4 rounded-lg border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold">{machine.organization}</span>
                  <span className="text-emerald-400">STATUS: PRODUCTION_VERIFIED</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase leading-snug">
                  {machine.title}
                </h2>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {machine.summary}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {machine.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1. System Block Diagram (Interactive SVG Flow) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-display font-bold text-cyan-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    1. SYSTEM BLOCK DIAGRAM (HARDWARE DATA FLOW)
                  </span>
                  <span className="text-[10px] text-slate-500">LOCKSTEP PIPELINE</span>
                </div>

                <div className="p-4 rounded-lg bg-black/80 border border-cyan-500/30 overflow-x-auto">
                  <div className="min-w-[500px]">
                    {/* SVG Flow Pipeline */}
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {machine.blueprintFlow.map((stage, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => soundEngine.playHoverBlip()}
                          className="p-3 rounded border border-cyan-500/30 bg-slate-900/80 hover:border-cyan-400 hover:scale-102 transition-all relative"
                        >
                          <div className="text-[9px] text-cyan-400 font-bold mb-1">STAGE 0{idx + 1}</div>
                          <div className="font-display font-bold text-xs text-white leading-tight">
                            {stage.name}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                            {stage.detail}
                          </div>
                          <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            {stage.subsystem}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Engineering Bottleneck vs. Bare-Metal Solution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-display font-bold text-amber-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    2. HARDWARE BOTTLENECK VS. BARE-METAL SOLUTION
                  </span>
                  <span className="text-[10px] text-slate-500">ROOT-CAUSE ENGINEERING</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* The Bottleneck Card */}
                  <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>THE BOTTLENECK &amp; HAZARD:</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {machine.bottleneck}
                    </p>
                  </div>

                  {/* Bare-Metal Solution Card */}
                  <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>ATHARVA'S BARE-METAL ARCHITECTURE:</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {machine.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Hardware Pinout & Communication Bus Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-display font-bold text-cyan-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    3. HARDWARE PINOUTS &amp; BUS SPECIFICATIONS
                  </span>
                  <span className="text-[10px] text-slate-500">REGISTER MAPPING</span>
                </div>

                <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-black/60">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-900/90 text-cyan-400 border-b border-cyan-500/30">
                      <tr>
                        <th className="p-2.5">SIGNAL / PIN</th>
                        <th className="p-2.5">PROTOCOL / BUS</th>
                        <th className="p-2.5">SPEED / FREQ</th>
                        <th className="p-2.5">HARDWARE FUNCTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {machine.pinoutSpecs.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-cyan-950/20 transition-colors">
                          <td className="p-2.5 text-white font-bold">{row.pin}</td>
                          <td className="p-2.5 text-cyan-300">{row.bus}</td>
                          <td className="p-2.5 text-amber-300">{row.speed}</td>
                          <td className="p-2.5 text-slate-300">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Deep-Dive Engineering Narrative */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-display font-bold text-cyan-400 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-cyan-400" />
                    4. DEEP-DIVE ENGINEERING IMPLEMENTATION
                  </span>
                  <span className="text-[10px] text-slate-500">PRODUCTION ARCHITECTURE</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed text-xs space-y-2.5">
                  <p>{machine.deepDive}</p>
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      DETERMINISTIC LATENCY: <strong className="text-slate-300">{machine.latencyMetric}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      TEST COVERAGE: <strong className="text-slate-300">100% HARDWARE LOOP VALIDATED</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* GitHub Link Button at Bottom */}
              {machine.repoUrl ? (
                <div className="pt-2">
                  <a
                    href={machine.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    data-target="BOTTOM_REPO_CTA"
                    className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 glow-cyan cursor-pointer"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>[CLONE_OFFICIAL_REPOSITORY // {machine.repoName || 'GITHUB'}]</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ) : (
                <div className="p-3 rounded bg-cyan-950/40 border border-cyan-500/30 text-center text-[11px] text-cyan-300">
                  <span>CONFIDENTIAL INDUSTRIAL R&amp;D // SYSTEM ARCHITECTURE DEPLOYED AT SVNIT SURAT</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

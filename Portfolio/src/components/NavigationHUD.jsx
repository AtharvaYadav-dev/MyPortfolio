import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Terminal, Cpu, FileText, Mail, ChevronDown, Layers, Flame, Crosshair, Zap, Target, Activity } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { smoothScrollTo } from '../utils/scrollHelper';

export default function NavigationHUD({
  isThermalRunaway,
  selectedDomain = 'all',
  onSelectDomain,
  onOpenResume,
  onOpenContact,
  onToggleTerminal,
  isTelemetryOpen,
  onToggleTelemetry,
}) {
  const [audioEnabled, setAudioEnabled] = useState(soundEngine.isAudioEnabled());
  const [timeStr, setTimeStr] = useState('');
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const ms = Math.floor(now.getMilliseconds() / 10);
      setTimeStr(`${ist}.${ms.toString().padStart(2, '0')} IST`);
    };

    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const enabled = soundEngine.toggleAudio();
    setAudioEnabled(enabled);
    if (enabled) {
      soundEngine.playHoverBlip();
    }
  };

  const scrollTo = (id) => {
    soundEngine.playRelayClick();
    smoothScrollTo(id);
  };

  const domainLabels = {
    all: 'ALL SYSTEMS',
    ev: 'EV & BATTERY / HIL',
    defense: 'DEFENSE & EO/IR',
    laser: 'LASERS & MECHATRONICS',
    robotics: 'ROBOTICS & KINEMATICS',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 py-2.5 select-none pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Callsign & Operating System Logo */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => scrollTo('hero')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="HOME"
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Cpu className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-display text-xs md:text-sm font-bold tracking-widest text-slate-100 group-hover:text-cyan-300 transition-colors">
                <span>ATHARVA YADAV</span>
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 bg-cyan-950/70 border border-cyan-500/30 rounded">
                  AY-740
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
                CYBER-PHYSICAL FIRMWARE R&amp;D
              </div>
            </div>
          </button>
        </div>

        {/* Center Recruiter Domain Quick-Selector & Nav Matrix */}
        <div className="pointer-events-auto flex items-center gap-2 font-mono text-xs">
          {/* Recruiter Quick-Mode Domain Pill (Prominent on all screens) */}
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playTabLock();
                setDomainDropdownOpen(!domainDropdownOpen);
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)] text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="hidden md:inline text-slate-400">DOMAIN:</span>
              <span className="text-white font-mono">{domainLabels[selectedDomain] || 'ALL SYSTEMS'}</span>
              <ChevronDown className="w-3 h-3 text-cyan-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {domainDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 sm:left-auto sm:right-0 w-56 rounded-xl bg-[#030712]/98 border border-cyan-500/40 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 space-y-1 backdrop-blur-xl">
                {[
                  { id: 'all', label: 'All Systems', icon: Layers },
                  { id: 'ev', label: 'EV & Battery / HIL', icon: Flame },
                  { id: 'defense', label: 'Defense & EO/IR', icon: Crosshair },
                  { id: 'laser', label: 'Lasers & Mechatronics', icon: Zap },
                  { id: 'robotics', label: 'Robotics & Kinematics', icon: Target },
                ].map((item) => {
                  const Icon = item.icon;
                  const isCur = selectedDomain === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playRelayClick();
                        if (onSelectDomain) onSelectDomain(item.id);
                        setDomainDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-left transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'text-slate-300 hover:bg-cyan-950/60 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Full Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#040813]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-lg text-[11px]">
            <button
              onClick={() => scrollTo('machines')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
            >
              // 01. MACHINES
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('architecture-xray')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all cursor-pointer font-bold"
            >
              // 02. X-RAY
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('architecture')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
            >
              // 03. PCB_MATRIX
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('jd-analyzer')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all cursor-pointer font-bold"
            >
              // 04. JD_FIT
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('roi-bench')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
            >
              // 05. ROI_BENCH
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('timeline')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
            >
              // 06. R&amp;D_LOG
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('uart-terminal')}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-cyan-400" />
              // 07. UART_IO
            </button>
          </nav>
        </div>

        {/* Right Action Cluster: Technical Resume, Terminal, Audio & Clock */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Quick Technical Resume Modal Launcher */}
          {onOpenResume && (
            <button
              onClick={() => {
                soundEngine.playTabLock();
                onOpenResume();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs transition-colors cursor-pointer"
              title="Open Technical Resume (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-bold">RESUME</span>
            </button>
          )}

          {/* Quick Contact Modal Launcher */}
          {onOpenContact && (
            <button
              onClick={() => {
                soundEngine.playRelayClick();
                onOpenContact();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs transition-colors cursor-pointer"
              title="Direct Recruiter Contact"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-bold">CONTACT</span>
            </button>
          )}

          {/* Quick Terminal Trigger */}
          {onToggleTerminal && (
            <button
              onClick={() => {
                soundEngine.playTabLock();
                onToggleTerminal();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
              title="Open Interactive Terminal (Press `)"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">CLI</span>
            </button>
          )}

          {/* 4-CH Telemetry & PID Bench Trigger */}
          {onToggleTelemetry && (
            <button
              onClick={() => {
                soundEngine.playTabLock();
                onToggleTelemetry();
              }}
              onMouseEnter={() => soundEngine.playHoverBlip()}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-colors cursor-pointer ${
                isTelemetryOpen
                  ? 'bg-cyan-950/80 hover:bg-cyan-900/90 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle 4-Channel Logic Analyzer & PID Bench"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-bold">TELEM</span>
            </button>
          )}

          {/* Critical Thermal Alert Banner */}
          {isThermalRunaway && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-600 text-white font-mono text-[10px] font-bold animate-bounce shadow-[0_0_20px_#ef4444]">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>[🔥 CRITICAL RUNAWAY]</span>
            </div>
          )}

          {/* Live System Time */}
          <div className="hidden xl:flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">{timeStr}</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="AUDIO_TOGGLE"
            className={`flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded border transition-all cursor-pointer ${
              !audioEnabled
                ? 'bg-slate-900/70 border-slate-700 text-slate-500 hover:border-slate-500'
                : 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            }`}
            title="Toggle Web Audio Synthesizer"
          >
            {!audioEnabled ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="font-bold hidden sm:inline">
              {!audioEnabled ? 'MUTED' : 'AUDIO'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

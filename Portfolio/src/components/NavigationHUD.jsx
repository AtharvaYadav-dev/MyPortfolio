import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Terminal, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function NavigationHUD({ isThermalRunaway }) {
  const [audioEnabled, setAudioEnabled] = useState(soundEngine.isAudioEnabled());
  const [timeStr, setTimeStr] = useState('');

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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 select-none pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Callsign & Operating System Logo */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => scrollTo('hero')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="HOME"
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Cpu className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-display text-xs md:text-sm font-bold tracking-widest text-slate-100 group-hover:text-cyan-300 transition-colors">
                <span>ATHARVA YADAV</span>
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 bg-cyan-950/70 border border-cyan-500/30 rounded">
                  AY-740
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                INDUSTRIAL FIRMWARE &amp; CYBER-PHYSICAL
              </div>
            </div>
          </button>
        </div>

        {/* Center Navigation Matrix */}
        <nav className="pointer-events-auto hidden xl:flex items-center gap-1 font-mono text-xs bg-[#040813]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-lg">
          <button
            onClick={() => scrollTo('machines')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="MACHINES"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
          >
            // 01. MACHINES
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => scrollTo('architecture')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="PCB_MATRIX"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
          >
            // 02. PCB_MATRIX
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => scrollTo('builder-profile')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="BUILDER_PROFILE"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
          >
            // 03. PROFILE
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => scrollTo('roi-bench')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="ROI_BENCH"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
          >
            // 04. ROI_BENCH
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => scrollTo('timeline')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="R&D_LOG"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all cursor-pointer"
          >
            // 05. R&amp;D_LOG
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => scrollTo('uart-terminal')}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="UART_IO"
            className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all flex items-center gap-1 cursor-pointer"
          >
            <Terminal className="w-3 h-3 text-cyan-400" />
            // 06. UART_IO
          </button>
        </nav>

        {/* Right Telemetry Telemetry Bar & Audio Control */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Live System Time */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">{timeStr}</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={() => soundEngine.playHoverBlip()}
            data-target="AUDIO_TOGGLE"
            className={`flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded border transition-all cursor-pointer ${
              !audioEnabled
                ? 'bg-slate-900/70 border-slate-700 text-slate-500 hover:border-slate-500'
                : 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
            }`}
          >
            {!audioEnabled ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="font-bold">
              {!audioEnabled ? '[🔇 AUDIO_HUD: OFF]' : '[🔊 AUDIO_HUD: ON]'}
            </span>
            {audioEnabled && (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
                <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

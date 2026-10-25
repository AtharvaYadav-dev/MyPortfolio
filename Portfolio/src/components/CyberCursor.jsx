import React, { useEffect, useState, useRef } from 'react';
import { cyberAudio } from '../utils/audio';

export default function CyberCursor() {
  const [isLocked, setIsLocked] = useState(false);
  const [targetLabel, setTargetLabel] = useState('SYSTEM_IDLE');
  const [visible, setVisible] = useState(false);

  const innerDotRef = useRef(null);
  const outerRingRef = useRef(null);
  const badgeRef = useRef(null);
  const xTextRef = useRef(null);
  const yTextRef = useRef(null);
  const velTextRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const lagPos = useRef({ x: -100, y: -100 });
  const prevTime = useRef(0);
  const prevPos = useRef({ x: 0, y: 0 });
  const currentVel = useRef(0);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      if (!visible) setVisible(true);

      const now = Date.now();
      const dt = Math.max(1, now - prevTime.current);
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      currentVel.current = Math.min(9999, Math.round((dist / dt) * 1000));

      prevTime.current = now;
      prevPos.current = { x: e.clientX, y: e.clientY };
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Update inner dot immediately with 0ms lag
      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hover targets directly from event target (0 reflow, 0 layout cost!)
      const target = e.target;
      const interactiveEl = target?.closest('button, a, input, select, [data-target], .cursor-lock');

      if (interactiveEl) {
        if (!isLockedRef.current) {
          isLockedRef.current = true;
          setIsLocked(true);
          cyberAudio.playHoverTick();
        }
        const label = interactiveEl.getAttribute('data-target') || 'LOCK_TARGET';
        setTargetLabel(label);
      } else {
        if (isLockedRef.current) {
          isLockedRef.current = false;
          setIsLocked(false);
          setTargetLabel('SYSTEM_IDLE');
        }
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // High-performance direct RAF loop for outer ring and badge (Zero React state overhead!)
    let animId;
    const renderCursor = () => {
      // Smooth interpolation for outer reticle
      lagPos.current.x += (mousePos.current.x - lagPos.current.x) * 0.22;
      lagPos.current.y += (mousePos.current.y - lagPos.current.y) * 0.22;

      const lx = lagPos.current.x;
      const ly = lagPos.current.y;

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${lx + 24}px, ${ly + 12}px, 0)`;
      }

      // Update text nodes directly
      if (xTextRef.current) xTextRef.current.textContent = Math.round(mousePos.current.x);
      if (yTextRef.current) yTextRef.current.textContent = Math.round(mousePos.current.y);
      if (velTextRef.current) velTextRef.current.textContent = currentVel.current;

      animId = requestAnimationFrame(renderCursor);
    };

    animId = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Inner Laser Dot */}
      <div
        ref={innerDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: isLocked ? '8px' : '4px',
          height: isLocked ? '8px' : '4px',
          backgroundColor: isLocked ? '#ff9900' : '#00f0ff',
          boxShadow: isLocked
            ? '0 0 10px #ff9900, 0 0 20px #ff9900'
            : '0 0 8px #00f0ff, 0 0 14px #00f0ff',
        }}
      />

      {/* 2. Outer Lagging Reticle Ring */}
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: isLocked ? '48px' : '32px',
          height: isLocked ? '48px' : '32px',
          transition: 'width 0.15s ease-out, height 0.15s ease-out',
        }}
      >
        <div
          className={`h-full w-full rounded-full border transition-all duration-150 ${
            isLocked
              ? 'border-amber-400 bg-amber-500/10 scale-110'
              : 'border-cyan-400/60 bg-transparent'
          }`}
          style={{
            boxShadow: isLocked
              ? '0 0 15px rgba(255, 153, 0, 0.4), inset 0 0 8px rgba(255, 153, 0, 0.3)'
              : '0 0 10px rgba(0, 240, 255, 0.25)',
          }}
        />

        {/* Reticle Crosshair Ticks */}
        <div className={`absolute top-0 left-1/2 h-1.5 w-[1px] -translate-x-1/2 ${isLocked ? 'bg-amber-400' : 'bg-cyan-400/80'}`} />
        <div className={`absolute bottom-0 left-1/2 h-1.5 w-[1px] -translate-x-1/2 ${isLocked ? 'bg-amber-400' : 'bg-cyan-400/80'}`} />
        <div className={`absolute top-1/2 left-0 h-[1px] w-1.5 -translate-y-1/2 ${isLocked ? 'bg-amber-400' : 'bg-cyan-400/80'}`} />
        <div className={`absolute top-1/2 right-0 h-[1px] w-1.5 -translate-y-1/2 ${isLocked ? 'bg-amber-400' : 'bg-cyan-400/80'}`} />

        {/* Target Lock Corners if Locked */}
        {isLocked && (
          <>
            <span className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-amber-400 animate-pulse" />
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t-2 border-r-2 border-amber-400 animate-pulse" />
            <span className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b-2 border-l-2 border-amber-400 animate-pulse" />
            <span className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-amber-400 animate-pulse" />
          </>
        )}
      </div>

      {/* 3. Live Telemetry Coordinates & Speed Readout Badge */}
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 select-none will-change-transform"
      >
        <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-300 shadow-lg">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
          <span>
            X:<span ref={xTextRef} className="text-white">0</span> Y:<span ref={yTextRef} className="text-white">0</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            VEL:<span ref={velTextRef} className="text-cyan-300">0</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className={isLocked ? 'text-amber-400 font-bold' : 'text-slate-400'}>
            [{targetLabel}]
          </span>
        </div>
      </div>
    </div>
  );
}

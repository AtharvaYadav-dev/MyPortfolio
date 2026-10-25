import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CyberCursor from './components/CyberCursor';
import BootSequence from './components/BootSequence';
import NavigationHUD from './components/NavigationHUD';
import InteractiveLaserCanvas from './components/InteractiveLaserCanvas';
import TelemetryHUDWidget from './components/TelemetryHUDWidget';
import HeroSection from './components/HeroSection';
import MachinesBay from './components/MachinesBay';
import PCBArchitectureMatrix from './components/PCBArchitectureMatrix';
import CareerTelemetryTimeline from './components/CareerTelemetryTimeline';
import UARTTerminalCTA from './components/UARTTerminalCTA';
import FooterHUD from './components/FooterHUD';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isThermalRunaway, setIsThermalRunaway] = useState(false);

  // Initialize Lenis Smooth Inertia Scrolling synced with GSAP Ticker
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      autoRaf: false, // Prevents duplicate RAF calls when syncing with gsap.ticker
    });

    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Refresh ScrollTrigger calculations after blast doors reveal
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className={`relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden ${isThermalRunaway ? 'selection:bg-red-500 selection:text-white' : 'selection:bg-cyan-500 selection:text-black'}`}>
      {/* Custom Cybernetic Dual-Layer Reticle Cursor */}
      <CyberCursor />

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-30 opacity-40" />

      {/* Interactive 3D Wireframe CNC & Galvo Laser Background Canvas */}
      <InteractiveLaserCanvas isThermalRunaway={isThermalRunaway} />

      {/* Phase 0: High-Speed BIOS Boot-Up Preloader */}
      {!bootComplete && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Mission Control Top HUD */}
      <NavigationHUD isThermalRunaway={isThermalRunaway} />

      {/* Floating Interactive Draggable Oscilloscope & PID Telemetry Pod */}
      <TelemetryHUDWidget
        isThermalRunaway={isThermalRunaway}
        setIsThermalRunaway={setIsThermalRunaway}
      />

      {/* Main Narrative Flow */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* GSAP Pinned Scroll-Storytelling: The 3 Flagship Machines */}
        <MachinesBay />

        {/* Interactive PCB Trace Architecture Matrix */}
        <PCBArchitectureMatrix />

        {/* R&D Career Telemetry Timeline */}
        <CareerTelemetryTimeline />

        {/* Finale: Interactive UART Serial Terminal & Magnetic CTA */}
        <UARTTerminalCTA />
      </main>

      {/* High-Tech Footer */}
      <FooterHUD />
    </div>
  );
}

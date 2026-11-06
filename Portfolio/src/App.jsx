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
import RecruiterQuickMode from './components/RecruiterQuickMode';
import MachinesBay from './components/MachinesBay';
import PCBArchitectureMatrix from './components/PCBArchitectureMatrix';
import EngineerProfileBento from './components/EngineerProfileBento';
import HireAtharvaROIWidget from './components/HireAtharvaROIWidget';
import CareerTelemetryTimeline from './components/CareerTelemetryTimeline';
import UARTTerminalCTA from './components/UARTTerminalCTA';
import FooterHUD from './components/FooterHUD';
import CollapsibleTerminalDrawer from './components/CollapsibleTerminalDrawer';
import TechnicalResumeModal from './components/TechnicalResumeModal';
import QuickContactModal from './components/QuickContactModal';
import { smoothScrollTo } from './utils/scrollHelper';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isThermalRunaway, setIsThermalRunaway] = useState(false);

  // Recruiter Domain Quick-Mode State ('all' | 'ev' | 'defense' | 'laser' | 'robotics')
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Recruiter Modals & Terminal States
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(true);

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

  const handleSelectDomain = (domainId) => {
    setSelectedDomain(domainId);
    // Smoothly scroll down to the machines section if selected from header
    smoothScrollTo('machines');
  };

  return (
    <div
      className={`relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden ${
        isThermalRunaway
          ? 'selection:bg-red-500 selection:text-white'
          : 'selection:bg-cyan-500 selection:text-black'
      }`}
    >
      {/* Custom Cybernetic Dual-Layer Reticle Cursor */}
      <CyberCursor />

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-30 opacity-30" />
      {/* Subtle CRT / Oscilloscope Scanline & Noise Texture Overlay */}
      <div className="crt-oscilloscope-overlay" />

      {/* Interactive 3D Wireframe CNC & Galvo Laser Background Canvas */}
      <InteractiveLaserCanvas isThermalRunaway={isThermalRunaway} />

      {/* Phase 0: High-Speed BIOS Boot-Up Preloader */}
      {!bootComplete && <BootSequence onComplete={handleBootComplete} />}

      {/* Mission Control Top HUD */}
      <NavigationHUD
        isThermalRunaway={isThermalRunaway}
        selectedDomain={selectedDomain}
        onSelectDomain={handleSelectDomain}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        isTelemetryOpen={isTelemetryOpen}
        onToggleTelemetry={() => setIsTelemetryOpen(!isTelemetryOpen)}
      />

      {/* Floating Interactive Draggable Oscilloscope & PID Telemetry Pod */}
      <TelemetryHUDWidget
        isThermalRunaway={isThermalRunaway}
        setIsThermalRunaway={setIsThermalRunaway}
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />

      {/* Main Narrative Flow */}
      <main className="relative z-10">
        {/* 01. Hero Section (With Live 100Hz PID & 16-Ch Circular DMA Canvas) */}
        <HeroSection
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
          onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
          onSelectDomain={handleSelectDomain}
        />

        {/* Recruiter Domain Filter & Executive Briefing Strip */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
          <RecruiterQuickMode
            selectedDomain={selectedDomain}
            onSelectDomain={handleSelectDomain}
            onOpenResume={() => setIsResumeModalOpen(true)}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        </section>

        {/* 02. GSAP Pinned Scroll-Storytelling: The 8 Flagship R&D Machines */}
        <MachinesBay
          selectedDomain={selectedDomain}
          onSelectDomain={handleSelectDomain}
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
        />

        {/* 03. Interactive PCB Trace Architecture Matrix */}
        <PCBArchitectureMatrix />

        {/* 03.5. "The Complete Builder" Cross-Domain Bento Grid */}
        <EngineerProfileBento />

        {/* 04. "Why Hire Atharva" 3-in-1 Role Consolidation & ROI Bench */}
        <HireAtharvaROIWidget />

        {/* 05. R&D Career Telemetry Timeline */}
        <CareerTelemetryTimeline />

        {/* 06. Finale: Interactive UART Serial Terminal & Magnetic CTA */}
        <UARTTerminalCTA
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
          onSelectDomain={handleSelectDomain}
        />
      </main>

      {/* Collapsible Embedded Developer Terminal & Simulator (Docked Floating Console) */}
      <CollapsibleTerminalDrawer
        isOpen={isTerminalOpen}
        onToggle={() => setIsTerminalOpen(!isTerminalOpen)}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onSelectDomain={handleSelectDomain}
      />

      {/* Engineering Technical Resume Dossier Modal */}
      <TechnicalResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Fast Direct Recruiter Contact & Apply Modal */}
      <QuickContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* High-Tech Footer */}
      <FooterHUD />
    </div>
  );
}

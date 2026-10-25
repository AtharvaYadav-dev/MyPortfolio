// Web Audio API Synthesizer (Zero External Dependencies)
// High-tech procedural sound generator for bare-metal cybernetic UI

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.hasUserInteracted = false;

    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.hasUserInteracted = true;
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        } else if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    }
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.hasUserInteracted) return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleAudio(forceState) {
    if (forceState !== undefined) {
      this.isMuted = !forceState;
    } else {
      this.isMuted = !this.isMuted;
    }
    return !this.isMuted; // returns audioEnabled boolean
  }

  isAudioEnabled() {
    return !this.isMuted;
  }

  // 1. Crisp 2ms micro-click (1200Hz sine/triangle blip) on hovering buttons, PCB chips, links
  playHoverBlip() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.002);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.003);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.0035);
    } catch {}
  }

  // 2. Futuristic mechanical lock sound when switching machine tabs
  playTabLock() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Metallic click high-tone
      const oscHigh = this.ctx.createOscillator();
      const gainHigh = this.ctx.createGain();
      oscHigh.type = 'square';
      oscHigh.frequency.setValueAtTime(1800, now);
      oscHigh.frequency.exponentialRampToValueAtTime(450, now + 0.04);
      gainHigh.gain.setValueAtTime(0.06, now);
      gainHigh.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      oscHigh.connect(gainHigh);
      gainHigh.connect(this.ctx.destination);
      oscHigh.start(now);
      oscHigh.stop(now + 0.04);

      // Low mechanical latch thump
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(160, now + 0.015);
      oscLow.frequency.exponentialRampToValueAtTime(55, now + 0.08);
      gainLow.gain.setValueAtTime(0.12, now + 0.015);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      oscLow.connect(gainLow);
      gainLow.connect(this.ctx.destination);
      oscLow.start(now + 0.015);
      oscLow.stop(now + 0.085);
    } catch {}
  }

  // 3. Low-frequency warning pulse when user clicks [⚡ INJECT THERMAL RUNAWAY]
  playWarningPulse() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Deep sub-bass pulse
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(80, now);
      subOsc.frequency.linearRampToValueAtTime(52, now + 0.35);

      // Filter sub-pulse to keep it thunderous & industrial
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.35);

      subGain.gain.setValueAtTime(0.28, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      subOsc.connect(filter);
      filter.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.36);

      // Secondary harsh alarm overtone
      const sirenOsc = this.ctx.createOscillator();
      const sirenGain = this.ctx.createGain();
      sirenOsc.type = 'sawtooth';
      sirenOsc.frequency.setValueAtTime(880, now + 0.04);
      sirenOsc.frequency.linearRampToValueAtTime(1320, now + 0.22);
      sirenGain.gain.setValueAtTime(0.09, now + 0.04);
      sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      sirenOsc.connect(sirenGain);
      sirenGain.connect(this.ctx.destination);
      sirenOsc.start(now + 0.04);
      sirenOsc.stop(now + 0.26);
    } catch {}
  }

  // 4. Laser Galvo chirp sound
  playLaserChirp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(3400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // 5. Heavy relay click
  playRelayClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;

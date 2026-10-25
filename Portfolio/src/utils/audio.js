// Cybernetic Audio Engine - Synthesizer facade bridging soundEngine.js
import { soundEngine } from './soundEngine';

class CyberAudioBridge {
  constructor() {
    this.engine = soundEngine;
  }

  init() {
    this.engine.init();
  }

  toggleMute() {
    const isAudioOn = this.engine.toggleAudio();
    return !isAudioOn; // returns isMuted
  }

  get isMuted() {
    return this.engine.isMuted;
  }

  playHoverTick() {
    this.engine.playHoverBlip();
  }

  playRelayClick() {
    this.engine.playRelayClick();
  }

  playLaserChirp() {
    this.engine.playLaserChirp();
  }

  playLockTarget() {
    this.engine.playTabLock();
  }

  playAlarm() {
    this.engine.playWarningPulse();
  }

  playBootBeep(freq = 1200, duration = 0.05) {
    if (this.engine.isMuted) return;
    try {
      this.engine.init();
      if (!this.engine.ctx) return;
      const osc = this.engine.ctx.createOscillator();
      const gain = this.engine.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.engine.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.engine.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.engine.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.engine.ctx.destination);
      osc.start();
      osc.stop(this.engine.ctx.currentTime + duration);
    } catch {}
  }
}

export const cyberAudio = new CyberAudioBridge();
export { soundEngine };

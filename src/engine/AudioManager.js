export class AudioManager {
  constructor() {
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.muted = false;
    this.audioContext = null;
    this.currentMusic = null;
  }

  ensureContext() {
    if (this.audioContext) return this.audioContext;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    this.audioContext = new AudioCtx();
    return this.audioContext;
  }

  setVolumes({ musicVolume, sfxVolume, muted }) {
    if (typeof musicVolume === 'number') this.musicVolume = musicVolume;
    if (typeof sfxVolume === 'number') this.sfxVolume = sfxVolume;
    if (typeof muted === 'boolean') this.muted = muted;
  }

  playTone(frequency = 440, duration = 0.12, type = 'sine', volume = this.sfxVolume) {
    if (this.muted) return;
    const context = this.ensureContext();
    if (!context) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.frequency.value = frequency;
    osc.type = type;
    gain.gain.value = volume * 0.08;
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    osc.stop(context.currentTime + duration);
  }

  playSfx(name) {
    const tones = {
      jump: [520, 0.08, 'triangle'],
      hurt: [180, 0.18, 'sawtooth'],
      coin: [780, 0.09, 'square'],
      checkpoint: [620, 0.16, 'triangle'],
      shoot: [300, 0.06, 'square'],
      explosion: [120, 0.25, 'sawtooth'],
      victory: [880, 0.22, 'triangle']
    };
    if (tones[name]) {
      this.playTone(...tones[name]);
    }
  }

  playMusic(track = 'calm') {
    if (this.muted) return;
    if (this.currentMusic === track) return;
    this.currentMusic = track;
    this.playTone(track === 'fort' ? 220 : 330, 0.4, 'sine', this.musicVolume);
  }

  stopMusic() {
    this.currentMusic = null;
  }
}

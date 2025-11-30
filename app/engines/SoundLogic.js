// --- RETRO AUDIO SYNTHESIZER ---
// Generates 8-bit sound effects using the Web Audio API (No files needed!)

let audioCtx = null;

const initAudio = () => {
    if (!audioCtx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    // Resume context if suspended (browser policy)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (freq, type, duration, vol = 0.1) => {
    if (!audioCtx) initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

// --- SFX PRESETS ---

export const sfxButton = () => {
    // High-pitched blip for UI interactions
    playTone(1200, 'sine', 0.1, 0.05);
};

export const sfxAttack = () => {
    // Laser pew-pew
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
};

export const sfxDamage = () => {
    // Low crunch/noise for taking damage
    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
};

export const sfxWin = () => {
    // Happy Arpeggio
    setTimeout(() => playTone(523.25, 'square', 0.2), 0);   // C
    setTimeout(() => playTone(659.25, 'square', 0.2), 150); // E
    setTimeout(() => playTone(783.99, 'square', 0.4), 300); // G
};

export const sfxCrit = () => {
    // Heavy impact sound
    playTone(150, 'square', 0.1, 0.2);
    setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.2), 50);
};

export const sfxBuy = () => {
    // Cash register ching
    playTone(1200, 'triangle', 0.1);
    setTimeout(() => playTone(2000, 'triangle', 0.3), 100);
};
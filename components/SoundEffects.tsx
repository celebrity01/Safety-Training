import { useEffect } from "react";

// Web Audio API sound generator
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Only create AudioContext when needed due to browser autoplay policies
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported");
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.1,
  ) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playSuccess() {
    // Pleasant ascending chime
    await this.playTone(523.25, 0.15, "sine", 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.15, "sine", 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.25, "sine", 0.1), 200); // G5
  }

  async playError() {
    // Gentle descending tone
    await this.playTone(400, 0.2, "sine", 0.08);
    setTimeout(() => this.playTone(300, 0.3, "sine", 0.08), 150);
  }

  async playAchievement() {
    // Celebratory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C-E-G-C octave
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playTone(notes[i], 0.2, "triangle", 0.08), i * 100);
    }
  }

  async playNotification() {
    // Subtle notification sound
    await this.playTone(800, 0.1, "sine", 0.05);
    setTimeout(() => this.playTone(1000, 0.1, "sine", 0.05), 80);
  }

  async playButtonClick() {
    // Quick click sound
    await this.playTone(1200, 0.05, "square", 0.03);
  }

  async playLevelUp() {
    // Major chord progression
    const chord1 = [523.25, 659.25, 783.99]; // C major
    const chord2 = [587.33, 739.99, 880.0]; // D major

    chord1.forEach((freq) => this.playTone(freq, 0.4, "triangle", 0.06));
    setTimeout(() => {
      chord2.forEach((freq) => this.playTone(freq, 0.6, "triangle", 0.08));
    }, 300);
  }
}

// Global sound instance
const soundGenerator = new SoundGenerator();

// Sound preferences from localStorage
const getSoundPreference = (): boolean => {
  const saved = localStorage.getItem("safety_training_sound_enabled");
  return saved !== null ? JSON.parse(saved) : true; // Default to enabled
};

const setSoundPreference = (enabled: boolean) => {
  localStorage.setItem(
    "safety_training_sound_enabled",
    JSON.stringify(enabled),
  );
};

// Hook for using sound effects
export const useSoundEffects = () => {
  const soundEnabled = getSoundPreference();

  const playSound = async (
    type:
      | "success"
      | "error"
      | "achievement"
      | "notification"
      | "click"
      | "levelup",
  ) => {
    if (!soundEnabled) return;

    try {
      switch (type) {
        case "success":
          await soundGenerator.playSuccess();
          break;
        case "error":
          await soundGenerator.playError();
          break;
        case "achievement":
          await soundGenerator.playAchievement();
          break;
        case "notification":
          await soundGenerator.playNotification();
          break;
        case "click":
          await soundGenerator.playButtonClick();
          break;
        case "levelup":
          await soundGenerator.playLevelUp();
          break;
      }
    } catch (error) {
      // Silently handle audio errors
      console.debug("Sound effect failed:", error);
    }
  };

  return {
    playSound,
    soundEnabled,
    setSoundEnabled: setSoundPreference,
  };
};

// Sound toggle component
export const SoundToggle: React.FC = () => {
  const { soundEnabled, setSoundEnabled, playSound } = useSoundEffects();

  const handleToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      playSound("notification"); // Test sound when enabling
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-all duration-200 ${
        soundEnabled
          ? "bg-brand text-white hover:bg-brand-dark"
          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }`}
      title={`Sound effects ${soundEnabled ? "enabled" : "disabled"}`}
      aria-label={`Toggle sound effects. Currently ${soundEnabled ? "on" : "off"}`}
    >
      {soundEnabled ? (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M6 10H4a1 1 0 00-1 1v2a1 1 0 001 1h2l3.5 3.5V6.5L6 10z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </button>
  );
};

// Auto-play sounds based on app events
export const SoundEffectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    // Listen for achievement events
    const handleAchievement = () => playSound("achievement");
    const handleLevelUp = () => playSound("levelup");
    const handleSuccess = () => playSound("success");
    const handleError = () => playSound("error");

    // Custom events for sound triggers
    window.addEventListener("achievement-unlocked", handleAchievement);
    window.addEventListener("level-up", handleLevelUp);
    window.addEventListener("training-success", handleSuccess);
    window.addEventListener("training-error", handleError);

    return () => {
      window.removeEventListener("achievement-unlocked", handleAchievement);
      window.removeEventListener("level-up", handleLevelUp);
      window.removeEventListener("training-success", handleSuccess);
      window.removeEventListener("training-error", handleError);
    };
  }, [playSound]);

  return <>{children}</>;
};

// Helper functions to trigger sound events
export const triggerSoundEvent = (type: string) => {
  const event = new CustomEvent(type);
  window.dispatchEvent(event);
};

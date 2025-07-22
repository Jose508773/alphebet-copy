// SpeechUtils.ts - Comprehensive speech and audio functionality for the Alphabet Learning App

import { Platform } from 'react-native';

// Speech synthesis interface for cross-platform compatibility
interface SpeechSynthesis {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getVoices: () => Promise<SpeechVoice[]>;
  isSupported: () => boolean;
}

interface SpeechOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: string;
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

interface SpeechVoice {
  name: string;
  lang: string;
  default?: boolean;
}

// Letter pronunciation data
interface LetterData {
  letter: string;
  phonetic: string;
  example: string;
  exampleWord: string;
  description: string;
  emoji: string;
}

// Comprehensive letter data with pronunciation
export const LETTER_DATA: { [key: string]: LetterData } = {
  'A': {
    letter: 'A',
    phonetic: 'ay',
    example: 'Apple',
    exampleWord: 'Apple',
    description: 'A as in Apple',
    emoji: '🍎'
  },
  'B': {
    letter: 'B',
    phonetic: 'bee',
    example: 'Ball',
    exampleWord: 'Ball',
    description: 'B as in Ball',
    emoji: '⚽'
  },
  'C': {
    letter: 'C',
    phonetic: 'see',
    example: 'Cat',
    exampleWord: 'Cat',
    description: 'C as in Cat',
    emoji: '🐱'
  },
  'D': {
    letter: 'D',
    phonetic: 'dee',
    example: 'Dog',
    exampleWord: 'Dog',
    description: 'D as in Dog',
    emoji: '🐕'
  },
  'E': {
    letter: 'E',
    phonetic: 'ee',
    example: 'Elephant',
    exampleWord: 'Elephant',
    description: 'E as in Elephant',
    emoji: '🐘'
  },
  'F': {
    letter: 'F',
    phonetic: 'eff',
    example: 'Fish',
    exampleWord: 'Fish',
    description: 'F as in Fish',
    emoji: '🐟'
  },
  'G': {
    letter: 'G',
    phonetic: 'jee',
    example: 'Giraffe',
    exampleWord: 'Giraffe',
    description: 'G as in Giraffe',
    emoji: '🦒'
  },
  'H': {
    letter: 'H',
    phonetic: 'aych',
    example: 'Hat',
    exampleWord: 'Hat',
    description: 'H as in Hat',
    emoji: '🎩'
  },
  'I': {
    letter: 'I',
    phonetic: 'eye',
    example: 'Ice Cream',
    exampleWord: 'Ice Cream',
    description: 'I as in Ice Cream',
    emoji: '🍦'
  },
  'J': {
    letter: 'J',
    phonetic: 'jay',
    example: 'Juice',
    exampleWord: 'Juice',
    description: 'J as in Juice',
    emoji: '🧃'
  },
  'K': {
    letter: 'K',
    phonetic: 'kay',
    example: 'Kite',
    exampleWord: 'Kite',
    description: 'K as in Kite',
    emoji: '🪁'
  },
  'L': {
    letter: 'L',
    phonetic: 'ell',
    example: 'Lion',
    exampleWord: 'Lion',
    description: 'L as in Lion',
    emoji: '🦁'
  },
  'M': {
    letter: 'M',
    phonetic: 'em',
    example: 'Monkey',
    exampleWord: 'Monkey',
    description: 'M as in Monkey',
    emoji: '🐒'
  },
  'N': {
    letter: 'N',
    phonetic: 'en',
    example: 'Nest',
    exampleWord: 'Nest',
    description: 'N as in Nest',
    emoji: '🪺'
  },
  'O': {
    letter: 'O',
    phonetic: 'oh',
    example: 'Octopus',
    exampleWord: 'Octopus',
    description: 'O as in Octopus',
    emoji: '🐙'
  },
  'P': {
    letter: 'P',
    phonetic: 'pee',
    example: 'Penguin',
    exampleWord: 'Penguin',
    description: 'P as in Penguin',
    emoji: '🐧'
  },
  'Q': {
    letter: 'Q',
    phonetic: 'cue',
    example: 'Queen',
    exampleWord: 'Queen',
    description: 'Q as in Queen',
    emoji: '👑'
  },
  'R': {
    letter: 'R',
    phonetic: 'ar',
    example: 'Rainbow',
    exampleWord: 'Rainbow',
    description: 'R as in Rainbow',
    emoji: '🌈'
  },
  'S': {
    letter: 'S',
    phonetic: 'ess',
    example: 'Sun',
    exampleWord: 'Sun',
    description: 'S as in Sun',
    emoji: '☀️'
  },
  'T': {
    letter: 'T',
    phonetic: 'tee',
    example: 'Tiger',
    exampleWord: 'Tiger',
    description: 'T as in Tiger',
    emoji: '🐯'
  },
  'U': {
    letter: 'U',
    phonetic: 'you',
    example: 'Umbrella',
    exampleWord: 'Umbrella',
    description: 'U as in Umbrella',
    emoji: '☂️'
  },
  'V': {
    letter: 'V',
    phonetic: 'vee',
    example: 'Violin',
    exampleWord: 'Violin',
    description: 'V as in Violin',
    emoji: '🎻'
  },
  'W': {
    letter: 'W',
    phonetic: 'double-you',
    example: 'Whale',
    exampleWord: 'Whale',
    description: 'W as in Whale',
    emoji: '🐋'
  },
  'X': {
    letter: 'X',
    phonetic: 'ex',
    example: 'Xylophone',
    exampleWord: 'Xylophone',
    description: 'X as in Xylophone',
    emoji: '🎵'
  },
  'Y': {
    letter: 'Y',
    phonetic: 'why',
    example: 'Yarn',
    exampleWord: 'Yarn',
    description: 'Y as in Yarn',
    emoji: '🧶'
  },
  'Z': {
    letter: 'Z',
    phonetic: 'zee',
    example: 'Zebra',
    exampleWord: 'Zebra',
    description: 'Z as in Zebra',
    emoji: '🦓'
  }
};

// Web Speech API implementation
class WebSpeechSynthesis implements SpeechSynthesis {
  private synthesis: any; // Use any to avoid type conflicts with browser API
  private utterance: any | null = null;

  constructor() {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.synthesis = (window as any).speechSynthesis;
    }
  }

  speak(text: string, options: SpeechOptions = {}): void {
    // Check if we're in a browser environment and speech synthesis is available
    if (typeof window === 'undefined' || !this.synthesis) {
      console.log('Speech synthesis not available');
      return;
    }

    // Stop any current speech
    this.stop();

    this.utterance = new (window as any).SpeechSynthesisUtterance(text);
    
    // Set properties
    this.utterance.rate = options.rate || 0.8;
    this.utterance.pitch = options.pitch || 1.0;
    this.utterance.volume = options.volume || 1.0;
    
    if (options.language) {
      this.utterance.lang = options.language;
    }

    // Set event handlers
    if (options.onStart) {
      this.utterance.onstart = options.onStart;
    }
    if (options.onEnd) {
      this.utterance.onend = options.onEnd;
    }
    if (options.onError) {
      this.utterance.onerror = options.onError;
    }

    this.synthesis.speak(this.utterance);
  }

  stop(): void {
    if (typeof window !== 'undefined' && this.synthesis) {
      this.synthesis.cancel();
    }
    this.utterance = null;
  }

  pause(): void {
    if (typeof window !== 'undefined' && this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (typeof window !== 'undefined' && this.synthesis) {
      this.synthesis.resume();
    }
  }

  async getVoices(): Promise<SpeechVoice[]> {
    if (typeof window === 'undefined' || !this.synthesis) {
      return [];
    }

    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices && voices.length > 0) {
        resolve(voices.map((voice: any) => ({
          name: voice.name,
          lang: voice.lang,
          default: voice.default
        })));
      } else {
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices();
          resolve(voices.map((voice: any) => ({
            name: voice.name,
            lang: voice.lang,
            default: voice.default
          })));
        };
      }
    });
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

// React Native implementation (placeholder for mobile)
class ReactNativeSpeechSynthesis implements SpeechSynthesis {
  speak(text: string, options: SpeechOptions = {}): void {
    // For React Native, you would integrate with expo-av or react-native-tts
    console.log('Speech not implemented for React Native yet');
    if (options.onError) {
      options.onError(new Error('Speech not implemented for React Native'));
    }
  }

  stop(): void {
    console.log('Stop speech');
  }

  pause(): void {
    console.log('Pause speech');
  }

  resume(): void {
    console.log('Resume speech');
  }

  async getVoices(): Promise<SpeechVoice[]> {
    return [];
  }

  isSupported(): boolean {
    return false;
  }
}

// Create speech synthesis instance based on platform
export const speechSynthesis: SpeechSynthesis = (typeof window !== 'undefined' && Platform.OS === 'web') 
  ? new WebSpeechSynthesis() 
  : new ReactNativeSpeechSynthesis();

// Speech utility functions
export class SpeechUtils {
  private static instance: SpeechUtils;
  private currentVolume: number = 1.0;
  private isEnabled: boolean = true;

  static getInstance(): SpeechUtils {
    if (!SpeechUtils.instance) {
      SpeechUtils.instance = new SpeechUtils();
    }
    return SpeechUtils.instance;
  }

  // Set volume for all speech
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
  }

  // Enable/disable speech
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Speak a letter with pronunciation
  speakLetter(letter: string): void {
    if (!this.isEnabled) return;

    const letterData = LETTER_DATA[letter.toUpperCase()];
    if (!letterData) return;

    const text = `${letterData.letter}... as in ${letterData.exampleWord}!`;
    
    speechSynthesis.speak(text, {
      rate: 0.6,
      pitch: 1.2,
      volume: this.currentVolume,
      language: 'en-US',
      onStart: () => console.log(`Started speaking letter ${letter}`),
      onEnd: () => console.log(`Finished speaking letter ${letter}`),
      onError: (error) => console.error(`Speech error for letter ${letter}:`, error)
    });
  }

  // Speak letter name only
  speakLetterName(letter: string): void {
    if (!this.isEnabled) return;

    const letterData = LETTER_DATA[letter.toUpperCase()];
    if (!letterData) return;

    speechSynthesis.speak(letterData.letter, {
      rate: 0.7,
      pitch: 1.1,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak letter phonetic sound
  speakLetterPhonetic(letter: string): void {
    if (!this.isEnabled) return;

    const letterData = LETTER_DATA[letter.toUpperCase()];
    if (!letterData) return;

    speechSynthesis.speak(letterData.phonetic, {
      rate: 0.5,
      pitch: 1.3,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak example word
  speakExampleWord(letter: string): void {
    if (!this.isEnabled) return;

    const letterData = LETTER_DATA[letter.toUpperCase()];
    if (!letterData) return;

    speechSynthesis.speak(letterData.exampleWord, {
      rate: 0.6,
      pitch: 1.0,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak full description
  speakDescription(letter: string): void {
    if (!this.isEnabled) return;

    const letterData = LETTER_DATA[letter.toUpperCase()];
    if (!letterData) return;

    speechSynthesis.speak(letterData.description, {
      rate: 0.6,
      pitch: 1.1,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak alphabet song
  speakAlphabetSong(): void {
    if (!this.isEnabled) return;

    const alphabet = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
    speechSynthesis.speak(alphabet, {
      rate: 0.5,
      pitch: 1.2,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak success message
  speakSuccess(): void {
    if (!this.isEnabled) return;

    const successMessages = [
      'Great job!',
      'Excellent!',
      'Well done!',
      'Fantastic!',
      'Amazing!',
      'Perfect!',
      'Wonderful!',
      'Brilliant!'
    ];

    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
    speechSynthesis.speak(randomMessage, {
      rate: 0.7,
      pitch: 1.3,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak encouragement
  speakEncouragement(): void {
    if (!this.isEnabled) return;

    const encouragementMessages = [
      'You can do it!',
      'Keep trying!',
      'Almost there!',
      'You\'re doing great!',
      'Don\'t give up!',
      'You\'re learning!',
      'Keep going!',
      'You\'ve got this!'
    ];

    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    speechSynthesis.speak(randomMessage, {
      rate: 0.6,
      pitch: 1.1,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak practice mode instructions
  speakPracticeInstructions(): void {
    if (!this.isEnabled) return;

    speechSynthesis.speak('Let\'s practice the alphabet! Tap each letter to hear its sound.', {
      rate: 0.6,
      pitch: 1.0,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Speak story mode introduction
  speakStoryIntroduction(): void {
    if (!this.isEnabled) return;

    speechSynthesis.speak('Welcome to the alphabet story! Let\'s sing the alphabet together.', {
      rate: 0.6,
      pitch: 1.1,
      volume: this.currentVolume,
      language: 'en-US'
    });
  }

  // Stop all speech
  stop(): void {
    speechSynthesis.stop();
  }

  // Pause speech
  pause(): void {
    speechSynthesis.pause();
  }

  // Resume speech
  resume(): void {
    speechSynthesis.resume();
  }

  // Get available voices
  async getVoices(): Promise<SpeechVoice[]> {
    return await speechSynthesis.getVoices();
  }

  // Check if speech is supported
  isSupported(): boolean {
    return speechSynthesis.isSupported();
  }

  // Get letter data
  getLetterData(letter: string): LetterData | null {
    return LETTER_DATA[letter.toUpperCase()] || null;
  }

  // Get all letter data
  getAllLetterData(): { [key: string]: LetterData } {
    return LETTER_DATA;
  }
}

// Export singleton instance
export const speechUtils = SpeechUtils.getInstance();

// Export types for use in other files
export type { SpeechOptions, SpeechVoice, LetterData }; 
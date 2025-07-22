import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';
import { useAccessibility } from '../constants/AccessibilityContext';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const EXAMPLES: Record<string, { word: string }> = {
  A: { word: 'Apple' },
  B: { word: 'Ball' },
  C: { word: 'Cat' },
  D: { word: 'Dog' },
  E: { word: 'Elephant' },
  F: { word: 'Fish' },
  G: { word: 'Giraffe' },
  H: { word: 'Hat' },
  I: { word: 'Ice' },
  J: { word: 'Juice' },
  K: { word: 'Kite' },
  L: { word: 'Lion' },
  M: { word: 'Monkey' },
  N: { word: 'Nest' },
  O: { word: 'Octopus' },
  P: { word: 'Penguin' },
  Q: { word: 'Queen' },
  R: { word: 'Rainbow' },
  S: { word: 'Sun' },
  T: { word: 'Tiger' },
  U: { word: 'Umbrella' },
  V: { word: 'Violin' },
  W: { word: 'Whale' },
  X: { word: 'Xylophone' },
  Y: { word: 'Yarn' },
  Z: { word: 'Zebra' },
};

// Add Web Speech API TTS for web
function speakLetter(letter: string, word: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(`${letter} as in ${word}`);
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('google') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  }
}

export const StorySongMode: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [caption, setCaption] = useState('');
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { captions, highContrast } = useAccessibility();

  const animateLetter = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const advance = (nextIdx: number) => {
    setCurrentIndex(nextIdx);
    animateLetter();
    setCaption(`${LETTERS[nextIdx]}... as in ${EXAMPLES[LETTERS[nextIdx]].word}!`);
    if (isPlaying && nextIdx < LETTERS.length - 1) {
      timeoutRef.current = setTimeout(() => advance(nextIdx + 1), 1800);
    }
  };

  // Call TTS when letter changes or replay/play is pressed
  React.useEffect(() => {
    if (isPlaying) {
      animateLetter();
      setCaption(`${LETTERS[currentIndex]}... as in ${EXAMPLES[LETTERS[currentIndex]].word}!`);
      speakLetter(LETTERS[currentIndex], EXAMPLES[LETTERS[currentIndex]].word);
      if (currentIndex < LETTERS.length - 1) {
        timeoutRef.current = setTimeout(() => advance(currentIndex + 1), 1800);
      }
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIndex]);

  const handlePause = () => {
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  const handlePlay = () => {
    setIsPlaying(true);
    advance(currentIndex);
    speakLetter(LETTERS[currentIndex], EXAMPLES[LETTERS[currentIndex]].word);
  };
  const handleReplay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
    advance(0);
    speakLetter(LETTERS[0], EXAMPLES[LETTERS[0]].word);
  };

  return (
    <View style={[styles.container, highContrast && styles.highContrastBg]}>
      <View style={styles.navRow}>
        <Pressable style={styles.homeButton} onPress={onHome} accessibilityLabel="Home">
          <Text style={styles.homeIcon}>🏠</Text>
        </Pressable>
        {isPlaying ? (
          <Pressable style={styles.controlButton} onPress={handlePause} accessibilityLabel="Pause">
            <Text style={styles.controlIcon}>⏸️</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.controlButton} onPress={handlePlay} accessibilityLabel="Play">
            <Text style={styles.controlIcon}>▶️</Text>
          </Pressable>
        )}
        <Pressable style={styles.controlButton} onPress={handleReplay} accessibilityLabel="Replay">
          <Text style={styles.controlIcon}>🔁</Text>
        </Pressable>
      </View>
      <Animated.Text
        style={[
          styles.letter,
          {
            transform: [
              {
                scale: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      >
        {LETTERS[currentIndex]}
      </Animated.Text>
      {captions && (
        <Text style={styles.caption} accessibilityLiveRegion="polite">{caption}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastelPeach,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 10,
    marginRight: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  homeIcon: {
    fontSize: 28,
    color: COLORS.white,
  },
  controlButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  controlIcon: {
    fontSize: 28,
    color: COLORS.white,
  },
  letter: {
    fontSize: 96,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: FONTS.fallback,
    marginBottom: 24,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  caption: {
    fontSize: 28,
    color: COLORS.primary,
    fontFamily: FONTS.fallback,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
    textAlign: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  highContrastBg: {
    backgroundColor: COLORS.highContrastBg,
  },
}); 
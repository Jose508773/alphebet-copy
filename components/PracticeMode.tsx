import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Platform, 
  Animated
} from 'react-native';
import { COLORS } from '../constants/StyleGuide';
import { useAccessibility } from '../constants/AccessibilityContext';
import { LETTER_EMOJI } from '../constants/StyleGuide';
import { speechUtils } from '../utils/SpeechUtils';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const PracticeMode: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { highContrast } = useAccessibility();

  const handleNext = () => {
    setShowSuccess(false);
    setCurrentIndex((idx) => (idx < LETTERS.length - 1 ? idx + 1 : idx));
    // Speak the next letter
    const nextIndex = currentIndex < LETTERS.length - 1 ? currentIndex + 1 : currentIndex;
    speechUtils.speakLetter(LETTERS[nextIndex]);
  };
  const handleBack = () => {
    setShowSuccess(false);
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : 0));
    // Speak the previous letter
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    speechUtils.speakLetter(LETTERS[prevIndex]);
  };
  const handleLetterTap = (letter: string) => {
    if (letter === LETTERS[currentIndex]) {
      setShowSuccess(true);
      speechUtils.speakSuccess();
    } else {
      speechUtils.speakEncouragement();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice Mode</Text>
        <Pressable
          style={styles.homeButton}
          onPress={onHome}
          accessibilityLabel="Go back to home"
        >
          <Text style={styles.homeButtonText}>🏠</Text>
        </Pressable>
      </View>
      <View style={styles.practiceArea}>
        <Text style={styles.currentLetter}>
          {LETTERS[currentIndex]}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.practiceLetter,
            pressed && styles.practiceLetterPressed,
          ]}
          onPress={() => handleLetterTap(LETTERS[currentIndex])}
          accessibilityLabel={`Practice letter ${LETTERS[currentIndex]}`}
          accessibilityRole="button"
        >
          <Text style={styles.practiceLetterText}>{LETTERS[currentIndex]}</Text>
        </Pressable>
        {showSuccess && (
          <View style={styles.successEffect}>
            <Text style={styles.successText}>⭐ Great! ⭐</Text>
          </View>
        )}
      </View>
      <View style={styles.controls}>
        <Pressable
          style={styles.controlButton}
          onPress={handleBack}
          accessibilityLabel="Previous letter"
        >
          <Text style={styles.controlIcon}>←</Text>
        </Pressable>
        <Pressable
          style={styles.controlButton}
          onPress={handleNext}
          accessibilityLabel="Next letter"
        >
          <Text style={styles.controlIcon}>→</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastelMint,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  homeButton: {
    padding: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
  },
  homeButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  practiceArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.brightPurple,
    marginBottom: 20,
  },
  practiceLetter: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  practiceLetterPressed: {
    opacity: 0.8,
  },
  practiceLetterText: {
    fontSize: 64,
    color: COLORS.white,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  successEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  successText: {
    fontSize: 28,
    color: COLORS.brightGreen,
    fontWeight: 'bold',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlIcon: {
    fontSize: 28,
    color: COLORS.white,
  },
});
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, LETTER_EMOJI } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface LetterPreviewProps {
  letter: string | null;
  position: { x: number; y: number };
  isVisible: boolean;
}

// Example phonetic pronunciations and words
const LETTER_DATA: Record<string, { phonetic: string; words: string[]; description: string }> = {
  A: { phonetic: 'ay', words: ['Apple', 'Ant', 'Airplane'], description: 'The first letter of the alphabet' },
  B: { phonetic: 'bee', words: ['Ball', 'Book', 'Butterfly'], description: 'Makes a "buh" sound' },
  C: { phonetic: 'see', words: ['Cat', 'Car', 'Cookie'], description: 'Can sound like "kuh" or "sss"' },
  D: { phonetic: 'dee', words: ['Dog', 'Duck', 'Drum'], description: 'Makes a "duh" sound' },
  E: { phonetic: 'ee', words: ['Elephant', 'Egg', 'Eagle'], description: 'Often sounds like "eh"' },
  F: { phonetic: 'eff', words: ['Fish', 'Fire', 'Flower'], description: 'Makes a "fff" sound' },
  G: { phonetic: 'jee', words: ['Goat', 'Girl', 'Guitar'], description: 'Can sound like "guh" or "juh"' },
  H: { phonetic: 'aych', words: ['Hat', 'House', 'Horse'], description: 'Makes a breathy "huh" sound' },
  I: { phonetic: 'eye', words: ['Ice', 'Igloo', 'Island'], description: 'Often sounds like "ih"' },
  J: { phonetic: 'jay', words: ['Juice', 'Jump', 'Jellyfish'], description: 'Makes a "juh" sound' },
  K: { phonetic: 'kay', words: ['Kite', 'King', 'Kitchen'], description: 'Makes a "kuh" sound' },
  L: { phonetic: 'ell', words: ['Lion', 'Lamp', 'Lemon'], description: 'Makes a "luh" sound' },
  M: { phonetic: 'em', words: ['Mouse', 'Moon', 'Music'], description: 'Makes a "mmm" sound' },
  N: { phonetic: 'en', words: ['Nose', 'Net', 'Night'], description: 'Makes a "nnn" sound' },
  O: { phonetic: 'oh', words: ['Orange', 'Owl', 'Ocean'], description: 'Often sounds like "ah"' },
  P: { phonetic: 'pee', words: ['Penguin', 'Pizza', 'Piano'], description: 'Makes a "puh" sound' },
  Q: { phonetic: 'cue', words: ['Queen', 'Question', 'Quiet'], description: 'Usually paired with U' },
  R: { phonetic: 'are', words: ['Rainbow', 'Robot', 'River'], description: 'Makes a rolling "rrr" sound' },
  S: { phonetic: 'ess', words: ['Sun', 'Snake', 'Star'], description: 'Makes a "sss" sound' },
  T: { phonetic: 'tee', words: ['Tiger', 'Tree', 'Truck'], description: 'Makes a "tuh" sound' },
  U: { phonetic: 'you', words: ['Umbrella', 'Up', 'Under'], description: 'Often sounds like "uh"' },
  V: { phonetic: 'vee', words: ['Violin', 'Van', 'Volcano'], description: 'Makes a "vvv" sound' },
  W: { phonetic: 'double-you', words: ['Water', 'Wind', 'Whale'], description: 'Makes a "wuh" sound' },
  X: { phonetic: 'ex', words: ['X-ray', 'Box', 'Fox'], description: 'Often sounds like "ks"' },
  Y: { phonetic: 'why', words: ['Yellow', 'Yo-yo', 'Yard'], description: 'Can sound like "yuh" or "ih"' },
  Z: { phonetic: 'zee', words: ['Zebra', 'Zoo', 'Zero'], description: 'Makes a "zzz" sound' },
};

export default function LetterPreview({ letter, position, isVisible }: LetterPreviewProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (isVisible && letter) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 400,
          friction: 10,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, letter]);

  if (!isVisible || !letter) return null;

  const letterData = LETTER_DATA[letter];
  if (!letterData) return null;

  // Calculate position to keep preview on screen
  const previewWidth = 280;
  const previewHeight = 200;
  const adjustedX = Math.min(Math.max(position.x - previewWidth / 2, 10), width - previewWidth - 10);
  const adjustedY = position.y > height / 2 ? position.y - previewHeight - 20 : position.y + 60;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: adjustedX,
          top: adjustedY,
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      {/* Arrow pointer */}
      <View style={[
        styles.arrow,
        position.y > height / 2 ? styles.arrowBottom : styles.arrowTop,
        { left: position.x - adjustedX - 10 }
      ]} />
      
      {/* Preview content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.letterDisplay}>{letter}</Text>
          <Text style={styles.letterLowercase}>{letter.toLowerCase()}</Text>
          <Text style={styles.emoji}>{LETTER_EMOJI[letter]}</Text>
        </View>

        {/* Pronunciation */}
        <View style={styles.pronunciation}>
          <Text style={styles.phoneticLabel}>Sounds like:</Text>
          <Text style={styles.phoneticText}>&ldquo;{letterData.phonetic}&rdquo;</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{letterData.description}</Text>

        {/* Example words */}
        <View style={styles.wordsSection}>
          <Text style={styles.wordsLabel}>Words that start with {letter}:</Text>
          <View style={styles.wordsContainer}>
            {letterData.words.map((word, index) => (
              <View key={word} style={styles.wordChip}>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    width: 280,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    left: '50%',
    marginLeft: -10,
  },
  arrowTop: {
    top: -8,
    borderBottomWidth: 8,
    borderBottomColor: COLORS.white,
  },
  arrowBottom: {
    bottom: -8,
    borderTopWidth: 8,
    borderTopColor: COLORS.white,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  letterDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.heading,
    marginRight: 8,
  },
  letterLowercase: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.secondary,
    fontFamily: FONTS.heading,
    marginRight: 15,
  },
  emoji: {
    fontSize: 32,
  },
  pronunciation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  phoneticLabel: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontFamily: FONTS.body,
    marginRight: 8,
  },
  phoneticText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: FONTS.heading,
  },
  description: {
    fontSize: 14,
    color: COLORS.primaryText,
    fontFamily: FONTS.body,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  wordsSection: {
    marginTop: 5,
  },
  wordsLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontFamily: FONTS.body,
    marginBottom: 8,
    textAlign: 'center',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  wordChip: {
    backgroundColor: COLORS.pastelMint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brightGreen,
  },
  wordText: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
}); 
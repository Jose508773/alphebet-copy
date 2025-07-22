import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated, Easing } from 'react-native';
import { COLORS, FONTS, LETTER_EMOJI, RAINBOW } from '../constants/StyleGuide';
import { useAccessibility } from '../constants/AccessibilityContext';
import { speechUtils, LETTER_DATA } from '../utils/SpeechUtils';

interface LetterDetailPopupProps {
  visible: boolean;
  letter: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

export default function LetterDetailPopup({ 
  visible, 
  letter, 
  onClose, 
  onNext, 
  onPrevious, 
  canGoNext = true, 
  canGoPrevious = true 
}: LetterDetailPopupProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const letterAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(0)).current;
  const letterIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);
  const letterColor = RAINBOW[letterIndex % RAINBOW.length];
  const { highContrast } = useAccessibility();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(letterAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
          Animated.timing(wordAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(letterAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wordAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getHighlightedWord = () => {
    const letterData = LETTER_DATA[letter];
    return `${letter}... as in ${letterData?.exampleWord}!`;
  };

  const handleReplay = () => {
    speechUtils.speakLetter(letter);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.popup,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.letter,
              {
                color: letterColor,
                transform: [
                  { scale: letterAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })},
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.word,
              {
                opacity: wordAnim,
                transform: [
                  { translateX: wordAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })},
                ],
              },
            ]}
          >
            {LETTER_DATA[letter]?.exampleWord}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.description,
              {
                opacity: wordAnim,
                transform: [
                  { translateY: wordAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })},
                ],
              },
            ]}
          >
            {LETTER_EMOJI[letter]}
          </Animated.Text>
          <View style={styles.buttonRow}>
            {canGoPrevious && onPrevious && (
              <Pressable
                style={[
                  styles.navButton,
                  {
                    backgroundColor: COLORS.secondary,
                  },
                ]}
                onPress={onPrevious}
                accessibilityLabel="Previous letter"
              >
                <Text style={styles.navButtonText}>← Previous</Text>
              </Pressable>
            )}
            
            <Pressable
              style={[
                styles.replayButton,
                {
                  backgroundColor: COLORS.brightGreen,
                },
              ]}
              onPress={handleReplay}
              accessibilityLabel="Replay letter pronunciation"
            >
              <Text style={styles.replayButtonText}>🔊 Replay</Text>
            </Pressable>

            <Pressable
              style={[
                styles.closeButton,
                {
                  backgroundColor: COLORS.accent,
                },
              ]}
              onPress={onClose}
              onHoverIn={() => {
                Animated.spring(letterAnim, {
                  toValue: 2,
                  friction: 8,
                  tension: 100,
                  useNativeDriver: true,
                }).start();
              }}
              onHoverOut={() => {
                Animated.spring(letterAnim, {
                  toValue: 1,
                  friction: 8,
                  tension: 100,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Animated.Text
                style={[
                  styles.closeButtonText,
                  {
                    transform: [
                      { scale: letterAnim.interpolate({
                        inputRange: [0, 2],
                        outputRange: [1, 1.2],
                      })},
                    ],
                  },
                ]}
              >
                Close
              </Animated.Text>
            </Pressable>

            {canGoNext && onNext && (
              <Pressable
                style={[
                  styles.navButton,
                  {
                    backgroundColor: COLORS.brightBlue,
                  },
                ]}
                onPress={onNext}
                accessibilityLabel="Next letter"
              >
                <Text style={styles.navButtonText}>Next →</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: COLORS.pastelPink,
    borderRadius: 40,
    padding: 50,
    elevation: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    marginHorizontal: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  letter: {
    fontSize: 100,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.primary,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 20,
    padding: 10,
  },
  word: {
    fontSize: 32,
    color: COLORS.brightBlue,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: FONTS.heading,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    backgroundColor: COLORS.pastelMint,
    borderRadius: 15,
    padding: 10,
  },
  description: {
    fontSize: 26,
    color: COLORS.brightGreen,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: FONTS.heading,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    backgroundColor: COLORS.pastelBlue,
    borderRadius: 15,
    padding: 15,
  },
  closeButton: {
    marginTop: 25,
    backgroundColor: COLORS.brightRed,
    borderRadius: 40,
    paddingHorizontal: 50,
    paddingVertical: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 10,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    paddingHorizontal: 15,
    textAlign: 'center',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    gap: 10,
  },
  navButton: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 8,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    textAlign: 'center',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  replayButton: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 8,
  },
  replayButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    textAlign: 'center',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  captionText: {
    fontSize: 30,
    color: COLORS.brightPurple,
    backgroundColor: COLORS.pastelPeach,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    zIndex: 2,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highContrastBg: {
    backgroundColor: COLORS.highContrastBg,
  },
  highContrastText: {
    color: COLORS.highContrastText,
  },
}); 
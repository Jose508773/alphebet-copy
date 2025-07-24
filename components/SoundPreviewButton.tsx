import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet, Platform, View } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

interface SoundPreviewButtonProps {
  letter: string;
  size?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onSoundPlay?: (letter: string) => void;
  disabled?: boolean;
}

export default function SoundPreviewButton({
  letter,
  size = 30,
  position = 'top-right',
  onSoundPlay,
  disabled = false,
}: SoundPreviewButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Gentle pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handlePress = () => {
    if (disabled) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Ripple effect
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      rippleAnim.setValue(0);
    });

    // Play sound and call callback
    playLetterSound();
    onSoundPlay?.(letter);
  };

  const playLetterSound = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.rate = 0.7;
      utterance.pitch = 1.3;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getPositionStyle = () => {
    const baseSize = size / 2;
    switch (position) {
      case 'top-right':
        return { top: -baseSize, right: -baseSize };
      case 'top-left':
        return { top: -baseSize, left: -baseSize };
      case 'bottom-right':
        return { bottom: -baseSize, right: -baseSize };
      case 'bottom-left':
        return { bottom: -baseSize, left: -baseSize };
      default:
        return { top: -baseSize, right: -baseSize };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        {
          width: size,
          height: size,
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            {
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
        },
      ]}
    >
      {/* Ripple Effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            transform: [
              {
                scale: rippleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
            opacity: rippleAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.6, 0.3, 0],
            }),
          },
        ]}
      />

      {/* Main Button */}
      <Pressable
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={`Play sound for letter ${letter}`}
        accessibilityRole="button"
      >
        {/* Sound Wave Icon */}
        <Animated.View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.soundWave,
              styles.wave1,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 0.3, 0.6, 1],
                  outputRange: [0.3, 1, 0.3, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.soundWave,
              styles.wave2,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 0.4, 0.7, 1],
                  outputRange: [0.2, 0.8, 0.2, 0.8],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.soundWave,
              styles.wave3,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 0.5, 0.8, 1],
                  outputRange: [0.1, 0.6, 0.1, 0.6],
                }),
              },
            ]}
          />
          
          {/* Center Dot */}
          <View style={styles.centerDot} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  ripple: {
    position: 'absolute',
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: COLORS.disabled,
  },
  iconContainer: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  soundWave: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 1,
  },
  wave1: {
    width: 2,
    height: 8,
    left: '60%',
  },
  wave2: {
    width: 2,
    height: 12,
    left: '75%',
  },
  wave3: {
    width: 2,
    height: 6,
    left: '90%',
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: '30%',
  },
}); 
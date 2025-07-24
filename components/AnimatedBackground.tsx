import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface FloatingLetter {
  id: number;
  letter: string;
  animValue: Animated.Value;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  rotateValue: Animated.Value;
}

export default function AnimatedBackground() {
  const floatingLetters = useRef<FloatingLetter[]>([]);

  useEffect(() => {
    // Create floating letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    floatingLetters.current = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      letter: letters[Math.floor(Math.random() * letters.length)],
      animValue: new Animated.Value(Math.random() * height),
      x: Math.random() * width,
      y: Math.random() * height,
      size: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.2,
      speed: 0.3 + Math.random() * 0.7,
      rotateValue: new Animated.Value(0),
    }));

    // Start animations
    floatingLetters.current.forEach((letter, index) => {
      // Vertical floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(letter.animValue, {
            toValue: -100,
            duration: (8000 + Math.random() * 4000) / letter.speed,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(letter.rotateValue, {
          toValue: 1,
          duration: 15000 + Math.random() * 10000,
          useNativeDriver: true,
        })
      ).start();

      // Reset position when off screen
      const listener = letter.animValue.addListener(({ value }) => {
        if (value <= -100) {
          letter.animValue.setValue(height + 100);
          letter.x = Math.random() * width;
          letter.letter = letters[Math.floor(Math.random() * letters.length)];
        }
      });
    });

    return () => {
      floatingLetters.current.forEach(letter => {
        letter.animValue.removeAllListeners();
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />
      
      {/* Floating Letters */}
      {floatingLetters.current.map((letter) => (
        <Animated.View
          key={letter.id}
          style={[
            styles.floatingLetter,
            {
              left: letter.x,
              transform: [
                {
                  translateY: letter.animValue,
                },
                {
                  rotate: letter.rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.letterText,
              {
                fontSize: letter.size,
                opacity: letter.opacity,
              },
            ]}
          >
            {letter.letter}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.gradientStart,
  },
  floatingLetter: {
    position: 'absolute',
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  letterText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

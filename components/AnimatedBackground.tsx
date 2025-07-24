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
  const gradientColorAnim = useRef(new Animated.Value(0)).current;

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

    // Start gradient color animation
    Animated.loop(
      Animated.timing(gradientColorAnim, {
        toValue: 1,
        duration: 20000, // 20 seconds for full color cycle
        useNativeDriver: false, // Can't use native driver for color interpolation
      })
    ).start();

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

  // Function to get animated gradient colors
  const getAnimatedBackgroundColor = () => {
    return gradientColorAnim.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        '#E8F5E8', // Pastel mint (original)
        '#E6E6FA', // Lavender
        '#FFE4E1', // Misty rose
        '#F0E6FF', // Light purple
        '#E0F6FF', // Alice blue
        '#E8F5E8', // Back to pastel mint
      ],
    });
  };

  const getAnimatedGradientOverlay = () => {
    return gradientColorAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 192, 203, 0.1)', // Light pink
        'rgba(173, 216, 230, 0.1)', // Light blue
        'rgba(221, 160, 221, 0.1)', // Plum
        'rgba(255, 255, 255, 0.1)', // Back to white
      ],
    });
  };

  return (
    <View style={styles.container}>
      {/* Animated Gradient Background */}
      <Animated.View 
        style={[
          styles.gradientBackground,
          {
            backgroundColor: getAnimatedBackgroundColor(),
          },
        ]} 
      />
      
      {/* Animated Gradient Overlay */}
      <Animated.View 
        style={[
          styles.gradientOverlay,
          {
            backgroundColor: getAnimatedGradientOverlay(),
          },
        ]} 
      />
      
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
    zIndex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  floatingLetter: {
    position: 'absolute',
    zIndex: 3,
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

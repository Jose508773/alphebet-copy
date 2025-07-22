import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

// Define some vibrant colors for the background elements
const BG_COLORS = [
  '#FF69B4', // Hot pink
  '#48D1CC', // Turquoise
  '#FFD700', // Gold
  '#FFB6C1', // Light pink
  '#98FB98', // Light green
  '#ADD8E6', // Light blue
  '#FF4500', // Orange red
  '#32CD32', // Lime green
  '#00BFFF', // Turquoise blue
  '#9400D3', // Purple
];

const AnimatedBackground: React.FC = () => {
  // Create multiple animated elements
  const elements = Array.from({ length: 6 }, (_, i) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const delay = i * 1000; // Stagger animations

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2000,
            delay: delay,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 3000,
            delay: delay,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            delay: delay,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 360,
          duration: 15000,
          delay: delay,
          useNativeDriver: true,
        })
      ).start();
    }, []);

    return (
      <Animated.View 
        key={i}
        style={[
          styles.element,
          {
            backgroundColor: BG_COLORS[i % BG_COLORS.length],
            top: `${Math.random() * 70 + 15}%`,
            left: `${Math.random() * 70 + 15}%`,
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              })},
            ],
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <View style={styles.gradient} />
      
      {/* Multiple animated elements */}
      {elements}
      
      {/* Confetti-like particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Animated.View
          key={`particle-${i}`}
          style={[
            styles.particle,
            {
              backgroundColor: BG_COLORS[i % BG_COLORS.length],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            },
          ]}
        />
      ))}
    </View>
  );
};

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
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.gradientStart,
  },
  element: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  particle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default AnimatedBackground;

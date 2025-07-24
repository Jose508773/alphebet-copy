import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface LoadingWheelProps {
  size?: number;
  visible?: boolean;
}

export default function LoadingWheel({ size = 200, visible = true }: LoadingWheelProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Start rotation
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 8000, // 8 seconds for full rotation
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Fade out
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const renderAlphabetWheel = () => {
    const radius = size / 2 - 30;
    const centerX = size / 2;
    const centerY = size / 2;

    return ALPHABET.map((letter, index) => {
      const angle = (index * 360) / ALPHABET.length;
      const radian = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(radian);
      const y = centerY + radius * Math.sin(radian);

      return (
        <Animated.View
          key={letter}
          style={[
            styles.letterContainer,
            {
              left: x - 15,
              top: y - 15,
              transform: [
                {
                  rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.wheelLetter}>{letter}</Text>
        </Animated.View>
      );
    });
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          width: size,
          height: size,
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.wheelContainer}>
        {renderAlphabetWheel()}
        
        {/* Center circle */}
        <View style={styles.centerCircle}>
          <Text style={styles.centerText}>ABC</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1000,
  },
  wheelContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  letterContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  wheelLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.heading,
  },
  centerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.heading,
  },
}); 
import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface EnhancedGradientBackgroundProps {
  style?: any;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  speed?: 'slow' | 'medium' | 'fast';
  type?: 'radial' | 'linear' | 'diagonal' | 'spiral';
}

export default function EnhancedGradientBackground({
  style,
  intensity = 'medium',
  speed = 'medium',
  type = 'radial',
}: EnhancedGradientBackgroundProps) {
  const gradient1Anim = useRef(new Animated.Value(0)).current;
  const gradient2Anim = useRef(new Animated.Value(0)).current;
  const gradient3Anim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const speedMap = { slow: 30000, medium: 20000, fast: 15000 };
    const animationDuration = speedMap[speed];

    // Main gradient color cycling
    const gradient1Animation = Animated.loop(
      Animated.timing(gradient1Anim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false,
      })
    );

    // Secondary gradient with offset timing
    const gradient2Animation = Animated.loop(
      Animated.timing(gradient2Anim, {
        toValue: 1,
        duration: animationDuration * 1.3,
        useNativeDriver: false,
      })
    );

    // Tertiary gradient with different timing
    const gradient3Animation = Animated.loop(
      Animated.timing(gradient3Anim, {
        toValue: 1,
        duration: animationDuration * 0.8,
        useNativeDriver: false,
      })
    );

    // Rotation animation for spiral/radial effects
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: animationDuration * 2,
        useNativeDriver: true,
      })
    );

    // Gentle scaling animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: animationDuration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration / 4,
          useNativeDriver: true,
        }),
      ])
    );

    gradient1Animation.start();
    gradient2Animation.start();
    gradient3Animation.start();
    rotationAnimation.start();
    scaleAnimation.start();

    return () => {
      gradient1Animation.stop();
      gradient2Animation.stop();
      gradient3Animation.stop();
      rotationAnimation.stop();
      scaleAnimation.stop();
    };
  }, [speed]);

  const getIntensityColors = () => {
    const intensityMap = {
      subtle: {
        primary: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'],
        secondary: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6'],
        accent: ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8'],
      },
      medium: {
        primary: ['#FFE0E6', '#FFB3C1', '#FF8A95', '#FF5722'],
        secondary: ['#E8F5E8', '#C8E6C8', '#81C784', '#4CAF50'],
        accent: ['#FFF3E0', '#FFCC80', '#FFB74D', '#FF9800'],
      },
      vibrant: {
        primary: ['#FF6B6B', '#FF8E53', '#FF6B35', '#C44569'],
        secondary: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
        accent: ['#A8E6CF', '#FFD93D', '#6C5CE7', '#FD79A8'],
      },
    };

    return intensityMap[intensity];
  };

  const colors = getIntensityColors();

  const getGradient1Color = () => {
    return gradient1Anim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: colors.primary,
    });
  };

  const getGradient2Color = () => {
    return gradient2Anim.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: colors.secondary,
    });
  };

  const getGradient3Color = () => {
    return gradient3Anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: colors.accent,
    });
  };

  const getTransformStyle = () => {
    const rotation = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    switch (type) {
      case 'spiral':
        return {
          transform: [
            { scale: scaleAnim },
            { rotate: rotation },
          ],
        };
      case 'radial':
        return {
          transform: [
            { scale: scaleAnim },
            { rotateZ: rotation },
          ],
        };
      case 'diagonal':
        return {
          transform: [
            { skewX: '15deg' },
            { rotate: rotation },
          ],
        };
      default:
        return {
          transform: [{ scale: scaleAnim }],
        };
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Base Layer */}
      <Animated.View
        style={[
          styles.gradientLayer,
          {
            backgroundColor: getGradient1Color(),
            ...getTransformStyle(),
          },
        ]}
      />

      {/* Secondary Layer */}
      <Animated.View
        style={[
          styles.gradientLayer,
          styles.secondaryLayer,
          {
            backgroundColor: getGradient2Color(),
            opacity: 0.7,
          },
        ]}
      />

      {/* Accent Layer */}
      <Animated.View
        style={[
          styles.gradientLayer,
          styles.accentLayer,
          {
            backgroundColor: getGradient3Color(),
            opacity: 0.4,
          },
        ]}
      />

      {/* Overlay Patterns */}
      {type === 'radial' && (
        <View style={styles.radialOverlay}>
          <Animated.View
            style={[
              styles.radialCircle,
              {
                backgroundColor: getGradient1Color(),
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [1, 1.05],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      )}

      {type === 'spiral' && (
        <View style={styles.spiralOverlay}>
          <Animated.View
            style={[
              styles.spiralElement,
              {
                backgroundColor: getGradient2Color(),
                transform: [
                  { rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }) },
                  { scale: scaleAnim },
                ],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  secondaryLayer: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    borderRadius: width * 0.1,
  },
  accentLayer: {
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    borderRadius: width * 0.2,
  },
  radialOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    opacity: 0.3,
  },
  spiralOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spiralElement: {
    width: width * 0.8,
    height: 20,
    borderRadius: 10,
    opacity: 0.2,
  },
}); 
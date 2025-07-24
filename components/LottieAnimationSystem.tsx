import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

// Lottie-style animation system with CSS fallbacks
interface LottieAnimationProps {
  animationType: 'loading' | 'success' | 'celebration' | 'educational' | 'magical' | 'bounce' | 'spin' | 'pulse';
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onAnimationComplete?: () => void;
  style?: any;
}

export default function LottieAnimationSystem({
  animationType,
  size = 100,
  loop = true,
  autoplay = true,
  speed = 1,
  onAnimationComplete,
  style,
}: LottieAnimationProps) {
  const animationValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const [animationState, setAnimationState] = useState<'idle' | 'running' | 'completed'>('idle');

  useEffect(() => {
    if (autoplay) {
      startAnimation();
    }
  }, [autoplay, animationType, speed]);

  const startAnimation = () => {
    setAnimationState('running');
    
    // Reset values
    animationValue.setValue(0);
    rotationValue.setValue(0);
    scaleValue.setValue(1);
    opacityValue.setValue(1);

    const animations = createAnimationSequence();
    
    if (loop) {
      Animated.loop(animations).start();
    } else {
      animations.start(() => {
        setAnimationState('completed');
        onAnimationComplete?.();
      });
    }
  };

  const createAnimationSequence = (): Animated.CompositeAnimation => {
    const duration = 2000 / speed;
    
    switch (animationType) {
      case 'loading':
        return Animated.parallel([
          Animated.timing(rotationValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scaleValue, {
              toValue: 1.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]);

      case 'success':
        return Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.3,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]);

      case 'celebration':
        return Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleValue, {
              toValue: 1.5,
              duration: duration / 3,
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 0.8,
              duration: duration / 3,
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 1.2,
              duration: duration / 3,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotationValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
        ]);

      case 'educational':
        return Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 0.5,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(scaleValue, {
              toValue: 1.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(rotationValue, {
              toValue: 0.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(animationValue, {
            toValue: 1,
            duration: duration / 4,
            useNativeDriver: true,
          }),
        ]);

      case 'magical':
        return Animated.parallel([
          Animated.sequence([
            Animated.timing(opacityValue, {
              toValue: 0.3,
              duration: duration / 6,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 1,
              duration: duration / 6,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 0.7,
              duration: duration / 6,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scaleValue, {
            toValue: 1.3,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(rotationValue, {
            toValue: 2,
            duration: duration,
            useNativeDriver: true,
          }),
        ]);

      case 'bounce':
        return Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 0.3,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.spring(scaleValue, {
            toValue: 1.2,
            tension: 300,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: duration / 4,
            useNativeDriver: true,
          }),
        ]);

      case 'spin':
        return Animated.timing(rotationValue, {
          toValue: 3,
          duration: duration,
          useNativeDriver: true,
        });

      case 'pulse':
        return Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]);

      default:
        return Animated.timing(animationValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        });
    }
  };

  const getAnimationContent = () => {
    switch (animationType) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'celebration':
        return '🎉';
      case 'educational':
        return '📚';
      case 'magical':
        return '✨';
      case 'bounce':
        return '⚡';
      case 'spin':
        return '🌟';
      case 'pulse':
        return '💖';
      default:
        return '🎭';
    }
  };

  const getRotation = () => {
    return rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  };

  const getComplexRotation = () => {
    return rotationValue.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: ['0deg', '180deg', '360deg', '1080deg'],
    });
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.animationContainer,
          {
            width: size,
            height: size,
            opacity: opacityValue,
            transform: [
              { scale: scaleValue },
              { rotate: animationType === 'spin' || animationType === 'magical' ? getComplexRotation() : getRotation() },
            ],
          },
        ]}
      >
        <Text style={[styles.animationEmoji, { fontSize: size * 0.6 }]}>
          {getAnimationContent()}
        </Text>
        
        {/* Additional animated elements for complex animations */}
        {animationType === 'celebration' && (
          <View style={styles.celebrationElements}>
            {[...Array(6)].map((_, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.celebrationEmoji,
                  {
                    fontSize: size * 0.2,
                    transform: [
                      { rotate: rotationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [`${index * 60}deg`, `${index * 60 + 360}deg`],
                      }) },
                      { translateX: size * 0.3 },
                    ],
                  },
                ]}
              >
                {['🎊', '🎈', '⭐', '🌟', '💫', '✨'][index]}
              </Animated.Text>
            ))}
          </View>
        )}

        {animationType === 'magical' && (
          <View style={styles.magicalElements}>
            {[...Array(8)].map((_, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.magicalParticle,
                  {
                    fontSize: size * 0.15,
                    opacity: opacityValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0.3],
                    }),
                    transform: [
                      { rotate: rotationValue.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [`${index * 45}deg`, `${index * 45 + 180}deg`, `${index * 45 + 720}deg`],
                      }) },
                      { translateX: size * 0.4 },
                    ],
                  },
                ]}
              >
                ✨
              </Animated.Text>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

// Specialized Lottie-style components
export function LoadingAnimation({ size = 80 }: { size?: number }) {
  return (
    <LottieAnimationSystem
      animationType="loading"
      size={size}
      loop={true}
      autoplay={true}
      speed={1.5}
    />
  );
}

export function SuccessAnimation({ size = 100, onComplete }: { size?: number; onComplete?: () => void }) {
  return (
    <LottieAnimationSystem
      animationType="success"
      size={size}
      loop={false}
      autoplay={true}
      speed={1}
      onAnimationComplete={onComplete}
    />
  );
}

export function CelebrationAnimation({ size = 120 }: { size?: number }) {
  return (
    <LottieAnimationSystem
      animationType="celebration"
      size={size}
      loop={true}
      autoplay={true}
      speed={0.8}
    />
  );
}

export function MagicalAnimation({ size = 90 }: { size?: number }) {
  return (
    <LottieAnimationSystem
      animationType="magical"
      size={size}
      loop={true}
      autoplay={true}
      speed={1.2}
    />
  );
}

export function EducationalAnimation({ size = 70 }: { size?: number }) {
  return (
    <LottieAnimationSystem
      animationType="educational"
      size={size}
      loop={true}
      autoplay={true}
      speed={1}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  animationEmoji: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  celebrationElements: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationEmoji: {
    position: 'absolute',
    textAlign: 'center',
  },
  magicalElements: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  magicalParticle: {
    position: 'absolute',
    textAlign: 'center',
  },
}); 
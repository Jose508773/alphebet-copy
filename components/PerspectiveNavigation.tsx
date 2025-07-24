import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface PerspectiveNavigationProps {
  isVisible: boolean;
  onTransitionComplete?: () => void;
  perspectiveType?: 'zoom' | 'rotate' | 'flip' | 'cube';
  duration?: number;
}

export default function PerspectiveNavigation({ 
  isVisible, 
  onTransitionComplete, 
  perspectiveType = 'zoom',
  duration = 1500 
}: PerspectiveNavigationProps) {
  const perspectiveAnim = useRef(new Animated.Value(0)).current;
  const rotationXAnim = useRef(new Animated.Value(0)).current;
  const rotationYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset values
      perspectiveAnim.setValue(0);
      rotationXAnim.setValue(0);
      rotationYAnim.setValue(0);
      scaleAnim.setValue(1);
      opacityAnim.setValue(0);

      // Start fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      let animationSequence: Animated.CompositeAnimation;

      switch (perspectiveType) {
        case 'zoom':
          animationSequence = createZoomAnimation();
          break;
        case 'rotate':
          animationSequence = createRotateAnimation();
          break;
        case 'flip':
          animationSequence = createFlipAnimation();
          break;
        case 'cube':
          animationSequence = createCubeAnimation();
          break;
        default:
          animationSequence = createZoomAnimation();
      }

      animationSequence.start(() => {
        // Fade out and complete
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onTransitionComplete?.();
        });
      });
    }
  }, [isVisible, perspectiveType]);

  const createZoomAnimation = () => {
    return Animated.sequence([
      // Zoom out dramatically
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: duration * 0.4,
          useNativeDriver: true,
        }),
        Animated.timing(perspectiveAnim, {
          toValue: 1,
          duration: duration * 0.4,
          useNativeDriver: true,
        }),
      ]),
      // Pause
      Animated.delay(duration * 0.2),
      // Zoom back in with rotation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(rotationYAnim, {
          toValue: 1,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
      ]),
      // Settle to normal
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration * 0.1,
        useNativeDriver: true,
      }),
    ]);
  };

  const createRotateAnimation = () => {
    return Animated.sequence([
      // Rotate on X and Y axis
      Animated.parallel([
        Animated.timing(rotationXAnim, {
          toValue: 1,
          duration: duration * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(rotationYAnim, {
          toValue: 1,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(perspectiveAnim, {
          toValue: 1,
          duration: duration * 0.5,
          useNativeDriver: true,
        }),
      ]),
      // Return to center with scale
      Animated.parallel([
        Animated.timing(rotationXAnim, {
          toValue: 0,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(rotationYAnim, {
          toValue: 0,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: duration * 0.2,
          useNativeDriver: true,
        }),
      ]),
      // Final settle
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration * 0.2,
        useNativeDriver: true,
      }),
    ]);
  };

  const createFlipAnimation = () => {
    return Animated.sequence([
      // Flip forward on X-axis
      Animated.timing(rotationXAnim, {
        toValue: 0.5,
        duration: duration * 0.3,
        useNativeDriver: true,
      }),
      // Continue flip
      Animated.timing(rotationXAnim, {
        toValue: 1,
        duration: duration * 0.3,
        useNativeDriver: true,
      }),
      // Flip back
      Animated.timing(rotationXAnim, {
        toValue: 0,
        duration: duration * 0.4,
        useNativeDriver: true,
      }),
    ]);
  };

  const createCubeAnimation = () => {
    return Animated.sequence([
      // Cube rotation sequence
      Animated.parallel([
        Animated.timing(rotationYAnim, {
          toValue: 0.25,
          duration: duration * 0.25,
          useNativeDriver: true,
        }),
        Animated.timing(perspectiveAnim, {
          toValue: 1,
          duration: duration * 0.25,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotationYAnim, {
        toValue: 0.5,
        duration: duration * 0.25,
        useNativeDriver: true,
      }),
      Animated.timing(rotationYAnim, {
        toValue: 0.75,
        duration: duration * 0.25,
        useNativeDriver: true,
      }),
      Animated.timing(rotationYAnim, {
        toValue: 1,
        duration: duration * 0.25,
        useNativeDriver: true,
      }),
    ]);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.perspectiveContainer,
          {
            opacity: opacityAnim,
            transform: [
              { perspective: 1000 },
              {
                rotateX: rotationXAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              {
                rotateY: rotationYAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Perspective Grid */}
        <View style={styles.perspectiveGrid}>
          {Array.from({ length: 9 }, (_, i) => (
            <View key={i} style={styles.gridCell}>
              <View style={styles.gridLine} />
            </View>
          ))}
        </View>

        {/* Central Focus Element */}
        <Animated.View 
          style={[
            styles.centralElement,
            {
              transform: [
                {
                  scale: perspectiveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.centralCircle}>
            <View style={styles.innerCircle} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Background Overlay */}
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1800,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    zIndex: -1,
  },
  perspectiveContainer: {
    width: width * 0.8,
    height: height * 0.6,
    maxWidth: 400,
    maxHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perspectiveGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: COLORS.accent,
    opacity: 0.3,
  },
  gridLine: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    opacity: 0.5,
  },
  centralElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
}); 
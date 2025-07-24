import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface DepthLayer {
  id: number;
  depth: number; // 1 = front, 5 = back
  speed: number; // multiplier for animation speed
  element: string;
  size: number;
  opacity: number;
  color: string;
}

interface DepthTransitionProps {
  isVisible: boolean;
  onTransitionComplete?: () => void;
  direction?: 'forward' | 'backward';
  duration?: number;
}

export default function DepthTransition({ 
  isVisible, 
  onTransitionComplete, 
  direction = 'forward',
  duration = 2000 
}: DepthTransitionProps) {
  const depthLayers = useRef<DepthLayer[]>([]);
  const masterOpacityAnim = useRef(new Animated.Value(0)).current;
  const layerAnims = useRef<{ [key: number]: Animated.Value }>({}).current;

  useEffect(() => {
    // Create depth layers
    const elements = ['A', 'B', 'C', 'D', 'E', 'F', '★', '✨', '🌟', '📚', '🎨', '🎵'];
    
    depthLayers.current = Array.from({ length: 15 }, (_, i) => {
      const depth = Math.floor(Math.random() * 5) + 1; // 1-5 depth levels
      const layerId = i;
      
      // Initialize animation value for this layer
      if (!layerAnims[layerId]) {
        layerAnims[layerId] = new Animated.Value(direction === 'forward' ? -width : width);
      }
      
      return {
        id: layerId,
        depth,
        speed: (6 - depth) * 0.3, // Front layers move faster
        element: elements[Math.floor(Math.random() * elements.length)],
        size: 20 + (6 - depth) * 15, // Front layers are bigger
        opacity: 0.3 + (6 - depth) * 0.15, // Front layers more opaque
        color: [
          COLORS.primary,
          COLORS.secondary,
          COLORS.accent,
          COLORS.brightBlue,
          COLORS.brightGreen,
          COLORS.brightPurple,
        ][depth - 1] || COLORS.primary,
      };
    });
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Start master fade in
      Animated.timing(masterOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start staggered layer animations
      const layerAnimations = depthLayers.current.map((layer, index) => {
        const targetPosition = direction === 'forward' ? width + 100 : -width - 100;
        const animDelay = index * 50; // Stagger each layer by 50ms
        const animDuration = duration * layer.speed;

        return Animated.timing(layerAnims[layer.id], {
          toValue: targetPosition,
          duration: animDuration,
          delay: animDelay,
          useNativeDriver: true,
        });
      });

      // Run all layer animations
      Animated.parallel(layerAnimations).start(() => {
        // Fade out and complete
        setTimeout(() => {
          Animated.timing(masterOpacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            // Reset positions for next use
            depthLayers.current.forEach(layer => {
              layerAnims[layer.id].setValue(direction === 'forward' ? -width : width);
            });
            onTransitionComplete?.();
          });
        }, 200);
      });
    }
  }, [isVisible, direction]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.depthContainer,
          {
            opacity: masterOpacityAnim,
          },
        ]}
      >
        {/* Background Gradient Layers */}
        <View style={[styles.backgroundLayer, { zIndex: 1 }]}>
          <View style={[styles.gradientLayer, { backgroundColor: COLORS.pastelMint, opacity: 0.3 }]} />
        </View>
        <View style={[styles.backgroundLayer, { zIndex: 2 }]}>
          <View style={[styles.gradientLayer, { backgroundColor: COLORS.pastelLavender, opacity: 0.2 }]} />
        </View>
        <View style={[styles.backgroundLayer, { zIndex: 3 }]}>
          <View style={[styles.gradientLayer, { backgroundColor: COLORS.pastelPeach, opacity: 0.15 }]} />
        </View>

        {/* Animated Elements Layers */}
        {depthLayers.current.map((layer) => (
          <Animated.View
            key={layer.id}
            style={[
              styles.layerElement,
              {
                zIndex: 10 - layer.depth, // Front layers have higher z-index
                transform: [
                  {
                    translateX: layerAnims[layer.id],
                  },
                  {
                    scale: layer.depth === 1 ? 1.2 : layer.depth === 2 ? 1.1 : 1,
                  },
                ],
                top: Math.random() * (height - 100),
                opacity: layer.opacity,
              },
            ]}
          >
            <View 
              style={[
                styles.elementContainer,
                {
                  backgroundColor: layer.color,
                  transform: [
                    { 
                      scale: layer.depth <= 2 ? 1.1 : 0.9, // Front elements slightly larger
                    }
                  ],
                },
              ]}
            >
              <Text 
                style={[
                  styles.elementText,
                  {
                    fontSize: layer.size,
                    color: layer.depth <= 2 ? COLORS.white : COLORS.primaryText,
                  },
                ]}
              >
                {layer.element}
              </Text>
            </View>
          </Animated.View>
        ))}

        {/* Foreground Overlay */}
        <View style={[styles.foregroundOverlay, { zIndex: 15 }]}>
          <View style={[styles.overlayGradient, { opacity: 0.1 }]} />
        </View>
      </Animated.View>

      {/* Screen Overlay */}
      <Animated.View 
        style={[
          styles.screenOverlay,
          {
            opacity: masterOpacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
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
    zIndex: 1500,
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    zIndex: 0,
  },
  depthContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  layerElement: {
    position: 'absolute',
    left: 0,
  },
  elementContainer: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  elementText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.heading,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  foregroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
  },
}); 
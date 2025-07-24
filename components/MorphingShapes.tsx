import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface MorphingShape {
  id: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: Animated.Value;
  morphProgress: Animated.Value;
  currentShape: number;
  targetShape: number;
  size: number;
}

interface MorphingShapesProps {
  shapeCount?: number;
  animationSpeed?: 'slow' | 'medium' | 'fast';
  shapeTypes?: ('circle' | 'square' | 'triangle' | 'hexagon' | 'star' | 'heart')[];
  colorPalette?: string[];
  morphDuration?: number;
  style?: any;
}

export default function MorphingShapes({
  shapeCount = 8,
  animationSpeed = 'medium',
  shapeTypes = ['circle', 'square', 'triangle', 'hexagon', 'star'],
  colorPalette = [COLORS.primary, COLORS.accent, COLORS.brightBlue, COLORS.brightGreen, COLORS.brightPurple],
  morphDuration = 3000,
  style,
}: MorphingShapesProps) {
  const [shapes, setShapes] = useState<MorphingShape[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const speedMultiplier = {
    slow: 0.7,
    medium: 1,
    fast: 1.5,
  }[animationSpeed];

  useEffect(() => {
    createMorphingShapes();
    return () => {
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, [shapeCount, shapeTypes, colorPalette]);

  const createMorphingShapes = () => {
    const newShapes: MorphingShape[] = [];
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = createSingleShape(i.toString());
      newShapes.push(shape);
    }
    
    setShapes(newShapes);
    startAnimations(newShapes);
  };

  const createSingleShape = (id: string): MorphingShape => {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const shapeSize = 30 + Math.random() * 40;
    
    return {
      id,
      x: new Animated.Value(startX),
      y: new Animated.Value(startY),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.6 + Math.random() * 0.4),
      color: new Animated.Value(0),
      morphProgress: new Animated.Value(0),
      currentShape: 0,
      targetShape: 1,
      size: shapeSize,
    };
  };

  const startAnimations = (shapes: MorphingShape[]) => {
    animationsRef.current.forEach(animation => animation.stop());
    animationsRef.current = [];

    shapes.forEach((shape, index) => {
      // Floating movement
      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shape.y, {
            toValue: Math.random() * height,
            duration: (4000 + Math.random() * 2000) / speedMultiplier,
            useNativeDriver: false,
          }),
          Animated.timing(shape.x, {
            toValue: Math.random() * width,
            duration: (4000 + Math.random() * 2000) / speedMultiplier,
            useNativeDriver: false,
          }),
        ])
      );

      // Rotation animation
      const rotationAnimation = Animated.loop(
        Animated.timing(shape.rotation, {
          toValue: 360,
          duration: (8000 + Math.random() * 4000) / speedMultiplier,
          useNativeDriver: true,
        })
      );

      // Scale pulsing
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shape.scale, {
            toValue: 1.2,
            duration: (2000 + Math.random() * 1000) / speedMultiplier,
            useNativeDriver: true,
          }),
          Animated.timing(shape.scale, {
            toValue: 0.8,
            duration: (2000 + Math.random() * 1000) / speedMultiplier,
            useNativeDriver: true,
          }),
        ])
      );

      // Color cycling
      const colorAnimation = Animated.loop(
        Animated.timing(shape.color, {
          toValue: colorPalette.length - 1,
          duration: (6000 + Math.random() * 3000) / speedMultiplier,
          useNativeDriver: false,
        })
      );

      // Morphing animation
      const morphAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shape.morphProgress, {
            toValue: 1,
            duration: morphDuration / speedMultiplier,
            useNativeDriver: false,
          }),
          Animated.timing(shape.morphProgress, {
            toValue: 0,
            duration: morphDuration / speedMultiplier,
            useNativeDriver: false,
          }),
        ])
      );

      // Opacity breathing
      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shape.opacity, {
            toValue: 0.3,
            duration: (3000 + Math.random() * 2000) / speedMultiplier,
            useNativeDriver: true,
          }),
          Animated.timing(shape.opacity, {
            toValue: 0.9,
            duration: (3000 + Math.random() * 2000) / speedMultiplier,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations
      floatAnimation.start();
      rotationAnimation.start();
      scaleAnimation.start();
      colorAnimation.start();
      morphAnimation.start();
      opacityAnimation.start();

      animationsRef.current.push(
        floatAnimation,
        rotationAnimation,
        scaleAnimation,
        colorAnimation,
        morphAnimation,
        opacityAnimation
      );

      // Periodically change target shape for morphing
      const shapeChangeInterval = setInterval(() => {
        shape.currentShape = shape.targetShape;
        shape.targetShape = (shape.targetShape + 1) % shapeTypes.length;
      }, morphDuration / speedMultiplier);

      // Store interval for cleanup
      setTimeout(() => clearInterval(shapeChangeInterval), 60000); // Auto cleanup after 1 minute
    });
  };



  const renderShape = (shape: MorphingShape) => {
    const rotationDegrees = shape.rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    const currentColor = shape.color.interpolate({
      inputRange: colorPalette.map((_, index) => index),
      outputRange: colorPalette,
    });

    const currentShapeType = shapeTypes[shape.currentShape] || 'circle';
    const shapeStyle = getShapeStyle(currentShapeType, shape.size);

    return (
      <Animated.View
        key={shape.id}
        style={[
          styles.shapeContainer,
          {
            left: shape.x,
            top: shape.y,
            opacity: shape.opacity,
            transform: [
              { scale: shape.scale },
              { rotate: rotationDegrees },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.shape,
            shapeStyle,
            {
              width: shape.size,
              height: shape.size,
              backgroundColor: currentColor,
            },
          ]}
        >
          {currentShapeType === 'star' && (
            <Text style={[styles.shapeText, { fontSize: shape.size * 0.8 }]}>★</Text>
          )}
          {currentShapeType === 'heart' && (
            <Text style={[styles.shapeText, { fontSize: shape.size * 0.7 }]}>♥</Text>
          )}
        </Animated.View>
      </Animated.View>
    );
  };

  const getShapeStyle = (shapeType: string, size: number) => {
    const commonStyle = {
      width: size,
      height: size,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    switch (shapeType) {
      case 'circle':
        return {
          ...commonStyle,
          borderRadius: size / 2,
        };
      
      case 'square':
        return {
          ...commonStyle,
          borderRadius: 0,
        };
      
      case 'triangle':
        return {
          ...commonStyle,
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid' as const,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        };
      
      case 'hexagon':
        return {
          ...commonStyle,
          borderRadius: size * 0.1,
          transform: [{ rotate: '30deg' }],
        };
      
      case 'star':
      case 'heart':
        return {
          ...commonStyle,
          borderRadius: size * 0.1,
          backgroundColor: 'transparent',
        };
      
      default:
        return {
          ...commonStyle,
          borderRadius: size / 2,
        };
    }
  };

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {shapes.map(renderShape)}
    </View>
  );
}

// Specialized morphing shape components
export function FloatingGeometry({ count = 6 }: { count?: number }) {
  return (
    <MorphingShapes
      shapeCount={count}
      shapeTypes={['circle', 'square', 'triangle', 'hexagon']}
      animationSpeed="medium"
      morphDuration={4000}
    />
  );
}

export function MagicalStars({ count = 5 }: { count?: number }) {
  return (
    <MorphingShapes
      shapeCount={count}
      shapeTypes={['star', 'circle', 'hexagon']}
      colorPalette={['#FFD700', '#FF69B4', '#48D1CC', '#FFB6C1']}
      animationSpeed="slow"
      morphDuration={5000}
    />
  );
}

export function PlayfulShapes({ count = 10 }: { count?: number }) {
  return (
    <MorphingShapes
      shapeCount={count}
      shapeTypes={['circle', 'square', 'triangle', 'star', 'heart']}
      colorPalette={[COLORS.pastelMint, COLORS.pastelPeach, COLORS.pastelLavender, COLORS.pastelBlue]}
      animationSpeed="fast"
      morphDuration={2500}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -2,
    overflow: 'hidden',
  },
  shapeContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  shape: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shapeText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 
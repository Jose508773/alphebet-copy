import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS, FONTS, LETTER_EMOJI } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface FloatingElement {
  id: string;
  type: 'letter' | 'emoji' | 'shape' | 'bubble';
  content: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  speed: number;
  size: number;
  color: string;
}

interface FloatingElementsProps {
  elementCount?: number;
  elementTypes?: ('letter' | 'emoji' | 'shape' | 'bubble')[];
  animationSpeed?: 'slow' | 'medium' | 'fast';
  density?: 'sparse' | 'moderate' | 'dense';
  interactive?: boolean;
  style?: any;
}

export default function FloatingElements({
  elementCount = 15,
  elementTypes = ['letter', 'emoji', 'bubble'],
  animationSpeed = 'medium',
  density = 'moderate',
  interactive = false,
  style,
}: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const speedMultiplier = {
    slow: 0.5,
    medium: 1,
    fast: 1.8,
  }[animationSpeed];

  const densityCount = {
    sparse: Math.max(5, Math.floor(elementCount * 0.6)),
    moderate: elementCount,
    dense: Math.floor(elementCount * 1.4),
  }[density];

  useEffect(() => {
    createFloatingElements();
    return () => {
      // Cleanup animations
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, [densityCount, elementTypes]);

  const createFloatingElements = () => {
    const newElements: FloatingElement[] = [];
    
    for (let i = 0; i < densityCount; i++) {
      const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
      const element = createSingleElement(i.toString(), elementType);
      newElements.push(element);
    }
    
    setElements(newElements);
    startAnimations(newElements);
  };

  const createSingleElement = (id: string, type: FloatingElement['type']): FloatingElement => {
    const startX = Math.random() * width;
    const startY = height + Math.random() * 200; // Start below screen
    const initialScale = 0.8 + Math.random() * 0.4;
    const initialOpacity = 0.6 + Math.random() * 0.4;
    
    const element: FloatingElement = {
      id,
      type,
      content: getElementContent(type),
      x: new Animated.Value(startX),
      y: new Animated.Value(startY),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(initialScale),
      opacity: new Animated.Value(initialOpacity),
      speed: (3 + Math.random() * 4) * speedMultiplier,
      size: 15 + Math.random() * 25,
      color: getElementColor(type),
    };

    return element;
  };

  const getElementContent = (type: FloatingElement['type']): string => {
    switch (type) {
      case 'letter':
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[Math.floor(Math.random() * letters.length)];
      
      case 'emoji':
        const emojis = Object.values(LETTER_EMOJI);
        return emojis[Math.floor(Math.random() * emojis.length)];
      
      case 'shape':
        const shapes = ['●', '◆', '▲', '★', '♦', '♥', '♣', '♠'];
        return shapes[Math.floor(Math.random() * shapes.length)];
      
      case 'bubble':
        const bubbles = ['○', '◯', '⚬', '⚪', '🫧'];
        return bubbles[Math.floor(Math.random() * bubbles.length)];
      
      default:
        return '●';
    }
  };

  const getElementColor = (type: FloatingElement['type']): string => {
    const colorPalettes = {
      letter: [COLORS.primary, COLORS.accent, COLORS.brightBlue, COLORS.brightGreen, COLORS.brightPurple],
      emoji: ['#FFD700', '#FF69B4', '#48D1CC', '#FFB6C1', '#98FB98'],
      shape: [COLORS.pastelMint, COLORS.pastelPeach, COLORS.pastelLavender, COLORS.pastelBlue],
      bubble: ['rgba(173, 216, 230, 0.7)', 'rgba(255, 182, 193, 0.7)', 'rgba(152, 251, 152, 0.7)'],
    };

    const palette = colorPalettes[type];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const startAnimations = (elements: FloatingElement[]) => {
    // Clear previous animations
    animationsRef.current.forEach(animation => animation.stop());
    animationsRef.current = [];

    elements.forEach((element, index) => {
      // Get initial values for animations
      const baseX = Math.random() * width;
      const driftRange = 50 + Math.random() * 100;
      const driftDirection = Math.random() > 0.5 ? 1 : -1;
      const driftTarget = Math.max(0, Math.min(width, baseX + driftRange * driftDirection));
      
      // Floating upward animation
      const floatAnimation = Animated.loop(
        Animated.timing(element.y, {
          toValue: -100,
          duration: (8000 + Math.random() * 4000) / speedMultiplier,
          useNativeDriver: false,
        })
      );

      // Horizontal drift animation
      const driftAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(element.x, {
            toValue: driftTarget,
            duration: 4000 / speedMultiplier,
            useNativeDriver: false,
          }),
          Animated.timing(element.x, {
            toValue: baseX,
            duration: 4000 / speedMultiplier,
            useNativeDriver: false,
          }),
        ])
      );

      // Rotation animation
      const rotationAnimation = Animated.loop(
        Animated.timing(element.rotation, {
          toValue: 360,
          duration: (6000 + Math.random() * 6000) / speedMultiplier,
          useNativeDriver: true,
        })
      );

      // Scale pulsing animation (using simple values)
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(element.scale, {
            toValue: 1.2,
            duration: 2000 / speedMultiplier,
            useNativeDriver: true,
          }),
          Animated.timing(element.scale, {
            toValue: 0.8,
            duration: 2000 / speedMultiplier,
            useNativeDriver: true,
          }),
        ])
      );

      // Opacity breathing animation
      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(element.opacity, {
            toValue: 0.3,
            duration: 3000 / speedMultiplier,
            useNativeDriver: true,
          }),
          Animated.timing(element.opacity, {
            toValue: 0.9,
            duration: 3000 / speedMultiplier,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations
      floatAnimation.start();
      driftAnimation.start();
      rotationAnimation.start();
      scaleAnimation.start();
      opacityAnimation.start();

      animationsRef.current.push(floatAnimation, driftAnimation, rotationAnimation, scaleAnimation, opacityAnimation);

      // Reset element when it goes off screen (simplified)
      const resetElement = () => {
        element.x.setValue(Math.random() * width);
        element.y.setValue(height + Math.random() * 200);
      };

      // Set up listener with timeout fallback
      setTimeout(() => {
        resetElement();
      }, (8000 + Math.random() * 4000) / speedMultiplier);
    });
  };

  const renderElement = (element: FloatingElement) => {
    const rotationDegrees = element.rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={element.id}
        style={[
          styles.floatingElement,
          {
            left: element.x,
            top: element.y,
            opacity: element.opacity,
            transform: [
              { scale: element.scale },
              { rotate: rotationDegrees },
            ],
          },
        ]}
        pointerEvents={interactive ? 'auto' : 'none'}
      >
        {element.type === 'letter' ? (
          <Text
            style={[
              styles.letterText,
              {
                fontSize: element.size,
                color: element.color,
              },
            ]}
          >
            {element.content}
          </Text>
        ) : element.type === 'emoji' ? (
          <Text style={[styles.emojiText, { fontSize: element.size }]}>
            {element.content}
          </Text>
        ) : (
          <Text
            style={[
              styles.shapeText,
              {
                fontSize: element.size,
                color: element.color,
              },
            ]}
          >
            {element.content}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {elements.map(renderElement)}
    </View>
  );
}

// Specialized floating components
interface FloatingLettersProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'medium' | 'fast';
}

export function FloatingLetters({ count = 8, size = 'medium', speed = 'medium' }: FloatingLettersProps) {
  return (
    <FloatingElements
      elementCount={count}
      elementTypes={['letter']}
      animationSpeed={speed}
      density="moderate"
    />
  );
}

export function FloatingEmojis({ count = 6, speed = 'slow' }: { count?: number; speed?: 'slow' | 'medium' | 'fast' }) {
  return (
    <FloatingElements
      elementCount={count}
      elementTypes={['emoji']}
      animationSpeed={speed}
      density="sparse"
    />
  );
}

export function FloatingBubbles({ count = 12, speed = 'medium' }: { count?: number; speed?: 'slow' | 'medium' | 'fast' }) {
  return (
    <FloatingElements
      elementCount={count}
      elementTypes={['bubble']}
      animationSpeed={speed}
      density="dense"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    overflow: 'hidden',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  letterText: {
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emojiText: {
    textAlign: 'center',
  },
  shapeText: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
}); 
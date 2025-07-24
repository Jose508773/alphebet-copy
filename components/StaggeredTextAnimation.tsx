import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';

interface StaggeredTextAnimationProps {
  text: string;
  style?: TextStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'bounce' | 'typewriter' | 'wave' | 'spiral' | 'rainbow';
  staggerType?: 'letter' | 'word' | 'line';
  duration?: number;
  delay?: number;
  loop?: boolean;
  onAnimationComplete?: () => void;
}

export default function StaggeredTextAnimation({
  text,
  style,
  animationType = 'fadeIn',
  staggerType = 'letter',
  duration = 800,
  delay = 100,
  loop = false,
  onAnimationComplete,
}: StaggeredTextAnimationProps) {
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const [textSegments, setTextSegments] = useState<string[]>([]);

  useEffect(() => {
    // Split text based on stagger type
    let segments: string[] = [];
    switch (staggerType) {
      case 'letter':
        segments = text.split('');
        break;
      case 'word':
        segments = text.split(' ');
        break;
      case 'line':
        segments = text.split('\n');
        break;
    }

    setTextSegments(segments);
    
    // Create animated values for each segment
    const values = segments.map(() => new Animated.Value(0));
    setAnimatedValues(values);
  }, [text, staggerType]);

  useEffect(() => {
    if (animatedValues.length === 0) return;

    const animations = animatedValues.map((value, index) => {
      const animationDelay = delay * index;
      
      return Animated.timing(value, {
        toValue: 1,
        duration: duration,
        delay: animationDelay,
        useNativeDriver: true,
      });
    });

    const runAnimation = () => {
      // Reset values
      animatedValues.forEach(value => value.setValue(0));
      
      // Start staggered animations
      Animated.stagger(0, animations).start(() => {
        onAnimationComplete?.();
        if (loop) {
          setTimeout(runAnimation, 1000);
        }
      });
    };

    runAnimation();
  }, [animatedValues, duration, delay, loop, onAnimationComplete]);

  const getAnimationStyle = (animatedValue: Animated.Value, index: number) => {
    switch (animationType) {
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };
      
      case 'bounce':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.2, 1],
              }),
            },
          ],
        };
      
      case 'typewriter':
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [
            {
              scaleX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
              }),
            },
          ],
        };
      
      case 'wave':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, -10, 0],
              }),
            },
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0deg', '5deg', '0deg'],
              }),
            },
          ],
        };
      
      case 'spiral':
        return {
          opacity: animatedValue,
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.5, 1],
              }),
            },
          ],
        };
      
      case 'rainbow':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.1, 1],
              }),
            },
          ],
        };
      
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  const getRainbowColor = (animatedValue: Animated.Value, index: number) => {
    if (animationType !== 'rainbow') return style?.color || COLORS.primaryText;
    
    const colors = [
      '#FF6B6B', '#FFD166', '#34C759', '#4ECDC4', '#8B5CF6', '#FFB3C1'
    ];
    
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.primaryText, colors[index % colors.length]],
    });
  };

  const renderSegment = (segment: string, index: number) => {
    if (!animatedValues[index]) return null;

    const animatedValue = animatedValues[index];
    
    return (
      <Animated.Text
        key={`${segment}-${index}`}
        style={[
          styles.textSegment,
          style,
          getAnimationStyle(animatedValue, index),
          animationType === 'rainbow' && { color: getRainbowColor(animatedValue, index) },
        ]}
      >
        {segment}
        {staggerType === 'word' && index < textSegments.length - 1 ? ' ' : ''}
      </Animated.Text>
    );
  };

  return (
    <View style={styles.container}>
      {textSegments.map(renderSegment)}
    </View>
  );
}

// Multi-line staggered text component
interface MultiLineStaggeredTextProps {
  lines: string[];
  style?: TextStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'bounce' | 'typewriter' | 'wave' | 'spiral' | 'rainbow';
  lineDelay?: number;
  letterDelay?: number;
  onComplete?: () => void;
}

export function MultiLineStaggeredText({
  lines,
  style,
  animationType = 'fadeIn',
  lineDelay = 800,
  letterDelay = 50,
  onComplete,
}: MultiLineStaggeredTextProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState(0);

  useEffect(() => {
    if (completedLines === lines.length) {
      onComplete?.();
    }
  }, [completedLines, lines.length, onComplete]);

  const handleLineComplete = () => {
    setCompletedLines(prev => prev + 1);
    if (currentLine < lines.length - 1) {
      setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, lineDelay);
    }
  };

  return (
    <View style={styles.multiLineContainer}>
      {lines.map((line, index) => (
        <View key={index} style={styles.lineContainer}>
          {index <= currentLine && (
            <StaggeredTextAnimation
              text={line}
              style={style}
              animationType={animationType}
              staggerType="letter"
              delay={letterDelay}
              onAnimationComplete={index === currentLine ? handleLineComplete : undefined}
            />
          )}
        </View>
      ))}
    </View>
  );
}

// Advanced staggered text with custom timing patterns
interface AdvancedStaggeredTextProps {
  text: string;
  style?: TextStyle;
  pattern?: 'sequential' | 'reverse' | 'center-out' | 'random' | 'wave-pattern';
  animationType?: 'fadeIn' | 'slideUp' | 'bounce' | 'typewriter' | 'wave' | 'spiral' | 'rainbow';
  duration?: number;
  baseDelay?: number;
  onComplete?: () => void;
}

export function AdvancedStaggeredText({
  text,
  style,
  pattern = 'sequential',
  animationType = 'fadeIn',
  duration = 600,
  baseDelay = 80,
  onComplete,
}: AdvancedStaggeredTextProps) {
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const letters = text.split('');

  useEffect(() => {
    const values = letters.map(() => new Animated.Value(0));
    setAnimatedValues(values);
  }, [text]);

  useEffect(() => {
    if (animatedValues.length === 0) return;

    const getDelayPattern = () => {
      const totalLetters = letters.length;
      
      switch (pattern) {
        case 'sequential':
          return letters.map((_, index) => index * baseDelay);
        
        case 'reverse':
          return letters.map((_, index) => (totalLetters - 1 - index) * baseDelay);
        
        case 'center-out':
          return letters.map((_, index) => {
            const center = Math.floor(totalLetters / 2);
            const distance = Math.abs(index - center);
            return distance * baseDelay;
          });
        
        case 'random':
          return letters.map(() => Math.random() * (totalLetters * baseDelay));
        
        case 'wave-pattern':
          return letters.map((_, index) => {
            const wave = Math.sin((index / totalLetters) * Math.PI * 2) * baseDelay;
            return Math.abs(wave) + (index * baseDelay * 0.5);
          });
        
        default:
          return letters.map((_, index) => index * baseDelay);
      }
    };

    const delays = getDelayPattern();
    
    const animations = animatedValues.map((value, index) => 
      Animated.timing(value, {
        toValue: 1,
        duration: duration,
        delay: delays[index],
        useNativeDriver: true,
      })
    );

    // Reset values
    animatedValues.forEach(value => value.setValue(0));
    
    // Start animations
    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  }, [animatedValues, pattern, duration, baseDelay, onComplete]);

  const getAnimationStyle = (animatedValue: Animated.Value, index: number) => {
    switch (animationType) {
      case 'fadeIn':
        return { opacity: animatedValue };
      
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        };
      
      case 'bounce':
        return {
          opacity: animatedValue,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1.3, 1],
            }),
          }],
        };
      
      default:
        return { opacity: animatedValue };
    }
  };

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => (
        <Animated.Text
          key={`${letter}-${index}`}
          style={[
            styles.textSegment,
            style,
            getAnimationStyle(animatedValues[index] || new Animated.Value(0), index),
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  multiLineContainer: {
    alignItems: 'center',
  },
  lineContainer: {
    marginBottom: 10,
  },
  textSegment: {
    fontFamily: FONTS.body,
    fontSize: 18,
    color: COLORS.primaryText,
  },
}); 
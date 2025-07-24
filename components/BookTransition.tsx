import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface BookTransitionProps {
  isVisible: boolean;
  onTransitionComplete?: () => void;
  direction?: 'open' | 'close';
  duration?: number;
}

export default function BookTransition({ 
  isVisible, 
  onTransitionComplete, 
  direction = 'open',
  duration = 1000 
}: BookTransitionProps) {
  const leftPageAnim = useRef(new Animated.Value(direction === 'open' ? 0 : -180)).current;
  const rightPageAnim = useRef(new Animated.Value(direction === 'open' ? 0 : 180)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      // Start the book opening/closing animation
      const targetLeft = direction === 'open' ? -180 : 0;
      const targetRight = direction === 'open' ? 180 : 0;
      const targetOpacity = 1;
      const targetScale = 1;

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: targetOpacity,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(leftPageAnim, {
          toValue: targetLeft,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(rightPageAnim, {
          toValue: targetRight,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After animation completes, fade out and call completion callback
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
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
          styles.bookContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Book Spine */}
        <View style={styles.bookSpine} />
        
        {/* Left Page */}
        <Animated.View
          style={[
            styles.leftPage,
            {
              transform: [
                { perspective: 1000 },
                { rotateY: leftPageAnim.interpolate({
                  inputRange: [-180, 0],
                  outputRange: ['-180deg', '0deg'],
                }) },
              ],
            },
          ]}
        >
          <View style={styles.pageContent}>
            <View style={styles.pageLines} />
            <View style={[styles.pageLines, { top: 60 }]} />
            <View style={[styles.pageLines, { top: 120 }]} />
            <View style={[styles.pageLines, { top: 180 }]} />
          </View>
        </Animated.View>

        {/* Right Page */}
        <Animated.View
          style={[
            styles.rightPage,
            {
              transform: [
                { perspective: 1000 },
                { rotateY: rightPageAnim.interpolate({
                  inputRange: [0, 180],
                  outputRange: ['0deg', '180deg'],
                }) },
              ],
            },
          ]}
        >
          <View style={styles.pageContent}>
            <View style={styles.pageLines} />
            <View style={[styles.pageLines, { top: 60 }]} />
            <View style={[styles.pageLines, { top: 120 }]} />
            <View style={[styles.pageLines, { top: 180 }]} />
          </View>
        </Animated.View>

        {/* Book Cover Decorations */}
        <View style={styles.bookDecoration}>
          <View style={styles.decorativeBorder} />
          <View style={styles.titleArea}>
            <View style={styles.titleLine} />
            <View style={[styles.titleLine, { marginTop: 10, width: '60%' }]} />
          </View>
        </View>
      </Animated.View>

      {/* Background Overlay */}
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
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
    zIndex: 2000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    zIndex: -1,
  },
  bookContainer: {
    width: width * 0.7,
    height: height * 0.5,
    maxWidth: 400,
    maxHeight: 300,
    position: 'relative',
  },
  bookSpine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: COLORS.primaryText,
    marginLeft: -4,
    zIndex: 10,
    borderRadius: 4,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  leftPage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFEF7',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  rightPage: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFEF7',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  pageContent: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  pageLines: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 40,
    height: 2,
    backgroundColor: '#E8E8E8',
    borderRadius: 1,
  },
  bookDecoration: {
    position: 'absolute',
    top: 20,
    left: '25%',
    right: '25%',
    alignItems: 'center',
    zIndex: 5,
  },
  decorativeBorder: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginBottom: 15,
  },
  titleArea: {
    alignItems: 'center',
    width: '100%',
  },
  titleLine: {
    width: '80%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
}); 
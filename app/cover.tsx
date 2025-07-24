import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS } from '../constants/StyleGuide';
import LoadingWheel from '../components/LoadingWheel';
import BookTransition from '../components/BookTransition';
import PulsingButton from '../components/PulsingButton';
import { useAccessibility } from '../constants/AccessibilityContext';
import AnimatedBackground from '../components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function CoverScreen() {
  const { highContrast } = useAccessibility();
  const [isLoading, setIsLoading] = useState(true);
  const [showBookTransition, setShowBookTransition] = useState(false);
  const titleText = "Welcome to Alphabet Adventures!";
  const letterAnims = useRef(
    Array.from({ length: titleText.length }, () => new Animated.Value(0))
  ).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Fade in content after loading
      Animated.timing(contentOpacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      
      // Start letter animations
      const letterAnimations = letterAnims.slice(0, titleText.length).map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: 100 + index * 50,
          useNativeDriver: true,
        })
      );
      
      Animated.parallel(letterAnimations).start();
      
      // Start button pulse after letters finish
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(buttonPulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(buttonPulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1500);
      
    }, 2500); // 2.5 seconds loading

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleStartLearning = () => {
    setShowBookTransition(true);
  };

  const handleBookTransitionComplete = () => {
    setShowBookTransition(false);
    router.replace('/(tabs)');
  };

  const renderAnimatedTitle = () => {
    return (
      <View style={styles.animatedTitleContainer}>
        {titleText.split('').map((char, index) => {
          const animValue = letterAnims[index] || new Animated.Value(0);
          return (
            <Animated.Text
              key={index}
              style={[
                styles.animatedLetter,
                {
                  opacity: animValue,
                  transform: [{
                    translateY: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              {char === ' ' ? '\u00A0' : char}
            </Animated.Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      {/* Loading Wheel */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LoadingWheel size={250} visible={isLoading} />
          <Text style={styles.loadingText}>Loading Alphabet Adventures...</Text>
        </View>
      )}

      {/* Book Transition */}
      <BookTransition
        isVisible={showBookTransition}
        onTransitionComplete={handleBookTransitionComplete}
        direction="open"
        duration={1500}
      />
      
      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: contentOpacityAnim,
          }
        ]}
        pointerEvents={isLoading ? 'none' : 'auto'}
      >
        <View style={styles.titleSection}>
          <View style={[
            styles.titleContainer, 
            highContrast && styles.titleContainerHighContrast
          ]}>
            {renderAnimatedTitle()}
            <Text style={[
              styles.subtitle, 
              highContrast && styles.subtitleHighContrast
            ]}>
              🎓 Learn Your ABCs with Fun!
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <View style={[
            styles.descriptionCard,
            highContrast && styles.descriptionCardHighContrast
          ]}>
            <Text style={[
              styles.descriptionTitle,
              highContrast && styles.descriptionTitleHighContrast
            ]}>
              🌟 Interactive Learning Experience
            </Text>
            <Text style={[
              styles.descriptionText,
              highContrast && styles.descriptionTextHighContrast
            ]}>
              Discover letters through colorful animations, sounds, and interactive games designed to make learning the alphabet fun and engaging for young learners.
            </Text>
            
            <View style={styles.featuresContainer}>
              <Text style={[
                styles.featuresText,
                highContrast && styles.featuresTextHighContrast
              ]}>
                ✨ Colorful letter animations{'\n'}
                🔊 Audio pronunciation guide{'\n'}
                🎮 Interactive quiz mode{'\n'}
                🎨 Beautiful visual effects
              </Text>
            </View>
            
            <Text style={[
              styles.instructionText,
              highContrast && styles.instructionTextHighContrast
            ]}>
              Tap any letter to hear its sound and see fun animations!
            </Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <PulsingButton
            onPress={handleStartLearning}
            style={[
              styles.startButton,
              ...(highContrast ? [styles.startButtonHighContrast] : []),
            ]}
            pulseColor={COLORS.accent}
            pulseIntensity={0.4}
            pulseDuration={1800}
            accessibilityLabel="Start learning the alphabet"
          >
            <Text style={[
              styles.startButtonText,
              highContrast && styles.startButtonTextHighContrast
            ]}>
              🚀 Start Learning!
            </Text>
          </PulsingButton>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.heading,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  titleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    width: Math.min(width * 0.9, 400),
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titleContainerHighContrast: {
    backgroundColor: COLORS.highContrastBg,
    borderColor: COLORS.highContrastText,
    borderWidth: 2,
  },
  animatedTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  animatedLetter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.heading,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
  },
  subtitleHighContrast: {
    color: COLORS.highContrastText,
  },
  descriptionSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    width: Math.min(width * 0.9, 400),
    maxWidth: 400,
    minHeight: 300,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  descriptionCardHighContrast: {
    backgroundColor: COLORS.highContrastBg,
    borderColor: COLORS.highContrastText,
    borderWidth: 2,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: FONTS.heading,
  },
  descriptionTitleHighContrast: {
    color: COLORS.highContrastText,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: FONTS.body,
  },
  descriptionTextHighContrast: {
    color: COLORS.highContrastText,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 233, 244, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    minHeight: 120,
  },
  featuresText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.primaryText,
    textAlign: 'left',
    fontFamily: FONTS.body,
  },
  featuresTextHighContrast: {
    color: COLORS.highContrastText,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: FONTS.body,
  },
  instructionTextHighContrast: {
    color: COLORS.highContrastText,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonPressed: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 0.98 }],
  },
  startButtonHighContrast: {
    backgroundColor: COLORS.highContrastText,
    borderColor: COLORS.highContrastBg,
    borderWidth: 2,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONTS.heading,
  },
  startButtonTextHighContrast: {
    color: COLORS.highContrastBg,
  },
}); 
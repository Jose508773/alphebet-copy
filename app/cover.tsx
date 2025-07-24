import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS } from '../constants/StyleGuide';
import LoadingWheel from '../components/LoadingWheel';
import PulsingButton from '../components/PulsingButton';
import { useAccessibility } from '../constants/AccessibilityContext';
import AnimatedBackground from '../components/AnimatedBackground';
import StaggeredTextAnimation, { MultiLineStaggeredText, AdvancedStaggeredText } from '../components/StaggeredTextAnimation';
import FloatingElements, { FloatingLetters, FloatingEmojis, FloatingBubbles } from '../components/FloatingElements';
import MorphingShapes, { FloatingGeometry, MagicalStars, PlayfulShapes } from '../components/MorphingShapes';

const { width, height } = Dimensions.get('window');

export default function CoverScreen() {
  const { highContrast } = useAccessibility();
  const [isLoading, setIsLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
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
      
      // Trigger staggered text animations in sequence
      setTimeout(() => setShowTitle(true), 300);
      setTimeout(() => setShowSubtitle(true), 2200);
      setTimeout(() => setShowDescription(true), 3800);
      
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
    router.replace('/(tabs)');
  };

  const renderStaggeredContent = () => {
    return (
      <View style={styles.staggeredContentContainer}>
        {/* Main Title with Center-Out Bounce Animation */}
        {showTitle && (
          <AdvancedStaggeredText
            text={titleText}
            style={Object.assign({}, styles.animatedLetter, highContrast && styles.titleHighContrast)}
            pattern="center-out"
            animationType="bounce"
            duration={600}
            baseDelay={80}
          />
        )}
        
        {/* Subtitle with Wave Animation */}
        {showSubtitle && (
          <StaggeredTextAnimation
            text="🎓 Learn Your ABCs with Fun!"
            style={Object.assign({}, styles.subtitle, highContrast && styles.subtitleHighContrast)}
            animationType="wave"
            staggerType="word"
            duration={700}
            delay={150}
          />
        )}
        
        {/* Description with Typewriter Effect */}
        {showDescription && (
          <MultiLineStaggeredText
            lines={[
              "🌟 Interactive Learning",
              "🎵 Fun Sound Effects", 
              "🎨 Beautiful Animations",
              "🚀 Start Your Journey!"
            ]}
            style={Object.assign({}, styles.featuresText, highContrast && styles.featuresTextHighContrast)}
            animationType="typewriter"
            lineDelay={600}
            letterDelay={40}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      {/* Floating Elements */}
      <FloatingLetters count={6} speed="slow" />
      <FloatingEmojis count={4} speed="slow" />
      <FloatingBubbles count={8} speed="medium" />
      
      {/* Morphing Shapes */}
      <MagicalStars count={3} />
      <PlayfulShapes count={5} />
      
      {/* Loading Wheel */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LoadingWheel size={250} visible={isLoading} />
          <Text style={styles.loadingText}>Loading Alphabet Adventures...</Text>
        </View>
      )}


      
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
            {renderStaggeredContent()}
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
  staggeredContentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  titleHighContrast: {
    color: COLORS.highContrastText,
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
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS } from '../constants/StyleGuide';
import { useAccessibility } from '../constants/AccessibilityContext';
import AnimatedBackground from '../components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function CoverPage() {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const { highContrast } = useAccessibility();
  
  // Animation refs
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const cardHoverAnim = useRef(new Animated.Value(1)).current;
  const buttonHoverAnim = useRef(new Animated.Value(1)).current;
  
  // Letter-by-letter animation refs
  const letterAnims = useRef(
    Array.from({ length: 18 }, () => new Animated.Value(0))
  ).current; // "🎓 Alphabet Learning" has 18 characters

  // Start animations on mount
  useEffect(() => {
    // Main entrance animations
    const animations = [
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 1200,
        delay: 600,
        useNativeDriver: true,
      }),
    ];
    
    // Letter-by-letter staggered animation
    const letterAnimations = letterAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: 100 + index * 50, // Stagger each letter by 50ms
        useNativeDriver: true,
      })
    );
    
    // Floating animation (continuous)
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Button pulse animation (continuous)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    Animated.parallel([...animations, ...letterAnimations]).start();
    floatingAnimation.start();
    
    // Start pulse animation after initial animations
    setTimeout(() => {
      pulseAnimation.start();
    }, 1800);
  }, []);

  // Card hover effects
  useEffect(() => {
    Animated.spring(cardHoverAnim, {
      toValue: cardHovered ? 1.02 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [cardHovered]);

  // Button hover effects
  useEffect(() => {
    Animated.spring(buttonHoverAnim, {
      toValue: buttonHovered ? 1.05 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [buttonHovered]);

  const handleStartLearning = () => {
    setButtonPressed(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to the main app after animation
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 300);
  };

  // Render letters with staggered animation
  const renderAnimatedTitle = () => {
    const titleText = "🎓 Alphabet Learning";
    return (
      <View style={styles.animatedTitleContainer}>
        {titleText.split('').map((char, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.animatedLetter,
              {
                opacity: letterAnims[index],
                transform: [{
                  translateY: letterAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              },
            ]}
          >
            {char === ' ' ? '\u00A0' : char}
          </Animated.Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      {/* Enhanced Gradient Overlay */}
      <Animated.View 
        style={[
          styles.gradientOverlay,
          {
            transform: [{
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            }],
          },
        ]}
      />
      
      {/* Floating Elements */}
      <Animated.View
        style={[
          styles.floatingElement1,
          {
            transform: [{
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.floatingText}>📚</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingElement2,
          {
            transform: [{
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.floatingText}>✨</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingElement3,
          {
            transform: [{
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -25],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.floatingText}>🎵</Text>
      </Animated.View>
      
      <View style={styles.content}>
        {/* Main Title Section */}
        <View style={styles.titleSection}>
          <Animated.View 
            style={[
              styles.titleContainer,
              {
                opacity: titleAnim,
                transform: [{
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              },
            ]}
          >
            {renderAnimatedTitle()}
            <Animated.Text 
              style={[
                styles.subtitle,
                {
                  opacity: titleAnim,
                  transform: [{
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  }],
                },
              ]}
            >
              Interactive & Fun
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Enhanced Description Section */}
        <View style={styles.descriptionSection}>
          <Animated.View 
            style={[
              styles.descriptionCard,
              {
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                  {
                    scale: cardHoverAnim,
                  },
                ],
              },
            ]}

          >
            <Text style={styles.descriptionTitle}>Welcome to Your Learning Adventure!</Text>
            
            <Text style={styles.descriptionText}>
              Discover the magical world of letters through our interactive alphabet learning app. 
              Perfect for children and anyone eager to master the ABCs in a fun, engaging way.
            </Text>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresText}>
                ✨ Interactive letter buttons with voice pronunciation{'\n'}
                🎯 Quiz mode with voice-guided questions{'\n'}
                🎵 Story and song mode for complete learning{'\n'}
                🔊 Clear audio feedback and pronunciation{'\n'}
                🎨 Beautiful, colorful design that makes learning fun
              </Text>
            </View>
            
            <Text style={styles.instructionText}>
              Ready to start your alphabet journey? Click the button below to begin exploring all 26 letters!
            </Text>
          </Animated.View>
        </View>

        {/* Enhanced Start Learning Button */}
        <View style={styles.buttonSection}>
          <Animated.View
            style={[
              {
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: Animated.multiply(scaleAnim, Animated.multiply(pulseAnim, buttonHoverAnim)),
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={[
                styles.startButton,
                buttonPressed && styles.startButtonPressed,
                buttonHovered && styles.startButtonHovered
              ]}
              onPress={handleStartLearning}

              accessibilityLabel="Start learning the alphabet"
              accessibilityRole="button"
            >
              <View style={[
                styles.buttonGradient,
                buttonHovered && styles.buttonGradientHovered
              ]}>
                <Animated.Text style={[
                  styles.startButtonText,
                  buttonPressed && styles.startButtonTextPressed
                ]}>
                  🚀 Start Learning
                </Animated.Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastelMint,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    zIndex: 2,
  },
  floatingElement2: {
    position: 'absolute',
    top: '25%',
    left: '8%',
    zIndex: 2,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '30%',
    right: '15%',
    zIndex: 2,
  },
  floatingText: {
    fontSize: 40,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    zIndex: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,
    flex: 0.15,
    justifyContent: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  animatedTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  animatedLetter: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.heading,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  descriptionSection: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: '100%',
    maxWidth: 520,
  },
  descriptionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    marginBottom: 18,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    fontSize: 18,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
    lineHeight: 26,
    marginBottom: 20,
  },
  featuresContainer: {
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresText: {
    fontSize: 16,
    color: COLORS.primaryText,
    textAlign: 'left',
    fontFamily: FONTS.body,
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 17,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonSection: {
    alignItems: 'center',
    flex: 0.4,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  startButton: {
    borderRadius: 35,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 3,
    borderColor: COLORS.primary,
    minWidth: 320,
    overflow: 'hidden',
    transform: [{ scale: 1.05 }],
  },
  startButtonHovered: {
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  buttonGradient: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 70,
    paddingVertical: 28,
  },
  buttonGradientHovered: {
    backgroundColor: COLORS.brightGreen,
  },
  startButtonPressed: {
    backgroundColor: COLORS.brightGreen,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.heading,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  startButtonTextPressed: {
    color: COLORS.white,
  },
}); 
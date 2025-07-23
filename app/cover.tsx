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
  const { highContrast } = useAccessibility();
  
  // Animation refs
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Start animations on mount
  useEffect(() => {
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
    
    Animated.parallel(animations).start();
  }, []);

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

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />
      
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
            <Text style={styles.mainTitle}>🎓 Alphabet Learning</Text>
            <Text style={styles.subtitle}>Interactive & Fun</Text>
          </Animated.View>
        </View>

        {/* Single Description Section */}
        <View style={styles.descriptionSection}>
          <Animated.View 
            style={[
              styles.descriptionCard,
              {
                opacity: cardAnim,
                transform: [{
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                }],
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

        {/* Start Learning Button */}
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
                    scale: scaleAnim,
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={[
                styles.startButton,
                buttonPressed && styles.startButtonPressed
              ]}
              onPress={handleStartLearning}
              accessibilityLabel="Start learning the alphabet"
              accessibilityRole="button"
            >
              <View style={styles.buttonGradient}>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    zIndex: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
    flex: 0.2,
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
  mainTitle: {
    fontSize: 46,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 26,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  descriptionSection: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 30,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: '100%',
    maxWidth: 550,
  },
  descriptionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    marginBottom: 20,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    fontSize: 20,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
    lineHeight: 28,
    marginBottom: 25,
  },
  featuresContainer: {
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresText: {
    fontSize: 18,
    color: COLORS.primaryText,
    textAlign: 'left',
    fontFamily: FONTS.body,
    lineHeight: 26,
  },
  instructionText: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
    lineHeight: 24,
  },
  buttonSection: {
    alignItems: 'center',
    flex: 0.3,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  startButton: {
    borderRadius: 30,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
    minWidth: 300,
    overflow: 'hidden',
  },
  buttonGradient: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 60,
    paddingVertical: 25,
  },
  startButtonPressed: {
    backgroundColor: COLORS.brightGreen,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 28,
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
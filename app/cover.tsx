import React, { useState } from 'react';
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

  const handleStartLearning = () => {
    setButtonPressed(true);
    // Navigate to the main app after a brief animation
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
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>🎓 Alphabet Learning</Text>
            <Text style={styles.subtitle}>Interactive & Fun</Text>
          </View>
        </View>

        {/* Single Description Section */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionCard}>
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
          </View>
        </View>

        {/* Start Learning Button */}
        <View style={styles.buttonSection}>
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for learning
          </Text>
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
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 42,
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
    fontSize: 24,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  descriptionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    maxWidth: 500,
  },
  descriptionTitle: {
    fontSize: 28,
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
    fontSize: 18,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
    lineHeight: 26,
    marginBottom: 25,
  },
  featuresContainer: {
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featuresText: {
    fontSize: 16,
    color: COLORS.primaryText,
    textAlign: 'left',
    fontFamily: FONTS.body,
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonSection: {
    alignItems: 'center',
    marginTop: 30,
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
    minWidth: 280,
    overflow: 'hidden',
  },
  buttonGradient: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  startButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 26,
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
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
    opacity: 0.7,
  },
}); 
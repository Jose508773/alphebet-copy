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
      
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>🎓 Alphabet Learning</Text>
          <Text style={styles.subtitle}>Interactive & Fun</Text>
        </View>

        {/* App Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔤</Text>
            <Text style={styles.featureTitle}>Learn Letters</Text>
            <Text style={styles.featureDescription}>
              Explore all 26 letters with interactive buttons and voice pronunciation
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureTitle}>Quiz Mode</Text>
            <Text style={styles.featureDescription}>
              Test your knowledge with voice-guided quizzes and multiple choice answers
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎵</Text>
            <Text style={styles.featureTitle}>Story & Song</Text>
            <Text style={styles.featureDescription}>
              Enjoy alphabet stories and songs for a complete learning experience
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔊</Text>
            <Text style={styles.featureTitle}>Voice Learning</Text>
            <Text style={styles.featureDescription}>
              Clear pronunciation and audio feedback for better understanding
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
            <Animated.Text style={[
              styles.startButtonText,
              buttonPressed && styles.startButtonTextPressed
            ]}>
              🚀 Start Learning
            </Animated.Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 36,
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
    fontSize: 20,
    color: COLORS.secondary,
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontWeight: '600',
  },
  descriptionSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.heading,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: FONTS.body,
    lineHeight: 20,
  },
  buttonSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
    minWidth: 200,
  },
  startButtonPressed: {
    backgroundColor: COLORS.brightGreen,
    transform: [{ scale: 0.95 }],
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 24,
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
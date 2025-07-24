import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, Modal, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Animated } from 'react-native';
import { router } from 'expo-router';
import LetterDetailPopup from '../../components/LetterDetailPopup';
import { PracticeMode } from '../../components/PracticeMode';
import { StorySongMode } from '../../components/StorySongMode';
import { useAccessibility } from '../../constants/AccessibilityContext';
import { COLORS, RAINBOW, FONTS, LETTER_EMOJI } from '../../constants/StyleGuide';
import AnimatedBackground from '../../components/AnimatedBackground';
import BookTransition from '../../components/BookTransition';
import LetterPreview from '../../components/LetterPreview';
import { speechUtils } from '../../utils/SpeechUtils';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const NUM_COLUMNS = 5;
const BUTTON_SIZE = 90; // Larger, more playful

export default function LetterGridScreen() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [storySongMode, setStorySongMode] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [pressedLetter, setPressedLetter] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    opacity: Animated.Value;
    scale: Animated.Value;
    translateX: Animated.Value;
    translateY: Animated.Value;
  }>>([]);
  const { captions, setCaptions, highContrast, setHighContrast, volume, setVolume } = useAccessibility();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [showBookTransition, setShowBookTransition] = useState(false);
  const [pendingLetter, setPendingLetter] = useState<string | null>(null);
  const [previewLetter, setPreviewLetter] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);

  // Animation refs for each letter's effects
  const wobbleAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const glowAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const colorWaveAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const rotationXAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const rotationYAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const hoverScaleAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(1);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const hoverGlowAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const hoverBorderAnims = useRef(
    LETTERS.reduce((acc, letter) => {
      acc[letter] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const handleLetterPress = (letter: string) => {
    // Trigger book transition first
    setPendingLetter(letter);
    setShowBookTransition(true);
    
    // Speak the letter when pressed
    speechUtils.speakLetter(letter);
    // Create particle burst effect
    const letterIndex = LETTERS.indexOf(letter);
    createParticleBurst(letterIndex);
  };

  const handleBookTransitionComplete = () => {
    setShowBookTransition(false);
    setSelectedLetter(pendingLetter);
    setPopupVisible(true);
    setPendingLetter(null);
  };

  // Wobble animation functions
  const startWobble = (letter: string) => {
    setHoveredLetter(letter);
    Animated.loop(
      Animated.sequence([
        Animated.timing(wobbleAnims[letter], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnims[letter], {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnims[letter], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnims[letter], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopWobble = (letter: string) => {
    setHoveredLetter(null);
    wobbleAnims[letter].stopAnimation();
    Animated.timing(wobbleAnims[letter], {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = (letter: string) => {
    setPressedLetter(letter);
    startGlow(letter);
    startColorWave(letter);
  };

  const handlePressOut = (letter: string) => {
    setPressedLetter(null);
    stopGlow(letter);
    stopColorWave(letter);
  };

  // Glow animation functions
  const startGlow = (letter: string) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnims[letter], {
          toValue: 1,
          duration: 500,
          useNativeDriver: false, // Can't use native driver for shadow effects
        }),
        Animated.timing(glowAnims[letter], {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopGlow = (letter: string) => {
    glowAnims[letter].stopAnimation();
    Animated.timing(glowAnims[letter], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Color wave animation functions
  const startColorWave = (letter: string) => {
    // Reset to start
    colorWaveAnims[letter].setValue(0);
    
    Animated.timing(colorWaveAnims[letter], {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false, // Can't use native driver for color interpolation
    }).start();
  };

  const stopColorWave = (letter: string) => {
    colorWaveAnims[letter].stopAnimation();
    colorWaveAnims[letter].setValue(0);
  };

  // 3D Rotation animation functions
  const start3DRotation = (letter: string) => {
    // X-axis rotation (tilt forward/backward)
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotationXAnims[letter], {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotationXAnims[letter], {
          toValue: -1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotationXAnims[letter], {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Y-axis rotation (turn left/right)
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotationYAnims[letter], {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(rotationYAnims[letter], {
          toValue: -1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(rotationYAnims[letter], {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stop3DRotation = (letter: string) => {
    rotationXAnims[letter].stopAnimation();
    rotationYAnims[letter].stopAnimation();
    
    // Return to original position
    Animated.parallel([
      Animated.timing(rotationXAnims[letter], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotationYAnims[letter], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hover effects functions
  const startHoverEffects = (letter: string) => {
    // Scale animation
    Animated.spring(hoverScaleAnims[letter], {
      toValue: 1.1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();

    // Glow animation
    Animated.timing(hoverGlowAnims[letter], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false, // Can't use native driver for shadow properties
    }).start();

    // Border animation
    Animated.timing(hoverBorderAnims[letter], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Can't use native driver for border properties
    }).start();
  };

  const stopHoverEffects = (letter: string) => {
    // Scale animation
    Animated.spring(hoverScaleAnims[letter], {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();

    // Glow animation
    Animated.timing(hoverGlowAnims[letter], {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Border animation
    Animated.timing(hoverBorderAnims[letter], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Enhanced letter press handlers
  const handleLetterHoverIn = (letter: string, event?: any) => {
    setHoveredLetter(letter);
    startHoverEffects(letter);
    
    // Show preview with position
    if (event?.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      setPreviewPosition({ x: pageX, y: pageY });
      setPreviewLetter(letter);
      setShowPreview(true);
    }
  };

  const handleLetterHoverOut = (letter: string) => {
    if (hoveredLetter === letter) {
      setHoveredLetter(null);
    }
    stopHoverEffects(letter);
    
    // Hide preview
    setShowPreview(false);
    setTimeout(() => {
      setPreviewLetter(null);
    }, 150);
  };

  // Function to get interpolated rainbow color
  const getRainbowColor = (progress: Animated.Value, index: number) => {
    const colors = [
      '#FFFFFF', // White (default)
      '#FF6B6B', // Red
      '#FF8E53', // Orange  
      '#FFD93D', // Yellow
      '#6BCF7F', // Green
      '#4ECDC4', // Cyan
      '#45B7D1', // Blue
      '#9B59B6', // Purple
      '#FFFFFF', // White (back to default)
    ];
    
    return progress.interpolate({
      inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
      outputRange: [
        colors[0], // White
        colors[(index % 7) + 1], // Start with letter's rainbow color
        colors[((index + 1) % 7) + 1],
        colors[((index + 2) % 7) + 1],
        colors[((index + 3) % 7) + 1],
        colors[((index + 4) % 7) + 1],
        colors[((index + 5) % 7) + 1],
        colors[((index + 6) % 7) + 1],
        colors[8], // Back to white
      ],
    });
  };

  // Particle burst animation functions
  const createParticleBurst = (letterIndex: number) => {
    const newParticles: Array<{
      id: string;
      x: number;
      y: number;
      opacity: Animated.Value;
      scale: Animated.Value;
      translateX: Animated.Value;
      translateY: Animated.Value;
    }> = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI;
      const distance = 50 + Math.random() * 30;
      
      const particle = {
        id: `${letterIndex}-${i}-${Date.now()}`,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
      };
      
      newParticles.push(particle);
      
      // Animate particle
      Animated.parallel([
        Animated.timing(particle.translateX, {
          toValue: particle.x,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: particle.y,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 800);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedLetter(null);
  };

  const handleNextLetter = () => {
    if (selectedLetter) {
      const currentIndex = LETTERS.indexOf(selectedLetter);
      const nextIndex = (currentIndex + 1) % LETTERS.length;
      const nextLetter = LETTERS[nextIndex];
      setSelectedLetter(nextLetter);
      speechUtils.speakLetter(nextLetter);
    }
  };

  const handlePreviousLetter = () => {
    if (selectedLetter) {
      const currentIndex = LETTERS.indexOf(selectedLetter);
      const prevIndex = currentIndex === 0 ? LETTERS.length - 1 : currentIndex - 1;
      const prevLetter = LETTERS[prevIndex];
      setSelectedLetter(prevLetter);
      speechUtils.speakLetter(prevLetter);
    }
  };

  const handleStartPractice = () => {
    setPracticeMode(true);
    speechUtils.speakPracticeInstructions();
  };

  const handleExitPractice = () => {
    setPracticeMode(false);
  };

  const handleStartStorySong = () => {
    setStorySongMode(true);
    speechUtils.speakStoryIntroduction();
  };
  const handleExitStorySong = () => {
    setStorySongMode(false);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Animated.View
      style={{
        transform: [
          { perspective: 1000 },
          { scale: hoverScaleAnims[item] },
          {
            rotateX: rotationXAnims[item].interpolate({
              inputRange: [-1, 1],
              outputRange: ['-15deg', '15deg'],
            }),
          },
          {
            rotateY: rotationYAnims[item].interpolate({
              inputRange: [-1, 1],
              outputRange: ['-20deg', '20deg'],
            }),
          },
          {
            rotate: wobbleAnims[item].interpolate({
              inputRange: [-1, 1],
              outputRange: ['-3deg', '3deg'],
            }),
          },
        ],
      }}
    >
      <Animated.View
        style={[
          styles.glowContainer,
          {
            shadowOpacity: Animated.add(
              glowAnims[item].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
              hoverGlowAnims[item].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              })
            ),
            shadowRadius: Animated.add(
              glowAnims[item].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }),
              hoverGlowAnims[item].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              })
            ),
          },
        ]}
      >
        <Animated.View style={[
          styles.letterButton,
          { 
            backgroundColor: RAINBOW[index % RAINBOW.length],
            borderWidth: hoverBorderAnims[item].interpolate({
              inputRange: [0, 1],
              outputRange: [2, 4],
            }),
            borderColor: hoverBorderAnims[item].interpolate({
              inputRange: [0, 1],
              outputRange: [COLORS.white, COLORS.accent],
            }),
          },
          highContrast && styles.letterButtonHighContrast,
        ]}>
          <Pressable
            style={[styles.pressableArea]}
            accessibilityLabel={`Letter ${item}`}
            accessibilityRole="button"
            onPress={() => handleLetterPress(item)}
            onPressIn={() => {
              handlePressIn(item);
              startWobble(item);
              startGlow(item);
              startColorWave(item);
              start3DRotation(item);
            }}
            onPressOut={() => {
              handlePressOut(item);
              stopWobble(item);
              stopGlow(item);
              stopColorWave(item);
              stop3DRotation(item);
            }}
            onHoverIn={(event) => handleLetterHoverIn(item, event)}
            onHoverOut={() => handleLetterHoverOut(item)}
          >
          <Text style={styles.letterEmoji}>{LETTER_EMOJI[item]}</Text>
          <View style={styles.letterContainer}>
            <Animated.Text 
              style={[
                styles.letterText,
                {
                  color: getRainbowColor(colorWaveAnims[item], index),
                },
              ]}
            >
              {item}
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.letterTextLowercase,
                {
                  color: getRainbowColor(colorWaveAnims[item], index + 3),
                },
              ]}
            >
              {item.toLowerCase()}
            </Animated.Text>
          </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );

  if (practiceMode) {
    return <PracticeMode onHome={handleExitPractice} />;
  }
  if (storySongMode) {
    return <StorySongMode onHome={handleExitStorySong} />;
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/cover')}
          accessibilityLabel="Back to cover page"
        >
          <Text style={styles.backButtonText}>🏠 Home</Text>
        </Pressable>
      </View>
      {/* Fun confetti background */}
      <View style={styles.confettiBg} pointerEvents="none" />
      
      {/* Particle effects container */}
      <View style={styles.particleContainer} pointerEvents="none">
        {particles.map((particle) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale },
                ],
              },
            ]}
          >
            <Text style={styles.particleText}>✨</Text>
          </Animated.View>
        ))}
      </View>
      <Animated.FlatList
        data={LETTERS}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.gridContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
          { useNativeDriver: true }
        )}
      />
      <Pressable style={styles.practiceButton} onPress={handleStartPractice} accessibilityLabel="Start Practice Mode">
        <Text style={styles.practiceButtonText}>Practice Mode</Text>
      </Pressable>
      <Pressable style={styles.storySongButton} onPress={handleStartStorySong} accessibilityLabel="Start Story/Song Mode">
        <Text style={styles.storySongButtonText}>Story/Song Mode</Text>
      </Pressable>
      <Pressable
        style={styles.accessibilityButton}
        onPress={() => setSettingsVisible(true)}
        accessibilityLabel="Accessibility and Settings"
      >
        <Text style={styles.accessibilityIcon}>⚙️</Text>
      </Pressable>
      <Modal visible={settingsVisible} transparent animationType="fade">
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsModal}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Captions</Text>
              <Switch value={captions} onValueChange={setCaptions} />
            </View>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>High Contrast</Text>
              <Switch value={highContrast} onValueChange={setHighContrast} />
            </View>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Volume</Text>
              <Slider
                style={{ width: 120 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={setVolume}
                minimumTrackTintColor="#FF6F61"
                maximumTrackTintColor="#222"
              />
            </View>
            <Pressable style={styles.closeSettingsButton} onPress={() => setSettingsVisible(false)}>
              <Text style={styles.closeSettingsText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Book Transition */}
      <BookTransition
        isVisible={showBookTransition}
        onTransitionComplete={handleBookTransitionComplete}
        direction="open"
        duration={1200}
      />

      <LetterDetailPopup
        visible={popupVisible}
        letter={selectedLetter || ''}
        onClose={handleClosePopup}
        onNext={handleNextLetter}
        onPrevious={handlePreviousLetter}
        canGoNext={true}
        canGoPrevious={true}
      />

      {/* Letter Preview */}
      <LetterPreview
        letter={previewLetter}
        position={previewPosition}
        isVisible={showPreview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    overflow: 'hidden',
  },
  confettiBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    opacity: 0.12,
    backgroundImage: 'repeating-linear-gradient(135deg, #FFD54F 0 10px, #FF80AB 10px 20px, #6EC6FF 20px 30px, #B388FF 30px 40px, #A7FFEB 40px 50px)',
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  letterButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    borderWidth: 3,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    transform: [{ scale: 1 }],
  },
  pressableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterButtonPressed: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  letterButtonHighContrast: {
    backgroundColor: COLORS.highContrastBg,
    borderColor: COLORS.highContrastText,
  },
  letterText: {
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 8,
    padding: 6,
    marginBottom: 2,
  },
  letterEmoji: {
    fontSize: 32,
    color: COLORS.brightPurple,
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  letterContainer: {
    alignItems: 'center',
  },
  glowContainer: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  particleText: {
    fontSize: 16,
    color: COLORS.accent,
  },
  letterTextLowercase: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    backgroundColor: COLORS.pastelMint,
    borderRadius: 6,
    padding: 4,
    opacity: 0.9,
  },
  practiceButton: {
    backgroundColor: '#6EC6FF',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  practiceButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif',
    letterSpacing: 1,
  },
  storySongButton: {
    backgroundColor: '#A7FFEB',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  storySongButtonText: {
    color: '#222',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif',
    letterSpacing: 1,
  },
  accessibilityButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  accessibilityIcon: {
    fontSize: 28,
    color: '#222',
  },
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    flex: 1,
    backgroundColor: COLORS.pastelMint,
    padding: 20,
    borderRadius: 20,
    margin: 20,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  settingsLabel: {
    fontSize: 18,
    color: '#222',
  },
  closeSettingsButton: {
    marginTop: 18,
    backgroundColor: '#FF6F61',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeSettingsText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
  },
  highContrastBg: {
    backgroundColor: '#000',
  },
});

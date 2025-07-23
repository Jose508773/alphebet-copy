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
import { speechUtils } from '../../utils/SpeechUtils';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const NUM_COLUMNS = 5;
const BUTTON_SIZE = 90; // Larger, more playful

export default function LetterGridScreen() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [storySongMode, setStorySongMode] = useState(false);
  const { captions, setCaptions, highContrast, setHighContrast, volume, setVolume } = useAccessibility();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter);
    setPopupVisible(true);
    // Speak the letter when pressed
    speechUtils.speakLetter(letter);
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
    <Pressable
      style={({ pressed }) => [
        styles.letterButton,
        { backgroundColor: RAINBOW[index % RAINBOW.length], borderColor: COLORS.white },
        pressed && styles.letterButtonPressed,
        highContrast && styles.letterButtonHighContrast,
      ]}
      accessibilityLabel={`Letter ${item}`}
      accessibilityRole="button"
      onPress={() => handleLetterPress(item)}
    >
      <Text style={styles.letterEmoji}>{LETTER_EMOJI[item]}</Text>
      <Text style={styles.letterText}>{item}</Text>
    </Pressable>
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
      <LetterDetailPopup
        visible={popupVisible}
        letter={selectedLetter || ''}
        onClose={handleClosePopup}
        onNext={handleNextLetter}
        onPrevious={handlePreviousLetter}
        canGoNext={true}
        canGoPrevious={true}
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
  letterButtonPressed: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  letterButtonHighContrast: {
    backgroundColor: COLORS.highContrastBg,
    borderColor: COLORS.highContrastText,
  },
  letterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 10,
    padding: 8,
  },
  letterEmoji: {
    fontSize: 40,
    color: COLORS.brightPurple,
    marginTop: 12,
    textShadowColor: COLORS.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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

import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/StyleGuide';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import DepthTransition from '../../components/DepthTransition';
import PerspectiveNavigation from '../../components/PerspectiveNavigation';
import CardStackShuffle from '../../components/CardStackShuffle';
import EnhancedGradientBackground from '../../components/EnhancedGradientBackground';
import { ComplementaryColorPalette, DynamicColorProvider } from '../../components/ComplementaryColorSystem';
import { useAccessibility } from '../../constants/AccessibilityContext';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const { highContrast } = useAccessibility();
  const [showDepthTransition, setShowDepthTransition] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [showPerspectiveNav, setShowPerspectiveNav] = useState(false);
  const [perspectiveType, setPerspectiveType] = useState<'zoom' | 'rotate' | 'flip' | 'cube'>('zoom');
  const [showCardShuffle, setShowCardShuffle] = useState(false);
  const [shuffleType, setShuffleType] = useState<'riffle' | 'overhand' | 'fan' | 'cascade'>('riffle');
  const [showEnhancedGradient, setShowEnhancedGradient] = useState(false);
  const [gradientIntensity, setGradientIntensity] = useState<'subtle' | 'medium' | 'vibrant'>('medium');
  const [gradientType, setGradientType] = useState<'radial' | 'linear' | 'diagonal' | 'spiral'>('radial');
  const [showComplementaryColors, setShowComplementaryColors] = useState(false);
  const [baseColor, setBaseColor] = useState('#FF69B4');
  const [colorScheme, setColorScheme] = useState<'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'monochromatic'>('complementary');

  const handleDepthTransitionComplete = () => {
    setShowDepthTransition(false);
  };

  const handlePerspectiveNavComplete = () => {
    setShowPerspectiveNav(false);
  };

  const handleCardShuffleComplete = () => {
    setShowCardShuffle(false);
  };

  const triggerDepthTransition = (direction: 'forward' | 'backward') => {
    setTransitionDirection(direction);
    setShowDepthTransition(true);
  };

  const triggerPerspectiveNav = (type: 'zoom' | 'rotate' | 'flip' | 'cube') => {
    setPerspectiveType(type);
    setShowPerspectiveNav(true);
  };

  const triggerCardShuffle = (type: 'riffle' | 'overhand' | 'fan' | 'cascade') => {
    setShuffleType(type);
    setShowCardShuffle(true);
  };

      return (
      <>
        {/* Enhanced Gradient Background */}
        {showEnhancedGradient && (
          <EnhancedGradientBackground
            intensity={gradientIntensity}
            type={gradientType}
            speed="medium"
            style={{ zIndex: -1 }}
          />
        )}
        
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={<IconSymbol size={310} color="#808080" name="chevron.left.forwardslash.chevron.right" style={styles.headerImage} />}>
        
        {/* Depth Transition Demo Section */}
        <ThemedView style={styles.depthDemoContainer}>
          <ThemedText type="title" style={styles.demoTitle}>🌊 Depth Transition Demo</ThemedText>
          <ThemedText style={styles.demoDescription}>
            Experience layered animations with different depth levels and parallax effects!
          </ThemedText>
          
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.demoButton, styles.forwardButton]}
              onPress={() => triggerDepthTransition('forward')}
            >
              <Text style={styles.buttonText}>▶️ Forward Transition</Text>
            </Pressable>
            
            <Pressable
              style={[styles.demoButton, styles.backwardButton]}
              onPress={() => triggerDepthTransition('backward')}
            >
              <Text style={[styles.buttonText, styles.backwardButtonText]}>◀️ Backward Transition</Text>
            </Pressable>
          </View>
          
          <ThemedText style={styles.demoInfo}>
            • 5 depth layers with different speeds{'\n'}
            • Parallax movement effects{'\n'}
            • Staggered animation timing{'\n'}
            • Dynamic element scaling
          </ThemedText>
        </ThemedView>

        {/* Perspective Navigation Demo Section */}
        <ThemedView style={styles.perspectiveDemoContainer}>
          <ThemedText type="title" style={styles.demoTitle}>🎯 Perspective Navigation Demo</ThemedText>
          <ThemedText style={styles.demoDescription}>
            Dramatic perspective changes with 3D rotations and zoom effects!
          </ThemedText>
          
          <View style={styles.perspectiveButtonContainer}>
            <Pressable
              style={[styles.perspectiveButton, styles.zoomButton]}
              onPress={() => triggerPerspectiveNav('zoom')}
            >
              <Text style={styles.perspectiveButtonText}>🔍 Zoom</Text>
            </Pressable>
            
            <Pressable
              style={[styles.perspectiveButton, styles.rotateButton]}
              onPress={() => triggerPerspectiveNav('rotate')}
            >
              <Text style={styles.perspectiveButtonText}>🔄 Rotate</Text>
            </Pressable>
            
            <Pressable
              style={[styles.perspectiveButton, styles.flipButton]}
              onPress={() => triggerPerspectiveNav('flip')}
            >
              <Text style={styles.perspectiveButtonText}>🔃 Flip</Text>
            </Pressable>
            
            <Pressable
              style={[styles.perspectiveButton, styles.cubeButton]}
              onPress={() => triggerPerspectiveNav('cube')}
            >
              <Text style={styles.perspectiveButtonText}>📦 Cube</Text>
            </Pressable>
          </View>
          
          <ThemedText style={styles.demoInfo}>
            • 3D perspective transformations{'\n'}
            • Multiple animation types{'\n'}
            • Dramatic visual effects{'\n'}
            • Smooth transition sequences
          </ThemedText>
        </ThemedView>

        {/* Card Stack Shuffle Demo Section */}
        <ThemedView style={styles.shuffleDemoContainer}>
          <ThemedText type="title" style={styles.demoTitle}>🃏 Card Stack Shuffle Demo</ThemedText>
          <ThemedText style={styles.demoDescription}>
            Professional card shuffling animations with realistic physics!
          </ThemedText>
          
          <View style={styles.shuffleButtonContainer}>
            <Pressable
              style={[styles.shuffleButton, styles.riffleButton]}
              onPress={() => triggerCardShuffle('riffle')}
            >
              <Text style={styles.shuffleButtonText}>🔄 Riffle</Text>
            </Pressable>
            
            <Pressable
              style={[styles.shuffleButton, styles.overhandButton]}
              onPress={() => triggerCardShuffle('overhand')}
            >
              <Text style={styles.shuffleButtonText}>🖐️ Overhand</Text>
            </Pressable>
            
            <Pressable
              style={[styles.shuffleButton, styles.fanButton]}
              onPress={() => triggerCardShuffle('fan')}
            >
              <Text style={styles.shuffleButtonText}>🌊 Fan</Text>
            </Pressable>
            
            <Pressable
              style={[styles.shuffleButton, styles.cascadeButton]}
              onPress={() => triggerCardShuffle('cascade')}
            >
              <Text style={styles.shuffleButtonText}>🌪️ Cascade</Text>
            </Pressable>
          </View>
          
          <ThemedText style={styles.demoInfo}>
            • Realistic card physics{'\n'}
            • Multiple shuffle techniques{'\n'}
            • 3D depth and rotation{'\n'}
            • Staggered timing effects
          </ThemedText>
        </ThemedView>

        {/* Enhanced Gradient Demo Section */}
        <ThemedView style={styles.gradientDemoContainer}>
          <ThemedText type="title" style={styles.demoTitle}>🌈 Enhanced Gradient Demo</ThemedText>
          <ThemedText style={styles.demoDescription}>
            Experience multi-layered animated gradients with different patterns!
          </ThemedText>
          
          <View style={styles.gradientControlsContainer}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Intensity:</Text>
              <View style={styles.controlButtons}>
                {(['subtle', 'medium', 'vibrant'] as const).map((intensity) => (
                  <Pressable
                    key={intensity}
                    style={[
                      styles.controlButton,
                      gradientIntensity === intensity && styles.controlButtonActive,
                    ]}
                    onPress={() => setGradientIntensity(intensity)}
                  >
                    <Text style={styles.controlButtonText}>{intensity}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Type:</Text>
              <View style={styles.controlButtons}>
                {(['radial', 'spiral', 'diagonal', 'linear'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.controlButton,
                      gradientType === type && styles.controlButtonActive,
                    ]}
                    onPress={() => setGradientType(type)}
                  >
                    <Text style={styles.controlButtonText}>{type}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
          
          <Pressable
            style={styles.gradientToggleButton}
            onPress={() => setShowEnhancedGradient(!showEnhancedGradient)}
          >
            <Text style={styles.gradientToggleText}>
              {showEnhancedGradient ? '🚫 Hide Gradient' : '✨ Show Gradient'}
            </Text>
          </Pressable>
          
          <ThemedText style={styles.demoInfo}>
            • Multi-layer color cycling{'\n'}
            • Dynamic transformations{'\n'}
            • Customizable intensity{'\n'}
            • Multiple pattern types
          </ThemedText>
        </ThemedView>

        {/* Complementary Color System Demo */}
        <ThemedView style={styles.colorDemoContainer}>
          <ThemedText type="title" style={styles.demoTitle}>🎨 Complementary Color Theory</ThemedText>
          <ThemedText style={styles.demoDescription}>
            Experience scientifically harmonious color combinations!
          </ThemedText>
          
          <View style={styles.colorControlsContainer}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Base Color:</Text>
              <View style={styles.controlButtons}>
                {[
                  { color: '#FF69B4', name: 'Hot Pink' },
                  { color: '#48D1CC', name: 'Turquoise' },
                  { color: '#FFD700', name: 'Gold' },
                  { color: '#8B5CF6', name: 'Purple' },
                  { color: '#34C759', name: 'Green' },
                ].map(({ color, name }) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      baseColor === color && styles.colorButtonActive,
                    ]}
                    onPress={() => setBaseColor(color)}
                  >
                    <Text style={styles.colorButtonText}>{name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Color Harmony:</Text>
              <View style={styles.controlButtons}>
                {([
                  { scheme: 'complementary', name: 'Complementary' },
                  { scheme: 'triadic', name: 'Triadic' },
                  { scheme: 'analogous', name: 'Analogous' },
                  { scheme: 'split-complementary', name: 'Split-Comp' },
                  { scheme: 'monochromatic', name: 'Monochromatic' },
                ] as const).map(({ scheme, name }) => (
                  <Pressable
                    key={scheme}
                    style={[
                      styles.controlButton,
                      colorScheme === scheme && styles.controlButtonActive,
                    ]}
                    onPress={() => setColorScheme(scheme)}
                  >
                    <Text style={styles.controlButtonText}>{name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
          
          <Pressable
            style={styles.colorToggleButton}
            onPress={() => setShowComplementaryColors(!showComplementaryColors)}
          >
            <Text style={styles.colorToggleText}>
              {showComplementaryColors ? '🚫 Hide Palette' : '🎨 Show Palette'}
            </Text>
          </Pressable>
          
          {showComplementaryColors && (
            <View style={styles.paletteDisplayContainer}>
              <ComplementaryColorPalette
                baseColor={baseColor}
                scheme={colorScheme}
                animationDuration={2500}
              />
            </View>
          )}
          
          <ThemedText style={styles.demoInfo}>
            • Color theory algorithms{'\n'}
            • Harmonious combinations{'\n'}
            • Dynamic color palettes{'\n'}
            • Animated transitions
          </ThemedText>
        </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
          </ParallaxScrollView>
      
      {/* Depth Transition */}
      <DepthTransition
        isVisible={showDepthTransition}
        onTransitionComplete={handleDepthTransitionComplete}
        direction={transitionDirection}
        duration={2500}
      />

      {/* Perspective Navigation */}
      <PerspectiveNavigation
        isVisible={showPerspectiveNav}
        onTransitionComplete={handlePerspectiveNavComplete}
        perspectiveType={perspectiveType}
        duration={1800}
      />

      {/* Card Stack Shuffle */}
      <CardStackShuffle
        isVisible={showCardShuffle}
        onShuffleComplete={handleCardShuffleComplete}
        shuffleType={shuffleType}
        cardCount={10}
        duration={3500}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  depthDemoContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoTitle: {
    marginBottom: 10,
  },
  demoDescription: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  demoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  forwardButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  backwardButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backwardButtonText: {
    color: COLORS.primary,
  },
  demoInfo: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'left',
  },
  perspectiveDemoContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  perspectiveButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  perspectiveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
  },
  zoomButton: {
    backgroundColor: COLORS.brightBlue,
    borderColor: COLORS.brightBlue,
  },
  rotateButton: {
    backgroundColor: COLORS.brightGreen,
    borderColor: COLORS.brightGreen,
  },
  flipButton: {
    backgroundColor: COLORS.brightPurple,
    borderColor: COLORS.brightPurple,
  },
  cubeButton: {
    backgroundColor: COLORS.brightYellow,
    borderColor: COLORS.brightYellow,
  },
  perspectiveButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  shuffleDemoContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shuffleButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shuffleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
  },
  riffleButton: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  overhandButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  fanButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cascadeButton: {
    backgroundColor: COLORS.brightRed,
    borderColor: COLORS.brightRed,
  },
  shuffleButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  gradientDemoContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientControlsContainer: {
    marginBottom: 20,
  },
  controlRow: {
    marginBottom: 15,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  controlButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: COLORS.pastelMint,
    borderWidth: 1,
    borderColor: COLORS.brightGreen,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  controlButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  gradientToggleButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  gradientToggleText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  colorDemoContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorControlsContainer: {
    marginBottom: 20,
  },
  colorButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: COLORS.black,
    borderWidth: 3,
  },
  colorButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorToggleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  colorToggleText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paletteDisplayContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
});

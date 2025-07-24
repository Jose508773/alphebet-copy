import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { COLORS, FONTS } from '../../constants/StyleGuide';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import DepthTransition from '../../components/DepthTransition';
import { useAccessibility } from '../../constants/AccessibilityContext';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const { highContrast } = useAccessibility();
  const [showDepthTransition, setShowDepthTransition] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  const handleDepthTransitionComplete = () => {
    setShowDepthTransition(false);
  };

  const triggerDepthTransition = (direction: 'forward' | 'backward') => {
    setTransitionDirection(direction);
    setShowDepthTransition(true);
  };

  return (
    <>
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
});

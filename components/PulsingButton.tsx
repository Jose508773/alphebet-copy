import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

interface PulsingButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  pulseColor?: string;
  pulseIntensity?: number;
  pulseDuration?: number;
  enablePulse?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
}

export default function PulsingButton({
  children,
  onPress,
  style,
  textStyle,
  pulseColor = COLORS.accent,
  pulseIntensity = 0.3,
  pulseDuration = 2000,
  enablePulse = true,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
}: PulsingButtonProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (enablePulse && !disabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: pulseDuration / 2,
            useNativeDriver: false, // Can't use native driver for backgroundColor interpolation
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: pulseDuration / 2,
            useNativeDriver: false,
          }),
        ])
      );
      
      pulseAnimation.start();
      
      return () => {
        pulseAnimation.stop();
      };
    }
  }, [enablePulse, disabled, pulseDuration]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const getPulseBackgroundColor = () => {
    if (!enablePulse || disabled) {
      return 'transparent';
    }
    
    return pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [`${pulseColor}00`, `${pulseColor}${Math.round(pulseIntensity * 255).toString(16).padStart(2, '0')}`],
    });
  };

  const getPulseScale = () => {
    if (!enablePulse || disabled) {
      return 1;
    }
    
    return pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1 + pulseIntensity * 0.1],
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { scale: getPulseScale() },
          ],
        },
      ]}
    >
      {/* Pulse Background Layer */}
      <Animated.View
        style={[
          styles.pulseBackground,
          {
            backgroundColor: getPulseBackgroundColor(),
          },
        ]}
      />
      
      {/* Main Button */}
      <Pressable
        style={[styles.button, style, disabled && styles.disabled]}
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : handlePressIn}
        onPressOut={disabled ? undefined : handlePressOut}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pulseBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    zIndex: -1,
  },
  button: {
    position: 'relative',
    zIndex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
}); 
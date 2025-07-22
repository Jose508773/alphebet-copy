import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { COLORS } from '@/constants/StyleGuide';

interface ThemedContainerProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'gradient' | 'solid' | 'glass';
}

export function ThemedContainer({
  children,
  style,
  variant = 'solid',
}: ThemedContainerProps) {
  const backgroundColor = useThemeColor({
    light: COLORS.white,
    dark: COLORS.black,
  });

  const containerStyle = [
    styles.container,
    { backgroundColor },
    style,
  ];

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={containerStyle}
      >
        {children}
      </LinearGradient>
    );
  }

  if (variant === 'glass') {
    return (
      <View
        style={[
          containerStyle,
          styles.glassContainer,
          {
            backgroundColor: useThemeColor({
              light: 'rgba(255, 255, 255, 0.9)',
              dark: 'rgba(0, 0, 0, 0.9)',
            }),
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glassContainer: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

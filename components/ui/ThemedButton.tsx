import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { COLORS } from '@/constants/StyleGuide';

interface ThemedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ThemedButton({
  children,
  onPress,
  style,
  variant = 'primary',
  disabled = false,
  size = 'medium',
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({
    light: variant === 'primary' ? COLORS.primary : variant === 'secondary' ? COLORS.secondary : 'transparent',
    dark: variant === 'primary' ? COLORS.primary : variant === 'secondary' ? COLORS.secondary : 'transparent',
  });

  const textColor = useThemeColor({
    light: variant === 'outline' ? COLORS.primary : 'white',
    dark: variant === 'outline' ? COLORS.primary : 'white',
  });

  const buttonStyles = [
    styles.button,
    variant === 'outline' && styles.outline,
    size === 'small' && styles.small,
    size === 'large' && styles.large,
    disabled && styles.disabled,
    { backgroundColor },
    style,
  ];

  const textStyles = [
    styles.text,
    { color: textColor },
  ];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.pressed,
      ]}
      disabled={disabled}
    >
      <Text style={textStyles}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

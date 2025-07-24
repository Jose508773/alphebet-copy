// StyleGuide.ts
// Centralized style guide for the Alphabet Learning App

import { ColorTheory } from '../components/ComplementaryColorSystem';

export const COLORS = {
  // Primary colors - vibrant and playful
  primary: '#FF69B4', // Hot pink
  secondary: '#48D1CC', // Turquoise
  accent: '#FFD700', // Gold
  
  // Pastel colors - soft and friendly
  pastelMint: '#98FB98', // Light green
  pastelPeach: '#FFB6C1', // Light pink
  pastelLavender: '#E6E6FA', // Lavender
  pastelPink: '#FFB6C1', // Light pink
  pastelBlue: '#ADD8E6', // Light blue
  
  // Bright accent colors
  brightBlue: '#00BFFF', // Turquoise blue
  brightGreen: '#32CD32', // Lime green
  brightPurple: '#9400D3', // Purple
  brightYellow: '#FFD700', // Gold
  brightRed: '#FF4500', // Orange red
  
  // Background gradients
  gradientStart: '#FF69B4',
  gradientEnd: '#48D1CC',
  
  // Interactive states
  hover: '#FFB6C1',
  active: '#FF69B4',
  disabled: '#E5E5E5',
  
  // Text colors
  primaryText: '#000000',
  secondaryText: '#8B4500',
  accentText: '#FF69B4',
  
  // Special effects
  shadow: '#483D8B',
  highlight: '#FFB6C1',
  
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  highContrastBg: '#000000',
  highContrastText: '#FFFFFF',
};

export const RAINBOW = [
  '#FF6B6B', // Coral
  '#FFD166', // Sunflower
  '#34C759', // Green
  '#4ECDC4', // Turquoise
  '#8B5CF6', // Purple
  '#FFB3C1', // Pink
  '#FFD700', // Yellow
];

// Harmonious color palettes using color theory
export const COLOR_PALETTES = {
  // Complementary pairs for high contrast and visual appeal
  complementary: {
    hotPink: ColorTheory.generateHarmoniousPalette('#FF69B4', 'complementary'),
    turquoise: ColorTheory.generateHarmoniousPalette('#48D1CC', 'complementary'),
    gold: ColorTheory.generateHarmoniousPalette('#FFD700', 'complementary'),
    coral: ColorTheory.generateHarmoniousPalette('#FF6B6B', 'complementary'),
    purple: ColorTheory.generateHarmoniousPalette('#8B5CF6', 'complementary'),
  },
  
  // Triadic harmonies for balanced color schemes
  triadic: {
    primary: ColorTheory.generateHarmoniousPalette('#FF69B4', 'triadic'),
    secondary: ColorTheory.generateHarmoniousPalette('#48D1CC', 'triadic'),
    accent: ColorTheory.generateHarmoniousPalette('#FFD700', 'triadic'),
  },
  
  // Analogous colors for smooth transitions
  analogous: {
    warm: ColorTheory.generateHarmoniousPalette('#FF69B4', 'analogous'),
    cool: ColorTheory.generateHarmoniousPalette('#48D1CC', 'analogous'),
    energetic: ColorTheory.generateHarmoniousPalette('#FFD700', 'analogous'),
  },
  
  // Split-complementary for softer contrast
  splitComplementary: {
    main: ColorTheory.generateHarmoniousPalette('#FF69B4', 'split-complementary'),
    supporting: ColorTheory.generateHarmoniousPalette('#48D1CC', 'split-complementary'),
  },
  
  // Monochromatic for elegant simplicity
  monochromatic: {
    pink: ColorTheory.generateHarmoniousPalette('#FF69B4', 'monochromatic'),
    blue: ColorTheory.generateHarmoniousPalette('#48D1CC', 'monochromatic'),
    gold: ColorTheory.generateHarmoniousPalette('#FFD700', 'monochromatic'),
    purple: ColorTheory.generateHarmoniousPalette('#8B5CF6', 'monochromatic'),
    green: ColorTheory.generateHarmoniousPalette('#34C759', 'monochromatic'),
  },
};

// Helper functions for using harmonious colors
export const getHarmoniousColors = (baseColor: string, scheme: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'monochromatic') => {
  return ColorTheory.generateHarmoniousPalette(baseColor, scheme);
};

export const getComplementaryColor = (hex: string) => {
  return ColorTheory.getComplementary(hex);
};

export const getAnalogousColors = (hex: string) => {
  return ColorTheory.getAnalogous(hex);
};

export const getTriadicColors = (hex: string) => {
  return ColorTheory.getTriadic(hex);
};

export const FONTS = {
  heading: 'Baloo, Nunito, Comic Neue, Arial Rounded MT Bold, sans-serif',
  body: 'Baloo, Nunito, Comic Neue, Arial Rounded MT Bold, sans-serif',
  fallback: 'Arial Rounded MT Bold',
  fallbackAndroid: 'sans-serif',
};

export const LETTER_EMOJI: Record<string, string> = {
  A: '🍎',
  B: '🏀',
  C: '🐱',
  D: '🐶',
  E: '🐘',
  F: '🐟',
  G: '🦒',
  H: '🎩',
  I: '🍦',
  J: '🧃',
  K: '🪁',
  L: '🦁',
  M: '🐵',
  N: '🪺',
  O: '🐙',
  P: '🐧',
  Q: '👑',
  R: '🌈',
  S: '☀️',
  T: '🐯',
  U: '☂️',
  V: '🎻',
  W: '🐋',
  X: '🎹',
  Y: '🧶',
  Z: '🦓',
};

export const ICONS = {
  home: 'home',
  next: 'arrow-forward',
  back: 'arrow-back',
  replay: 'refresh',
  volume: 'volume-high',
  contrast: 'contrast',
  star: 'star',
  confetti: 'emoticon-happy',
}; 
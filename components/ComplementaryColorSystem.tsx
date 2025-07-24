import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

// Color theory utilities
export class ColorTheory {
  // Convert hex to HSL
  static hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // Convert HSL to hex
  static hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number): string => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Generate complementary color (180° on color wheel)
  static getComplementary(hex: string): string {
    const [h, s, l] = this.hexToHsl(hex);
    const compH = (h + 180) % 360;
    return this.hslToHex(compH, s, l);
  }

  // Generate triadic colors (120° apart)
  static getTriadic(hex: string): [string, string] {
    const [h, s, l] = this.hexToHsl(hex);
    const triad1 = (h + 120) % 360;
    const triad2 = (h + 240) % 360;
    return [this.hslToHex(triad1, s, l), this.hslToHex(triad2, s, l)];
  }

  // Generate analogous colors (30° apart)
  static getAnalogous(hex: string): [string, string] {
    const [h, s, l] = this.hexToHsl(hex);
    const analog1 = (h + 30) % 360;
    const analog2 = (h - 30 + 360) % 360;
    return [this.hslToHex(analog1, s, l), this.hslToHex(analog2, s, l)];
  }

  // Generate split-complementary colors
  static getSplitComplementary(hex: string): [string, string] {
    const [h, s, l] = this.hexToHsl(hex);
    const split1 = (h + 150) % 360;
    const split2 = (h + 210) % 360;
    return [this.hslToHex(split1, s, l), this.hslToHex(split2, s, l)];
  }

  // Generate tetradic (square) colors
  static getTetradic(hex: string): [string, string, string] {
    const [h, s, l] = this.hexToHsl(hex);
    const tet1 = (h + 90) % 360;
    const tet2 = (h + 180) % 360;
    const tet3 = (h + 270) % 360;
    return [this.hslToHex(tet1, s, l), this.hslToHex(tet2, s, l), this.hslToHex(tet3, s, l)];
  }

  // Generate monochromatic palette (same hue, different lightness)
  static getMonochromatic(hex: string, steps: number = 5): string[] {
    const [h, s, l] = this.hexToHsl(hex);
    const palette: string[] = [];
    
    for (let i = 0; i < steps; i++) {
      const lightness = 20 + (i * (80 / (steps - 1))); // From 20% to 100%
      palette.push(this.hslToHex(h, s, lightness));
    }
    
    return palette;
  }

  // Generate harmonious palette based on color scheme
  static generateHarmoniousPalette(baseColor: string, scheme: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic' | 'monochromatic'): string[] {
    switch (scheme) {
      case 'complementary':
        return [baseColor, this.getComplementary(baseColor)];
      case 'triadic':
        return [baseColor, ...this.getTriadic(baseColor)];
      case 'analogous':
        return [baseColor, ...this.getAnalogous(baseColor)];
      case 'split-complementary':
        return [baseColor, ...this.getSplitComplementary(baseColor)];
      case 'tetradic':
        return [baseColor, ...this.getTetradic(baseColor)];
      case 'monochromatic':
        return this.getMonochromatic(baseColor);
      default:
        return [baseColor];
    }
  }
}

// Animated color palette component
interface ComplementaryColorPaletteProps {
  baseColor: string;
  scheme: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic' | 'monochromatic';
  animationDuration?: number;
  showLabels?: boolean;
  onColorChange?: (colors: string[]) => void;
}

export function ComplementaryColorPalette({
  baseColor,
  scheme,
  animationDuration = 3000,
  showLabels = true,
  onColorChange,
}: ComplementaryColorPaletteProps) {
  const animationValue = useRef(new Animated.Value(0)).current;
  const colors = ColorTheory.generateHarmoniousPalette(baseColor, scheme);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();
    onColorChange?.(colors);

    return () => animation.stop();
  }, [baseColor, scheme, animationDuration]);

  const renderColorSwatch = (color: string, index: number) => {
    const scaleAnim = animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1],
    });

    const rotateAnim = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={`${color}-${index}`}
        style={[
          styles.colorSwatch,
          {
            backgroundColor: color,
            transform: [
              { scale: scaleAnim },
              { rotate: rotateAnim },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.paletteContainer}>
      {colors.map(renderColorSwatch)}
    </View>
  );
}

// Dynamic color provider for theming
interface DynamicColorProviderProps {
  children: React.ReactNode;
  baseColor: string;
  colorScheme: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic' | 'monochromatic';
  transitionDuration?: number;
}

export function DynamicColorProvider({
  children,
  baseColor,
  colorScheme,
  transitionDuration = 2000,
}: DynamicColorProviderProps) {
  const colorTransition = useRef(new Animated.Value(0)).current;
  const colors = ColorTheory.generateHarmoniousPalette(baseColor, colorScheme);

  useEffect(() => {
    Animated.timing(colorTransition, {
      toValue: 1,
      duration: transitionDuration,
      useNativeDriver: false,
    }).start(() => {
      colorTransition.setValue(0);
    });
  }, [baseColor, colorScheme]);

  const getAnimatedBackgroundColor = () => {
    if (colors.length >= 2) {
      return colorTransition.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [colors[0], colors[1], colors[0]],
      });
    }
    return colors[0] || '#FFFFFF';
  };

  return (
    <Animated.View
      style={[
        styles.dynamicContainer,
        {
          backgroundColor: getAnimatedBackgroundColor(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  paletteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    padding: 20,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dynamicContainer: {
    flex: 1,
  },
}); 
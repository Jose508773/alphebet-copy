import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

const { width, height } = Dimensions.get('window');

interface OptimizedImageProps {
  source: { uri: string } | any;
  style?: any;
  placeholder?: string;
  blurRadius?: number;
  fadeDuration?: number;
  lazy?: boolean;
  priority?: 'low' | 'normal' | 'high';
  onLoad?: () => void;
  onError?: () => void;
  accessibilityLabel?: string;
}

export default function OptimizedImage({
  source,
  style,
  placeholder = '🖼️',
  blurRadius = 0,
  fadeDuration = 300,
  lazy = true,
  priority = 'normal',
  onLoad,
  onError,
  accessibilityLabel,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (lazy) {
      // Simulate intersection observer for lazy loading
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lazy]);

  useEffect(() => {
    if (isLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoaded, fadeDuration]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const getImageSource = () => {
    if (typeof source === 'string') {
      return { uri: source };
    }
    return source;
  };

  if (!isVisible) {
    return (
      <View style={[styles.container, style]} ref={viewRef}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} ref={viewRef}>
      {/* Placeholder/Loading State */}
      {!isLoaded && !hasError && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
          <LoadingIndicator />
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorMessage}>Failed to load</Text>
        </View>
      )}

      {/* Optimized Image */}
      {isVisible && !hasError && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={getImageSource()}
            style={[styles.image, style]}
            onLoad={handleLoad}
            onError={handleError}
            blurRadius={isLoaded ? blurRadius : 10}
            accessibilityLabel={accessibilityLabel}
            resizeMode="cover"
          />
        </Animated.View>
      )}
    </View>
  );
}

// Loading indicator component
function LoadingIndicator() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.loadingIndicator, { transform: [{ rotate: spin }] }]}>
      <Text style={styles.loadingText}>⏳</Text>
    </Animated.View>
  );
}

// Image gallery with optimized loading
interface ImageGalleryProps {
  images: { uri: string; alt?: string }[];
  columns?: number;
  spacing?: number;
  style?: any;
}

export function ImageGallery({ images, columns = 2, spacing = 10, style }: ImageGalleryProps) {
  const [visibleImages, setVisibleImages] = useState(new Set<number>());
  const imageWidth = (width - (columns + 1) * spacing) / columns;

  const handleImageVisible = (index: number) => {
    setVisibleImages(prev => new Set([...prev, index]));
  };

  const renderImage = (image: { uri: string; alt?: string }, index: number) => {
    const isVisible = visibleImages.has(index);
    
    return (
      <View key={index} style={[styles.galleryItem, { width: imageWidth, marginBottom: spacing }]}>
        <OptimizedImage
          source={{ uri: image.uri }}
          style={styles.galleryImage}
          lazy={true}
          accessibilityLabel={image.alt}
          onLoad={() => handleImageVisible(index)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.gallery, { padding: spacing }, style]}>
      <View style={styles.galleryGrid}>
        {images.map(renderImage)}
      </View>
    </View>
  );
}

// Progressive image with multiple quality levels
interface ProgressiveImageProps {
  lowQualitySource: { uri: string };
  highQualitySource: { uri: string };
  style?: any;
  onLoad?: () => void;
}

export function ProgressiveImage({ 
  lowQualitySource, 
  highQualitySource, 
  style, 
  onLoad 
}: ProgressiveImageProps) {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleHighQualityLoad = () => {
    setHighQualityLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onLoad?.();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Low quality image (always visible as base) */}
      <Image
        source={lowQualitySource}
        style={[styles.image, style]}
        blurRadius={3}
        resizeMode="cover"
      />
      
      {/* High quality image (fades in) */}
      <Animated.View 
        style={[
          styles.progressiveOverlay, 
          { opacity: fadeAnim }
        ]}
      >
        <Image
          source={highQualitySource}
          style={[styles.image, style]}
          onLoad={handleHighQualityLoad}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

// Image cache manager
class ImageCacheManager {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private maxCacheSize = 50;
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours

  preload(imageUrls: string[]) {
    imageUrls.forEach(url => {
      if (!this.cache.has(url)) {
        Image.prefetch(url).then(() => {
          this.cache.set(url, { data: url, timestamp: Date.now() });
          this.cleanup();
        });
      }
    });
  }

  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    entries.forEach(([key, value]) => {
      if (now - value.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    });

    // Remove oldest entries if cache is too large
    if (this.cache.size > this.maxCacheSize) {
      const sortedEntries = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, this.cache.size - this.maxCacheSize);
      
      sortedEntries.forEach(([key]) => {
        this.cache.delete(key);
      });
    }
  }

  getCacheInfo() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const imageCache = new ImageCacheManager();

// Responsive image component
interface ResponsiveImageProps {
  sources: {
    small: { uri: string };
    medium: { uri: string };
    large: { uri: string };
  };
  style?: any;
  onLoad?: () => void;
}

export function ResponsiveImage({ sources, style, onLoad }: ResponsiveImageProps) {
  const [screenSize, setScreenSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenSize(window);
    });
    return () => subscription?.remove();
  }, []);

  const getAppropriateSource = () => {
    const { width } = screenSize;
    
    if (width < 400) {
      return sources.small;
    } else if (width < 800) {
      return sources.medium;
    } else {
      return sources.large;
    }
  };

  return (
    <OptimizedImage
      source={getAppropriateSource()}
      style={style}
      onLoad={onLoad}
      lazy={true}
      priority="normal"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: COLORS.pastelMint,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pastelLavender,
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  loadingText: {
    fontSize: 20,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pastelPeach,
  },
  errorText: {
    fontSize: 30,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 12,
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  gallery: {
    flex: 1,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 120,
  },
  progressiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}); 
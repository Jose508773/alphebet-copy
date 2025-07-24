import React, { Suspense, lazy, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/StyleGuide';

// Lazy loading wrapper with loading states
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onLoad?: () => void;
}

export function LazyWrapper({ children, fallback: Fallback, errorFallback: ErrorFallback, onLoad }: LazyComponentProps) {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  if (error && ErrorFallback) {
    return <ErrorFallback error={error} retry={handleRetry} />;
  }

  return (
    <Suspense 
      fallback={
        Fallback ? (
          <Fallback />
        ) : (
          <DefaultLoadingFallback />
        )
      }
    >
      {children}
    </Suspense>
  );
}

// Default loading component
function DefaultLoadingFallback() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading component...</Text>
    </View>
  );
}

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }
      
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Component Error</Text>
          <Text style={styles.errorMessage}>Something went wrong loading this component.</Text>
          <Text style={styles.retryButton} onPress={this.handleRetry}>
            🔄 Try Again
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Code splitting utilities
export class CodeSplitManager {
  private static loadedChunks = new Set<string>();
  private static preloadedChunks = new Set<string>();

  // Track loaded chunks
  static markChunkLoaded(chunkName: string) {
    this.loadedChunks.add(chunkName);
  }

  // Preload chunks
  static async preloadChunk(chunkName: string, importFn: () => Promise<any>) {
    if (this.preloadedChunks.has(chunkName)) {
      return;
    }

    try {
      this.preloadedChunks.add(chunkName);
      await importFn();
      this.markChunkLoaded(chunkName);
    } catch (error) {
      console.warn(`Failed to preload chunk ${chunkName}:`, error);
      this.preloadedChunks.delete(chunkName);
    }
  }

  // Get loading stats
  static getStats() {
    return {
      loadedChunks: Array.from(this.loadedChunks),
      preloadedChunks: Array.from(this.preloadedChunks),
      totalLoaded: this.loadedChunks.size,
      totalPreloaded: this.preloadedChunks.size,
    };
  }
}

// Lazy load components with retry logic
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string,
  options: {
    preload?: boolean;
    retryAttempts?: number;
    retryDelay?: number;
  } = {}
) {
  const { preload = false, retryAttempts = 3, retryDelay = 1000 } = options;

  const LazyComponent = lazy(async () => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        const module = await importFn();
        CodeSplitManager.markChunkLoaded(chunkName);
        return module;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
  });

  // Preload if requested
  if (preload) {
    CodeSplitManager.preloadChunk(chunkName, importFn);
  }

  return LazyComponent;
}

// Progressive loading component
interface ProgressiveLoaderProps {
  stages: Array<{
    component: React.ComponentType;
    priority: number;
    description: string;
  }>;
  onStageLoad?: (stage: number) => void;
}

export function ProgressiveLoader({ stages, onStageLoad }: ProgressiveLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [loadedStages, setLoadedStages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Sort stages by priority
    const sortedStages = stages
      .map((stage, index) => ({ ...stage, originalIndex: index }))
      .sort((a, b) => a.priority - b.priority);

    // Load stages progressively
    const loadNextStage = (stageIndex: number = 0) => {
      if (stageIndex >= sortedStages.length) return;

      const stage = sortedStages[stageIndex];
      const originalIndex = stage.originalIndex;

      setTimeout(() => {
        setLoadedStages(prev => new Set([...prev, originalIndex]));
        setCurrentStage(originalIndex);
        onStageLoad?.(originalIndex);
        
        // Load next stage
        loadNextStage(stageIndex + 1);
      }, 500 * (stageIndex + 1)); // Stagger loading
    };

    loadNextStage();
  }, [stages, onStageLoad]);

  return (
    <View style={styles.progressiveContainer}>
      {stages.map((stage, index) => {
        const isLoaded = loadedStages.has(index);
        const Component = stage.component;

        return (
          <View key={index} style={[styles.stageContainer, !isLoaded && styles.hiddenStage]}>
            {isLoaded ? (
              <Suspense fallback={<StageFallback description={stage.description} />}>
                <Component />
              </Suspense>
            ) : (
              <StagePlaceholder description={stage.description} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// Stage fallback component
function StageFallback({ description }: { description: string }) {
  return (
    <View style={styles.stageFallback}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      <Text style={styles.stageText}>Loading {description}...</Text>
    </View>
  );
}

// Stage placeholder component
function StagePlaceholder({ description }: { description: string }) {
  return (
    <View style={styles.stagePlaceholder}>
      <Text style={styles.placeholderText}>⏳</Text>
      <Text style={styles.stageText}>Preparing {description}...</Text>
    </View>
  );
}

// Bundle analyzer component
interface BundleAnalyzerProps {
  showDetails?: boolean;
}

export function BundleAnalyzer({ showDetails = false }: BundleAnalyzerProps) {
  const [stats, setStats] = useState(CodeSplitManager.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(CodeSplitManager.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showDetails) {
    return (
      <View style={styles.miniAnalyzer}>
        <Text style={styles.miniAnalyzerText}>
          📦 {stats.totalLoaded} chunks loaded
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.analyzerContainer}>
      <Text style={styles.analyzerTitle}>📊 Bundle Analysis</Text>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Loaded Chunks:</Text>
        <Text style={styles.statValue}>{stats.totalLoaded}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Preloaded Chunks:</Text>
        <Text style={styles.statValue}>{stats.totalPreloaded}</Text>
      </View>

      {stats.loadedChunks.length > 0 && (
        <View style={styles.chunkList}>
          <Text style={styles.chunkListTitle}>Loaded:</Text>
          {stats.loadedChunks.map((chunk, index) => (
            <Text key={index} style={styles.chunkItem}>
              • {chunk}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// Hook for progressive feature loading
export function useProgressiveFeatures(features: string[]) {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    features.forEach((feature, index) => {
      setTimeout(() => {
        setEnabledFeatures(prev => new Set([...prev, feature]));
      }, 1000 * (index + 1));
    });
  }, [features]);

  return {
    isFeatureEnabled: (feature: string) => enabledFeatures.has(feature),
    enabledFeatures: Array.from(enabledFeatures),
    totalFeatures: features.length,
    loadedPercentage: (enabledFeatures.size / features.length) * 100,
  };
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.pastelMint,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primaryText,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: FONTS.body,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.pastelPeach,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.primaryText,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  progressiveContainer: {
    flex: 1,
  },
  stageContainer: {
    marginBottom: 10,
  },
  hiddenStage: {
    opacity: 0.3,
  },
  stageFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 8,
  },
  stagePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.pastelBlue,
    borderRadius: 8,
  },
  stageText: {
    fontSize: 14,
    color: COLORS.primaryText,
    marginLeft: 10,
  },
  placeholderText: {
    fontSize: 20,
  },
  analyzerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyzerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  chunkList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.pastelMint,
  },
  chunkListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 5,
  },
  chunkItem: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  miniAnalyzer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  miniAnalyzerText: {
    fontSize: 10,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
}); 
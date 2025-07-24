import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/StyleGuide';

// Simple storage polyfill for web compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Cache storage interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  tags: string[];
}

// Cache configuration
interface CacheConfig {
  maxSize: number; // in bytes
  maxEntries: number;
  defaultTTL: number; // time to live in ms
  strategy: 'LRU' | 'LFU' | 'FIFO' | 'TTL';
  compression: boolean;
  encryption: boolean;
}

// Multi-level cache system
export class CacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private currentSize = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 1000,
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      strategy: 'LRU',
      compression: false,
      encryption: false,
      ...config,
    };
  }

  // Set cache entry
  async set<T>(key: string, data: T, options: {
    ttl?: number;
    tags?: string[];
    priority?: 'low' | 'normal' | 'high';
  } = {}): Promise<void> {
    const { ttl = this.config.defaultTTL, tags = [], priority = 'normal' } = options;
    
    const serializedData = JSON.stringify(data);
    const size = new Blob([serializedData]).size;
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now,
      size,
      tags,
    };

    // Check if we need to evict entries
    await this.ensureSpace(size);

    // Add to memory cache
    this.memoryCache.set(key, entry);
    this.currentSize += size;

    // Persist to storage if high priority
    if (priority === 'high') {
      try {
        await storage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to persist cache entry:', error);
      }
    }
  }

  // Get cache entry
  async get<T>(key: string): Promise<T | null> {
    let entry = this.memoryCache.get(key);
    
    // Try to load from persistent storage if not in memory
    if (!entry) {
      try {
        const stored = await storage.getItem(`cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          // Add back to memory cache
          if (entry) {
            this.memoryCache.set(key, entry);
          }
        }
      } catch (error) {
        console.warn('Failed to load from persistent cache:', error);
      }
    }

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      await this.delete(key);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data as T;
  }

  // Delete cache entry
  async delete(key: string): Promise<void> {
    const entry = this.memoryCache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.memoryCache.delete(key);
    }

    try {
      await storage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove from persistent cache:', error);
    }
  }

  // Clear cache by tags
  async clearByTags(tags: string[]): Promise<void> {
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (tags.some(tag => entry.tags.includes(tag))) {
        keysToDelete.push(key);
      }
    }

    await Promise.all(keysToDelete.map(key => this.delete(key)));
  }

  // Ensure space for new entry
  private async ensureSpace(requiredSize: number): Promise<void> {
    while (
      this.currentSize + requiredSize > this.config.maxSize ||
      this.memoryCache.size >= this.config.maxEntries
    ) {
      const keyToEvict = this.selectEvictionKey();
      if (keyToEvict) {
        await this.delete(keyToEvict);
      } else {
        break; // No more entries to evict
      }
    }
  }

  // Select key for eviction based on strategy
  private selectEvictionKey(): string | null {
    if (this.memoryCache.size === 0) return null;

    const entries = Array.from(this.memoryCache.entries());
    
    switch (this.config.strategy) {
      case 'LRU': // Least Recently Used
        return entries.reduce((oldest, [key, entry]) => {
          const [oldestKey, oldestEntry] = oldest;
          return entry.lastAccessed < oldestEntry.lastAccessed ? [key, entry] : oldest;
        })[0];
      
      case 'LFU': // Least Frequently Used
        return entries.reduce((least, [key, entry]) => {
          const [leastKey, leastEntry] = least;
          return entry.accessCount < leastEntry.accessCount ? [key, entry] : least;
        })[0];
      
      case 'FIFO': // First In, First Out
        return entries.reduce((oldest, [key, entry]) => {
          const [oldestKey, oldestEntry] = oldest;
          return entry.timestamp < oldestEntry.timestamp ? [key, entry] : oldest;
        })[0];
      
      case 'TTL': // Shortest TTL
        return entries.reduce((shortest, [key, entry]) => {
          const [shortestKey, shortestEntry] = shortest;
          return entry.expiresAt < shortestEntry.expiresAt ? [key, entry] : shortest;
        })[0];
      
      default:
        return entries[0][0]; // Fallback to first entry
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.memoryCache.values());
    
    return {
      totalEntries: this.memoryCache.size,
      totalSize: this.currentSize,
      maxSize: this.config.maxSize,
      maxEntries: this.config.maxEntries,
      utilizationPercentage: (this.currentSize / this.config.maxSize) * 100,
      expiredEntries: entries.filter(entry => now > entry.expiresAt).length,
      averageAccessCount: entries.reduce((sum, entry) => sum + entry.accessCount, 0) / entries.length || 0,
      strategy: this.config.strategy,
    };
  }

  // Cleanup expired entries
  async cleanup(): Promise<void> {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }

    await Promise.all(expiredKeys.map(key => this.delete(key)));
  }
}

// Create global cache instances
export const appCache = new CacheManager({
  strategy: 'LRU',
  maxSize: 25 * 1024 * 1024, // 25MB
  maxEntries: 500,
});

export const imageCache = new CacheManager({
  strategy: 'LFU',
  maxSize: 100 * 1024 * 1024, // 100MB
  maxEntries: 200,
  defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const dataCache = new CacheManager({
  strategy: 'TTL',
  maxSize: 10 * 1024 * 1024, // 10MB
  maxEntries: 100,
  defaultTTL: 60 * 60 * 1000, // 1 hour
});

// Cache decorator for functions
export function cacheResult(
  cacheInstance: CacheManager,
  keyGenerator: (...args: any[]) => string,
  options: { ttl?: number; tags?: string[] } = {}
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      
      // Try to get from cache
      const cached = await cacheInstance.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
      
      // Execute method and cache result
      const result = await method.apply(this, args);
      await cacheInstance.set(cacheKey, result, options);
      
      return result;
    };
    
    return descriptor;
  };
}

// Cache monitoring component
interface CacheMonitorProps {
  cacheInstance: CacheManager;
  name: string;
  showDetails?: boolean;
}

export function CacheMonitor({ cacheInstance, name, showDetails = false }: CacheMonitorProps) {
  const [stats, setStats] = useState(cacheInstance.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheInstance.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [cacheInstance]);

  const handleCleanup = async () => {
    await cacheInstance.cleanup();
    setStats(cacheInstance.getStats());
  };

  if (!showDetails) {
    return (
      <View style={styles.miniMonitor}>
        <Text style={styles.miniText}>
          💾 {name}: {stats.totalEntries} entries ({Math.round(stats.utilizationPercentage)}%)
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.monitorContainer}>
      <Text style={styles.monitorTitle}>💾 {name} Cache Monitor</Text>
      
      <View style={styles.statGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Entries</Text>
          <Text style={styles.statValue}>{stats.totalEntries} / {stats.maxEntries}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Size</Text>
          <Text style={styles.statValue}>
            {(stats.totalSize / 1024 / 1024).toFixed(1)}MB / {(stats.maxSize / 1024 / 1024).toFixed(0)}MB
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Utilization</Text>
          <Text style={styles.statValue}>{stats.utilizationPercentage.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Strategy</Text>
          <Text style={styles.statValue}>{stats.strategy}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expired</Text>
          <Text style={styles.statValue}>{stats.expiredEntries}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Access</Text>
          <Text style={styles.statValue}>{stats.averageAccessCount.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.cleanupButton} onPress={handleCleanup}>
        🧹 Cleanup Expired
      </Text>
    </View>
  );
}

// Performance cache hook
export function usePerformanceCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    cacheInstance?: CacheManager;
    ttl?: number;
    tags?: string[];
    enabled?: boolean;
  } = {}
) {
  const {
    cacheInstance = appCache,
    ttl,
    tags,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!enabled) {
      try {
        setLoading(true);
        const result = await fetchFn();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      
      // Try cache first
      const cached = await cacheInstance.get<T>(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      
      // Fetch and cache
      const result = await fetchFn();
      await cacheInstance.set(key, result, { ttl, tags });
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key, enabled]);

  const invalidate = async () => {
    await cacheInstance.delete(key);
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate,
  };
}

const styles = StyleSheet.create({
  miniMonitor: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  miniText: {
    fontSize: 9,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  monitorContainer: {
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
  monitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: COLORS.pastelMint,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cleanupButton: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: COLORS.pastelLavender,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
}); 
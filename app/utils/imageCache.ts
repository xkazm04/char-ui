// A simple in-memory cache for images to prevent redundant fetching
// and improve performance when the same images are displayed multiple times

import { performance } from "@/app/styles/design-tokens";

interface CacheEntry {
  data: string;
  timestamp: number;
  contentType: string;
}

class ImageCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private maxAge: number; // in milliseconds
  private loadingPromises: Map<string, Promise<string>>;
  private concurrentLoads: number;

  constructor(maxSize = 100, maxAge = 30 * 60 * 1000) { // Default: 100 images, 30 minutes
    this.cache = new Map();
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.loadingPromises = new Map();
    this.concurrentLoads = 0;
  }

  // Get an image from cache or load it
  async getImage(
    key: string,
    loader: () => Promise<{ data: string; contentType: string }>,
    priority = false
  ): Promise<string> {
    // Check if the image is in cache and not expired
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return `data:${cached.contentType};base64,${cached.data}`;
    }

    // Check if the image is already being loaded
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    // If we've reached the maximum concurrent loads and this isn't a priority load,
    // return a placeholder and don't start loading
    if (
      !priority &&
      this.concurrentLoads >= performance.maxConcurrentImageLoads
    ) {
      return ""; // Return empty string to indicate not loaded yet
    }

    // Start loading the image
    this.concurrentLoads++;
    const loadPromise = loader()
      .then(({ data, contentType }) => {
        // Store in cache
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          contentType,
        });

        // If cache is too large, remove oldest entries
        if (this.cache.size > this.maxSize) {
          const entriesToDelete = [...this.cache.entries()]
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .slice(0, Math.floor(this.maxSize * 0.2)) // Remove oldest 20%
            .map(([entryKey]) => entryKey);

          entriesToDelete.forEach(entryKey => this.cache.delete(entryKey));
        }

        return `data:${contentType};base64,${data}`;
      })
      .catch(error => {
        console.error(`Failed to load image: ${key}`, error);
        return ""; // Return empty string on error
      })
      .finally(() => {
        this.loadingPromises.delete(key);
        this.concurrentLoads--;
      });

    this.loadingPromises.set(key, loadPromise);
    return loadPromise;
  }

  // Check if an image is in the cache
  has(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && Date.now() - cached.timestamp < this.maxAge;
  }

  // Manually add an image to the cache
  set(key: string, data: string, contentType: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      contentType,
    });
  }

  // Clear the cache
  clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    this.concurrentLoads = 0;
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      concurrentLoads: this.concurrentLoads,
      pendingLoads: this.loadingPromises.size,
    };
  }
}

// Create a singleton instance
export const imageCache = new ImageCache();

// Helper function to fetch an image as base64
export async function fetchImageAsBase64(
  url: string
): Promise<{ data: string; contentType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  return { data: base64, contentType };
}

// Helper function to get an image with caching
export async function getImageWithCache(
  url: string,
  priority = false
): Promise<string> {
  return imageCache.getImage(
    url,
    () => fetchImageAsBase64(url),
    priority
  );
}


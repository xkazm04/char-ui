import { AssetType, PaginatedAssetType } from "@/app/types/asset";

const CACHE_PREFIX = 'asset-cache-';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

// Cache a page of assets
export function cacheAssetPage(key: string, data: PaginatedAssetType): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (error) {
    console.warn('Error caching assets to localStorage:', error);
  }
}

// Get cached asset page
export function getCachedAssetPage(key: string): PaginatedAssetType | null {
  try {
    const cacheItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cacheItem) return null;
    
    const { timestamp, data } = JSON.parse(cacheItem);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    if (isExpired) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Error getting cached assets:', error);
    return null;
  }
}

// Store individual assets for faster access
export function cacheAsset(asset: AssetType): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}asset-${asset._id}`, JSON.stringify({
      timestamp: Date.now(),
      asset
    }));
  } catch (error) {
    console.warn('Error caching individual asset:', error);
  }
}

// Get individual cached asset
export function getCachedAsset(assetId: string): AssetType | null {
  try {
    const cacheItem = localStorage.getItem(`${CACHE_PREFIX}asset-${assetId}`);
    if (!cacheItem) return null;
    
    const { timestamp, asset } = JSON.parse(cacheItem);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    if (isExpired) {
      localStorage.removeItem(`${CACHE_PREFIX}asset-${assetId}`);
      return null;
    }
    
    return asset;
  } catch (error) {
    console.warn('Error getting cached asset:', error);
    return null;
  }
}

// Clear cached assets by type
export function clearCachedAssetsByType(type: string | null): void {
  try {
    // Get all localStorage keys with our prefix
    const keys = Object.keys(localStorage).filter(
      key => key.startsWith(CACHE_PREFIX)
    );
    
    // Clear keys that match the type pattern
    keys.forEach(key => {
      if (type) {
        if (key.includes(`-${type}-`)) {
          localStorage.removeItem(key);
        }
      } else {
        // If no type specified, clear all asset cache items
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing cached assets:', error);
  }
}
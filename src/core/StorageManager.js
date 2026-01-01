/**
 * Wrapper for Chrome Storage API with error handling and validation
 * Abstracts chrome.storage.sync and chrome.storage.local
 */
class StorageManager {
  constructor() {
    this.NAMESPACE = 'vibeshift:';
    this.isAvailable = typeof chrome !== 'undefined' && chrome.storage;
  }

  /**
   * Save data to chrome.storage.sync (syncs across devices)
   * @param {string} key - Storage key (will be namespaced)
   * @param {*} value - Value to store
   * @returns {Promise<boolean>} Success status
   */
  async save(key, value) {
    const namespacedKey = this.NAMESPACE + key;
    
    if (!this.isAvailable) {
      console.warn('Chrome storage not available, using memory fallback');
      this._memoryStorage = this._memoryStorage || {};
      this._memoryStorage[namespacedKey] = value;
      return true;
    }
    
    try {
      await chrome.storage.sync.set({ [namespacedKey]: value });
      return true;
    } catch (error) {
      console.error(`StorageManager.save failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Load data from chrome.storage.sync
   * @param {string} key - Storage key
   * @param {*} defaultValue - Value to return if key doesn't exist
   * @returns {Promise<*>} Stored value or defaultValue
   */
  async load(key, defaultValue = null) {
    const namespacedKey = this.NAMESPACE + key;
    
    if (!this.isAvailable) {
      this._memoryStorage = this._memoryStorage || {};
      return this._memoryStorage[namespacedKey] !== undefined 
        ? this._memoryStorage[namespacedKey] 
        : defaultValue;
    }
    
    try {
      const result = await chrome.storage.sync.get(namespacedKey);
      return result[namespacedKey] !== undefined ? result[namespacedKey] : defaultValue;
    } catch (error) {
      console.error(`StorageManager.load failed for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Save to local storage (not synced, larger quota)
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {Promise<boolean>} Success status
   */
  async saveLocal(key, value) {
    const namespacedKey = this.NAMESPACE + key;
    
    if (!this.isAvailable) {
      this._memoryStorageLocal = this._memoryStorageLocal || {};
      this._memoryStorageLocal[namespacedKey] = value;
      return true;
    }
    
    try {
      await chrome.storage.local.set({ [namespacedKey]: value });
      return true;
    } catch (error) {
      console.error(`StorageManager.saveLocal failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Load from local storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Value to return if key doesn't exist
   * @returns {Promise<*>} Stored value or defaultValue
   */
  async loadLocal(key, defaultValue = null) {
    const namespacedKey = this.NAMESPACE + key;
    
    if (!this.isAvailable) {
      this._memoryStorageLocal = this._memoryStorageLocal || {};
      return this._memoryStorageLocal[namespacedKey] !== undefined 
        ? this._memoryStorageLocal[namespacedKey] 
        : defaultValue;
    }
    
    try {
      const result = await chrome.storage.local.get(namespacedKey);
      return result[namespacedKey] !== undefined ? result[namespacedKey] : defaultValue;
    } catch (error) {
      console.error(`StorageManager.loadLocal failed for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove a key from sync storage
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  async remove(key) {
    const namespacedKey = this.NAMESPACE + key;
    
    if (!this.isAvailable) {
      this._memoryStorage = this._memoryStorage || {};
      delete this._memoryStorage[namespacedKey];
      return true;
    }
    
    try {
      await chrome.storage.sync.remove(namespacedKey);
      return true;
    } catch (error) {
      console.error(`StorageManager.remove failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all VibeShift data (useful for reset)
   * @returns {Promise<boolean>} Success status
   */
  async clearAll() {
    if (!this.isAvailable) {
      this._memoryStorage = {};
      this._memoryStorageLocal = {};
      return true;
    }
    
    try {
      const syncKeys = await chrome.storage.sync.get(null);
      const localKeys = await chrome.storage.local.get(null);
      
      const vibeShiftSyncKeys = Object.keys(syncKeys).filter(k => k.startsWith(this.NAMESPACE));
      const vibeShiftLocalKeys = Object.keys(localKeys).filter(k => k.startsWith(this.NAMESPACE));
      
      if (vibeShiftSyncKeys.length > 0) {
        await chrome.storage.sync.remove(vibeShiftSyncKeys);
      }
      if (vibeShiftLocalKeys.length > 0) {
        await chrome.storage.local.remove(vibeShiftLocalKeys);
      }
      
      return true;
    } catch (error) {
      console.error('StorageManager.clearAll failed:', error);
      return false;
    }
  }

  /**
   * Get all VibeShift keys from storage
   * @returns {Promise<Object>} All stored data
   */
  async getAll() {
    if (!this.isAvailable) {
      return {
        sync: this._memoryStorage || {},
        local: this._memoryStorageLocal || {}
      };
    }
    
    try {
      const syncData = await chrome.storage.sync.get(null);
      const localData = await chrome.storage.local.get(null);
      
      const filterVibeShift = (obj) => {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith(this.NAMESPACE)) {
            result[key.replace(this.NAMESPACE, '')] = value;
          }
        }
        return result;
      };
      
      return {
        sync: filterVibeShift(syncData),
        local: filterVibeShift(localData)
      };
    } catch (error) {
      console.error('StorageManager.getAll failed:', error);
      return { sync: {}, local: {} };
    }
  }
}

export default StorageManager;

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const password = process.env.REDIS_PASSWORD || undefined;
    const db = Number(process.env.REDIS_DB) || 0;

    this.client = new Redis({
      host,
      port,
      password,
      db,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        console.log(`🔄 Redis reconnecting in ${delay}ms... (attempt ${times})`);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('ready', () => console.log('✅ Redis is ready to receive commands'));
    this.client.on('error', (err) => console.error('❌ Redis error', err));
    this.client.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));
    this.client.on('close', () => console.log('🔌 Redis connection closed'));
  }

  /**
   * Set a key-value pair in Redis with optional TTL
   * @param key - Redis key
   * @param value - String value to store
   * @param ttlSeconds - Time to live in seconds (optional)
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
        console.log(`✅ [Redis] SET ${key} (TTL: ${ttlSeconds}s)`);
      } else {
        await this.client.set(key, value);
        console.log(`✅ [Redis] SET ${key} (no TTL)`);
      }
    } catch (error) {
      console.error(`❌ [Redis] Failed to set key ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Get value by key from Redis
   * @param key - Redis key
   * @returns String value or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`✅ [Redis] GET ${key} (found)`);
      } else {
        console.log(`⚠️ [Redis] GET ${key} (not found)`);
      }
      return value;
    } catch (error) {
      console.error(`❌ [Redis] Failed to get key ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a key from Redis
   * @param key - Redis key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      const result = await this.client.del(key);
      if (result === 1) {
        console.log(`✅ [Redis] DEL ${key} (deleted)`);
      } else {
        console.log(`⚠️ [Redis] DEL ${key} (not found)`);
      }
    } catch (error) {
      console.error(`❌ [Redis] Failed to delete key ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key - Redis key to check
   * @returns boolean indicating if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      const exists = result === 1;
      console.log(`🔍 [Redis] EXISTS ${key}: ${exists}`);
      return exists;
    } catch (error) {
      console.error(`❌ [Redis] Failed to check existence of ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Get Time To Live for a key in seconds
   * @param key - Redis key
   * @returns TTL in seconds (-1 if no TTL, -2 if key doesn't exist)
   */
  async ttl(key: string): Promise<number> {
    try {
      const ttl = await this.client.ttl(key);
      console.log(`⏰ [Redis] TTL ${key}: ${ttl} seconds`);
      return ttl;
    } catch (error) {
      console.error(`❌ [Redis] Failed to get TTL for ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Set with expiration in milliseconds (PX)
   * @param key - Redis key
   * @param value - String value
   * @param ttlMs - Time to live in milliseconds
   */
  async setWithPx(key: string, value: string, ttlMs: number): Promise<void> {
    try {
      await this.client.set(key, value, 'PX', ttlMs);
      console.log(`✅ [Redis] SET ${key} (PX: ${ttlMs}ms)`);
    } catch (error) {
      console.error(`❌ [Redis] Failed to set key ${key} with PX:`, error.message);
      throw error;
    }
  }

  /**
   * Set if not exists (atomic operation)
   * @param key - Redis key
   * @param value - String value
   * @param ttlSeconds - Optional TTL in seconds
   * @returns boolean indicating if key was set
   */
  async setIfNotExists(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      let result: string | null;
      if (ttlSeconds) {
        result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
      } else {
        result = await this.client.set(key, value, 'NX');
      }
      const success = result === 'OK';
      console.log(`✅ [Redis] SETNX ${key}: ${success ? 'acquired' : 'already exists'}`);
      return success;
    } catch (error) {
      console.error(`❌ [Redis] Failed to setnx ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Increment a counter
   * @param key - Redis key
   * @returns New value after increment
   */
  async incr(key: string): Promise<number> {
    try {
      const newValue = await this.client.incr(key);
      console.log(`📈 [Redis] INCR ${key}: ${newValue}`);
      return newValue;
    } catch (error) {
      console.error(`❌ [Redis] Failed to increment ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Decrement a counter
   * @param key - Redis key
   * @returns New value after decrement
   */
  async decr(key: string): Promise<number> {
    try {
      const newValue = await this.client.decr(key);
      console.log(`📉 [Redis] DECR ${key}: ${newValue}`);
      return newValue;
    } catch (error) {
      console.error(`❌ [Redis] Failed to decrement ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Get all keys matching a pattern (use carefully in production)
   * @param pattern - Key pattern (e.g., "refresh_token_*")
   * @returns Array of matching keys
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.client.keys(pattern);
      console.log(`🔑 [Redis] KEYS ${pattern}: found ${keys.length} keys`);
      return keys;
    } catch (error) {
      console.error(`❌ [Redis] Failed to get keys with pattern ${pattern}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete multiple keys
   * @param keys - Array of keys to delete
   * @returns Number of keys deleted
   */
  async deleteMultiple(keys: string[]): Promise<number> {
    try {
      const count = await this.client.del(...keys);
      console.log(`🗑️ [Redis] DEL multiple: deleted ${count} keys`);
      return count;
    } catch (error) {
      console.error(`❌ [Redis] Failed to delete multiple keys:`, error.message);
      throw error;
    }
  }

  /**
   * Delete all keys matching a pattern (use carefully in production)
   * @param pattern - Key pattern to delete
   * @returns Number of keys deleted
   */
  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) {
        console.log(`⚠️ [Redis] No keys found matching pattern: ${pattern}`);
        return 0;
      }
      const count = await this.deleteMultiple(keys);
      console.log(`🗑️ [Redis] Deleted ${count} keys matching pattern: ${pattern}`);
      return count;
    } catch (error) {
      console.error(`❌ [Redis] Failed to delete by pattern ${pattern}:`, error.message);
      throw error;
    }
  }

  /**
   * Flush all data from current database (use with caution!)
   */
  async flushDb(): Promise<void> {
    try {
      await this.client.flushdb();
      console.log('⚠️ [Redis] FLUSHDB - All data cleared from current database');
    } catch (error) {
      console.error('❌ [Redis] Failed to flush database:', error.message);
      throw error;
    }
  }

  /**
   * Get Redis server info
   */
  async getInfo(): Promise<string> {
    try {
      const info = await this.client.info();
      console.log('ℹ️ [Redis] Server info retrieved');
      return info;
    } catch (error) {
      console.error('❌ [Redis] Failed to get server info:', error.message);
      throw error;
    }
  }

  /**
   * Ping Redis server to check connection
   */
  async ping(): Promise<string> {
    try {
      const pong = await this.client.ping();
      console.log(`🏓 [Redis] PING: ${pong}`);
      return pong;
    } catch (error) {
      console.error('❌ [Redis] Failed to ping server:', error.message);
      throw error;
    }
  }

  /**
   * Get the raw Redis client for advanced operations
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Gracefully close Redis connection
   */
  async quit(): Promise<void> {
    try {
      await this.client.quit();
      console.log('🔌 [Redis] Connection closed gracefully');
    } catch (error) {
      console.error('❌ [Redis] Error while closing connection:', error.message);
      throw error;
    }
  }
}
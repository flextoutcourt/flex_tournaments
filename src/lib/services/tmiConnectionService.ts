/**
 * TMI Connection Service - Manages TMI.js client lifecycle
 */

import tmi from 'tmi.js';
import { TmiClientState } from '@/types/tmi';

export class TmiConnectionService {
  private client: tmi.Client | null = null;
  private isConnected: boolean = false;
  private error: string | null = null;

  /**
   * Initialize and connect to Twitch chat
   */
  async connect(channel: string): Promise<boolean> {
    if (this.isConnected && this.client?.readyState() === 'OPEN') {
      console.log(`[TmiConnectionService] Already connected to ${channel}`);
      return true;
    }

    try {
      console.log(`[TmiConnectionService] Creating new client for channel: ${channel}`);
      this.client = new tmi.Client({
        options: { debug: false },
        channels: [channel],
      });

      // Setup event listeners
      this.client.on('connected', () => {
        this.isConnected = true;
        this.error = null;
        console.log(`[TmiConnectionService] ✅ Connected to ${channel}`);
      });

      this.client.on('disconnected', (reason) => {
        this.isConnected = false;
        console.warn(`[TmiConnectionService] Disconnected: ${reason}`);
      });

      console.log(`[TmiConnectionService] Calling client.connect() for ${channel}`);
      await this.client.connect();
      console.log(`[TmiConnectionService] client.connect() completed for ${channel}`);
      
      // Give the 'connected' event a moment to fire
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`[TmiConnectionService] Connection complete. isConnected: ${this.isConnected}, readyState: ${this.client?.readyState()}`);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.error = `Failed to connect to Twitch: ${errorMsg}`;
      this.isConnected = false;
      console.error('[TmiConnectionService] ❌ Connection error:', this.error);
      return false;
    }
  }

  /**
   * Disconnect from Twitch chat
   */
  disconnect(): void {
    if (this.client && this.client.readyState() === 'OPEN') {
      this.client.disconnect();
    }
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Get the TMI client instance
   */
  getClient(): tmi.Client | null {
    return this.client;
  }

  /**
   * Get connection state
   */
  getState(): TmiClientState {
    return {
      client: this.client,
      isConnected: this.isConnected,
      error: this.error,
    };
  }

  /**
   * Check if connected
   */
  isReady(): boolean {
    return this.isConnected && this.client?.readyState() === 'OPEN';
  }
}

/**
 * Factory for creating TMI connection service
 */
export function createTmiConnectionService(): TmiConnectionService {
  return new TmiConnectionService();
}

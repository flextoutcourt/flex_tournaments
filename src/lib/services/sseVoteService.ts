/**
 * SSE Vote Service - Manages Server-Sent Events connection for vote streaming
 * Handles connection, batching, and disconnection
 */

export interface Vote {
  userId?: string;
  username?: string;
  vote: string;
  ts?: number;
  timestamp: number;
  tournamentId?: string;
}

export interface SSEConfig {
  tournamentId: string;
  subscribeUrl?: string;
  batchWindowMs?: number;
  maxBatchSize?: number;
}

export class SSEVoteService {
  private eventSource: EventSource | null = null;
  private config: Required<SSEConfig>;
  private isConnected: boolean = false;
  private error: string | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private onVoteBatch: ((votes: Vote[]) => void) | null = null;
  private voteBatch: Vote[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(config: SSEConfig) {
    this.config = {
      tournamentId: config.tournamentId,
      subscribeUrl:
        config.subscribeUrl || `/api/votes/${config.tournamentId}/subscribe`,
      batchWindowMs: config.batchWindowMs || 20,
      maxBatchSize: config.maxBatchSize || 100,
    };
  }

  /**
   * Connect to SSE stream
   */
  async connect(onBatch: (votes: Vote[]) => void): Promise<boolean> {
    console.log('[SSEVoteService] ========== CONNECT CALLED ==========');
    console.log('[SSEVoteService] Current state:', {
      isConnected: this.isConnected,
      eventSourceReady: this.eventSource?.readyState,
      subscribeUrl: this.config.subscribeUrl,
    });
    
    if (this.isConnected && this.eventSource?.readyState === EventSource.OPEN) {
      console.log('[SSEVoteService] ✅ Already connected');
      return true;
    }

    try {
      console.log('[SSEVoteService] 🔌 Attempting to connect to:', this.config.subscribeUrl);
      this.onVoteBatch = onBatch;
      this.eventSource = new EventSource(this.config.subscribeUrl);

      // Setup connection confirmation with timeout
      const openTimeout = setTimeout(() => {
        if (!this.isConnected) {
          this.isConnected = true;
          console.log('[SSEVoteService] ⏱️ Connected (timeout fallback after 1s)');
        }
      }, 1000);

      this.eventSource.addEventListener('open', () => {
        clearTimeout(openTimeout);
        this.isConnected = true;
        this.error = null;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        console.log('[SSEVoteService] ✅ Connected via open event');
      });

      this.eventSource.addEventListener('message', (event) => {
        console.log('[SSEVoteService] 📨 Received message event:');
        console.log('[SSEVoteService]   - event.data:', event.data);
        console.log('[SSEVoteService]   - event.data length:', event.data?.length);
        console.log('[SSEVoteService]   - type:', typeof event.data);
        this._handleMessage(event);
      });

      this.eventSource.addEventListener('error', () => {
        console.log('[SSEVoteService] ❌ Error event fired, readyState:', this.eventSource?.readyState);
        this._handleError();
      });

      console.log('[SSEVoteService] ✔️ EventSource created, readyState:', this.eventSource.readyState);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.error = errorMsg;
      this.isConnected = false;
      console.error('[SSEVoteService] ❌ Connection failed:', errorMsg);
      return false;
    }
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.isConnected = false;
    this.voteBatch = [];
  }

  /**
   * Flush pending votes
   */
  flushPending(): void {
    if (this.voteBatch.length > 0 && this.onVoteBatch) {
      const batch = [...this.voteBatch];
      this.voteBatch = [];
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
      }
      this.onVoteBatch(batch);
    }
  }

  /**
   * Get connection state
   */
  getState() {
    return {
      isConnected: this.isConnected,
      error: this.error,
      pendingVotes: this.voteBatch.length,
    };
  }

  /**
   * Handle incoming message
   */
  private _handleMessage(event: MessageEvent): void {
    try {
      console.log('[SSEVoteService] Parsing message:', {
        hasData: !!event.data,
        dataLength: event.data?.length,
        firstChars: event.data?.substring(0, 50),
      });
      
      const message = JSON.parse(event.data);
      
      console.log('[SSEVoteService] Parsed message:', {
        type: message.type,
        hasData: !!message.data,
        voteValue: message.data?.vote,
      });

      if (message.type === 'connected') {
        console.log('[SSEVoteService] ✔️ Connection confirmation received');
        return;
      }

      if (message.type === 'vote' && message.data) {
        console.log('[SSEVoteService] 🗳️ Vote added to batch:', {
          username: message.data.username,
          vote: message.data.vote,
          batchLength: this.voteBatch.length + 1,
        });
        this.voteBatch.push(message.data as Vote);
        this._scheduleBatchProcess();
      }
    } catch (err) {
      console.error('[SSEVoteService] Message parse error:', {
        error: err,
        eventData: event.data?.substring(0, 200),
      });
    }
  }

  /**
   * Schedule batch processing
   */
  private _scheduleBatchProcess(): void {
    if (this.voteBatch.length >= this.config.maxBatchSize) {
      console.log('[SSEVoteService] Max batch size reached, processing immediately:', {
        batchSize: this.voteBatch.length,
        maxBatchSize: this.config.maxBatchSize,
      });
      this._processBatch();
      return;
    }

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    const adaptiveWindow =
      this.voteBatch.length > 50
        ? this.config.batchWindowMs / 2
        : this.config.batchWindowMs;

    console.log('[SSEVoteService] Scheduling batch process:', {
      batchLength: this.voteBatch.length,
      windowMs: adaptiveWindow,
      configWindowMs: this.config.batchWindowMs,
    });

    this.batchTimer = setTimeout(() => {
      console.log('[SSEVoteService] Timer fired, processing batch');
      this._processBatch();
      this.batchTimer = null;
    }, adaptiveWindow);
  }

  /**
   * Process and dispatch batch
   */
  private _processBatch(): void {
    if (this.voteBatch.length === 0) {
      console.log('[SSEVoteService] No votes to process');
      return;
    }

    const batch = [...this.voteBatch];
    this.voteBatch = [];

    console.log('[SSEVoteService] Processing batch:', {
      batchSize: batch.length,
      hasCallback: !!this.onVoteBatch,
      votes: batch.map(v => ({ username: v.username, vote: v.vote })),
    });

    if (this.onVoteBatch) {
      this.onVoteBatch(batch);
    } else {
      console.warn('[SSEVoteService] No callback registered for batch processing!');
    }
  }

  /**
   * Handle connection error
   */
  private _handleError(): void {
    console.log('[SSEVoteService] Error handler called, readyState:', this.eventSource?.readyState, 'EventSource.CLOSED:', EventSource.CLOSED);
    
    if (this.eventSource?.readyState === EventSource.CLOSED) {
      this.isConnected = false;
      this.error = 'Connection closed';
      console.log('[SSEVoteService] Connection closed, auto-reconnecting in 3s');

      this.reconnectTimeout = setTimeout(() => {
        console.log('[SSEVoteService] Attempting reconnect...');
        if (this.onVoteBatch) {
          this.connect(this.onVoteBatch);
        }
      }, 3000);
    } else {
      this.error = 'Connection error';
      console.error('[SSEVoteService] Connection error (not closed), readyState:', this.eventSource?.readyState);
    }
  }
}

/**
 * QuickSOAP — Background Write Queue
 * Async FIFO queue for non-blocking database persistence.
 * User input is never blocked by writes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_STORAGE_KEY = '@quicksoap/write_queue';
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 100; // ms

export interface WriteOperation {
  id: string;
  table: string;
  recordId: string;
  data: Record<string, unknown>;
  type: 'insert' | 'upsert' | 'update' | 'delete';
  timestamp: number;
  retries?: number;
}

export type QueueStatus = 'idle' | 'processing' | 'error';
type WriteExecutor = (op: WriteOperation) => Promise<void>;

/** Generate a unique ID */
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

/**
 * Singleton background write queue.
 * Enqueue operations immediately; they are processed asynchronously
 * in FIFO order without blocking the UI thread.
 */
class WriteQueueManager {
  private queue: WriteOperation[] = [];
  private isProcessing = false;
  private executor: WriteExecutor | null = null;
  private statusListeners: Set<(status: QueueStatus) => void> = new Set();
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private _status: QueueStatus = 'idle';

  get status(): QueueStatus {
    return this._status;
  }

  get pendingCount(): number {
    return this.queue.length;
  }

  /** Set the function that actually executes writes against the DB */
  setExecutor(executor: WriteExecutor) {
    this.executor = executor;
    // If there are pending items, start processing
    if (this.queue.length > 0 && !this.isProcessing) {
      this.processQueue();
    }
  }

  /** Subscribe to status changes */
  onStatusChange(listener: (status: QueueStatus) => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private setStatus(status: QueueStatus) {
    this._status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  /**
   * Enqueue a write operation. Returns immediately.
   * Deduplicates by (table, recordId) — newer writes replace older ones.
   */
  enqueue(op: Omit<WriteOperation, 'id' | 'timestamp'>): void {
    const operation: WriteOperation = {
      ...op,
      id: generateId(),
      timestamp: Date.now(),
      retries: 0,
    };

    // Deduplicate: remove any existing operation for the same (table, recordId)
    const existingIndex = this.queue.findIndex(
      q => q.table === op.table && q.recordId === op.recordId && q.type !== 'insert'
    );
    if (existingIndex >= 0) {
      this.queue[existingIndex] = operation;
    } else {
      this.queue.push(operation);
    }

    // Persist queue to AsyncStorage for crash recovery
    this.persistQueue();

    // Trigger processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Enqueue with debounce — useful for text fields that change rapidly.
   * Groups writes by (table, recordId) key with 500ms debounce.
   */
  enqueueDebounced(
    op: Omit<WriteOperation, 'id' | 'timestamp'>,
    debounceMs = 500
  ): void {
    const key = `${op.table}:${op.recordId}`;

    // Clear existing timer for this key
    const existing = this.debounceTimers.get(key);
    if (existing) clearTimeout(existing);

    // Set new timer
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      this.enqueue(op);
    }, debounceMs);

    this.debounceTimers.set(key, timer);
  }

  /** Process the queue one item at a time in the background */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || !this.executor || this.queue.length === 0) return;

    this.isProcessing = true;
    this.setStatus('processing');

    while (this.queue.length > 0) {
      const operation = this.queue[0];

      try {
        await this.executor(operation);
        this.queue.shift(); // Remove successful operation
        await this.persistQueue();
      } catch (error) {
        const retries = (operation.retries ?? 0) + 1;

        if (retries >= MAX_RETRIES) {
          console.error(`WriteQueue: permanent failure for ${operation.table}/${operation.recordId}`, error);
          this.queue.shift(); // Remove failed operation after max retries
          this.setStatus('error');
          await this.persistQueue();
        } else {
          // Retry with exponential backoff
          operation.retries = retries;
          const delay = BASE_RETRY_DELAY * Math.pow(4, retries - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Yield to the event loop between operations
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    this.isProcessing = false;
    if (this._status !== 'error') {
      this.setStatus('idle');
    }
  }

  /** Flush all pending operations synchronously (used on app background/note completion) */
  async flush(): Promise<void> {
    // Cancel all debounce timers and enqueue immediately
    for (const [key, timer] of this.debounceTimers.entries()) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
    }

    if (!this.executor) return;

    while (this.queue.length > 0) {
      const operation = this.queue[0];
      try {
        await this.executor(operation);
        this.queue.shift();
      } catch (error) {
        console.error('WriteQueue flush error:', error);
        this.queue.shift(); // Skip on flush failure
      }
    }

    await this.persistQueue();
    this.isProcessing = false;
    this.setStatus('idle');
  }

  /** Persist queue to AsyncStorage for crash recovery */
  private async persistQueue(): Promise<void> {
    try {
      if (this.queue.length === 0) {
        await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      }
    } catch (error) {
      console.warn('WriteQueue: failed to persist queue', error);
    }
  }

  /** Restore queue from AsyncStorage on app launch */
  async restore(): Promise<number> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        const operations = JSON.parse(stored) as WriteOperation[];
        this.queue = operations;
        if (this.queue.length > 0 && this.executor) {
          this.processQueue();
        }
        return this.queue.length;
      }
    } catch (error) {
      console.warn('WriteQueue: failed to restore queue', error);
    }
    return 0;
  }

  /** Clear the queue (used in testing or reset) */
  clear(): void {
    this.queue = [];
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    this.isProcessing = false;
    this.setStatus('idle');
    AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
  }
}

/** Singleton instance */
export const writeQueue = new WriteQueueManager();

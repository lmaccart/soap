/**
 * QuickSOAP — Incident stopwatch hook
 * Uses Date.now() for drift-free timing. Persists start time for app backgrounding.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

interface StopwatchReturn {
  /** Elapsed time in milliseconds */
  elapsed: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  /** Formatted as HH:MM:SS */
  formattedTime: string;
  /** ISO string of when the stopwatch was started */
  startTime: string | null;
  /** Restore from a previously stored start time */
  restoreFrom: (isoStartTime: string) => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function useStopwatch(): StopwatchReturn {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startIsoRef = useRef<string | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed(Date.now() - startTimeRef.current);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
      tick(); // Immediate first tick
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const start = useCallback(() => {
    const now = Date.now();
    startTimeRef.current = now;
    startIsoRef.current = new Date(now).toISOString();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    startTimeRef.current = null;
    startIsoRef.current = null;
  }, []);

  const restoreFrom = useCallback((isoStartTime: string) => {
    const startMs = new Date(isoStartTime).getTime();
    startTimeRef.current = startMs;
    startIsoRef.current = isoStartTime;
    setElapsed(Date.now() - startMs);
    setIsRunning(true);
  }, []);

  return {
    elapsed,
    isRunning,
    start,
    stop,
    reset,
    formattedTime: formatElapsed(elapsed),
    startTime: startIsoRef.current,
    restoreFrom,
  };
}

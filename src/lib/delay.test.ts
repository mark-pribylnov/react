import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('resolves after the given duration', async () => {
    const promise = delay(500);
    await vi.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toBeUndefined();
  });
});

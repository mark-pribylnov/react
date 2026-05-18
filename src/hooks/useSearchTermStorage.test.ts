import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSearchTermStorage } from './useSearchTermStorage';

describe('useSearchTermStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('reads and persists search terms via localStorage', () => {
    const { result } = renderHook(() => useSearchTermStorage());

    expect(result.current.readSearchTerm()).toBe('');

    act(() => {
      result.current.persistSearchTerm('pikachu');
    });

    expect(result.current.readSearchTerm()).toBe('pikachu');
  });
});

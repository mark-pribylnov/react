import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getLastSearch,
  readSavedSearchTerm,
  saveSearchTerm,
} from './searchTermStorage';

describe('searchTermStorage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns empty string when storage is empty', () => {
    expect(readSavedSearchTerm()).toBe('');
    expect(getLastSearch()).toBe('');
  });

  it('reads a plain JSON string value', () => {
    localStorage.setItem('searchTerm', JSON.stringify('pikachu'));
    expect(readSavedSearchTerm()).toBe('pikachu');
  });

  it('reads last string from legacy JSON array', () => {
    localStorage.setItem('searchTerm', JSON.stringify(['a', 'b', 'c']));
    expect(readSavedSearchTerm()).toBe('c');
  });

  it('returns raw value when JSON is not array or string', () => {
    localStorage.setItem('searchTerm', JSON.stringify({ x: 1 }));
    expect(readSavedSearchTerm()).toBe('{"x":1}');
  });

  it('returns empty string when JSON.parse throws', () => {
    localStorage.setItem('searchTerm', '{');
    expect(readSavedSearchTerm()).toBe('');
  });

  it('writes search term to localStorage', () => {
    saveSearchTerm('eevee');
    expect(localStorage.getItem('searchTerm')).toBe('eevee');
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCacheTtlSeconds, getPokeApiBaseUrl } from './cacheConfig';

describe('cacheConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the default cache TTL when env is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_CACHE_TTL_SECONDS', '');
    expect(getCacheTtlSeconds()).toBe(60);
  });

  it('reads cache TTL from NEXT_PUBLIC_CACHE_TTL_SECONDS', () => {
    vi.stubEnv('NEXT_PUBLIC_CACHE_TTL_SECONDS', '120');
    expect(getCacheTtlSeconds()).toBe(120);
  });

  it('falls back to default for invalid TTL values', () => {
    vi.stubEnv('NEXT_PUBLIC_CACHE_TTL_SECONDS', 'not-a-number');
    expect(getCacheTtlSeconds()).toBe(60);
  });

  it('uses the default PokeAPI base URL when env is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEAPI_BASE_URL', '');
    expect(getPokeApiBaseUrl()).toBe('https://pokeapi.co/api/v2');
  });

  it('reads base URL from NEXT_PUBLIC_POKEAPI_BASE_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEAPI_BASE_URL', 'https://example.test/api/v2');
    expect(getPokeApiBaseUrl()).toBe('https://example.test/api/v2');
  });
});

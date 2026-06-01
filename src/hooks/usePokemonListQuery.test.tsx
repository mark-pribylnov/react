import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createMockFetchResponse,
  getFetchRequestUrl,
} from '../test-utils/createMockFetchResponse';
import { setupStore } from '../store/store';
import { usePokemonListQuery } from './usePokemonListQuery';

function createWrapper(store = setupStore()) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

function installListFetchMock() {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = getFetchRequestUrl(input);

    if (url.includes('search=')) {
      return createMockFetchResponse({
        results: [{ name: 'pikachu' }],
      });
    }

    if (url.includes('?limit=')) {
      return createMockFetchResponse({
        results: [{ name: 'mew' }],
      });
    }

    return createMockFetchResponse({
      name: url.includes('pikachu') ? 'pikachu' : 'mew',
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
    });
  });
}

describe('usePokemonListQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loading', () => {
    it('reports loading while the first page is being fetched', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(
        (input) =>
          new Promise((resolve) => {
            setTimeout(() => {
              const url = getFetchRequestUrl(input);
              if (url.includes('?limit=')) {
                resolve(
                  createMockFetchResponse({
                    results: [{ name: 'mew' }],
                  })
                );
                return;
              }

              resolve(
                createMockFetchResponse({
                  name: 'mew',
                  stats: [{ base_stat: 100, stat: { name: 'hp' } }],
                })
              );
            }, 50);
          })
      );

      const { result } = renderHook(() => usePokemonListQuery(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.results).toEqual([]);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.results[0]?.name).toBe('mew');
    });
  });

  describe('errors', () => {
    it('returns a human-readable error when the first page request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' })
      );

      const { result } = renderHook(() => usePokemonListQuery(''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.errorMessage).toBe(
          'Server error. Please try again in a moment.'
        );
      });
      expect(result.current.results).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('returns a human-readable error when a search request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' })
      );

      const { result } = renderHook(() => usePokemonListQuery('pika'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.errorMessage).toBe(
          'Server error. Please try again in a moment.'
        );
      });
      expect(result.current.results).toEqual([]);
    });
  });

  describe('caching', () => {
    it('reuses cached first-page data without refetching', async () => {
      const fetchMock = installListFetchMock();
      const store = setupStore();
      const wrapper = createWrapper(store);

      const { result, rerender } = renderHook(
        ({ term }) => usePokemonListQuery(term),
        {
          wrapper,
          initialProps: { term: '' as string | null },
        }
      );

      await waitFor(() => {
        expect(result.current.results[0]?.name).toBe('mew');
      });
      expect(fetchMock).toHaveBeenCalled();

      fetchMock.mockClear();
      rerender({ term: null });
      rerender({ term: '' });

      await waitFor(() => {
        expect(result.current.results[0]?.name).toBe('mew');
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reuses cached search results without refetching', async () => {
      const fetchMock = installListFetchMock();
      const store = setupStore();
      const wrapper = createWrapper(store);

      const { result, rerender } = renderHook(
        ({ term }) => usePokemonListQuery(term),
        {
          wrapper,
          initialProps: { term: 'pika' as string | null },
        }
      );

      await waitFor(() => {
        expect(result.current.results[0]?.name).toBe('pikachu');
      });

      fetchMock.mockClear();
      rerender({ term: null });
      rerender({ term: 'pika' });

      await waitFor(() => {
        expect(result.current.results[0]?.name).toBe('pikachu');
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});

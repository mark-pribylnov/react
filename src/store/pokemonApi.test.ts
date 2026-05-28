import { afterEach, describe, expect, it, vi } from 'vitest';
import { mapPokemonResponse } from '../lib/pokemonMappers';
import { createMockFetchResponse, getFetchRequestUrl } from '../test-utils/createMockFetchResponse';
import { setupStore } from '../store/store';
import { invalidateAllPokemonCache, pokemonApi } from '../store/pokemonApi';

describe('pokemonApi (RTK Query)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for empty pokemon query', async () => {
    const store = setupStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('   ')
    );

    expect(result.data).toBeNull();
  });

  it('fetches a single pokemon', async () => {
    const payload = {
      name: 'ditto',
      stats: [{ base_stat: 48, stat: { name: 'hp' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockFetchResponse(payload));

    const store = setupStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('Ditto')
    );

    expect(result.data).toEqual(mapPokemonResponse(payload));
    expect(getFetchRequestUrl(globalThis.fetch.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/ditto'
    );
  });

  it('fetches first page list and details', async () => {
    const list = {
      results: [{ name: 'a' }, { name: 'b' }],
    };
    const detail = {
      name: 'a',
      stats: [{ base_stat: 1, stat: { name: 'speed' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const u = getFetchRequestUrl(input);
      if (u.includes('?limit=')) {
        return createMockFetchResponse(list);
      }
      return createMockFetchResponse(detail);
    });

    const store = setupStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getFirstPagePokemon.initiate()
    );

    expect(result.data).toHaveLength(2);
    expect(result.data?.[0]?.name).toBe('a');
  });

  it('fetches matching search results and filters by substring', async () => {
    const list = {
      results: [{ name: 'abra' }, { name: 'kadabra' }, { name: 'other' }],
    };
    const detailAbra = {
      name: 'abra',
      stats: [{ base_stat: 1, stat: { name: 'hp' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const u = getFetchRequestUrl(input);
      if (u.includes('search=')) {
        return createMockFetchResponse(list);
      }
      return createMockFetchResponse(detailAbra);
    });

    const store = setupStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonSearchResults.initiate('abra')
    );

    expect(result.data?.length).toBeGreaterThanOrEqual(1);
    expect(result.data?.some((row: { name: string }) => row.name === 'abra')).toBe(
      true
    );
  });

  it('invalidates cached pokemon queries', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        createMockFetchResponse({
          name: 'ditto',
          stats: [{ base_stat: 48, stat: { name: 'hp' } }],
        })
      );
    vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock);

    const store = setupStore();
    await store.dispatch(pokemonApi.endpoints.getPokemonByName.initiate('ditto'));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    invalidateAllPokemonCache(store.dispatch);
    await store.dispatch(pokemonApi.endpoints.getPokemonByName.initiate('ditto'));

    expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
  });
});

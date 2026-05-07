import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from '../lib/httpError';
import { PokemonApi } from './pokemonApi';

describe('PokemonApi', () => {
  const api = new PokemonApi();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for empty pokemon query', async () => {
    await expect(api.fetchPokemon('   ')).resolves.toBeNull();
  });

  it('fetches a single pokemon', async () => {
    const payload = {
      name: 'ditto',
      stats: [{ base_stat: 48, stat: { name: 'hp' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await api.fetchPokemon('Ditto');
    expect(result).toEqual({
      name: 'ditto',
      stats: ['hp - 48'],
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/ditto'
    );
  });

  it('throws HttpError when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: async () => ({}),
    } as Response);

    await expect(api.fetchPokemon('x')).rejects.toBeInstanceOf(HttpError);
  });

  it('fetches first page list and details', async () => {
    const list = {
      results: [{ name: 'a' }, { name: 'b' }],
    };
    const detail = {
      name: 'a',
      stats: [{ base_stat: 1, stat: { name: 'speed' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes('?limit=')) {
        return {
          ok: true,
          json: async () => list,
        } as Response;
      }
      return {
        ok: true,
        json: async () => detail,
      } as Response;
    });

    const rows = await api.fetchFirstPagePokemon();
    expect(rows).toHaveLength(2);
    expect(rows[0]?.name).toBe('a');
  });

  it('fetches matching first page and filters by substring', async () => {
    const list = {
      results: [
        { name: 'abra' },
        { name: 'kadabra' },
        { name: 'other' },
      ],
    };
    const detailAbra = {
      name: 'abra',
      stats: [{ base_stat: 1, stat: { name: 'hp' } }],
    };
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes('search=')) {
        return {
          ok: true,
          json: async () => list,
        } as Response;
      }
      return {
        ok: true,
        json: async () => detailAbra,
      } as Response;
    });

    const rows = await api.fetchFirstPageMatchingPokemon('abra');
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows.some((r) => r.name === 'abra')).toBe(true);
  });
});

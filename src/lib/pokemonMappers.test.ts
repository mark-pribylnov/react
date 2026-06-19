import { describe, expect, it } from 'vitest';
import { mapPokemonResponse } from './pokemonMappers';

describe('mapPokemonResponse', () => {
  it('maps stats and prefers official artwork image url', () => {
    const result = mapPokemonResponse({
      name: 'ditto',
      stats: [{ base_stat: 48, stat: { name: 'hp' } }],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
        other: {
          'official-artwork': {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png',
          },
        },
      },
    });

    expect(result).toEqual({
      name: 'ditto',
      stats: ['hp - 48'],
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png',
    });
  });

  it('falls back to front_default sprite when artwork is missing', () => {
    const result = mapPokemonResponse({
      name: 'mew',
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
      },
    });

    expect(result.imageUrl).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png'
    );
  });
});

import type { PokemonResponse, PokemonResult } from '../types/pokemon';

export function mapPokemonResponse(pokemonData: PokemonResponse): PokemonResult {
  return {
    name: pokemonData.name,
    stats: pokemonData.stats.map(
      (stat) => `${stat.stat.name} - ${stat.base_stat}`
    ),
  };
}

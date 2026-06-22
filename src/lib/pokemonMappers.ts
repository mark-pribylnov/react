import type { PokemonResponse, PokemonResult } from '../types/pokemon';

function getPokemonImageUrl(pokemonData: PokemonResponse): string | null {
  return (
    pokemonData.sprites?.other?.['official-artwork']?.front_default ??
    pokemonData.sprites?.front_default ??
    null
  );
}

export function mapPokemonResponse(pokemonData: PokemonResponse): PokemonResult {
  return {
    name: pokemonData.name,
    stats: pokemonData.stats.map(
      (stat) => `${stat.stat.name} - ${stat.base_stat}`
    ),
    imageUrl: getPokemonImageUrl(pokemonData),
  };
}

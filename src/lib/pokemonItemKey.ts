import type { PokemonResult } from '../types/pokemon';

export function getPokemonItemKey(item: PokemonResult): string {
  return `${item.name}|${item.stats.join('|')}`;
}

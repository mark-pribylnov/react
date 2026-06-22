import { buildListSearchParams } from './searchParams';
import type { SelectedPokemonItem } from '../types/selectedPokemonItem';

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildPokemonDetailsUrl(
  listIndex: number,
  origin: string
): string {
  const search = buildListSearchParams({ page: 1, detailsIndex: listIndex });
  return `${origin}/details${search}`;
}

export function buildPokemonDescription(
  pokemon: SelectedPokemonItem['pokemon']
): string {
  return `Base stats: ${pokemon.stats.join(', ')}`;
}

export function getSelectedItemsDownloadFileName(itemCount: number): string {
  return `${itemCount}_items.csv`;
}

export function buildSelectedItemsCsvContent(
  items: SelectedPokemonItem[],
  origin: string
): string {
  const header = ['name', 'description', 'details url', 'stats'];
  const rows = items.map(({ pokemon, listIndex }) => [
    pokemon.name,
    buildPokemonDescription(pokemon),
    buildPokemonDetailsUrl(listIndex, origin),
    pokemon.stats.join(' | '),
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');
}

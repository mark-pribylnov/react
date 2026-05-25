import { buildListSearchParams } from './searchParams';
import type { SelectedPokemonItem } from '../types/selectedPokemonItem';

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildPokemonDetailsUrl(listIndex: number): string {
  const search = buildListSearchParams({ page: 1, detailsIndex: listIndex });
  return `${window.location.origin}/details${search}`;
}

export function buildPokemonDescription(pokemon: SelectedPokemonItem['pokemon']): string {
  return `Base stats: ${pokemon.stats.join(', ')}`;
}

export function getSelectedItemsDownloadFileName(itemCount: number): string {
  return `${itemCount}_items.csv`;
}

export function buildSelectedItemsCsvContent(items: SelectedPokemonItem[]): string {
  const header = ['name', 'description', 'details url', 'stats'];
  const rows = items.map(({ pokemon, listIndex }) => [
    pokemon.name,
    buildPokemonDescription(pokemon),
    buildPokemonDetailsUrl(listIndex),
    pokemon.stats.join(' | '),
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');
}

export function downloadSelectedItemsCsv(items: SelectedPokemonItem[]): void {
  const csv = buildSelectedItemsCsvContent(items);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = getSelectedItemsDownloadFileName(items.length);
  link.click();
  URL.revokeObjectURL(url);
}

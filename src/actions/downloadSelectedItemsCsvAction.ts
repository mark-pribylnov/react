'use server';

import {
  buildSelectedItemsCsvContent,
  getSelectedItemsDownloadFileName,
} from '../lib/buildSelectedItemsCsv';
import type { SelectedPokemonItem } from '../types/selectedPokemonItem';

export type DownloadCsvState = {
  csv: string | null;
  fileName: string | null;
  error: string | null;
};

export async function downloadSelectedItemsCsvAction(
  _prevState: DownloadCsvState,
  formData: FormData
): Promise<DownloadCsvState> {
  const itemsValue = formData.get('items');
  const originValue = formData.get('origin');

  if (typeof itemsValue !== 'string' || typeof originValue !== 'string') {
    return { csv: null, fileName: null, error: 'Invalid download request.' };
  }

  let items: SelectedPokemonItem[];

  try {
    items = JSON.parse(itemsValue) as SelectedPokemonItem[];
  } catch {
    return { csv: null, fileName: null, error: 'Invalid selected items data.' };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { csv: null, fileName: null, error: 'No items selected.' };
  }

  const csv = buildSelectedItemsCsvContent(items, originValue);

  return {
    csv,
    fileName: getSelectedItemsDownloadFileName(items.length),
    error: null,
  };
}

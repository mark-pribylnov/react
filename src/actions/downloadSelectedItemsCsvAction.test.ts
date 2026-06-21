import { describe, expect, it } from 'vitest';
import { downloadSelectedItemsCsvAction } from './downloadSelectedItemsCsvAction';

const initialState = {
  csv: null,
  fileName: null,
  error: null,
};

describe('downloadSelectedItemsCsvAction', () => {
  it('generates csv content on the server', async () => {
    const formData = new FormData();
    formData.set(
      'items',
      JSON.stringify([
        {
          pokemon: { name: 'mew', stats: ['hp - 100'] },
          listIndex: 1,
        },
      ])
    );
    formData.set('origin', 'http://localhost:3000');

    const result = await downloadSelectedItemsCsvAction(initialState, formData);

    expect(result.error).toBeNull();
    expect(result.fileName).toBe('1_items.csv');
    expect(result.csv).toContain('mew');
    expect(result.csv).toContain('http://localhost:3000/details?details=1');
  });

  it('returns an error when no items are provided', async () => {
    const formData = new FormData();
    formData.set('items', JSON.stringify([]));
    formData.set('origin', 'http://localhost:3000');

    const result = await downloadSelectedItemsCsvAction(initialState, formData);

    expect(result.csv).toBeNull();
    expect(result.error).toBe('No items selected.');
  });
});

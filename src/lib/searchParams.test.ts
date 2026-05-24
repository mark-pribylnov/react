import { describe, expect, it, vi } from 'vitest';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
} from './searchParams';
import {
  buildPokemonDetailsUrl,
  buildSelectedItemsCsvContent,
  downloadSelectedItemsCsv,
  getSelectedItemsDownloadFileName,
} from './downloadSelectedItemsCsv';

describe('searchParams', () => {
  it('reads page and details index from search params', () => {
    const params = new URLSearchParams('page=2&details=3');

    expect(readPageFromSearchParams(params)).toBe(2);
    expect(readDetailsIndexFromSearchParams(params)).toBe(3);
  });

  it('defaults invalid values safely', () => {
    const params = new URLSearchParams('page=0&details=abc');

    expect(readPageFromSearchParams(params)).toBe(1);
    expect(readDetailsIndexFromSearchParams(params)).toBeNull();
  });

  it('builds list search params for page and details', () => {
    expect(buildListSearchParams({ page: 1, detailsIndex: null })).toBe('');
    expect(buildListSearchParams({ page: 2, detailsIndex: 5 })).toBe(
      '?page=2&details=5'
    );
    expect(buildListSearchParams({ page: 1, detailsIndex: 2 })).toBe(
      '?details=2'
    );
  });
});

describe('downloadSelectedItemsCsv', () => {
  it('builds a details url for the selected list index', () => {
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:5173' },
    });

    expect(buildPokemonDetailsUrl(3)).toBe(
      'http://localhost:5173/details?details=3'
    );

    vi.unstubAllGlobals();
  });

  it('builds csv content with name, description, details url, and stats', () => {
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:5173' },
    });

    const csv = buildSelectedItemsCsvContent([
      {
        pokemon: { name: 'mew', stats: ['hp - 100', 'attack - 50'] },
        listIndex: 1,
      },
    ]);

    expect(csv).toContain('name,description,details url,stats');
    expect(csv).toContain('mew');
    expect(csv).toContain('Base stats: hp - 100, attack - 50');
    expect(csv).toContain('http://localhost:5173/details?details=1');
    expect(csv).toContain('hp - 100 | attack - 50');

    vi.unstubAllGlobals();
  });

  it('uses the selected count in the download file name', () => {
    expect(getSelectedItemsDownloadFileName(15)).toBe('15_items.csv');
  });

  it('downloads csv using native browser apis', () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:test');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    const link = document.createElement('a');
    const click = vi.spyOn(link, 'click').mockImplementation(() => undefined);
    const createElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(link);

    downloadSelectedItemsCsv([
      {
        pokemon: { name: 'mew', stats: ['hp - 100'] },
        listIndex: 1,
      },
    ]);

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(createElement).toHaveBeenCalledWith('a');
    expect(link.download).toBe('1_items.csv');
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');

    createElement.mockRestore();
    vi.unstubAllGlobals();
  });
});

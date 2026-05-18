import { describe, expect, it } from 'vitest';
import {
  buildListSearchParams,
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
} from './searchParams';

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

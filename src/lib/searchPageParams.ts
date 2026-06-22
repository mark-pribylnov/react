import {
  readDetailsIndexFromSearchParams,
  readPageFromSearchParams,
  readSearchFromSearchParams,
} from '../lib/searchParams';

export type SearchPageParams = {
  currentPage: number;
  detailsIndex: number | null;
  searchTerm: string;
};

export function toUrlSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      params.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      params.set(key, value[0]);
    }
  }

  return params;
}

export function parseSearchPageParams(
  searchParams: Record<string, string | string[] | undefined>
): SearchPageParams {
  const params = toUrlSearchParams(searchParams);

  return {
    currentPage: readPageFromSearchParams(params),
    detailsIndex: readDetailsIndexFromSearchParams(params),
    searchTerm: readSearchFromSearchParams(params),
  };
}

const PAGE_PARAM = 'page';
const DETAILS_PARAM = 'details';
const SEARCH_PARAM = 'search';

export const RESULTS_ITEMS_PER_PAGE = 10;

export function readPageFromSearchParams(params: URLSearchParams): number {
  const raw = params.get(PAGE_PARAM);
  const parsed = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export function readDetailsIndexFromSearchParams(
  params: URLSearchParams
): number | null {
  const raw = params.get(DETAILS_PARAM);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : null;
}

export function readSearchFromSearchParams(params: URLSearchParams): string {
  return params.get(SEARCH_PARAM)?.trim() ?? '';
}

export function buildListSearchParams(options: {
  page: number;
  detailsIndex?: number | null;
  search?: string | null;
}): string {
  const params = new URLSearchParams();

  if (options.search?.trim()) {
    params.set(SEARCH_PARAM, options.search.trim());
  }

  if (options.page > 1) {
    params.set(PAGE_PARAM, String(options.page));
  }

  if (options.detailsIndex != null && options.detailsIndex >= 1) {
    params.set(DETAILS_PARAM, String(options.detailsIndex));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function paginateResults<T>(items: T[], currentPage: number): T[] {
  const startIndex = (currentPage - 1) * RESULTS_ITEMS_PER_PAGE;
  return items.slice(startIndex, startIndex + RESULTS_ITEMS_PER_PAGE);
}

export function getTotalPages(itemCount: number): number {
  if (itemCount === 0) {
    return 0;
  }

  return Math.ceil(itemCount / RESULTS_ITEMS_PER_PAGE);
}

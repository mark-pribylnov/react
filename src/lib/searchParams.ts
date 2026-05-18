const PAGE_PARAM = 'page';
const DETAILS_PARAM = 'details';

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

export function buildListSearchParams(options: {
  page: number;
  detailsIndex?: number | null;
}): string {
  const params = new URLSearchParams();

  if (options.page > 1) {
    params.set(PAGE_PARAM, String(options.page));
  }

  if (options.detailsIndex != null && options.detailsIndex >= 1) {
    params.set(DETAILS_PARAM, String(options.detailsIndex));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

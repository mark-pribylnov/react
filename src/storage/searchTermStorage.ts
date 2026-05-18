const SEARCH_TERM_KEY = 'searchTerm';

export function readSavedSearchTerm(): string {
  const raw = localStorage.getItem(SEARCH_TERM_KEY);
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const strings = parsed.filter((v): v is string => typeof v === 'string');
      return strings.at(-1) ?? '';
    }
    return typeof parsed === 'string' ? parsed : raw;
  } catch {
    return raw;
  }
}

export function saveSearchTerm(term: string): void {
  localStorage.setItem(SEARCH_TERM_KEY, term);
}

export function getLastSearch(): string {
  return readSavedSearchTerm();
}

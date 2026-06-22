import { vi } from 'vitest';

let pathname = '/';
let searchParams = new URLSearchParams();
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const navigationMock = {
  get pathname() {
    return pathname;
  },
  get searchParams() {
    return searchParams;
  },
  push: vi.fn((url: string) => {
    const parsed = new URL(url, 'http://localhost');
    pathname = parsed.pathname;
    searchParams = parsed.searchParams;
    notifyListeners();
  }),
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    pathname = '/';
    searchParams = new URLSearchParams();
    navigationMock.push.mockClear();
    notifyListeners();
  },
  setInitialEntry(entry: string) {
    const parsed = new URL(entry, 'http://localhost');
    pathname = parsed.pathname;
    searchParams = parsed.searchParams;
  },
};

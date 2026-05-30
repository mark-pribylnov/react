import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import ItemDetailsPanel from './components/ItemDetailsPanel/ItemDetailsPanel';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import AboutPage from './pages/AboutPage/AboutPage';
import AppLayout from './layouts/AppLayout';
import { setupStore } from './store/store';
import { createMockFetchResponse, getFetchRequestUrl } from './test-utils/createMockFetchResponse';

type TestListItem = { name: string; stats?: string[] };

const mockFetch = vi.hoisted(() => vi.fn());
const testListItems = vi.hoisted(
  (): TestListItem[] => [{ name: 'mew', stats: ['hp - 100'] }]
);
const searchListItems = vi.hoisted(
  (): TestListItem[] => [{ name: 'mew', stats: ['hp - 100'] }]
);
const searchErrorTerm = vi.hoisted(() => ({ current: null as string | null }));

function createPokemonDetail(name: string) {
  const listItem = [...testListItems, ...searchListItems].find(
    (item) => item.name === name
  );
  if (listItem?.stats?.length === 1 && listItem.stats[0] === 'hp - 100') {
    return {
      name,
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
    };
  }
  if (name === 'eevee') {
    return {
      name,
      stats: [{ base_stat: 55, stat: { name: 'hp' } }],
    };
  }
  return {
    name,
    stats: [{ base_stat: 1, stat: { name: 'hp' } }],
  };
}

function installFetchMock() {
  mockFetch.mockImplementation(async (input: RequestInfo | URL) => {
    const url = getFetchRequestUrl(input);

    if (url.includes('search=')) {
      const searchTerm = new URL(url).searchParams.get('search');
      if (searchErrorTerm.current && searchTerm === searchErrorTerm.current) {
        return createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' });
      }

      return createMockFetchResponse({
        results: searchListItems.map((item) => ({ name: item.name })),
      });
    }

    if (url.includes('?limit=')) {
      return createMockFetchResponse({
        results: testListItems.map((item) => ({ name: item.name })),
      });
    }

    const slug = url.match(/\/pokemon\/([^/?]+)/)?.[1] ?? 'mew';
    return createMockFetchResponse(createPokemonDetail(decodeURIComponent(slug)));
  });

  vi.spyOn(globalThis, 'fetch').mockImplementation(mockFetch);
}

vi.mock('./storage/searchTermStorage', () => ({
  getLastSearch: vi.fn(() => ''),
  saveSearchTerm: vi.fn(),
}));

vi.mock('./lib/delay', () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

const downloadSelectedItemsCsv = vi.hoisted(() => vi.fn());

vi.mock('./lib/downloadSelectedItemsCsv', () => ({
  downloadSelectedItemsCsv,
}));

import App from './App';
import { getLastSearch, saveSearchTerm } from './storage/searchTermStorage';

const fixtures = [{ name: 'mew', stats: ['hp - 100'] }];

function resetFetchFixtures() {
  testListItems.length = 0;
  testListItems.push(...fixtures);
  searchListItems.length = 0;
  searchListItems.push(...fixtures);
  searchErrorTerm.current = null;
  installFetchMock();
}

function countFetchCalls(matcher: (url: string) => boolean): number {
  return mockFetch.mock.calls.filter(([input]) =>
    matcher(getFetchRequestUrl(input))
  ).length;
}

function renderApp(initialEntries: string[] = ['/']) {
  const store = setupStore();
  const user = userEvent.setup();

  return {
    user,
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<App />}>
                  <Route path="details" element={<ItemDetailsPanel />} />
                </Route>
                <Route path="/about" element={<AboutPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
  };
}

beforeEach(() => {
  vi.mocked(getLastSearch).mockReturnValue('');
  resetFetchFixtures();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.mocked(getLastSearch).mockReturnValue('');
  resetFetchFixtures();
});

describe('App', () => {
  it('shows a loading indicator while list data is being fetched', async () => {
    mockFetch.mockImplementation(async (input) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const url = getFetchRequestUrl(input);

      if (url.includes('search=')) {
        const searchTerm = new URL(url).searchParams.get('search');
        if (searchErrorTerm.current && searchTerm === searchErrorTerm.current) {
          return createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' });
        }

        return createMockFetchResponse({
          results: searchListItems.map((item) => ({ name: item.name })),
        });
      }

      if (url.includes('?limit=')) {
        return createMockFetchResponse({
          results: testListItems.map((item) => ({ name: item.name })),
        });
      }

      const slug = url.match(/\/pokemon\/([^/?]+)/)?.[1] ?? 'mew';
      return createMockFetchResponse(createPokemonDetail(decodeURIComponent(slug)));
    });

    renderApp();
    expect(screen.getByRole('status')).toHaveTextContent(/loading results/i);
    expect(await screen.findByText(/mew/i)).toBeInTheDocument();
  });

  it('reuses cached list data when navigating away and back', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    const limitCalls = countFetchCalls((url) => url.includes('?limit=32'));

    await user.click(screen.getByRole('link', { name: /about/i }));
    await screen.findByRole('heading', { name: /about/i });

    await user.click(screen.getByRole('link', { name: /search/i }));
    await screen.findByText(/mew/i);

    expect(countFetchCalls((url) => url.includes('?limit=32'))).toBe(limitCalls);
  });

  it('reuses cached detail data when reopening the same item', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.click(screen.getByText(/1\) mew/i));
    expect(
      await screen.findByRole('heading', { name: 'mew', level: 3 })
    ).toBeInTheDocument();

    const detailCalls = countFetchCalls((url) => url.includes('/pokemon/mew'));

    await user.click(screen.getByRole('heading', { name: /result area/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByText(/1\) mew/i));
    expect(
      await screen.findByRole('heading', { name: 'mew', level: 3 })
    ).toBeInTheDocument();
    expect(countFetchCalls((url) => url.includes('/pokemon/mew'))).toBe(
      detailCalls
    );
  });

  it('loads results on mount using mocked API', async () => {
    renderApp();
    expect(await screen.findByText(/mew/i)).toBeInTheDocument();
    expect(countFetchCalls((url) => url.includes('?limit=32'))).toBeGreaterThan(0);
  });

  it('saves trimmed search term and runs a matching search on submit', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.clear(screen.getByLabelText(/search terms/i));
    await user.type(screen.getByLabelText(/search terms/i), '  eevee  ');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    await waitFor(() => {
      expect(saveSearchTerm).toHaveBeenCalledWith('eevee');
    });
    expect(countFetchCalls((url) => url.includes('search=eevee'))).toBeGreaterThan(
      0
    );
  });

  it('does not call the API again when the trimmed search is unchanged', async () => {
    vi.mocked(getLastSearch).mockReturnValue('pika');
    searchListItems.length = 0;
    searchListItems.push({ name: 'pikachu', stats: ['hp - 35'] });
    const { user } = renderApp();
    await screen.findByText(/pikachu/i);
    const calls = countFetchCalls((url) => url.includes('search='));
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(countFetchCalls((url) => url.includes('search='))).toBe(calls);
  });

  it('shows no-results copy when the API returns an empty list', async () => {
    searchListItems.length = 0;
    searchListItems.push({ name: 'other', stats: ['hp - 1'] });
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.clear(screen.getByLabelText(/search terms/i));
    await user.type(screen.getByLabelText(/search terms/i), 'missingmon');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(
      await screen.findByText(/no results found for this search/i)
    ).toBeInTheDocument();
  });

  it('shows an error message when the API layer throws', async () => {
    searchErrorTerm.current = 'x';
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.clear(screen.getByLabelText(/search terms/i));
    await user.type(screen.getByLabelText(/search terms/i), 'x');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(
      await screen.findByText('Server error. Please try again in a moment.')
    ).toBeInTheDocument();
  });

  it('shows an error message when the initial list request fails', async () => {
    mockFetch.mockImplementation(async (input) => {
      const url = getFetchRequestUrl(input);

      if (url.includes('?limit=')) {
        return createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' });
      }

      return createMockFetchResponse(createPokemonDetail('mew'));
    });

    renderApp();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Server error. Please try again in a moment.');
  });

  it('stores checkbox selections in Redux and keeps them across route navigation', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);

    const checkbox = screen.getByRole('checkbox', { name: /select mew/i });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(screen.getByRole('link', { name: /about/i }));
    expect(
      await screen.findByRole('heading', { name: /about/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /search/i }));
    await screen.findByText(/mew/i);
    expect(screen.getByRole('checkbox', { name: /select mew/i })).toBeChecked();
  });

  it('removes an item from Redux when its checkbox is unchecked', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);

    const checkbox = screen.getByRole('checkbox', { name: /select mew/i });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('shows the flyout with selected count and hides it after unselect all', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);

    expect(
      screen.queryByRole('region', { name: /selected items/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /select mew/i }));
    expect(screen.getByRole('region', { name: /selected items/i })).toHaveTextContent(
      /1 item selected/i
    );

    await user.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(
      screen.queryByRole('region', { name: /selected items/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /select mew/i })).not.toBeChecked();
  });

  it('downloads selected items from the flyout', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);

    await user.click(screen.getByRole('checkbox', { name: /select mew/i }));
    await user.click(screen.getByRole('button', { name: /^download$/i }));

    expect(downloadSelectedItemsCsv).toHaveBeenCalledWith([
      { pokemon: { name: 'mew', stats: ['hp - 100'] }, listIndex: 1 },
    ]);
  });

  it('keeps checkbox selections when switching result pages', async () => {
    testListItems.length = 0;
    testListItems.push(
      ...Array.from({ length: 11 }, (_, index) => ({
        name: `pokemon-${index + 1}`,
        stats: ['hp - 1'],
      }))
    );
    installFetchMock();

    const { user } = renderApp(['/?page=2']);
    const checkbox = await screen.findByRole('checkbox', {
      name: /select pokemon-11/i,
    });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(screen.getByRole('button', { name: /previous page/i }));
    await user.click(screen.getByRole('button', { name: /next page/i }));

    expect(
      screen.getByRole('checkbox', { name: /select pokemon-11/i })
    ).toBeChecked();
  });

  it('opens and closes the details panel from the results list', async () => {
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.click(screen.getByText(/1\) mew/i));
    expect(
      await screen.findByRole('heading', { name: 'mew' })
    ).toBeInTheDocument();
    expect(countFetchCalls((url) => url.includes('/pokemon/mew'))).toBeGreaterThan(
      0
    );

    await user.click(screen.getByRole('heading', { name: /result area/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument();
    });
  });

  it('switches details to another item while keeping the panel open', async () => {
    testListItems.length = 0;
    testListItems.push(
      { name: 'mew', stats: ['hp - 100'] },
      { name: 'eevee', stats: ['hp - 55'] }
    );
    installFetchMock();

    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.click(screen.getByText(/1\) mew/i));
    expect(
      await screen.findByRole('heading', { name: 'mew', level: 3 })
    ).toBeInTheDocument();

    await user.click(screen.getByText(/2\) eevee/i));
    expect(
      await screen.findByRole('heading', { name: 'eevee', level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(countFetchCalls((url) => url.includes('/pokemon/eevee'))).toBeGreaterThan(
      0
    );
  });

  it('shows the page from the URL query param', async () => {
    testListItems.length = 0;
    testListItems.push(
      ...Array.from({ length: 11 }, (_, index) => ({
        name: `pokemon-${index + 1}`,
        stats: ['hp - 1'],
      }))
    );
    installFetchMock();

    renderApp(['/?page=2']);

    expect(await screen.findByText(/pokemon-11/i)).toBeInTheDocument();
    expect(screen.queryByText(/pokemon-1\)/i)).not.toBeInTheDocument();
  });

  it('shows the error boundary fallback when the test error button is used', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user } = renderApp();
    try {
      await screen.findByText(/mew/i);
      await user.click(
        screen.getByRole('button', { name: /test error boundary/i })
      );
      expect(
        await screen.findByRole('heading', { name: /something went wrong/i })
      ).toBeInTheDocument();
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

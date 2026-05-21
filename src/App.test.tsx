import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import ItemDetailsPanel from './components/ItemDetailsPanel/ItemDetailsPanel';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { HttpError } from './lib/httpError';
import AppLayout from './layouts/AppLayout';
import AboutPage from './pages/AboutPage/AboutPage';
import { setupStore } from './store/store';

const fetchFirstPagePokemon = vi.hoisted(() => vi.fn());
const fetchPokemonSearchResults = vi.hoisted(() => vi.fn());
const fetchOnePokemon = vi.hoisted(() =>
  vi.fn(async (name: string) => ({
    name,
    stats: ['hp - 100', 'attack - 50'],
  }))
);

vi.mock('./storage/searchTermStorage', () => ({
  getLastSearch: vi.fn(() => ''),
  saveSearchTerm: vi.fn(),
}));

vi.mock('./lib/delay', () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

vi.mock('./services/pokemonApi', () => ({
  PokemonApi: vi.fn().mockImplementation(() => ({
    fetchFirstPagePokemon,
    fetchPokemonSearchResults,
    fetchOnePokemon,
  })),
}));

import App from './App';
import { getLastSearch, saveSearchTerm } from './storage/searchTermStorage';

const fixtures = [{ name: 'mew', stats: ['hp - 100'] }];

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
  fetchFirstPagePokemon.mockResolvedValue(fixtures);
  fetchPokemonSearchResults.mockImplementation(async () => fixtures);
});

afterEach(() => {
  vi.clearAllMocks();
  vi.mocked(getLastSearch).mockReturnValue('');
  fetchFirstPagePokemon.mockResolvedValue(fixtures);
  fetchPokemonSearchResults.mockImplementation(async () => fixtures);
});

describe('App', () => {
  it('loads results on mount using mocked API', async () => {
    renderApp();
    expect(await screen.findByText(/mew/i)).toBeInTheDocument();
    expect(fetchFirstPagePokemon).toHaveBeenCalled();
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
    expect(fetchPokemonSearchResults).toHaveBeenCalledWith('eevee');
  });

  it('does not call the API again when the trimmed search is unchanged', async () => {
    vi.mocked(getLastSearch).mockReturnValue('pika');
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    const calls = fetchPokemonSearchResults.mock.calls.length;
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(fetchPokemonSearchResults.mock.calls.length).toBe(calls);
  });

  it('shows no-results copy when the API returns an empty list', async () => {
    fetchPokemonSearchResults.mockImplementation(async (term: string) =>
      term === 'missingmon' ? [] : fixtures
    );
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
    fetchPokemonSearchResults.mockImplementation(async (term: string) => {
      if (term === 'x') {
        throw new HttpError(
          500,
          'err',
          'Server error. Please try again in a moment.'
        );
      }
      return fixtures;
    });
    const { user } = renderApp();
    await screen.findByText(/mew/i);
    await user.clear(screen.getByLabelText(/search terms/i));
    await user.type(screen.getByLabelText(/search terms/i), 'x');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(
      await screen.findByText('Server error. Please try again in a moment.')
    ).toBeInTheDocument();
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

  it('keeps checkbox selections when switching result pages', async () => {
    const manyResults = Array.from({ length: 11 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      stats: ['hp - 1'],
    }));
    fetchFirstPagePokemon.mockResolvedValue(manyResults);

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
    expect(fetchOnePokemon).toHaveBeenCalledWith('mew');

    await user.click(screen.getByRole('heading', { name: /result area/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument();
    });
  });

  it('switches details to another item while keeping the panel open', async () => {
    fetchFirstPagePokemon.mockResolvedValue([
      { name: 'mew', stats: ['hp - 100'] },
      { name: 'eevee', stats: ['hp - 55'] },
    ]);

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
    expect(fetchOnePokemon).toHaveBeenCalledWith('eevee');
  });

  it('shows the page from the URL query param', async () => {
    const manyResults = Array.from({ length: 11 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      stats: ['hp - 1'],
    }));
    fetchFirstPagePokemon.mockResolvedValue(manyResults);

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

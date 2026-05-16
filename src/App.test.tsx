import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './lib/httpError';

const fetchFirstPagePokemon = vi.hoisted(() => vi.fn());
const fetchPokemonSearchResults = vi.hoisted(() => vi.fn());

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
  })),
}));

import App from './App';
import { getLastSearch, saveSearchTerm } from './storage/searchTermStorage';
import { renderWithUser } from './test-utils';

const fixtures = [{ name: 'mew', stats: ['hp - 100'] }];

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
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText(/mew/i)).toBeInTheDocument();
    expect(fetchFirstPagePokemon).toHaveBeenCalled();
  });

  it('saves trimmed search term and runs a matching search on submit', async () => {
    const { user } = renderWithUser(<App />);
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
    const { user } = renderWithUser(<App />);
    await screen.findByText(/mew/i);
    const calls = fetchPokemonSearchResults.mock.calls.length;
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(fetchPokemonSearchResults.mock.calls.length).toBe(calls);
  });

  it('shows no-results copy when the API returns an empty list', async () => {
    fetchPokemonSearchResults.mockImplementation(async (term: string) =>
      term === 'missingmon' ? [] : fixtures
    );
    const { user } = renderWithUser(<App />);
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
    const { user } = renderWithUser(<App />);
    await screen.findByText(/mew/i);
    await user.clear(screen.getByLabelText(/search terms/i));
    await user.type(screen.getByLabelText(/search terms/i), 'x');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(
      await screen.findByText('Server error. Please try again in a moment.')
    ).toBeInTheDocument();
  });

  it('shows the page from the URL query param', async () => {
    const manyResults = Array.from({ length: 11 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      stats: ['hp - 1'],
    }));
    fetchFirstPagePokemon.mockResolvedValue(manyResults);

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/pokemon-11/i)).toBeInTheDocument();
    expect(screen.queryByText(/pokemon-1\)/i)).not.toBeInTheDocument();
  });

  it('shows the error boundary fallback when the test error button is used', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user } = renderWithUser(<App />);
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

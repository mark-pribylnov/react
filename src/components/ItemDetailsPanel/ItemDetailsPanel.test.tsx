import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMockFetchResponse,
  getFetchRequestUrl,
} from '../../test-utils/createMockFetchResponse';
import { navigationMock } from '../../test-utils/navigationMock';
import { TestIntlProvider } from '../../test-utils/TestIntlProvider';
import { setupStore } from '../../store/store';
import ItemDetailsPanel from './ItemDetailsPanel';

const mockFetch = vi.fn();

function createPokemonDetail(name: string) {
  return {
    name,
    stats: [{ base_stat: 100, stat: { name: 'hp' } }],
  };
}

function installFetchMock() {
  mockFetch.mockImplementation(async (input: RequestInfo | URL) => {
    const url = getFetchRequestUrl(input);

    if (url.includes('?limit=')) {
      return createMockFetchResponse({
        results: [{ name: 'mew' }],
      });
    }

    const slug = url.match(/\/pokemon\/([^/?]+)/)?.[1] ?? 'mew';
    return createMockFetchResponse(createPokemonDetail(decodeURIComponent(slug)));
  });

  vi.spyOn(globalThis, 'fetch').mockImplementation(mockFetch);
}

function renderItemDetails(store = setupStore()) {
  const closeDetails = vi.fn();
  navigationMock.setInitialEntry('/?details=1');

  return {
    store,
    closeDetails,
    ...render(
      <TestIntlProvider>
        <Provider store={store}>
          <ItemDetailsPanel
            results={[{ name: 'mew', stats: ['hp - 100'] }]}
            closeDetails={closeDetails}
          />
        </Provider>
      </TestIntlProvider>
    ),
  };
}

describe('ItemDetailsPanel (RTK Query)', () => {
  beforeEach(() => {
    installFetchMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loading', () => {
    it('shows a loading indicator while details are being fetched', async () => {
      mockFetch.mockImplementation(async (input) => {
        const url = getFetchRequestUrl(input);
        if (url.includes('/pokemon/mew')) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        return createMockFetchResponse(createPokemonDetail('mew'));
      });

      renderItemDetails();
      expect(screen.getByRole('status')).toHaveTextContent(/loading details/i);
      expect(
        await screen.findByRole('heading', { name: 'mew', level: 3 })
      ).toBeInTheDocument();
    });
  });

  describe('errors', () => {
    it('shows a human-readable error when detail fetch fails', async () => {
      mockFetch.mockImplementation(async (input) => {
        const url = getFetchRequestUrl(input);
        if (url.includes('/pokemon/mew')) {
          return createMockFetchResponse({}, { ok: false, status: 500, statusText: 'err' });
        }
        return createMockFetchResponse(createPokemonDetail('mew'));
      });

      renderItemDetails();

      expect(
        await screen.findByRole('alert')
      ).toHaveTextContent('Server error. Please try again in a moment.');
    });
  });

  describe('caching', () => {
    it('reuses cached details when reopening the same item', async () => {
      const { store } = renderItemDetails();

      expect(
        await screen.findByRole('heading', { name: 'mew', level: 3 })
      ).toBeInTheDocument();

      mockFetch.mockClear();
      cleanup();

      navigationMock.setInitialEntry('/?details=1');

      render(
        <TestIntlProvider>
          <Provider store={store}>
            <ItemDetailsPanel
              results={[{ name: 'mew', stats: ['hp - 100'] }]}
              closeDetails={vi.fn()}
            />
          </Provider>
        </TestIntlProvider>
      );

      expect(
        await screen.findByRole('heading', { name: 'mew', level: 3 })
      ).toBeInTheDocument();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});

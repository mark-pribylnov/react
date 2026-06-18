import { render, screen, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { setupStore } from '../../store/store';
import { TestIntlProvider } from '../../test-utils/TestIntlProvider';
import ResultsPanel from './ResultsPanel';

const noopSetPage = vi.fn();

const sampleResults = [
  {
    name: 'bulbasaur',
    stats: ['hp - 45', 'attack - 49'],
  },
];

function renderResultsPanel(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const store = setupStore();

  return render(ui, {
    wrapper: ({ children }) => (
      <TestIntlProvider>
        <Provider store={store}>{children}</Provider>
      </TestIntlProvider>
    ),
    ...options,
  });
}

describe('ResultsPanel', () => {
  it('shows loading state', () => {
    renderResultsPanel(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading
        errorMessage=""
        results={[]}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent(/loading results/i);
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();
  });

  it('shows error message', () => {
    renderResultsPanel(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage="Request failed"
        results={[]}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Request failed');
  });

  it('shows empty placeholder when there are no results', () => {
    renderResultsPanel(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={[]}
      />
    );
    expect(screen.getByText('Nothing to show yet')).toBeInTheDocument();
  });

  it('renders one row per result with stats', () => {
    renderResultsPanel(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={sampleResults}
      />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText('hp - 45')).toBeInTheDocument();
    expect(screen.getByText('attack - 49')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /select bulbasaur/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous page/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('hides pagination while loading and when there are no results', () => {
    const { rerender } = renderResultsPanel(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading={false}
        errorMessage=""
        results={[]}
      />
    );
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();

    rerender(
      <ResultsPanel
        currentPage={1}
        setCurrentPage={noopSetPage}
        isLoading
        errorMessage=""
        results={sampleResults}
      />
    );
    expect(
      screen.queryByRole('button', { name: /previous page/i })
    ).not.toBeInTheDocument();
  });
});

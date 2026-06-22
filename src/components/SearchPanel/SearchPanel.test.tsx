import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../test-utils';
import { TestIntlProvider } from '../../test-utils/TestIntlProvider';
import { SearchPanel } from './SearchPanel';

const defaultProps = {
  searchQuery: '',
  currentSearch: '',
  onQueryChange: vi.fn(),
  formAction: vi.fn(),
  onRefresh: vi.fn(),
  onSimulateError: vi.fn(),
};

describe('SearchPanel', () => {
  it('renders search input, search button, refresh button, and test error button', () => {
    render(
      <TestIntlProvider>
        <SearchPanel {...defaultProps} />
      </TestIntlProvider>
    );

    expect(
      screen.getByRole('textbox', { name: /search terms/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^search$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^refresh$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /test error boundary/i })
    ).toBeInTheDocument();
  });

  it('invokes onQueryChange when the user types', async () => {
    const onQueryChange = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel {...defaultProps} onQueryChange={onQueryChange} />
    );

    await user.type(screen.getByLabelText(/search terms/i), 'x');
    expect(onQueryChange).toHaveBeenCalled();
  });

  it('submits the search form through the provided action', async () => {
    const formAction = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel
        {...defaultProps}
        searchQuery="mew"
        formAction={formAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(formAction).toHaveBeenCalled();
  });

  it('invokes onRefresh when the refresh button is clicked', async () => {
    const onRefresh = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel {...defaultProps} onRefresh={onRefresh} />
    );

    await user.click(screen.getByRole('button', { name: /^refresh$/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('invokes onSimulateError when the test button is clicked', async () => {
    const onSimulateError = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel {...defaultProps} onSimulateError={onSimulateError} />
    );

    await user.click(
      screen.getByRole('button', { name: /test error boundary/i })
    );
    expect(onSimulateError).toHaveBeenCalledTimes(1);
  });
});

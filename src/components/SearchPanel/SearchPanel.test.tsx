import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../test-utils';
import { SearchPanel } from './SearchPanel';

describe('SearchPanel', () => {
  it('renders search input, search button, and test error button', () => {
    render(
      <SearchPanel
        searchQuery=""
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        onSimulateError={vi.fn()}
      />
    );

    expect(
      screen.getByRole('textbox', { name: /search terms/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^search$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /test error boundary/i })
    ).toBeInTheDocument();
  });

  it('invokes onQueryChange when the user types', async () => {
    const onQueryChange = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel
        searchQuery=""
        onQueryChange={onQueryChange}
        onSubmit={vi.fn()}
        onSimulateError={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText(/search terms/i), 'x');
    expect(onQueryChange).toHaveBeenCalled();
  });

  it('invokes onSubmit when the form is submitted', async () => {
    const onSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    const { user } = renderWithUser(
      <SearchPanel
        searchQuery="mew"
        onQueryChange={vi.fn()}
        onSubmit={onSubmit}
        onSimulateError={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /^search$/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('invokes onSimulateError when the test button is clicked', async () => {
    const onSimulateError = vi.fn();

    const { user } = renderWithUser(
      <SearchPanel
        searchQuery=""
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        onSimulateError={onSimulateError}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /test error boundary/i })
    );
    expect(onSimulateError).toHaveBeenCalledTimes(1);
  });
});

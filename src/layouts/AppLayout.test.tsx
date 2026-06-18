import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { setupStore } from '../store/store';
import { TestIntlProvider } from '../test-utils/TestIntlProvider';
import AppLayout from './AppLayout';

function renderAppLayout(ui: React.ReactNode, store = setupStore()) {
  return render(
    <TestIntlProvider>
      <Provider store={store}>
        <ThemeProvider>{ui}</ThemeProvider>
      </Provider>
    </TestIntlProvider>
  );
}

describe('AppLayout', () => {
  it('renders navigation and child route content', () => {
    renderAppLayout(
      <AppLayout>
        <p>About content</p>
      </AppLayout>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('About content')).toBeInTheDocument();
  });

  it('shows the selected items flyout when items are in the store', () => {
    renderAppLayout(
      <AppLayout>
        <p>About content</p>
      </AppLayout>,
      setupStore({
        selectedItems: {
          items: [
            {
              pokemon: { name: 'mew', stats: ['hp - 100'] },
              listIndex: 1,
            },
          ],
        },
      })
    );

    expect(screen.getByRole('region', { name: /selected items/i })).toHaveTextContent(
      /1 item selected/i
    );
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('updates data-theme on the document when the theme toggle is used', async () => {
    const user = userEvent.setup();

    renderAppLayout(
      <AppLayout>
        <p>About content</p>
      </AppLayout>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

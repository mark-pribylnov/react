import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../context/ThemeProvider.tsx';
import { setupStore } from '../store/store';
import AppLayout from './AppLayout';

describe('AppLayout', () => {
  it('renders navigation and child route content', () => {
    render(
      <Provider store={setupStore()}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/about']}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="about" element={<p>About content</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('About content')).toBeInTheDocument();
  });

  it('shows the selected items flyout when items are in the store', () => {
    render(
      <Provider
        store={setupStore({
          selectedItems: {
            items: [
              {
                pokemon: { name: 'mew', stats: ['hp - 100'] },
                listIndex: 1,
              },
            ],
          },
        })}
      >
        <ThemeProvider>
          <MemoryRouter initialEntries={['/about']}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="about" element={<p>About content</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
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

    render(
      <Provider store={setupStore()}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/about']}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="about" element={<p>About content</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import AppLayout from './AppLayout';

describe('AppLayout', () => {
  it('renders navigation and child route content', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="about" element={<p>About content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('About content')).toBeInTheDocument();
  });
});

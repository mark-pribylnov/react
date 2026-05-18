import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

export function renderWithUser(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult & { user: UserEvent } {
  const user = userEvent.setup();
  return {
    user,
    ...render(ui, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      ...options,
    }),
  };
}

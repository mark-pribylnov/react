import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { TestIntlProvider } from './TestIntlProvider';

export function renderWithUser(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult & { user: UserEvent } {
  const user = userEvent.setup();
  return {
    user,
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestIntlProvider>{children}</TestIntlProvider>
      ),
      ...options,
    }),
  };
}

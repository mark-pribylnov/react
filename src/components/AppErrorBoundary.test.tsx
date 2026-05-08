import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppErrorBoundary } from './AppErrorBoundary';

class Boom extends React.Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('boom');
    }
    return <div>child ok</div>;
  }
}

function Harness({ bad }: { bad: boolean }) {
  return (
    <AppErrorBoundary>
      <Boom shouldThrow={bad} />
    </AppErrorBoundary>
  );
}

describe('AppErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(<Harness bad={false} />);
    expect(screen.getByText('child ok')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(<Harness bad />);
    expect(
      screen.getByRole('heading', { name: /something went wrong/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset application/i })
    ).toBeInTheDocument();
  });

  it('returns to children after reset when child no longer throws', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness bad />);
    expect(
      screen.getByRole('heading', { name: /something went wrong/i })
    ).toBeInTheDocument();
    rerender(<Harness bad={false} />);
    await user.click(screen.getByRole('button', { name: /reset application/i }));
    expect(await screen.findByText('child ok')).toBeInTheDocument();
  });
});

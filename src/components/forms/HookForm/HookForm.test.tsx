import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fillValidHookForm } from '../../../test/form-helpers';
import { renderWithProviders } from '../../../test/test-utils';
import { selectSubmissions } from '../../../store/slices/formSubmissionsSlice';
import { HookForm } from './HookForm';

vi.mock('../../../utils/image', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../utils/image')>();

  return {
    ...actual,
    fileToBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
  };
});

describe('HookForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Gender$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Image$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Country$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Terms and Conditions/i)).toBeInTheDocument();
  });

  it('disables submit while the form is invalid', () => {
    renderWithProviders(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('shows validation errors during live validation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HookForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/^Name$/i), 'john');

    expect(
      await screen.findByText('First letter must be uppercase')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('submits valid data to the store and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithProviders(<HookForm onSuccess={onSuccess} />);

    await fillValidHookForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(selectSubmissions(store.getState())).toHaveLength(1);
    });

    expect(selectSubmissions(store.getState())[0].data.name).toBe('Jane');
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toBeTruthy();
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fillValidUncontrolledForm } from '../../../test/form-helpers';
import { renderWithProviders } from '../../../test/test-utils';
import { selectSubmissions } from '../../../store/slices/formSubmissionsSlice';
import { UncontrolledForm } from './UncontrolledForm';

vi.mock('../../../utils/image', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../utils/image')>();

  return {
    ...actual,
    fileToBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
  };
});

describe('UncontrolledForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<UncontrolledForm onSuccess={vi.fn()} />);

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

  it('shows validation errors on submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('submits valid data to the store and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithProviders(
      <UncontrolledForm onSuccess={onSuccess} />
    );

    await fillValidUncontrolledForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(selectSubmissions(store.getState())).toHaveLength(1);
    });

    expect(selectSubmissions(store.getState())[0].data.name).toBe('John');
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toBeTruthy();
  });
});

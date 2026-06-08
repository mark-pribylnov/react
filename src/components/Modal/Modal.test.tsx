import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

function setupModalRoot() {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
  return modalRoot;
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does not render when closed', () => {
    setupModalRoot();

    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders through a portal when open', () => {
    const modalRoot = setupModalRoot();

    render(
      <Modal isOpen onClose={vi.fn()} title="Test modal">
        <p>Modal content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Test modal' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(modalRoot).toContainElement(dialog);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('closes on Escape, backdrop click, and close button', async () => {
    setupModalRoot();
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Test modal">
        <button type="button">Inside button</button>
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) {
      await user.click(overlay);
    }
    expect(onClose).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});

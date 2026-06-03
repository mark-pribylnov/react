import { useCallback, useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { HookForm } from './components/forms/HookForm/HookForm';
import { UncontrolledForm } from './components/forms/UncontrolledForm/UncontrolledForm';
import './App.css';

type ActiveModal = 'uncontrolled' | 'hook-form' | null;

function App() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <main className="app">
      <h1>Forms</h1>

      <div className="app-actions">
        <button type="button" onClick={() => setActiveModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button type="button" onClick={() => setActiveModal('hook-form')}>
          Open React Hook Form
        </button>
      </div>

      <section className="submissions" aria-label="Submitted forms" />

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={closeModal}
        title="Uncontrolled Form"
      >
        <UncontrolledForm />
      </Modal>

      <Modal
        isOpen={activeModal === 'hook-form'}
        onClose={closeModal}
        title="React Hook Form"
      >
        <HookForm />
      </Modal>
    </main>
  );
}

export default App;

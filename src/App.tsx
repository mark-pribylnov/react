import { useCallback, useEffect, useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard';
import { HookForm } from './components/forms/HookForm/HookForm';
import { UncontrolledForm } from './components/forms/UncontrolledForm/UncontrolledForm';
import { useAppSelector } from './store/hooks';
import { selectSubmissions } from './store/slices/formSubmissionsSlice';
import './App.css';

type ActiveModal = 'uncontrolled' | 'hook-form' | null;

function App() {
  const submissions = useAppSelector(selectSubmissions);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [highlightedSubmissionId, setHighlightedSubmissionId] = useState<
    string | null
  >(null);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleSubmissionSuccess = useCallback((submissionId: string) => {
    setActiveModal(null);
    setHighlightedSubmissionId(submissionId);
  }, []);

  useEffect(() => {
    if (!highlightedSubmissionId) {
      return;
    }

    const timer = window.setTimeout(() => {
      setHighlightedSubmissionId(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [highlightedSubmissionId]);

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

      <section aria-label="Submitted forms">
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              isHighlighted={submission.id === highlightedSubmissionId}
            />
          ))
        )}
      </section>

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={closeModal}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={handleSubmissionSuccess} />
      </Modal>

      <Modal
        isOpen={activeModal === 'hook-form'}
        onClose={closeModal}
        title="React Hook Form"
      >
        <HookForm onSuccess={handleSubmissionSuccess} />
      </Modal>
    </main>
  );
}

export default App;

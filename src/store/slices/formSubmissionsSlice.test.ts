import { describe, expect, it, vi } from 'vitest';
import type { FormSubmissionData } from '../../types/form';
import formSubmissionsReducer, {
  addSubmission,
  selectSubmissions,
} from './formSubmissionsSlice';

const submissionData: FormSubmissionData = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  gender: 'male',
  acceptTerms: true,
  country: 'Poland',
  imageBase64: 'data:image/png;base64,abc',
};

describe('formSubmissionsSlice', () => {
  it('adds a submission with generated id and timestamp', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001'
    );
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const action = addSubmission({
      source: 'uncontrolled',
      data: submissionData,
    });

    const state = formSubmissionsReducer(undefined, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      id: '00000000-0000-4000-8000-000000000001',
      submittedAt: 1_700_000_000_000,
      source: 'uncontrolled',
      data: submissionData,
    });

    vi.restoreAllMocks();
  });

  it('selectSubmissions returns all stored submissions', () => {
    const state = {
      formSubmissions: {
        items: [
          {
            id: '1',
            submittedAt: 1,
            source: 'hook-form' as const,
            data: submissionData,
          },
        ],
      },
    };

    expect(selectSubmissions(state)).toEqual(state.formSubmissions.items);
  });
});

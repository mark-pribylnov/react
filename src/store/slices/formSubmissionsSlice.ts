import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSource, FormSubmission, FormSubmissionData } from '../../types/form';

type AddSubmissionPayload = {
  source: FormSource;
  data: FormSubmissionData;
};

export type FormSubmissionsState = {
  items: FormSubmission[];
};

const initialState: FormSubmissionsState = {
  items: [],
};

const formSubmissionsSlice = createSlice({
  name: 'formSubmissions',
  initialState,
  reducers: {
    addSubmission: {
      reducer: (state, action: PayloadAction<FormSubmission>) => {
        state.items.push(action.payload);
      },
      prepare: (payload: AddSubmissionPayload) => ({
        payload: {
          id: crypto.randomUUID(),
          submittedAt: Date.now(),
          source: payload.source,
          data: payload.data,
        },
      }),
    },
  },
});

export const { addSubmission } = formSubmissionsSlice.actions;

export const selectSubmissions = (state: {
  formSubmissions: FormSubmissionsState;
}) => state.formSubmissions.items;

export default formSubmissionsSlice.reducer;

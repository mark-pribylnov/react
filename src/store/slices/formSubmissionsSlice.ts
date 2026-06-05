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
    addSubmission: (state, action: PayloadAction<AddSubmissionPayload>) => {
      state.items.push({
        id: crypto.randomUUID(),
        submittedAt: Date.now(),
        source: action.payload.source,
        data: action.payload.data,
      });
    },
  },
});

export const { addSubmission } = formSubmissionsSlice.actions;

export const selectSubmissions = (state: {
  formSubmissions: FormSubmissionsState;
}) => state.formSubmissions.items;

export default formSubmissionsSlice.reducer;

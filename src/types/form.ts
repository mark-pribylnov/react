export type FormSource = 'uncontrolled' | 'hook-form';

export type FormSubmissionData = {
  name: string;
  age: number;
  email: string;
  gender: string;
  acceptTerms: boolean;
  imageBase64: string;
  country: string;
};

export type FormSubmission = {
  id: string;
  source: FormSource;
  submittedAt: number;
  data: FormSubmissionData;
};

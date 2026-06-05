export const GENDER_OPTIONS = ['male', 'female'] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];

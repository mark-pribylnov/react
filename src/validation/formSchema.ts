import { z } from 'zod';
import { GENDER_OPTIONS } from '../constants/genderOptions';
import { isValidEmail } from '../utils/emailValidation';
import { validateImageFile } from '../utils/image';
import { hasUppercaseFirstLetter } from '../utils/nameValidation';

function getImageFile(image: File | FileList | null): File | null {
  if (image instanceof File) {
    return image.size > 0 ? image : null;
  }

  if (image instanceof FileList && image.length > 0) {
    return image[0];
  }

  return null;
}

export const formFieldNames = [
  'name',
  'age',
  'email',
  'gender',
  'acceptTerms',
  'password',
  'confirmPassword',
  'country',
  'image',
] as const;

export type FormFieldName = (typeof formFieldNames)[number];
export type FormFieldErrors = Partial<Record<FormFieldName, string>>;

export function mapZodFieldErrors(error: z.ZodError): FormFieldErrors {
  const fieldErrors: FormFieldErrors = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string' && !fieldErrors[fieldName as FormFieldName]) {
      fieldErrors[fieldName as FormFieldName] = issue.message;
    }
  }

  return fieldErrors;
}

export function createFormSchema(countries: readonly string[]) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .refine(hasUppercaseFirstLetter, 'First letter must be uppercase'),
      age: z
        .number({ message: 'Age must be a number' })
        .refine((value) => !Number.isNaN(value), 'Age must be a number')
        .refine((value) => value >= 0, 'Age cannot be negative'),
      email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .refine(isValidEmail, 'Invalid email'),
      gender: z
        .string()
        .min(1, 'Gender is required')
        .refine(
          (value) => GENDER_OPTIONS.includes(value as (typeof GENDER_OPTIONS)[number]),
          'Gender is required'
        ),
      acceptTerms: z.boolean().refine((value) => value, 'You must accept the terms'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
      country: z
        .string()
        .trim()
        .min(1, 'Country is required')
        .refine((value) => countries.includes(value), 'Country must be selected from the list'),
      image: z.union([z.instanceof(File), z.instanceof(FileList), z.null()]),
    })
    .superRefine((data, context) => {
      if (data.password !== data.confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: 'Passwords must match',
          path: ['confirmPassword'],
        });
      }

      const imageFile = getImageFile(data.image);

      if (!imageFile) {
        context.addIssue({
          code: 'custom',
          message: 'Image is required',
          path: ['image'],
        });
        return;
      }

      const imageError = validateImageFile(imageFile);

      if (imageError) {
        context.addIssue({
          code: 'custom',
          message: imageError,
          path: ['image'],
        });
      }
    });
}

export type FormSchemaInput = z.infer<ReturnType<typeof createFormSchema>>;

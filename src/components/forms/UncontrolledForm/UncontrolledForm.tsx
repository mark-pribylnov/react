import { type FormEvent, useMemo, useState } from 'react';
import { GENDER_OPTIONS } from '../../../constants/genderOptions';
import { CountryAutocomplete } from '../../CountryAutocomplete/CountryAutocomplete';
import { FormFieldError } from '../FormFieldError/FormFieldError';
import { PasswordStrengthIndicator } from '../../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { selectCountries } from '../../../store/slices/countriesSlice';
import { addSubmission } from '../../../store/slices/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { FormSubmissionData } from '../../../types/form';
import { fileToBase64 } from '../../../utils/image';
import {
  createFormSchema,
  mapZodFieldErrors,
  type FormFieldErrors,
  type FormFieldName,
} from '../../../validation/formSchema';

type UncontrolledFormProps = {
  onSuccess: (submissionId: string) => void;
};

function parseFormValues(formData: FormData) {
  const name = formData.get('name');
  const age = formData.get('age');
  const email = formData.get('email');
  const gender = formData.get('gender');
  const country = formData.get('country');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const image = formData.get('image');

  return {
    name: typeof name === 'string' ? name : '',
    age: typeof age === 'string' && age !== '' ? Number(age) : NaN,
    email: typeof email === 'string' ? email : '',
    gender: typeof gender === 'string' ? gender : '',
    acceptTerms: formData.get('acceptTerms') === 'on',
    password: typeof password === 'string' ? password : '',
    confirmPassword: typeof confirmPassword === 'string' ? confirmPassword : '',
    country: typeof country === 'string' ? country : '',
    image: image instanceof File ? image : null,
  };
}

function getImageFile(image: File | FileList | null): File {
  if (image instanceof File) {
    return image;
  }

  if (image instanceof FileList && image.length > 0) {
    return image[0];
  }

  throw new Error('Image is required');
}

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const formSchema = useMemo(() => createFormSchema(countries), [countries]);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormFieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedValues = parseFormValues(new FormData(event.currentTarget));
    const validationResult = formSchema.safeParse(parsedValues);

    if (!validationResult.success) {
      setErrors(mapZodFieldErrors(validationResult.error));
      return;
    }

    setErrors({});

    const imageFile = getImageFile(validationResult.data.image);
    const imageBase64 = await fileToBase64(imageFile);
    const data: FormSubmissionData = {
      name: validationResult.data.name,
      age: validationResult.data.age,
      email: validationResult.data.email,
      gender: validationResult.data.gender,
      acceptTerms: validationResult.data.acceptTerms,
      country: validationResult.data.country,
      imageBase64,
    };

    const action = dispatch(
      addSubmission({
        source: 'uncontrolled',
        data,
      })
    );

    setPassword('');
    event.currentTarget.reset();
    onSuccess(action.payload.id);
  };

  const fieldError = (fieldName: FormFieldName) => errors[fieldName];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="uncontrolled-name">Name</label>
        <input id="uncontrolled-name" name="name" type="text" />
        <FormFieldError message={fieldError('name')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" min="0" />
        <FormFieldError message={fieldError('age')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-email">Email</label>
        <input id="uncontrolled-email" name="email" type="email" />
        <FormFieldError message={fieldError('email')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select id="uncontrolled-gender" name="gender" defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FormFieldError message={fieldError('gender')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-image">Image</label>
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
        />
        <FormFieldError message={fieldError('image')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <FormFieldError message={fieldError('password')} />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div>
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
        />
        <FormFieldError message={fieldError('confirmPassword')} />
      </div>

      <div>
        <label htmlFor="uncontrolled-country">Country</label>
        <CountryAutocomplete
          inputId="uncontrolled-country"
          listId="uncontrolled-country-list"
          name="country"
          countries={countries}
        />
        <FormFieldError message={fieldError('country')} />
      </div>

      <div>
        <input
          id="uncontrolled-accept-terms"
          name="acceptTerms"
          type="checkbox"
        />
        <label htmlFor="uncontrolled-accept-terms">Terms and Conditions</label>
        <FormFieldError message={fieldError('acceptTerms')} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

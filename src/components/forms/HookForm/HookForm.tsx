import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../../constants/genderOptions';
import { CountryAutocomplete } from '../../CountryAutocomplete/CountryAutocomplete';
import { PasswordStrengthIndicator } from '../../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { selectCountries } from '../../../store/slices/countriesSlice';
import { addSubmission } from '../../../store/slices/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { FormSubmissionData } from '../../../types/form';
import { fileToBase64, validateImageFile } from '../../../utils/image';

type HookFormValues = {
  name: string;
  age: number;
  email: string;
  gender: string;
  acceptTerms: boolean;
  image: FileList;
  password: string;
  confirmPassword: string;
  country: string;
};

type HookFormProps = {
  onSuccess: () => void;
};

const defaultValues: HookFormValues = {
  name: '',
  age: NaN,
  email: '',
  gender: '',
  acceptTerms: false,
  image: new DataTransfer().files,
  password: '',
  confirmPassword: '',
  country: '',
};

export function HookForm({ onSuccess }: HookFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const [imageError, setImageError] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<HookFormValues>({
    defaultValues,
  });

  const password = watch('password');

  const onSubmit = async (values: HookFormValues) => {
    setImageError(null);

    const imageFile = values.image[0];
    if (!imageFile) {
      setImageError('Image is required');
      return;
    }

    const validationError = validateImageFile(imageFile);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    const imageBase64 = await fileToBase64(imageFile);
    const data: FormSubmissionData = {
      name: values.name.trim(),
      age: values.age,
      email: values.email.trim(),
      gender: values.gender,
      acceptTerms: values.acceptTerms,
      country: values.country.trim(),
      imageBase64,
    };

    dispatch(
      addSubmission({
        source: 'hook-form',
        data,
      })
    );

    reset(defaultValues);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="hook-form-name">Name</label>
        <input id="hook-form-name" type="text" {...register('name')} />
      </div>

      <div>
        <label htmlFor="hook-form-age">Age</label>
        <input
          id="hook-form-age"
          type="number"
          min="0"
          {...register('age', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label htmlFor="hook-form-email">Email</label>
        <input id="hook-form-email" type="email" {...register('email')} />
      </div>

      <div>
        <label htmlFor="hook-form-gender">Gender</label>
        <select id="hook-form-gender" {...register('gender')}>
          <option value="" disabled>
            Select gender
          </option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="hook-form-image">Image</label>
        <input
          id="hook-form-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
        {imageError && <p role="alert">{imageError}</p>}
      </div>

      <div>
        <label htmlFor="hook-form-password">Password</label>
        <input
          id="hook-form-password"
          type="password"
          {...register('password')}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div>
        <label htmlFor="hook-form-confirm-password">Confirm password</label>
        <input
          id="hook-form-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
      </div>

      <div>
        <label htmlFor="hook-form-country">Country</label>
        <CountryAutocomplete
          inputId="hook-form-country"
          listId="hook-form-country-list"
          countries={countries}
          {...register('country')}
        />
      </div>

      <div>
        <input
          id="hook-form-accept-terms"
          type="checkbox"
          {...register('acceptTerms')}
        />
        <label htmlFor="hook-form-accept-terms">Terms and Conditions</label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

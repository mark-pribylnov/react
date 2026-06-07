import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { GENDER_OPTIONS } from '../../../constants/genderOptions';
import { CountryAutocomplete } from '../../CountryAutocomplete/CountryAutocomplete';
import { FormFieldError } from '../FormFieldError/FormFieldError';
import { PasswordStrengthIndicator } from '../../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { selectCountries } from '../../../store/slices/countriesSlice';
import { addSubmission } from '../../../store/slices/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { FormSubmissionData } from '../../../types/form';
import { fileToBase64 } from '../../../utils/image';
import { createFormSchema } from '../../../validation/formSchema';

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
  onSuccess: (submissionId: string) => void;
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
  const formSchema = useMemo(() => createFormSchema(countries), [countries]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<HookFormValues>({
    resolver: zodResolver(formSchema) as Resolver<HookFormValues>,
    mode: 'onChange',
    defaultValues,
  });

  const password = watch('password');

  const onSubmit = async (values: HookFormValues) => {
    const imageFile = values.image[0];
    if (!imageFile) {
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

    const action = dispatch(
      addSubmission({
        source: 'hook-form',
        data,
      })
    );

    reset(defaultValues);
    onSuccess(action.payload.id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="hook-form-name">Name</label>
        <input id="hook-form-name" type="text" {...register('name')} />
        <FormFieldError message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="hook-form-age">Age</label>
        <input
          id="hook-form-age"
          type="number"
          min="0"
          {...register('age', { valueAsNumber: true })}
        />
        <FormFieldError message={errors.age?.message} />
      </div>

      <div>
        <label htmlFor="hook-form-email">Email</label>
        <input id="hook-form-email" type="email" {...register('email')} />
        <FormFieldError message={errors.email?.message} />
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
        <FormFieldError message={errors.gender?.message} />
      </div>

      <div>
        <label htmlFor="hook-form-image">Image</label>
        <input
          id="hook-form-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
        <FormFieldError message={errors.image?.message} />
      </div>

      <div>
        <label htmlFor="hook-form-password">Password</label>
        <input
          id="hook-form-password"
          type="password"
          {...register('password')}
        />
        <FormFieldError message={errors.password?.message} />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div>
        <label htmlFor="hook-form-confirm-password">Confirm password</label>
        <input
          id="hook-form-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        <FormFieldError message={errors.confirmPassword?.message} />
      </div>

      <div>
        <label htmlFor="hook-form-country">Country</label>
        <CountryAutocomplete
          inputId="hook-form-country"
          listId="hook-form-country-list"
          countries={countries}
          {...register('country')}
        />
        <FormFieldError message={errors.country?.message} />
      </div>

      <div>
        <input
          id="hook-form-accept-terms"
          type="checkbox"
          {...register('acceptTerms')}
        />
        <label htmlFor="hook-form-accept-terms">Terms and Conditions</label>
        <FormFieldError message={errors.acceptTerms?.message} />
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

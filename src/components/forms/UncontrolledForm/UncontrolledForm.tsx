import { type FormEvent, useState } from 'react';
import { GENDER_OPTIONS } from '../../../constants/genderOptions';
import { CountryAutocomplete } from '../../CountryAutocomplete/CountryAutocomplete';
import { PasswordStrengthIndicator } from '../../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { selectCountries } from '../../../store/slices/countriesSlice';
import { addSubmission } from '../../../store/slices/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { FormSubmissionData } from '../../../types/form';
import { fileToBase64, validateImageFile } from '../../../utils/image';

type UncontrolledFormProps = {
  onSuccess: () => void;
};

function parseBasicFormData(formData: FormData): Omit<FormSubmissionData, 'imageBase64'> {
  const name = formData.get('name');
  const age = formData.get('age');
  const email = formData.get('email');
  const gender = formData.get('gender');
  const country = formData.get('country');

  return {
    name: typeof name === 'string' ? name.trim() : '',
    age: typeof age === 'string' && age !== '' ? Number(age) : NaN,
    email: typeof email === 'string' ? email.trim() : '',
    gender: typeof gender === 'string' ? gender : '',
    acceptTerms: formData.get('acceptTerms') === 'on',
    country: typeof country === 'string' ? country.trim() : '',
  };
}

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const [password, setPassword] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageError(null);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get('image');

    if (!(imageFile instanceof File) || imageFile.size === 0) {
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
      ...parseBasicFormData(formData),
      imageBase64,
    };

    dispatch(
      addSubmission({
        source: 'uncontrolled',
        data,
      })
    );

    setPassword('');
    event.currentTarget.reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="uncontrolled-name">Name</label>
        <input id="uncontrolled-name" name="name" type="text" />
      </div>

      <div>
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" min="0" />
      </div>

      <div>
        <label htmlFor="uncontrolled-email">Email</label>
        <input id="uncontrolled-email" name="email" type="email" />
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
      </div>

      <div>
        <label htmlFor="uncontrolled-image">Image</label>
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
        />
        {imageError && <p role="alert">{imageError}</p>}
      </div>

      <div>
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div>
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
        />
      </div>

      <div>
        <label htmlFor="uncontrolled-country">Country</label>
        <CountryAutocomplete
          inputId="uncontrolled-country"
          listId="uncontrolled-country-list"
          name="country"
          countries={countries}
        />
      </div>

      <div>
        <input
          id="uncontrolled-accept-terms"
          name="acceptTerms"
          type="checkbox"
        />
        <label htmlFor="uncontrolled-accept-terms">Terms and Conditions</label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

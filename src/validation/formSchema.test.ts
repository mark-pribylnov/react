import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../constants/countries';
import { createFormSchema } from './formSchema';

const schema = createFormSchema(COUNTRIES);

const validValues = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  acceptTerms: true,
  password: 'Password1!',
  confirmPassword: 'Password1!',
  country: COUNTRIES[0],
  image: new File(['img'], 'photo.png', { type: 'image/png' }),
};

describe('createFormSchema', () => {
  it('accepts valid form values', () => {
    const result = schema.safeParse(validValues);

    expect(result.success).toBe(true);
  });

  it('rejects a name without an uppercase first letter', () => {
    const result = schema.safeParse({ ...validValues, name: 'john' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'name')).toBe(
        true
      );
    }
  });

  it('rejects negative age values', () => {
    const result = schema.safeParse({ ...validValues, age: -1 });

    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = schema.safeParse({
      ...validValues,
      confirmPassword: 'Different1!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'confirmPassword')
      ).toBe(true);
    }
  });

  it('rejects countries that are not in the stored list', () => {
    const result = schema.safeParse({
      ...validValues,
      country: 'Atlantis',
    });

    expect(result.success).toBe(false);
  });
});

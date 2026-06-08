import { describe, expect, it } from 'vitest';
import { hasUppercaseFirstLetter } from './nameValidation';

describe('hasUppercaseFirstLetter', () => {
  it('returns true when the first letter is uppercase', () => {
    expect(hasUppercaseFirstLetter('John')).toBe(true);
  });

  it('returns false when the first letter is lowercase', () => {
    expect(hasUppercaseFirstLetter('john')).toBe(false);
  });

  it('returns false for an empty name', () => {
    expect(hasUppercaseFirstLetter('')).toBe(false);
  });
});

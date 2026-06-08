import { describe, expect, it } from 'vitest';
import { getPasswordCriteria } from './passwordStrength';

describe('getPasswordCriteria', () => {
  it('detects all password strength requirements', () => {
    expect(getPasswordCriteria('Aa1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });

  it('reports missing criteria for weak passwords', () => {
    expect(getPasswordCriteria('password')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: true,
      hasSpecialCharacter: false,
    });
  });
});

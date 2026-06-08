import { getPasswordCriteria } from '../../utils/passwordStrength';

type PasswordStrengthIndicatorProps = {
  password: string;
};

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const criteria = getPasswordCriteria(password);

  return (
    <ul aria-live="polite">
      <li>{criteria.hasNumber ? '✓' : '✗'} 1 number</li>
      <li>{criteria.hasUppercase ? '✓' : '✗'} 1 uppercase</li>
      <li>{criteria.hasLowercase ? '✓' : '✗'} 1 lowercase</li>
      <li>{criteria.hasSpecialCharacter ? '✓' : '✗'} 1 special character</li>
    </ul>
  );
}

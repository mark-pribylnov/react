export function isValidEmail(email: string): boolean {
  const parts = email.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  if (localPart.length === 0) {
    return false;
  }

  const dotIndex = domain.indexOf('.');

  if (dotIndex === -1) {
    return false;
  }

  const domainBeforeDot = domain.slice(0, dotIndex);
  const domainAfterDot = domain.slice(dotIndex + 1);

  return domainBeforeDot.length > 0 && domainAfterDot.length > 0;
}

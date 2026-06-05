export type PasswordCriteria = {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
};

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9';
}

function isUppercaseLetter(character: string): boolean {
  return character >= 'A' && character <= 'Z';
}

function isLowercaseLetter(character: string): boolean {
  return character >= 'a' && character <= 'z';
}

function isSpecialCharacter(character: string): boolean {
  return !isDigit(character) && !isUppercaseLetter(character) && !isLowercaseLetter(character);
}

export function getPasswordCriteria(password: string): PasswordCriteria {
  let hasNumber = false;
  let hasUppercase = false;
  let hasLowercase = false;
  let hasSpecialCharacter = false;

  for (const character of password) {
    if (isDigit(character)) {
      hasNumber = true;
    }
    if (isUppercaseLetter(character)) {
      hasUppercase = true;
    }
    if (isLowercaseLetter(character)) {
      hasLowercase = true;
    }
    if (isSpecialCharacter(character)) {
      hasSpecialCharacter = true;
    }
  }

  return {
    hasNumber,
    hasUppercase,
    hasLowercase,
    hasSpecialCharacter,
  };
}

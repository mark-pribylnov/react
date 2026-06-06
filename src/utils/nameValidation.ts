export function hasUppercaseFirstLetter(name: string): boolean {
  if (name.length === 0) {
    return false;
  }

  const firstCharacter = name[0];
  return firstCharacter >= 'A' && firstCharacter <= 'Z';
}

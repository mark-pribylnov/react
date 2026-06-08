import type { InputHTMLAttributes } from 'react';

type CountryAutocompleteProps = {
  inputId: string;
  listId: string;
  countries: readonly string[];
} & InputHTMLAttributes<HTMLInputElement>;

export function CountryAutocomplete({
  inputId,
  listId,
  countries,
  ...inputProps
}: CountryAutocompleteProps) {
  return (
    <>
      <input id={inputId} list={listId} {...inputProps} />
      <datalist id={listId}>
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
    </>
  );
}

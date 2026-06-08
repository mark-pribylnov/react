import './FormFieldError.css';

type FormFieldErrorProps = {
  message?: string;
};

export function FormFieldError({ message }: FormFieldErrorProps) {
  return (
    <p className="form-field-error" role="alert" aria-live="polite">
      {message ?? '\u00A0'}
    </p>
  );
}

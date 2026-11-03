import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}

export function fieldInputClass(hasError: boolean): string {
  return hasError ? 'field-input field-input-error' : 'field-input';
}

export function FormField({ id, label, error, hint, optional, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-1.5 font-normal text-forest-400">(opcional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-forest-400">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

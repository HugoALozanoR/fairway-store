import { forwardRef } from "react";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ id, label, error, ...rest }, ref) {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium uppercase tracking-wider text-charcoal-500"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`mt-1.5 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-charcoal-800 placeholder-charcoal-300 outline-none transition focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-charcoal-200 focus:border-fairway-500 focus:ring-fairway-100"
          }`}
          {...rest}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

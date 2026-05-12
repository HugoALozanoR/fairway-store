import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(160, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(200),
  shippingAddress: z
    .string()
    .trim()
    .min(10, "Enter your full shipping address")
    .max(500, "Address is too long"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => Promise<void> | void;
  submitting?: boolean;
  serverError?: string | null;
}

export function CheckoutForm({
  onSubmit,
  submitting = false,
  serverError,
}: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", email: "", shippingAddress: "" },
    mode: "onBlur",
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-charcoal-100 bg-white p-6 shadow-card"
    >
      <div>
        <h2 className="font-display text-xl text-charcoal-900">
          Shipping details
        </h2>
        <p className="mt-1 text-sm text-charcoal-500">
          We’ll send a confirmation to the email below. (No real payment is
          processed.)
        </p>
      </div>

      <TextField
        id="customerName"
        label="Full name"
        autoComplete="name"
        error={errors.customerName?.message}
        {...register("customerName")}
      />

      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <TextareaField
        id="shippingAddress"
        label="Shipping address"
        rows={3}
        placeholder="Street, city, state, ZIP"
        autoComplete="street-address"
        error={errors.shippingAddress?.message}
        {...register("shippingAddress")}
      />

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-fairway-700 text-sm font-medium text-white transition hover:bg-fairway-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
      >
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ id, label, error, ...rest }, ref) {
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

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ id, label, error, ...rest }, ref) {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium uppercase tracking-wider text-charcoal-500"
        >
          {label}
        </label>
        <textarea
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

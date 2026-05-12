import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function AdminPlaceholderPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-fairway-50 text-fairway-700">
        <ShieldCheck className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-charcoal-900">
        Admin area
      </h1>
      <p className="mt-3 text-charcoal-500">
        You’re signed in as an administrator. The full dashboard, product
        management, and order tools land in Phase 6.
      </p>
      <Link
        to="/account"
        className="mt-6 inline-flex rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
      >
        Go to my account
      </Link>
    </div>
  );
}

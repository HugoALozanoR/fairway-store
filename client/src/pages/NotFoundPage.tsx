import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-fairway-700">404</p>
      <h1 className="mt-3 font-display text-4xl text-charcoal-900">
        Page not found
      </h1>
      <p className="mt-3 text-charcoal-500">
        The page you’re looking for doesn’t exist. Let’s get you back on course.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
      >
        Back home
      </Link>
    </div>
  );
}

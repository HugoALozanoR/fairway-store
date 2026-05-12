export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal-100 bg-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg text-fairway-700">
              Fairway Store
            </p>
            <p className="mt-1 text-sm text-charcoal-500">
              Elegant gear for the modern golfer.
            </p>
          </div>
          <p className="text-xs text-charcoal-400">
            &copy; {new Date().getFullYear()} Fairway Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

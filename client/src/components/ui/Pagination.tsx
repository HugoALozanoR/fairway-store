import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-3 pt-6">
      <p className="text-sm text-charcoal-500">
        Page <span className="text-charcoal-800">{page}</span> of {totalPages}
        <span className="mx-2 text-charcoal-300">·</span>
        <span>{total} {total === 1 ? "product" : "products"}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-charcoal-200 px-3 text-sm text-charcoal-700 transition enabled:hover:border-fairway-500 enabled:hover:text-fairway-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-charcoal-200 px-3 text-sm text-charcoal-700 transition enabled:hover:border-fairway-500 enabled:hover:text-fairway-700 disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

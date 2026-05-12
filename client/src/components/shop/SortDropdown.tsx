import type { ProductSort } from "../../types/catalog";

interface SortDropdownProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
}

const options: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-charcoal-500">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSort)}
        className="rounded-md border border-charcoal-200 bg-white px-3 py-2 text-sm text-charcoal-800 focus:border-fairway-500 focus:outline-none focus:ring-1 focus:ring-fairway-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

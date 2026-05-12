import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-charcoal-400">
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
            )}
            {item.to ? (
              <Link
                to={item.to}
                className="hover:text-fairway-700 hover:underline underline-offset-2"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-charcoal-600">{item.label}</span>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

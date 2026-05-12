interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-charcoal-100/70 ${className}`}
      aria-hidden="true"
    />
  );
}

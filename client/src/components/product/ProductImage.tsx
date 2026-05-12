import { useState } from "react";
import { Flag } from "lucide-react";

interface ProductImageProps {
  fileName: string;
  alt: string;
  className?: string;
}

export function ProductImage({ fileName, alt, className = "" }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const src = fileName ? `/products/${fileName}` : "";

  if (!src || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-cream-100 to-fairway-50 text-fairway-300 ${className}`}
        aria-hidden="true"
      >
        <Flag className="h-10 w-10" strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}

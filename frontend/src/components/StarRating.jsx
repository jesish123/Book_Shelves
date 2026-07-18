import React, { useEffect, useState } from "react";

export default function StarRating({ value = 0, onChange }) {
  const [selectedRating, setSelectedRating] = useState(value);

  useEffect(() => {
    setSelectedRating(value);
  }, [value]);

  const handleSelect = (v) => {
    setSelectedRating(v);
    onChange?.(v);
  };

  return (
    <div className="flex items-center gap-1 text-2xl text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="transition hover:text-amber-400"
          onClick={() => handleSelect(star)}
          aria-label={`${star} star`}
        >
          {star <= selectedRating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

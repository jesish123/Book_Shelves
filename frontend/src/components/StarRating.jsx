const StarRating = ({ value = 0, onChange, readOnly = false }) => {
  const handleSelect = (v) => {
    if (!readOnly && onChange) {
      onChange(v);
    }
  };

  return (
    <div className="flex items-center gap-1 text-2xl text-amber-500 select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`transition ${readOnly ? "cursor-default opacity-90" : "cursor-pointer hover:scale-110 hover:text-amber-400"}`}
          onClick={() => handleSelect(star)}
          aria-label={`${star} star`}
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default StarRating;


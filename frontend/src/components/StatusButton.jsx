export default function StatusButton({ toggleStatus }) {
  return (
    <button
      onClick={() => toggleStatus?.()}
      className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700 active:scale-95"
    >
      Toggle Status
    </button>
  );
}
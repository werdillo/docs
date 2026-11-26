export function OrderCard({ id, status, onConfirm }: { id: string; status: string; onConfirm: () => void }) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span style={{ color: "#3b82f6" }}>#{id}</span>
        <span>{status}</span>
      </div>
      <button
        onClick={onConfirm}
        className="mt-3 h-8 px-3 rounded bg-blue-500 text-white"
      >
        Submit
      </button>
    </div>
  );
}

"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
      <p className="text-slate-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-slate-900 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="h-9 w-44 bg-slate-200 rounded" />
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
        </div>
      </div>
    </main>
  );
}

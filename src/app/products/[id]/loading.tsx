export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 animate-pulse">
      <div className="card flex gap-6">
        <div className="h-40 w-40 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-4 border-b border-slate-200 pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-16 rounded bg-slate-200" />
        ))}
      </div>
      <div className="mt-6 card h-64 bg-slate-100" />
    </div>
  );
}

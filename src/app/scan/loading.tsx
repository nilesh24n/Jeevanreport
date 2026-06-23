export default function ScanLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="mt-4 text-sm text-slate-600">Loading scan experience…</p>
    </div>
  );
}

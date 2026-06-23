export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Data Sources</h1>
      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        <li className="card">• Product label photography submitted by community members</li>
        <li className="card">• Manufacturer-published nutrition and ingredient data</li>
        <li className="card">• Open product databases (Open Food Facts, GS1 barcode registry)</li>
        <li className="card">• User-reported prices with store and date metadata</li>
        <li className="card">• Moderator-verified shrinkflation and formula change reports</li>
      </ul>
    </div>
  );
}

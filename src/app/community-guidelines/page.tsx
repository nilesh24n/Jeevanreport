export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Community Guidelines</h1>
      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        <li className="card">✓ Submit only accurate, good-faith evidence with clear photos</li>
        <li className="card">✓ Include purchase dates, store names, and barcodes when possible</li>
        <li className="card">✗ Do not fabricate shrinkflation or formula changes</li>
        <li className="card">✗ Do not make medical diagnoses or guaranteed health outcome claims</li>
        <li className="card">✗ Do not upload photos of other people without consent</li>
        <li className="card">✗ Do not use the platform for commercial spam or astroturfing</li>
      </ul>
    </div>
  );
}

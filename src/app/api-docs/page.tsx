export default function ApiDocsPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/products",
      desc: "List all products. Optional query params: category, country, barcode",
      example: "/api/products?category=snacks&country=USA",
    },
    {
      method: "GET",
      path: "/api/products/[id]",
      desc: "Full product JSON including versions, nutrition, changes, and submissions",
      example: "/api/products/oreo-original-us",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
      <p className="mt-2 text-slate-600">Public read-only JSON API for researchers, journalists, and developers</p>

      <div className="mt-8 card bg-slate-50">
        <p className="text-sm text-slate-600">
          All responses are JSON. No authentication required for read access. Rate limits may apply in production.
          Data is educational — not medical advice.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {endpoints.map((ep) => (
          <div key={ep.path} className="card">
            <div className="flex items-center gap-3">
              <span className="rounded bg-success-100 px-2 py-0.5 text-xs font-bold text-success-700">{ep.method}</span>
              <code className="text-sm font-mono text-slate-800">{ep.path}</code>
            </div>
            <p className="mt-3 text-sm text-slate-600">{ep.desc}</p>
            <div className="mt-3 rounded-lg bg-slate-900 p-3">
              <code className="text-xs text-green-400">curl https://jeevanreport.org{ep.example}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="font-semibold">Response shape (list)</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-green-400">{`{
  "count": 15,
  "products": [
    {
      "id": "oreo-original-us",
      "name": "Oreo Chocolate Sandwich Cookies",
      "brand": "Oreo",
      "barcode": "044000005977",
      "category": "snacks",
      "trustScore": 92,
      "url": "/products/oreo-original-us"
    }
  ]
}`}</pre>
      </div>
    </div>
  );
}

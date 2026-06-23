import type { FormulaChange } from "@/lib/types";

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[,;.]+/).map((s) => s.trim()).filter(Boolean);
}

export default function FormulaDiff({ change }: { change: FormulaChange }) {
  const oldTokens = new Set(tokenize(change.oldIngredients));
  const newTokens = new Set(tokenize(change.newIngredients));
  const removed = change.removed.length > 0 ? change.removed : [...oldTokens].filter((t) => !newTokens.has(t));
  const added = change.added.length > 0 ? change.added : [...newTokens].filter((t) => !oldTokens.has(t));

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">{change.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-red-700">Removed</h4>
          {removed.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {removed.map((item) => (
                <li key={item} className="text-sm text-red-800 line-through">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-red-600">No removals detected</p>
          )}
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-green-700">Added</h4>
          {added.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {added.map((item) => (
                <li key={item} className="text-sm text-green-800">+ {item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-green-600">No additions detected</p>
          )}
        </div>
      </div>
    </div>
  );
}

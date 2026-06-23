import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-brand-600">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <span className="text-slate-300">/</span>
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-brand-600">{item.label}</Link>
            ) : (
              <span className="text-slate-700 font-medium truncate max-w-[200px] sm:max-w-none">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

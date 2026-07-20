import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, blogPosts } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article Not Found — JeevanReport" };
  }
  return {
    title: `${post.title} — JeevanReport India`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      <div className="space-y-3">
        <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1 min-h-[44px]">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-400">
          <span>By {post.author}</span>
          <span>·</span>
          <span>Published on {post.date}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-100 pb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Render Markdown content */}
      <div className="prose prose-slate max-w-none space-y-6 pt-4 text-slate-700 leading-relaxed font-medium text-base">
        {post.content.split("\n\n").map((paragraph, index) => {
          const text = paragraph.trim();
          if (!text) return null;

          // Handle headings
          if (text.startsWith("### ")) {
            return (
              <h3 key={index} className="text-xl font-bold text-slate-900 pt-4 pb-1">
                {text.replace("### ", "")}
              </h3>
            );
          }
          if (text.startsWith("## ")) {
            return (
              <h2 key={index} className="text-2xl font-bold text-slate-900 pt-6 pb-2">
                {text.replace("## ", "")}
              </h2>
            );
          }

          // Handle lists
          if (text.startsWith("* ")) {
            return (
              <ul key={index} className="list-disc pl-5 space-y-2">
                {text.split("\n").map((item, itemIdx) => (
                  <li key={itemIdx}>{item.replace("* ", "").replace("• ", "")}</li>
                ))}
              </ul>
            );
          }

          // Handle markdown table rendering for the worst shrinkflation table
          if (text.startsWith("| ")) {
            const rows = text.split("\n").filter(Boolean);
            const headers = rows[0].split("|").map(h => h.trim()).filter(Boolean);
            const bodyRows = rows.slice(2).map(r => r.split("|").map(c => c.trim()).filter(Boolean));

            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-slate-100 my-6">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left font-bold text-slate-800">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        {row.map((col, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-slate-650 font-semibold">{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <p key={index} className="text-slate-650">
              {text}
            </p>
          );
        })}
      </div>
    </article>
  );
}

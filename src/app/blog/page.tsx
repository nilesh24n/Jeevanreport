import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Food Transparency & Shrinkflation Blog | JeevanReport India",
  description: "Read the latest research, consumer guides, and data updates regarding packaged foods, shrinkflation, and nutrition labeling in India.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">JeevanReport Blog</h1>
        <p className="mt-2 text-slate-650 text-slate-600 max-w-xl mx-auto">
          Empowering Indian consumers with food science analysis, product weight updates, and healthy eating guides.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="card flex flex-col justify-between hover:border-brand-200 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>{post.author} · {post.date}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-bold text-brand-600 hover:text-brand-700 min-h-[36px] flex items-center"
              >
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

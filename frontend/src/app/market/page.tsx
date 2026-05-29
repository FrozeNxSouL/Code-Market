"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getCategories, type Product, type Category } from "@/lib/api";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Top Rated", value: "score" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

function StarRating({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-amber-400 font-medium">
      ★ {score.toFixed(1)}
    </span>
  );
}

export default function MarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories([{ id: "all", name: "All", level: 0, status: "ACTIVE" }, ...cats]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search, category: category === "all" ? undefined : category, sort })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-zinc-900/30 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-zinc-400 mb-6">Discover production-ready code from expert developers.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="market-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <select
              id="market-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500 transition-colors min-w-[200px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Category</p>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  id={`cat-${c.id}`}
                  onClick={() => setCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === c.id
                      ? "bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/market/${p.id}`}
                  id={`product-card-${p.id}`}
                  className="group flex flex-col border border-zinc-800 bg-zinc-900/50 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:bg-zinc-900 transition-all"
                >
                  <div className="h-44 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 flex items-center justify-center text-5xl border-b border-zinc-800 group-hover:border-indigo-900/50 transition-all">
                    💻
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {p.tags?.slice(0, 2).map((t) => (
                        <span key={t.categoryId} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{t.category?.name}</span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-white text-base mb-1 group-hover:text-indigo-300 transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-zinc-500 text-sm mb-4 line-clamp-2 flex-1">{p.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-white font-bold text-lg">${p.price}</span>
                      <StarRating score={p.score} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="text-center py-24 text-zinc-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">No products found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

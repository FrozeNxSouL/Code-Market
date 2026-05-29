"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProduct, getProductFeedbacks, type Product, type Feedback, type User } from "@/lib/api";

type FullProduct = Product & { user: User; feedbacks: Feedback[]; tags: { categoryId: string; category: { id: string; name: string; level: number; status: string } }[] };

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-zinc-400 w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className="text-zinc-400 w-6 text-right">{value}</span>
    </div>
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "demo" | "feedback">("overview");
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getProduct(params.id),
      getProductFeedbacks(params.id),
    ])
      .then(([p, feedbacks]) => {
        setProduct({ ...(p as FullProduct), feedbacks });
      })
      .catch(() => setError("Failed to load product. It may not exist or the server is unavailable."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
        <p className="text-zinc-400 mb-6">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link href="/market" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
          Back to Market
        </Link>
      </div>
    );
  }

  const avgScore = product.feedbacks.length
    ? product.feedbacks.reduce((a, f) => a + f.score, 0) / product.feedbacks.length
    : product.score;

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Left */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Image Gallery */}
          <div className="relative h-72 md:h-96 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-zinc-800 overflow-hidden flex items-center justify-center">
            <span className="text-8xl">💻</span>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button id="img-prev" onClick={() => setImgIndex((i) => Math.max(0, i - 1))} className="w-8 h-8 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-colors">←</button>
              <button id="img-next" onClick={() => setImgIndex((i) => i + 1)} className="w-8 h-8 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-colors">→</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-zinc-800 flex gap-0">
            {(["overview", "demo", "feedback"] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-white border-indigo-500"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {tab === "feedback" ? `Reviews (${product.feedbacks.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="prose prose-invert prose-sm max-w-none">
              {product.description.split("\n").map((line, i) => (
                <p key={i} className={line.startsWith("**") ? "font-semibold text-white" : "text-zinc-400 leading-relaxed"}>
                  {line.replace(/\*\*/g, "")}
                </p>
              ))}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Full source code", "Documentation included", "6 months support", "Commercial license", "Regular updates", "Private GitHub repo"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-emerald-400">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "demo" && (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">Interactive live preview running in a sandboxed environment.</p>
              <div className="rounded-2xl border border-zinc-800 bg-black overflow-hidden">
                {/* Browser chrome */}
                <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 h-5 bg-zinc-800 rounded-full flex items-center px-3 text-xs text-zinc-500">
                    🔒 demo.codemarket.dev/preview/{params.id}
                  </div>
                </div>
                <div className="h-[400px] bg-slate-900 flex flex-col items-center justify-center gap-4 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-3xl mb-2">💻</div>
                  <h3 className="text-white font-semibold text-xl">{product.name}</h3>
                  <p className="text-zinc-500 text-sm max-w-sm">The live demo environment is loading. In production, your deployed app appears here.</p>
                  <div className="flex gap-2 mt-2">
                    <div className="h-2 w-16 rounded-full bg-indigo-600/30 animate-pulse" />
                    <div className="h-2 w-24 rounded-full bg-purple-600/30 animate-pulse delay-100" />
                    <div className="h-2 w-12 rounded-full bg-pink-600/30 animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-5">
              <div className="flex items-center gap-6 p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-white">{avgScore.toFixed(1)}</p>
                  <p className="text-amber-400 text-xl mt-1">{"★".repeat(Math.round(avgScore))}</p>
                  <p className="text-zinc-500 text-xs mt-1">{product.feedbacks.length} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  <ScoreBar label="5 stars" value={5} />
                  <ScoreBar label="4 stars" value={4} />
                  <ScoreBar label="3 stars" value={3} />
                  <ScoreBar label="2 stars" value={2} />
                  <ScoreBar label="1 star" value={1} />
                </div>
              </div>
              {product.feedbacks.map((fb) => (
                <div key={fb.id} className="p-5 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold text-white">
                      {fb.user?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{fb.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-zinc-500">{new Date(fb.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="ml-auto text-amber-400">{"★".repeat(fb.score)}</span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{fb.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Purchase card */}
        <div className="lg:w-80 shrink-0 space-y-4">
          <div className="sticky top-20 border border-zinc-800 bg-zinc-900 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-wrap gap-1.5">
              {product.tags?.map((t) => (
                <span key={t.categoryId} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{t.category?.name}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">★ {avgScore.toFixed(1)}</span>
              <span className="text-zinc-600 text-sm">({product.feedbacks.length} reviews)</span>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <p className="text-4xl font-extrabold text-white">${product.price}</p>
              <p className="text-zinc-500 text-sm mt-1">One-time purchase · lifetime access</p>
            </div>
            <Link
              href={`/transaction/${product.id}`}
              id="btn-buy-now"
              className="block w-full text-center py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
            >
              Buy Now
            </Link>
            <button id="btn-demo" onClick={() => setActiveTab("demo")} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
              View Live Demo
            </button>
            <div className="space-y-2 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
              <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Secure checkout via Stripe</p>
              <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Instant download on purchase</p>
              <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 14-day money-back guarantee</p>
            </div>
          </div>

          {/* Seller Card */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Seller</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {product.user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{product.user?.name}</p>
                <p className="text-zinc-500 text-sm">@{product.user?.accountName}</p>
              </div>
            </div>
            {product.user?.accountDescription && (
              <p className="text-zinc-500 text-sm leading-relaxed">{product.user.accountDescription}</p>
            )}
            {product.user?.githubHandle && (
              <a
                href={`https://github.com/${product.user.githubHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>⬡</span> github.com/{product.user.githubHandle}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

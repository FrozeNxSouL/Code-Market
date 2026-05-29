import Link from "next/link";

const features = [
  { icon: "🧩", title: "Production-Ready Components", desc: "Browse thousands of tested, plug-and-play components and full apps built by expert developers." },
  { icon: "🔭", title: "Live In-Browser Demos", desc: "Test every product interactively in a sandboxed browser environment before you buy." },
  { icon: "🚀", title: "One-Click Deployment", desc: "Connect GitHub or upload a ZIP and deploy your project to a live URL in seconds." },
  { icon: "🔒", title: "Secure Payments via Stripe", desc: "Industry-standard payment processing with full purchase history and receipts." },
  { icon: "⭐", title: "Verified Reviews", desc: "Only buyers can leave feedback, so every review you read is trustworthy." },
  { icon: "🤖", title: "AI-Powered Discovery", desc: "Find exactly what you need with intelligent search and category filtering." },
];

const stats = [
  { value: "12,400+", label: "Products Listed" },
  { value: "3,800+", label: "Verified Sellers" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "$2.1M+", label: "Paid to Developers" },
];

export default async function HomePage() {
  let featured: { id: string; name: string; price: string; score: number; tags: string[]; desc: string }[] = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${baseUrl}/api/products?sort=score_desc&page=1`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      featured = (json.data || []).slice(0, 3).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price?.toString() || "0",
        score: p.score || 0,
        tags: (p.tags || []).map((t: any) => t.category?.name || "").filter(Boolean),
        desc: p.description?.slice(0, 60) + "…" || "",
      }));
    }
  } catch {}

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
          </span>
          Now open for beta — join 3,800+ developers
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mb-6 leading-[1.1]">
          The marketplace for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            developers who ship.
          </span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Discover production-ready code, run live demos, and deploy instantly. Buy once, own forever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/market" className="group px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-100 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_70px_rgba(255,255,255,0.25)] flex items-center gap-2">
            Browse the Market
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
          <Link href="/signup" className="px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-colors">
            Sell Your Code
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06] divide-y md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-8 px-6 text-center">
              <span className="text-3xl font-extrabold text-white mb-1">{s.value}</span>
              <span className="text-sm text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Featured</p>
            <h2 className="text-3xl font-bold text-white">Trending this week</h2>
          </div>
          <Link href="/market" className="text-sm text-zinc-400 hover:text-white transition-colors">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.length > 0 ? featured.map((p) => (
            <Link key={p.id} href={`/market/${p.id}`} className="group border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-zinc-900 transition-all">
              <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl mb-5 flex items-center justify-center text-4xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                💻
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{t}</span>
                ))}
              </div>
              <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">{p.name}</h3>
              <p className="text-zinc-500 text-sm mb-4">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-lg">${p.price}</span>
                <span className="text-amber-400 text-sm">★ {p.score}</span>
              </div>
            </Link>
          )) : (
            <>
              <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6">
                <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl mb-5 flex items-center justify-center text-4xl border border-white/5">💻</div>
                <h3 className="font-semibold text-white text-lg mb-1">Featured products</h3>
                <p className="text-zinc-500 text-sm">Connect to the backend to see trending products.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6">
                <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl mb-5 flex items-center justify-center text-4xl border border-white/5">🔧</div>
                <h3 className="font-semibold text-white text-lg mb-1">Coming soon</h3>
                <p className="text-zinc-500 text-sm">New products are added daily by our community.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6">
                <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl mb-5 flex items-center justify-center text-4xl border border-white/5">🚀</div>
                <h3 className="font-semibold text-white text-lg mb-1">Be the first seller</h3>
                <p className="text-zinc-500 text-sm">Publish your code and earn from day one.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-zinc-900/30 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Platform</p>
            <h2 className="text-3xl font-bold text-white">Everything you need to ship faster</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to start selling your code?</h2>
          <p className="text-zinc-400 mb-8">Deploy your project and reach thousands of developers today.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            Create your seller account →
          </Link>
        </div>
      </section>
    </div>
  );
}

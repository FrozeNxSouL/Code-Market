"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyTransactions, submitFeedback, type Transaction } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  REFUNDED: "text-red-400 bg-red-400/10 border-red-400/20",
  FAILED: "text-red-500 bg-red-500/10 border-red-500/20",
};

function FeedbackModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const [score, setScore] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await submitFeedback(transaction.productId, { score, text, type: "REVIEW" });
    } catch {}
    finally {
      setSubmitting(false);
      setDone(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
        {done ? (
          <div className="text-center py-6 space-y-3">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Thanks for your review!</h2>
            <p className="text-zinc-400 text-sm">Your feedback helps other developers find great products.</p>
            <button id="btn-close-feedback" onClick={onClose} className="mt-2 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">Close</button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">Leave a Review</h2>
              <p className="text-zinc-400 text-sm mt-1">{transaction.product?.name}</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} id={`star-${s}`} onClick={() => setScore(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= score ? "text-amber-400" : "text-zinc-700"}`}>★</button>
              ))}
            </div>
            <textarea
              id="feedback-text"
              rows={4}
              placeholder="Share your experience with this product…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors">Cancel</button>
              <button
                id="btn-submit-feedback"
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Submit Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "REFUNDED">("ALL");

  useEffect(() => {
    setLoading(true);
    getMyTransactions()
      .then(setTransactions)
      .catch(() => {}) // No fallback — show empty state on error
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? transactions : transactions.filter((t) => t.status === filter);
  const totalSpent = transactions.filter((t) => t.status === "COMPLETED").reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div className="flex-1 flex flex-col py-12 px-6">
      {reviewTarget && (
        <FeedbackModal transaction={reviewTarget} onClose={() => setReviewTarget(null)} />
      )}
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Purchase History</h1>
          <p className="text-zinc-400">All your transactions and purchased products.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <p className="text-zinc-500 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <p className="text-zinc-500 text-sm mb-1">Purchases</p>
            <p className="text-2xl font-bold text-white">{transactions.filter((t) => t.status === "COMPLETED").length}</p>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <p className="text-zinc-500 text-sm mb-1">Refunds</p>
            <p className="text-2xl font-bold text-white">{transactions.filter((t) => t.status === "REFUNDED").length}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-zinc-800 pb-0">
          {(["ALL", "COMPLETED", "REFUNDED"] as const).map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                filter === f ? "text-white border-indigo-500" : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-5xl mb-4">📭</p>
            <p>No transactions found.</p>
            <Link href="/market" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">Browse the market →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((tx) => (
              <div key={tx.id} id={`tx-${tx.id}`} className="flex flex-col sm:flex-row sm:items-center gap-4 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-900/40 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">💻</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/market/${tx.productId}`} className="font-semibold text-white hover:text-indigo-300 transition-colors truncate">
                      {tx.product?.name || tx.description}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[tx.status] || "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm mt-0.5">{new Date(tx.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ID: {tx.id.slice(0, 8)}…</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-white font-bold text-lg">${tx.amount}</span>
                  {tx.status === "COMPLETED" && (
                    <button
                      id={`btn-review-${tx.id}`}
                      onClick={() => setReviewTarget(tx)}
                      className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-indigo-500 hover:text-white transition-colors"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

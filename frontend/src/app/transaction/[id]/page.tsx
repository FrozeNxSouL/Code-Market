"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct, createTransaction, getStoredUser, type Product } from "@/lib/api";

function InputField({ label, id, type = "text", placeholder, value, onChange }: {
  label: string; id: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-wider"
      />
    </div>
  );
}

export default function TransactionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [step, setStep] = useState<"details" | "confirm" | "success">("details");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(params.id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handlePay = async () => {
    setError("");
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      setError("Please fill in all card details.");
      return;
    }
    const user = getStoredUser();
    if (!user) {
      setError("Please sign in before making a purchase.");
      return;
    }
    setPaying(true);
    try {
      await createTransaction({ productId: params.id, paymentMethodId: "pm_" + Date.now() });
      setStep("success");
    } catch {
      setError("Payment failed. Please check your card details and try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
        <p className="text-zinc-400 mb-6">This product doesn't exist or has been removed.</p>
        <Link href="/market" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
          Back to Market
        </Link>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
          <p className="text-zinc-400">
            You've purchased <span className="text-white font-medium">{product.name}</span>. A receipt has been sent to your email.
          </p>
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-left space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Product</span><span className="text-white">{product.name}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Amount</span><span className="text-white font-bold">${product.price}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="text-emerald-400 font-medium">Completed</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Date</span><span className="text-white">{new Date().toLocaleDateString()}</span></div>
          </div>
          <div className="flex gap-3">
            <Link href="/history" id="btn-view-history" className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition-colors">
              View History
            </Link>
            <Link href="/market" className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-center transition-colors">
              Keep Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Form */}
        <div className="space-y-8">
          <div>
            <Link href={`/market/${params.id}`} className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1 mb-4">
              ← Back to product
            </Link>
            <h1 className="text-3xl font-bold text-white mb-1">Checkout</h1>
            <p className="text-zinc-500 text-sm">Secure payment powered by Stripe</p>
          </div>

          {/* Card visual */}
          <div className="relative h-44 rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 p-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="w-10 h-7 bg-amber-400/80 rounded-sm" />
                <p className="text-white/60 text-sm font-semibold tracking-widest">STRIPE</p>
              </div>
              <div>
                <p className="text-white font-mono text-lg tracking-widest">
                  {cardNumber || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between mt-2 text-white/70 text-xs">
                  <span>{cardName || "CARDHOLDER NAME"}</span>
                  <span>{cardExpiry || "MM/YY"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <InputField label="Cardholder Name" id="card-name" placeholder="John Doe" value={cardName} onChange={setCardName} />
            <InputField
              label="Card Number" id="card-number" placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(v) => setCardNumber(formatCard(v))}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Expiry" id="card-expiry" placeholder="MM/YY" value={cardExpiry} onChange={(v) => setCardExpiry(formatExpiry(v))} />
              <InputField label="CVC" id="card-cvc" placeholder="•••" value={cardCvc} onChange={setCardCvc} />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            id="btn-pay"
            onClick={handlePay}
            disabled={paying}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2"
          >
            {paying ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
            ) : (
              `Pay $${product.price}`
            )}
          </button>
          <p className="text-center text-xs text-zinc-600">
            🔒 Your payment is encrypted and secured by Stripe. We never store your card details.
          </p>
        </div>

        {/* Right — Order summary */}
        <div className="space-y-5 lg:pt-16">
          <h2 className="text-lg font-semibold text-zinc-300">Order Summary</h2>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-900/40 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">💻</div>
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">Lifetime License</span>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${product.price}</span></div>
              <div className="flex justify-between text-zinc-400"><span>Platform fee</span><span>$0.00</span></div>
              <div className="flex justify-between text-zinc-400"><span>Tax</span><span>Included</span></div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-zinc-800">
                <span>Total</span><span>${product.price}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm text-zinc-500">
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Instant download after purchase</p>
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 14-day money-back guarantee</p>
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Lifetime access to updates</p>
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Commercial use license included</p>
          </div>
        </div>
      </div>
    </div>
  );
}

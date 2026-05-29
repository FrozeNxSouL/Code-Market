"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, storeAuth } from "@/lib/api";

type AccountType = "BUYER" | "SELLER";

export default function SignUpPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("BUYER");
  const [name, setName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Auto-generate accountName from name
  const handleNameChange = (v: string) => {
    setName(v);
    setAccountName(v.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("Please fill in all required fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setLoading(true);
    try {
      const { token, user } = await register({ name, accountName, email, password });
      storeAuth(token, user);
      router.push("/market");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.12),transparent)] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl">
            <span className="bg-gradient-to-br from-indigo-400 to-purple-400 text-black w-10 h-10 rounded-xl flex items-center justify-center text-base font-black">CM</span>
            <span className="text-white">Code<span className="text-indigo-400">Market</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-zinc-400 text-sm">Join thousands of developers on CodeMarket</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-5">
          {/* Account type toggle */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-300">I want to…</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-800 rounded-xl">
              {(["BUYER", "SELLER"] as const).map((t) => (
                <button
                  key={t}
                  id={`type-${t.toLowerCase()}`}
                  type="button"
                  onClick={() => setAccountType(t)}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    accountType === t
                      ? "bg-zinc-900 text-white shadow border border-zinc-700"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t === "BUYER" ? "🛒 Buy Code" : "🚀 Sell Code"}
                </button>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <button
            id="btn-github-signup"
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex-1 h-px bg-zinc-800" />OR<div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="signup-name" className="text-sm font-medium text-zinc-300">Full Name <span className="text-red-400">*</span></label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="signup-username" className="text-sm font-medium text-zinc-300">Username <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">@</span>
                  <input
                    id="signup-username"
                    type="text"
                    placeholder="john_doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-sm font-medium text-zinc-300">Email <span className="text-red-400">*</span></label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-sm font-medium text-zinc-300">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors pr-12"
                />
                <button type="button" id="toggle-signup-password" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? strengthColor : "bg-zinc-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">Strength: <span className={strength >= 3 ? "text-emerald-400" : strength >= 2 ? "text-amber-400" : "text-red-400"}>{strengthLabel}</span></p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-confirm" className="text-sm font-medium text-zinc-300">Confirm Password <span className="text-red-400">*</span></label>
              <input
                id="signup-confirm"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-600 focus:outline-none transition-colors ${
                  confirm && confirm !== password ? "border-red-500 focus:border-red-500" : "border-zinc-700 focus:border-indigo-500"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-400">Passwords do not match.</p>
              )}
            </div>

            <label htmlFor="agree-terms" className="flex items-start gap-3 cursor-pointer">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-indigo-500 w-4 h-4"
              />
              <span className="text-sm text-zinc-400 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
              </span>
            </label>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              id="btn-signup"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

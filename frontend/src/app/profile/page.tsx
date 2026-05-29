"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredUser, getUser, updateUser, type User } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    getUser(user.id)
      .then((u) => {
        setUser(u);
        localStorage.setItem("cm_user", JSON.stringify(u));
      })
      .catch((err) => setError(err.message));
  }, []);

  const startEdit = () => {
    if (!user) return;
    setForm({
      name: user.name,
      accountName: user.accountName,
      accountDescription: user.accountDescription,
      phone: user.phone,
      githubHandle: user.githubHandle,
    });
    setEditing(true);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateUser(user.id, form);
      setUser(updated);
      localStorage.setItem("cm_user", JSON.stringify(updated));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const field = (u: User, key: keyof User, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label htmlFor={`field-${key}`} className="text-sm font-medium text-zinc-400">{label}</label>
      {editing ? (
        <input
          id={`field-${key}`}
          type={type}
          value={(form[key] as string) ?? ""}
          placeholder={placeholder}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      ) : (
        <p className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white min-h-[48px]">
          {(u[key] as string) || <span className="text-zinc-600 italic">Not set</span>}
        </p>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-white mb-2">Not signed in</h2>
        <p className="text-zinc-400 mb-6">Please sign in to view and edit your profile.</p>
        <Link href="/login" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-12 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-8">

        {/* Header card */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          <div className="h-24 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60" />
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border-4 border-zinc-900 flex items-center justify-center text-3xl font-bold text-white shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-zinc-400 text-sm">@{user.accountName}</p>
              </div>
              <div className="flex items-center gap-3 pb-2">
                {saved && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Saved
                  </span>
                )}
                {editing ? (
                  <>
                    <button id="btn-cancel-edit" onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">Cancel</button>
                    <button id="btn-save" onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2">
                      {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button id="btn-edit" onClick={startEdit} className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-zinc-700 transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>
              {error && (
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                user.type === "SELLER"
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  : user.type === "ADMIN"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}>{user.type}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">● {user.status}</span>
              <span className="text-xs text-zinc-600 flex items-center gap-1">Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-6">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field(user, "name", "Full Name", "text", "Your full name")}
            {field(user, "accountName", "Username", "text", "@username")}
          </div>
          {field(user, "accountDescription", "Bio", "text", "Tell the community about yourself…")}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field(user, "phone", "Phone Number", "tel", "+1 555 000 0000")}
            {field(user, "githubHandle", "GitHub Handle", "text", "username")}
          </div>
        </div>

        {/* Read-only */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Account Security</h2>
          <p className="text-zinc-500 text-sm mb-4">Some fields can only be changed by contacting support.</p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Email Address</label>
            <div className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex justify-between items-center">
              <span>{user.email}</span>
              <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">Verified</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <div className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex justify-between items-center">
              <span className="font-mono tracking-widest">••••••••••</span>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Change password</button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="border border-red-900/30 bg-red-900/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-1">Danger Zone</h2>
          <p className="text-zinc-500 text-sm mb-4">Permanent actions that can't be undone.</p>
          <button id="btn-delete-account" className="px-5 py-2 rounded-lg border border-red-800 text-red-400 text-sm hover:bg-red-900/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

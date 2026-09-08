"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { LogOut, Lock, Eye, RotateCcw } from "lucide-react";
import type { Gift } from "@/lib/registry";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNames, setEditingNames] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setAuthenticated(data.authenticated);
    return data.authenticated as boolean;
  }, []);

  const loadAdminGifts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gifts");
    if (res.ok) {
      const data = await res.json();
      const list: Gift[] = data.gifts ?? [];
      setGifts(list);
      setEditingNames(
        Object.fromEntries(
          list
            .filter((g) => g.claimedBy)
            .map((g) => [g.id, g.claimedBy as string])
        )
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) loadAdminGifts();
    });
  }, [checkAuth, loadAdminGifts]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setLoginError("Invalid username or password.");
      return;
    }

    setAuthenticated(true);
    loadAdminGifts();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setGifts([]);
    setEditingNames({});
    setUsername("");
    setPassword("");
  }

  async function updateReservationName(giftId: string) {
    const name = editingNames[giftId]?.trim();
    if (!name || name.length < 2) {
      setActionError("Please enter a valid name.");
      return;
    }

    setActionLoading(giftId);
    setActionError("");

    const res = await fetch(`/api/admin/gifts/${giftId}/claim`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) {
      setActionError(data.error || "Could not update name.");
      setActionLoading(null);
      return;
    }

    await loadAdminGifts();
    setActionLoading(null);
  }

  async function releaseReservation(giftId: string) {
    setActionLoading(`${giftId}-release`);
    setActionError("");

    const res = await fetch(`/api/admin/gifts/${giftId}/claim`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ release: true }),
    });

    const data = await res.json();
    if (!res.ok) {
      setActionError(data.error || "Could not mark gift as open.");
      setActionLoading(null);
      return;
    }

    await loadAdminGifts();
    setActionLoading(null);
  }

  if (authenticated === null) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted">
          Loading...
        </div>
      </PageShell>
    );
  }

  if (!authenticated) {
    return (
      <PageShell>
        <div className="mx-auto max-w-sm px-4 py-10">
          <div className="rounded-2xl bg-cream/95 p-6 shadow-sm ring-1 ring-forest/10">
            <div className="mb-5 flex items-center gap-2 text-forest">
              <Lock className="h-5 w-5" />
              <h1 className="font-serif text-2xl font-semibold">Admin login</h1>
            </div>
            <p className="mb-5 text-sm text-muted">
              Sign in to see who has reserved each gift.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1 block text-xs font-medium">
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-xs font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  autoComplete="current-password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-terracotta">{loginError}</p>
              )}
              <button type="submit" className="btn-primary w-full">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-forest" />
            <h1 className="font-serif text-2xl font-semibold text-forest">
              Reservations
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary !px-3 !py-2 text-xs"
          >
            <LogOut className="mr-1 inline h-3.5 w-3.5" />
            Logout
          </button>
        </div>

        <p className="mb-6 text-sm text-muted">
          Guest names are hidden from the public list. You can update a name or
          mark a gift open again here.
        </p>

        {actionError && (
          <p className="mb-4 rounded-lg bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
            {actionError}
          </p>
        )}

        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-cream-dark/80" />
        ) : (
          <div className="space-y-3">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="rounded-2xl border border-forest/15 bg-cream/90 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-forest">
                      {gift.name}
                    </h3>
                    {gift.link && (
                      <a
                        href={gift.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate text-xs text-terracotta underline"
                      >
                        {gift.link}
                      </a>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      gift.claimedBy
                        ? "bg-forest/15 text-forest"
                        : "bg-cream-dark text-muted"
                    }`}
                  >
                    {gift.claimedBy ? "Reserved" : "Open"}
                  </span>
                </div>

                <div className="mt-3 border-t border-forest/10 pt-3 text-sm">
                  {gift.claimedBy ? (
                    <div className="space-y-3">
                      {gift.claimedAt && (
                        <p className="text-xs text-muted">
                          Reserved on{" "}
                          {new Date(gift.claimedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      <div>
                        <label
                          htmlFor={`name-${gift.id}`}
                          className="mb-1 block text-xs font-medium text-forest/80"
                        >
                          Reserved by
                        </label>
                        <input
                          id={`name-${gift.id}`}
                          value={editingNames[gift.id] ?? gift.claimedBy}
                          onChange={(e) =>
                            setEditingNames((prev) => ({
                              ...prev,
                              [gift.id]: e.target.value,
                            }))
                          }
                          className="input-field"
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => updateReservationName(gift.id)}
                          disabled={actionLoading === gift.id}
                          className="btn-primary flex-1 !py-2 text-xs disabled:opacity-60"
                        >
                          {actionLoading === gift.id
                            ? "Saving..."
                            : "Update name"}
                        </button>
                        <button
                          type="button"
                          onClick={() => releaseReservation(gift.id)}
                          disabled={actionLoading === `${gift.id}-release`}
                          className="btn-secondary flex-1 !py-2 text-xs disabled:opacity-60"
                        >
                          <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
                          {actionLoading === `${gift.id}-release`
                            ? "Opening..."
                            : "Mark open again"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">Not reserved yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

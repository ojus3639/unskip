"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Plus, Trash2, Save, Lock } from "lucide-react";

type EditableGift = {
  id?: string;
  name: string;
  link: string;
};

export default function EditPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [gifts, setGifts] = useState<EditableGift[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setAuthenticated(data.authenticated);
    return data.authenticated as boolean;
  }, []);

  const loadGifts = useCallback(async () => {
    const res = await fetch("/api/admin/gifts");
    if (res.ok) {
      const data = await res.json();
      setGifts(
        (data.gifts ?? []).map((g: EditableGift) => ({
          id: g.id,
          name: g.name,
          link: g.link ?? "",
        }))
      );
    }
  }, []);

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) loadGifts();
    });
  }, [checkAuth, loadGifts]);

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
    loadGifts();
  }

  function updateGift(index: number, field: keyof EditableGift, value: string) {
    setGifts((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  }

  function addGift() {
    setGifts((prev) => [...prev, { name: "", link: "" }]);
  }

  function removeGift(index: number) {
    setGifts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = gifts.filter((g) => g.name.trim());

    const res = await fetch("/api/admin/gifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gifts: payload }),
    });

    if (res.ok) {
      setMessage("Gift list saved.");
      loadGifts();
    } else {
      setMessage("Could not save. Please try again.");
    }
    setSaving(false);
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
              <h1 className="font-serif text-2xl font-semibold">Edit list</h1>
            </div>
            <p className="mb-5 text-sm text-muted">
              Sign in to add, remove, or update gifts on the list.
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
        <h1 className="font-serif mb-2 text-2xl font-semibold text-forest">
          Edit gift list
        </h1>
        <p className="mb-6 text-sm text-muted">
          Update gift names and links. Reservations are kept when you save.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {gifts.map((gift, index) => (
            <div
              key={gift.id ?? `new-${index}`}
              className="rounded-2xl border border-forest/15 bg-cream/90 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Gift {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGift(index)}
                  className="rounded-lg p-1.5 text-terracotta hover:bg-terracotta/10"
                  aria-label="Remove gift"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name</label>
                  <input
                    value={gift.name}
                    onChange={(e) => updateGift(index, "name", e.target.value)}
                    placeholder="Gift name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Link (optional)
                  </label>
                  <input
                    value={gift.link}
                    onChange={(e) => updateGift(index, "link", e.target.value)}
                    placeholder="https://..."
                    className="input-field"
                    type="url"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addGift}
            className="btn-secondary w-full"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add gift
          </button>

          {message && (
            <p className="text-center text-sm text-forest">{message}</p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

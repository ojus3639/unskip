"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PublicGift } from "./GiftCard";

type ClaimModalProps = {
  gift: PublicGift | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function ClaimModal({ gift, onClose, onSuccess }: ClaimModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gift) {
      setName("");
      setError("");
    }
  }, [gift]);

  if (!gift) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/gifts/${gift!.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-slide-up relative w-full max-w-md rounded-2xl bg-cream p-5 shadow-xl ring-1 ring-forest/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-forest/60 hover:bg-forest/10"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-serif pr-8 text-xl font-semibold text-forest">
          Reserve {gift.name}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Add your name or family name. Only we can see this — it won&apos;t
          show on the public list.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="claim-name" className="mb-1.5 block text-xs font-medium text-forest/80">
              Your name / family name
            </label>
            <input
              id="claim-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. The Sharma family"
              className="input-field"
              autoFocus
            />
          </div>

          {error && (
            <p className="rounded-lg bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Reserving..." : "Confirm reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}

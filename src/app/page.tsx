"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { GiftCard, type PublicGift } from "@/components/GiftCard";
import { ClaimModal } from "@/components/ClaimModal";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [gifts, setGifts] = useState<PublicGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PublicGift | null>(null);

  const loadGifts = useCallback(async () => {
    const res = await fetch("/api/gifts");
    const data = await res.json();
    setGifts(data.gifts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const available = gifts.filter((g) => !g.claimed).length;
  const reserved = gifts.filter((g) => g.claimed).length;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-8 pb-12">
        <section className="animate-fade-in mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
            <Sparkles className="h-3.5 w-3.5" />
            With love
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
            Ojus and Pallavi&apos;s Wedding
          </h1>
          <p className="font-serif mt-2 text-2xl font-medium text-forest/80 sm:text-3xl">
            Gift Registry
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Your presence is the greatest gift. If you&apos;d like to bring
            something, pick an item below and reserve it so we avoid duplicates.
          </p>

          {!loading && (
            <div className="mt-5 flex justify-center gap-3">
              <span className="rounded-full bg-forest px-3 py-1 text-xs font-medium text-cream">
                {available} available
              </span>
              <span className="rounded-full bg-cream-dark px-3 py-1 text-xs font-medium text-forest">
                {reserved} reserved
              </span>
            </div>
          )}
        </section>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-cream-dark/80"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {gifts.map((gift, i) => (
              <div
                key={gift.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <GiftCard gift={gift} onReserve={setSelected} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ClaimModal
        gift={selected}
        onClose={() => setSelected(null)}
        onSuccess={loadGifts}
      />
    </PageShell>
  );
}

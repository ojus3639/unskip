import { ExternalLink, Gift } from "lucide-react";

export type PublicGift = {
  id: string;
  name: string;
  link: string;
  claimed: boolean;
};

type GiftCardProps = {
  gift: PublicGift;
  onReserve: (gift: PublicGift) => void;
};

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        gift.claimed
          ? "border-forest/15 bg-cream/50 opacity-80"
          : "border-forest/20 bg-cream/90 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            gift.claimed ? "bg-forest/10" : "bg-forest/15"
          }`}
        >
          <Gift className="h-5 w-5 text-forest" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-forest">
            {gift.name}
          </h3>
          {gift.link ? (
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-terracotta underline-offset-2 hover:underline"
            >
              View gift link
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="mt-1 text-xs text-muted">Link coming soon</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {gift.claimed ? (
          <div className="flex items-center justify-center rounded-xl bg-forest/10 py-2.5 text-sm font-medium text-forest">
            Reserved
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onReserve(gift)}
            className="w-full rounded-xl bg-forest py-2.5 text-sm font-semibold text-cream transition hover:bg-forest/90 active:scale-[0.98]"
          >
            I&apos;ll gift this
          </button>
        )}
      </div>
    </article>
  );
}

import type { ReactNode } from "react";
import { Header } from "@/components/Header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/couple-bg.jpg')" }}
      />
      <div className="pointer-events-none fixed inset-0 bg-cream/75 backdrop-blur-[2px]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-cream/30 via-cream/60 to-cream/90" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, Pencil, Heart } from "lucide-react";

const links = [
  { href: "/", label: "Gift List", icon: Gift },
  { href: "/admin/edit", label: "Edit List", icon: Pencil },
  { href: "/admin", label: "Admin", icon: Heart },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="font-serif text-lg font-semibold text-forest">
          Gift Registry
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-forest text-cream"
                    : "text-forest/70 hover:bg-forest/10 hover:text-forest"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import {
  ArrowRight,
  Brain,
  Check,
  Clock,
  Flame,
  MapPin,
  Menu,
  Package,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useState } from "react";

const products = [
  {
    name: "Spinach & Cheese Egg Muffins",
    description:
      "Tender spinach and melted cheese folded into fluffy, protein-packed egg muffins. Open the pack, eat, and go — no prep required.",
    badge: "Available now",
    badgeClass: "badge-lime",
    image: "/images/spinach-cheese-egg-muffins.png",
  },
  {
    name: "French Toast Sticks",
    description:
      "Golden, grab-and-go french toast sticks — a sweet, satisfying start to your morning. Currently under development; coming soon to the lineup.",
    badge: "In development",
    badgeClass: "badge-muted",
    image: "/images/french-toast-sticks.png",
  },
];

const pillars = [
  {
    icon: Clock,
    title: "Zero Prep",
    description:
      "Open the pack and eat. No cooking, no chopping — breakfast solved in seconds.",
  },
  {
    icon: Zap,
    title: "High Protein",
    description:
      "Protein-first nutrition to keep you full, focused, and energised all morning.",
  },
  {
    icon: Package,
    title: "Packaged & Portable",
    description:
      "Take it to work, the gym, or straight from the fridge. Built for busy mornings.",
  },
  {
    icon: MapPin,
    title: "Made in Faridabad",
    description:
      "Proudly crafted in Faridabad, Haryana — local food, global ambition.",
  },
];

const inquiryTypes = [
  "General enquiry",
  "Concern or feedback",
  "Suggestion",
  "Work with us / Collaboration",
];

const heroStats = [
  { value: "High", label: "Protein" },
  { value: "Seconds", label: "To ready" },
  { value: "2", label: "Products" },
];

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
  { href: "#contact", label: "Contact" },
];

const whyPoints = [
  {
    id: "protein",
    icon: Zap,
    label: "Protein",
    stat: "15g+",
    statLabel: "protein per serving",
    detail:
      "Starting your day with protein helps control appetite, supports muscle recovery, and keeps you satisfied well past mid-morning.",
  },
  {
    id: "energy",
    icon: Flame,
    label: "Energy",
    stat: "4 hrs",
    statLabel: "sustained fuel",
    detail:
      "After hours of sleep your body needs fuel. A protein-rich breakfast stabilises blood sugar so you avoid the mid-morning crash.",
  },
  {
    id: "focus",
    icon: Brain,
    label: "Focus",
    stat: "2×",
    statLabel: "better concentration",
    detail:
      "Glucose from a proper breakfast restores what your brain needs for memory, alertness, and getting through that first meeting.",
  },
  {
    id: "habit",
    icon: Check,
    label: "Habit",
    stat: "1",
    statLabel: "meal changes everything",
    detail:
      "One consistent breakfast habit sets the tone for healthier choices all day — we make it effortless with zero-prep packaging.",
  },
];

export default function Home() {
  const [formState, setFormState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeWhy, setActiveWhy] = useState(whyPoints[0].id);
  const [heroFlipped, setHeroFlipped] = useState(false);

  const currentWhy =
    whyPoints.find((p) => p.id === activeWhy) ?? whyPoints[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey || accessKey === "your_access_key_here") {
      setFormState("error");
      setErrorMessage(
        "Contact form is not configured yet. Please add your Web3Forms access key to .env.local"
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "Unskip Breakfast Club — New Reach Out");
    formData.append("from_name", "Unskip Breakfast Club Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormState("success");
        form.reset();
      } else {
        setFormState("error");
        setErrorMessage(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch {
      setFormState("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-[60px] sm:grid-cols-[1fr_auto_1fr] sm:px-6">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:h-11 sm:w-11">
              <Image
                src="/images/image.png"
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold tracking-tight sm:text-[15px]">
                <span className="text-primary">Unskip</span>{" "}
                <span className="text-foreground">Breakfast Club</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                High-protein packaged breakfast
              </p>
            </div>
          </a>

          <nav className="hidden items-center justify-center gap-7 sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-muted-foreground transition hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <a
              href="#contact"
              className="btn-lime hidden !px-4 !py-1.5 text-xs sm:inline-flex sm:!text-[13px]"
            >
              Reach Out
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted sm:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border px-4 py-2 sm:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-lime mt-1 w-full justify-center !py-2 text-sm"
            >
              Reach Out
            </a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-5">
                <span className="badge badge-lime">High-protein · No prep</span>
                <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]">
                  Breakfast you{" "}
                  <span className="text-primary">won&apos;t skip</span>
                </h1>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  Quick, no-prep packaged breakfast that&apos;s high in protein.
                  Fuel up on your busiest mornings — made in Faridabad, Haryana.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#products" className="btn-lime group">
                    See Products
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a href="#contact" className="btn-ghost">
                    Get in Touch
                  </a>
                </div>
                <div className="flex items-center gap-5 border-t border-border pt-5">
                  {heroStats.map((stat, i) => (
                    <div key={stat.label} className="contents">
                      {i > 0 && <div className="h-8 w-px bg-border" />}
                      <div>
                        <p className="text-xl font-bold text-primary">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div className="absolute inset-0 rotate-2 rounded-2xl bg-primary/20" />
                <button
                  type="button"
                  onClick={() => setHeroFlipped((f) => !f)}
                  aria-label={heroFlipped ? "Show logo" : "Show brand proposition"}
                  className="flip-scene relative block w-full text-left"
                >
                  <div
                    className={`flip-card ring-1 ring-border ${heroFlipped ? "is-flipped" : ""}`}
                  >
                    {/* Front — logo */}
                    <div className="flip-face bg-card">
                      <Image
                        src="/images/image.png"
                        alt="Unskip Breakfast Club"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 pt-10">
                        <p className="text-xs font-medium text-muted-foreground">
                          Tap to flip
                        </p>
                      </div>
                    </div>

                    {/* Back — brand proposition */}
                    <div className="flip-face flip-face-back flex flex-col justify-center bg-card p-6 sm:p-8">
                      <span className="badge badge-lime mb-4 w-fit">
                        Our promise
                      </span>
                      <p className="mb-2 text-2xl font-bold leading-tight sm:text-3xl">
                        High-protein breakfast,{" "}
                        <span className="text-primary">ready in seconds</span>
                      </p>
                      <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        No cooking, no chopping, no morning chaos. Just
                        packaged breakfast that fuels you — open, eat, and take
                        on your day.
                      </p>
                      <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex items-center gap-3">
                          <Zap className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm">Protein-first, every serving</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm">Zero prep — grab and go</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm">Packaged for busy mornings</span>
                        </div>
                      </div>
                      <p className="mt-5 text-xs text-muted-foreground">
                        Tap again to flip back
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section-pad border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 max-w-xl">
              <span className="badge badge-lime mb-3">About</span>
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Mornings made easy, nutrition made a priority
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                We started Unskip Breakfast Club because skipping breakfast
                shouldn&apos;t be the norm. Packaged breakfast that&apos;s high in
                protein, ready in seconds, and actually delicious.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-xl bg-background p-4 ring-1 ring-border transition hover:ring-primary/30"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <pillar.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">{pillar.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="section-pad">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <span className="badge badge-lime mb-3">Products</span>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                What we make
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
                High-protein packaged breakfast — grab-and-go, done right.
              </p>
              <span className="badge badge-muted mx-auto mt-3">
                Awareness only — not for sale online yet
              </span>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <div key={product.name} className="card card-hover group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <span
                      className={`badge absolute top-2.5 left-2.5 z-10 ${product.badgeClass}`}
                    >
                      {product.badge}
                    </span>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-base font-bold">{product.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="section-pad border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div>
                <span className="badge badge-lime mb-3">Why it matters</span>
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  #UnskipBreakfast
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Most people skip breakfast because mornings are rushed — not
                  because they don&apos;t care. Tap each point to see why the
                  first meal makes a real difference.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We&apos;re building convenience without compromise — from egg
                  muffins to french toast sticks, with more high-protein products
                  on the way.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-border">
                <div className="grid grid-cols-4 border-b border-border">
                  {whyPoints.map((point) => {
                    const isActive = activeWhy === point.id;
                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setActiveWhy(point.id)}
                        className={`flex flex-col items-center gap-1.5 px-2 py-3 transition sm:px-3 sm:py-4 ${
                          isActive
                            ? "border-b-2 border-primary bg-primary/5"
                            : "border-b-2 border-transparent hover:bg-muted"
                        }`}
                      >
                        <point.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <span
                          className={`text-[10px] font-semibold sm:text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {point.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div key={activeWhy} className="animate-fade-in p-5 sm:p-6">
                  <div className="mb-4 flex items-end gap-3">
                    <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                      {currentWhy.stat}
                    </p>
                    <p className="mb-1.5 text-sm font-medium text-muted-foreground">
                      {currentWhy.statLabel}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {currentWhy.detail}
                  </p>
                  <div className="mt-4 flex gap-1">
                    {whyPoints.map((point) => (
                      <div
                        key={point.id}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          activeWhy === point.id
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-start gap-4 rounded-xl bg-card p-5 ring-1 ring-border">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-base font-bold">Based in Faridabad, Haryana</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A local business making high-protein breakfast accessible to
                  everyone who&apos;s ever skipped the most important meal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section-pad pb-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <div className="mb-6 text-center">
                <span className="badge badge-lime mb-3">Reach out</span>
                <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Get in touch
                </h2>
                <p className="text-sm text-muted-foreground">
                  Concerns, suggestions, or collaboration ideas — drop us a
                  message and we&apos;ll get back to you.
                </p>
              </div>

              {formState === "success" ? (
                <div className="rounded-2xl bg-card p-8 text-center ring-1 ring-primary/30">
                  <Check className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 text-lg font-bold">Message sent</h3>
                  <p className="text-sm text-muted-foreground">
                    Thanks for reaching out. We&apos;ll be in touch soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormState("idle")}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-border sm:p-6"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-xs font-medium text-muted-foreground">
                        Name
                      </label>
                      <input id="name" name="name" type="text" required placeholder="Your name" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-xs font-medium text-muted-foreground">
                        Email
                      </label>
                      <input id="email" name="email" type="email" required placeholder="you@email.com" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="inquiry_type" className="mb-1 block text-xs font-medium text-muted-foreground">
                      Topic
                    </label>
                    <select id="inquiry_type" name="inquiry_type" required defaultValue="" className="select-field">
                      <option value="" disabled>Select one</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1 block text-xs font-medium text-muted-foreground">
                      Message
                    </label>
                    <textarea id="message" name="message" rows={3} required placeholder="Your message..." className="textarea-field" />
                  </div>
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                  {formState === "error" && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>
                  )}
                  <button type="submit" disabled={formState === "loading"} className="btn-lime group w-full justify-center !py-2.5">
                    {formState === "loading" ? "Sending..." : "Send Message"}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Image src="/images/image.png" alt="" width={24} height={24} className="rounded" />
            <span className="text-sm font-bold">Unskip Breakfast Club</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} · Faridabad, Haryana
          </p>
          <p className="text-xs font-bold text-primary">#UnskipBreakfast</p>
        </div>
      </footer>
    </div>
  );
}

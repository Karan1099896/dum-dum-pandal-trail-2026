import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dum Dum Pandal Trail 2026 — North Kolkata Puja Guide" },
      { name: "description", content: "A maximalist Durga Puja 2026 pandal-hopping guide for Dum Dum Park, North Kolkata: Tarun Sangha, Bharat Chakra, Sarbojanin, Yubak Brinda, Tarun Dal plus nearby extensions." },
      { property: "og:title", content: "Dum Dum Pandal Trail 2026" },
      { property: "og:description", content: "Five legendary stops. One North Kolkata night. Maps links, a walking circuit and a packing checklist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Pandal = {
  id: string;
  name: string;
  area: string;
  address: string;
  category: "core" | "extension";
  description: string;
  note?: string;
  caveat?: string;
  color: string;
};

const PANDALS: Pandal[] = [
  {
    id: "tarun-sangha",
    name: "Dum Dum Park Tarun Sangha",
    area: "Dum Dum Park",
    address: "496, Dum Dum Park, Kolkata, West Bengal 700055",
    category: "core",
    description: "The trailhead. One of the most talked-about pandals in the Dum Dum Park cluster.",
    note: "Reported theme: Binia Katha — verify onsite.",
    color: "bg-vermilion",
  },
  {
    id: "bharat-chakra",
    name: "Dum Dum Park Bharat Chakra",
    area: "Dum Dum Park",
    address: "Tank No. 2, Dum Dum Park, South Dumdum, West Bengal 700055",
    category: "core",
    description: "A Dum Dum Park institution by the tank — a fixture of every local pandal round.",
    note: "Theme: confirm on arrival.",
    color: "bg-cobalt",
  },
  {
    id: "sarbojanin",
    name: "Dum Dum Park Sarbojanin Durga Puja Samity",
    area: "Dum Dum Park",
    address: "225/1, Dum Dum Park, South Dumdum, West Bengal 700055",
    category: "core",
    description: "The big community puja of the park, drawing some of the heaviest evening crowds.",
    note: "Reported 2026 concept: folk puppetry, with live puppetry shows per recent coverage — verify onsite.",
    color: "bg-pink",
  },
  {
    id: "yubak-brinda",
    name: "Dum Dum Park Yubak Brinda",
    area: "Dum Dum Park",
    address: "Dum Dum Park, South Dumdum, West Bengal 700055",
    category: "core",
    description: "A much-loved local stop inside the park's core cluster.",
    caveat: "Dum Dum Park area — verify exact gate on Maps.",
    color: "bg-emerald",
  },
  {
    id: "tarun-dal",
    name: "Dum Dum Park Tarun Dal",
    area: "Dum Dum Park / Shyamnagar Rd",
    address: "Dum Dum Park, Shyamnagar Road side, South Dumdum, West Bengal 700055",
    category: "core",
    description: "The fifth core stop, on the Shyamnagar Road side of the park.",
    caveat: "Exact gate should be confirmed on Maps.",
    color: "bg-marigold",
  },
  {
    id: "amra-sobai",
    name: "Arjunpur Amra Sobai Club",
    area: "Arjunpur",
    address: "Arjunpur, Kolkata, West Bengal",
    category: "extension",
    description: "A popular Arjunpur stop worth the short hop north of Dum Dum Park.",
    caveat: "Exact gate unverified — confirm on Maps.",
    color: "bg-cobalt",
  },
  {
    id: "sreebhumi",
    name: "Sreebhumi Sporting Club",
    area: "Lake Town / Sreebhumi",
    address: "8th Lane, Sreebhumi, Lake Town, South Dumdum, West Bengal 700048",
    category: "extension",
    description: "The famous Lake Town blockbuster — a nearby extension rather than a core Dum Dum Park stop.",
    note: "Theme: confirm on arrival.",
    color: "bg-vermilion",
  },
  {
    id: "adhibasi-brinda",
    name: "Nagerbazar Adhibasi Brinda",
    area: "Nagerbazar / Jessore Rd",
    address: "Nagerbazar, Jessore Road area, Kolkata, West Bengal",
    category: "extension",
    description: "A strong Nagerbazar-area option to extend the night further north.",
    caveat: "Exact gate unverified — confirm on Maps.",
    color: "bg-emerald",
  },
];

const CORE = PANDALS.filter((p) => p.category === "core");
const EXTENSIONS = PANDALS.filter((p) => p.category === "extension");

const PACK = [
  { id: "phone", label: "Phone charged" },
  { id: "power", label: "Power bank" },
  { id: "water", label: "Water" },
  { id: "shoes", label: "Comfortable shoes" },
  { id: "cash", label: "Cash / UPI ready" },
  { id: "crowd", label: "Expect evening queues" },
  { id: "meeting", label: "Set a family meeting point" },
  { id: "confirm", label: "Confirm entrances on Maps" },
];

const TIPS = [
  "Queues usually peak in the evening — arrive earlier for a calmer round.",
  "Follow police and volunteer directions; event-day barricades and one-way routes change access.",
  "Confirm exact entrances via Maps and onsite signage — block-level pins can be off.",
  "Carry water and agree a family meeting point before you split up.",
  "Dum Dum Park is the compact five-stop core; Sreebhumi and Nagerbazar are nearby extensions and may need an auto, toto or cab depending on crowds.",
];

const mapsUrl = (name: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Durga Puja")}`;
const dirUrl = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

function usePersisted(key: string) {
  const [v, setV] = useState<Record<string, boolean>>({});
  const loaded = useRef(false);
  useEffect(() => {
    try { setV(JSON.parse(localStorage.getItem(key) || "{}")); } catch { /* ignore */ }
    loaded.current = true;
  }, [key]);
  useEffect(() => { if (loaded.current) localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
  return [v, setV] as const;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Pin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden>
      <path d="M24 2C12 2 3 11 3 23c0 16 21 38 21 38s21-22 21-38C45 11 36 2 24 2z" fill="var(--vermilion)" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="24" cy="23" r="10" fill="var(--gold)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M24 15c2 4 6 6 6 8s-3 5-6 7c-3-2-6-5-6-7s4-4 6-8z" fill="var(--pink)" />
    </svg>
  );
}

function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} aria-hidden>
      {[-50, -25, 0, 25, 50].map((r, i) => (
        <ellipse key={i} cx="50" cy="32" rx="9" ry="26" transform={`rotate(${r} 50 55)`} fill={i % 2 ? "var(--pink)" : "var(--marigold)"} stroke="var(--ink)" strokeWidth="2" />
      ))}
    </svg>
  );
}

function Alpona({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="50" cy="50" r="8" />
      <circle cx="50" cy="50" r="44" strokeDasharray="2 6" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d="M50 42 C44 30 46 20 50 12 C54 20 56 30 50 42" transform={`rotate(${i * 30} 50 50)`} />
      ))}
    </svg>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`grid size-7 shrink-0 place-items-center rounded-md border-[3px] border-ink ${on ? "bg-emerald animate-pop" : "bg-card"}`}>
      {on && <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M4 10l4 4 8-9" stroke="var(--paper)" strokeWidth="3.5" fill="none" strokeLinecap="round" /></svg>}
    </span>
  );
}

function Index() {
  const [visited, setVisited] = usePersisted("ddpt26-visited");
  const [packed, setPacked] = usePersisted("ddpt26-pack");
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [query, setQuery] = useState("");
  const [routeMode, setRouteMode] = useState<"core" | "extended">("core");
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState("");
  useReveal();

  const active = routeMode === "core" ? CORE : PANDALS;
  const count = active.filter((p) => visited[p.id]).length;
  const pct = (count / active.length) * 100;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return active
      .filter((p) => filter === "all" || (filter === "done" ? visited[p.id] : !visited[p.id]))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
  }, [active, filter, visited, query]);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2400); return () => clearTimeout(t); }, [toast]);

  const share = async () => {
    const lines = (list: Pandal[]) => list.map((p, i) => `${i + 1}. ${visited[p.id] ? "✓" : "○"} ${p.name} — ${mapsUrl(p.name)}`).join("\n");
    const text = `DUM DUM PANDAL TRAIL 2026 (suggested walking order, crowd dependent)\n\nMain walking circuit:\n${lines(CORE)}\n\nExtend your night:\n${lines(EXTENSIONS)}\n\nProgress: ${count}/${active.length}. Confirm entrances, dates & access locally — event-day traffic may change access.`;
    try {
      if (navigator.share) { await navigator.share({ title: "Dum Dum Pandal Trail 2026", text }); return; }
      await navigator.clipboard.writeText(text); setToast("Itinerary copied!");
    } catch (e) {
      if ((e as Error).name !== "AbortError") { try { await navigator.clipboard.writeText(text); setToast("Itinerary copied!"); } catch { setToast("Couldn't copy — try again"); } }
    }
  };

  const ticker = "SHUBHO SHARODIYA ✦ TARUN SANGHA ✦ BHARAT CHAKRA ✦ SARBOJANIN ✦ YUBAK BRINDA ✦ TARUN DAL ✦ DHAAK ON ✦ ";

  const card = (p: Pandal, i: number, num: number, span: string) => {
    const on = !!visited[p.id];
    return (
      <li key={p.id} className={`reveal ${span}`} style={{ animationDelay: `${i * 80}ms` }}>
        <article className={`spring relative h-full overflow-hidden rounded-2xl border-4 border-ink bg-card shadow-pop ${i % 2 ? "md:rotate-1" : "md:-rotate-1"} ${on ? "opacity-90" : ""}`}>
          <div className={`${p.color} relative flex items-center justify-between gap-3 px-5 py-4 text-primary-foreground`}>
            <div className="absolute inset-0 dots-bg opacity-40" aria-hidden />
            <span className="relative grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper font-display text-2xl text-ink">{num}</span>
            <div className="relative min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-ink">{p.area} • {p.category === "core" ? "Core" : "Nearby extension"}</p>
              <h3 className="font-display text-3xl leading-none text-ink [text-shadow:2px_2px_0_var(--paper)] md:text-4xl">{p.name}</h3>
            </div>
            <Pin className="relative w-9 shrink-0" />
          </div>
          <div className="h-2 alpona-border" aria-hidden />
          <div className="space-y-3 p-5">
            <p className="font-medium">{p.description}</p>
            <p className="text-sm">{p.address}</p>
            {p.caveat && <p className="inline-block -rotate-1 rounded bg-gold px-2 py-0.5 text-xs font-bold">{p.caveat}</p>}
            <p className="text-sm text-muted-foreground">{p.note ?? "Theme: confirm on arrival."}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={mapsUrl(p.name)} target="_blank" rel="noopener noreferrer" className="spring rounded-lg border-[3px] border-ink bg-cobalt px-4 py-2 text-sm font-bold text-secondary-foreground shadow-pop-sm">Open Maps ↗</a>
              <a href={dirUrl(p.address)} target="_blank" rel="noopener noreferrer" className="spring rounded-lg border-[3px] border-ink bg-card px-4 py-2 text-sm font-bold shadow-pop-sm">Get directions ↗</a>
              <button onClick={() => setVisited((v) => ({ ...v, [p.id]: !v[p.id] }))} aria-pressed={on}
                className={`spring flex items-center gap-2 rounded-lg border-[3px] border-ink px-4 py-2 text-sm font-bold shadow-pop-sm ${on ? "bg-emerald text-primary-foreground" : "bg-marigold"}`}>
                <Check on={on} /> {on ? "Visited!" : "Mark visited"}
              </button>
            </div>
          </div>
          {on && <span className="absolute right-3 top-20 rotate-12 rounded-full border-[3px] border-ink bg-pink px-3 py-1 font-display text-lg shadow-pop-sm animate-pop">DONE ✦</span>}
        </article>
      </li>
    );
  };

  const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4", "lg:col-span-6"];

  return (
    <div className="overflow-x-hidden">
      <div className="h-3 alpona-border" />
      {/* HERO */}
      <header className="relative bg-vermilion text-primary-foreground">
        <div className="absolute inset-0 dots-bg opacity-40" aria-hidden />
        <Alpona className="pointer-events-none absolute -right-24 -top-24 size-80 text-gold opacity-60 animate-spin-slow" />
        <Lotus className="pointer-events-none absolute left-4 top-24 w-16 animate-floaty md:w-24" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-16 pt-10 md:grid-cols-[1.2fr_1fr] md:items-center md:pt-16">
          <div className="reveal">
            <p className="inline-block -rotate-2 rounded-full border-[3px] border-ink bg-gold px-4 py-1 text-sm font-bold text-ink shadow-pop-sm">
              Durga Puja 2026 • Dum Dum Park, North Kolkata
            </p>
            <h1 className="mt-6 font-display text-[3rem] leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
              DUM DUM <span className="block text-gold [text-shadow:4px_4px_0_var(--ink)]">PANDAL TRAIL 2026</span>
            </h1>
            <p className="mt-5 max-w-md text-lg">Five legendary stops. One North Kolkata night.</p>
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Route stats">
              {["5 main stops", "3 optional add-ons", "1 epic night"].map((s) => (
                <span key={s} className="rounded-full border-2 border-ink bg-ink/30 px-3 py-1 text-sm font-bold">{s}</span>
              ))}
              <p className="w-full text-xs opacity-80">Estimates and curated circuit counts, not official stats.</p>
            </div>
            <p className="mt-3 max-w-md rounded-lg border-2 border-dashed border-gold/80 bg-ink/30 p-3 text-sm">
              Heads-up: event-specific details are reported, not guaranteed. Police barricades, one-way routes and festival traffic can alter access — verify onsite.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#circuit" className="spring rounded-xl border-[3px] border-ink bg-gold px-5 py-3 font-bold text-ink shadow-pop">Start the trail →</a>
              <a href="#checklist" className="spring rounded-xl border-[3px] border-ink bg-cobalt px-5 py-3 font-bold text-secondary-foreground shadow-pop">Open checklist</a>
            </div>
          </div>
          <div className="reveal relative">
            <div className="rotate-2 overflow-hidden rounded-[2rem] border-4 border-ink shadow-pop">
              <img src={hero} alt="Illustrated dhaak drum, lotus flowers and alpona patterns" width={1280} height={960} className="h-full w-full object-cover" />
            </div>
            <span className="absolute -bottom-5 -left-3 -rotate-6 rounded-md border-[3px] border-ink bg-pink px-3 py-1 font-display text-xl shadow-pop-sm">8 stops!</span>
            <Pin className="absolute -right-3 -top-8 w-14 animate-floaty md:w-20" />
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div className="-rotate-1 border-y-4 border-ink bg-marigold py-3 text-ink" aria-hidden>
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-2xl">
          <span>{ticker.repeat(3)}</span><span>{ticker.repeat(3)}</span>
        </div>
      </div>

      {/* PROGRESS */}
      <section aria-label="Progress" className="sticky top-0 z-30 border-b-4 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
          <p className="font-display text-2xl" aria-live="polite">{count}/{active.length} <span className="font-sans text-sm font-bold">visited</span></p>
          <div className="h-5 flex-1 min-w-[140px] overflow-hidden rounded-full border-[3px] border-ink bg-card" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={active.length} aria-label="Pandals visited">
            <div className="h-full alpona-border transition-[width] duration-700 ease-[cubic-bezier(.3,1.4,.5,1)]" style={{ width: `${pct}%` }} />
          </div>
          <button onClick={share} className="spring rounded-lg border-[3px] border-ink bg-cobalt px-3 py-1.5 text-sm font-bold text-secondary-foreground shadow-pop-sm">Copy / share itinerary</button>
        </div>
      </section>

      <main>
        {/* ROUTE SELECTOR + CHECKLIST CARDS */}
        <section id="circuit" className="mx-auto max-w-6xl px-5 py-16">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-5xl leading-none md:text-7xl">The <span className="text-vermilion">Trail</span></h2>
            <div className="flex flex-col gap-3 sm:items-end">
              <div role="group" aria-label="Choose route" className="flex gap-2">
                {([["core", "Core loop (5 stops)"], ["extended", "Extended North Kolkata (add nearby stops)"]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setRouteMode(k)} aria-pressed={routeMode === k}
                    className={`spring rounded-full border-[3px] border-ink px-4 py-1.5 text-sm font-bold shadow-pop-sm ${routeMode === k ? "bg-ink text-paper" : "bg-card"}`}>{l}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <div role="group" aria-label="Filter pandals" className="flex gap-2">
                  {([["all", "All"], ["todo", "To visit"], ["done", "Visited"]] as const).map(([k, l]) => (
                    <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k}
                      className={`spring rounded-full border-[3px] border-ink px-4 py-1.5 text-sm font-bold shadow-pop-sm ${filter === k ? "bg-ink text-paper" : "bg-card"}`}>{l}</button>
                  ))}
                </div>
                <label className="sr-only" htmlFor="pandal-search">Search by pandal name or area</label>
                <input id="pandal-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or area…"
                  className="w-full rounded-full border-[3px] border-ink bg-card px-4 py-1.5 text-sm font-bold shadow-pop-sm placeholder:text-muted-foreground sm:w-48" />
              </div>
            </div>
          </div>

          <h3 className="reveal mt-10 font-display text-3xl md:text-4xl">Main walking circuit <span className="text-cobalt">(5 stops)</span></h3>
          <p className="reveal mt-2 inline-block rounded-md border-2 border-ink bg-gold px-3 py-1 text-sm font-bold">Suggested walking order — crowd dependent, not a guaranteed shortest route.</p>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
            {shown.filter((p) => p.category === "core").length === 0 && <li className="col-span-full rounded-xl border-[3px] border-dashed border-ink p-8 text-center font-bold">No core stops match your search or filter.</li>}
            {shown.filter((p) => p.category === "core").map((p, i) => card(p, i, CORE.indexOf(p) + 1, spans[CORE.indexOf(p)]!))}
          </ul>

          {routeMode === "extended" && (
            <>
              <h3 className="reveal mt-16 font-display text-3xl md:text-4xl">Extend your night <span className="text-pink">(3 optional add-ons)</span></h3>
              <p className="reveal mt-2 inline-block rounded-md border-2 border-ink bg-gold px-3 py-1 text-sm font-bold">Nearby extensions — may need an auto, toto or cab depending on crowds.</p>
              <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
                {shown.filter((p) => p.category === "extension").length === 0 && <li className="col-span-full rounded-xl border-[3px] border-dashed border-ink p-8 text-center font-bold">No add-on stops match your search or filter.</li>}
                {shown.filter((p) => p.category === "extension").map((p, i) => card(p, i, EXTENSIONS.indexOf(p) + 6, spans[EXTENSIONS.indexOf(p)]!))}
              </ul>
            </>
          )}
        </section>

        {/* TIPS */}
        <section className="relative border-y-4 border-ink bg-cobalt py-16 text-secondary-foreground">
          <Alpona className="pointer-events-none absolute -left-16 bottom-0 size-64 text-marigold opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5">
            <h2 className="reveal font-display text-5xl md:text-7xl">Field <span className="text-gold">Notes</span></h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TIPS.map((t, i) => (
                <li key={t} className={`reveal spring relative rounded-2xl border-4 border-ink bg-paper p-5 text-ink shadow-pop ${i === 1 ? "md:translate-y-8" : ""}`}>
                  <span className="absolute -top-5 left-4 grid size-12 place-items-center rounded-full border-4 border-ink bg-vermilion font-display text-2xl text-primary-foreground">{i + 1}</span>
                  <p className="mt-4 font-bold">{t}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CHECKLIST */}
        <section id="checklist" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
            <div className="reveal">
              <h2 className="font-display text-5xl leading-none md:text-7xl">Master <span className="text-pink">Checklist</span></h2>
              <p className="mt-4 text-lg">Pack it, tick it, hop it. Everything saves on this device.</p>
              <p className="mt-2 font-bold">{PACK.filter((x) => packed[x.id]).length}/{PACK.length} ready</p>
              <Lotus className="mt-6 w-32 animate-floaty" />
              <div className="mt-6">
                {!confirmReset ? (
                  <button onClick={() => setConfirmReset(true)} className="spring rounded-lg border-[3px] border-ink bg-card px-4 py-2 font-bold shadow-pop-sm">Reset checklist</button>
                ) : (
                  <div role="alertdialog" aria-label="Confirm reset" className="rounded-xl border-[3px] border-ink bg-gold p-4 shadow-pop-sm">
                    <p className="font-bold">Clear all visited pandals and checklist ticks?</p>
                    <div className="mt-3 flex gap-2">
                      <button autoFocus onClick={() => { setVisited({}); setPacked({}); setConfirmReset(false); setToast("Checklist reset"); }} className="rounded-lg border-[3px] border-ink bg-destructive px-4 py-2 font-bold text-destructive-foreground">Yes, reset</button>
                      <button onClick={() => setConfirmReset(false)} className="rounded-lg border-[3px] border-ink bg-card px-4 py-2 font-bold">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PACK.map((x, i) => { const on = !!packed[x.id]; return (
                <li key={x.id} className="reveal" style={{ animationDelay: `${i * 50}ms` }}>
                  <button onClick={() => setPacked((v) => ({ ...v, [x.id]: !v[x.id] }))} aria-pressed={on}
                    className={`spring flex w-full items-center gap-3 rounded-xl border-[3px] border-ink p-4 text-left font-bold shadow-pop-sm ${on ? "bg-emerald/20" : "bg-card"} ${i % 3 === 1 ? "sm:rotate-1" : ""}`}>
                    <Check on={on} /><span className={on ? "line-through decoration-2" : ""}>{x.label}</span>
                  </button>
                </li>); })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-ink bg-ink text-paper">
        <div className="h-3 alpona-border" />
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="font-display text-4xl text-gold">Dum Dum Pandal Trail 2026</p>
          <p className="mt-3 max-w-2xl text-sm opacity-90">An independent visitor guide — not affiliated with any puja committee. Addresses and entrances are based on map searches; event-day police barricades, one-way routes and festival traffic may change access. This site does not track your location.</p>
          <p className="mt-4 text-sm opacity-70">Shubho Sharodiya ✦ Dum Dum Park, North Kolkata</p>
        </div>
      </footer>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        {toast && <p className="animate-pop rounded-full border-[3px] border-ink bg-gold px-5 py-2 font-bold text-ink shadow-pop-sm">{toast}</p>}
      </div>
    </div>
  );
}

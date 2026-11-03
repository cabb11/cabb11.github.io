"use client";

import { useState } from "react";
import { profile } from "@/app/data";

const links = [
  { href: "#services", label: "services" },
  { href: "#work", label: "work" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-mono text-sm tracking-tight">
          <span className="text-blood">~/</span>
          {profile.name.split(" ")[0].toLowerCase()}
        </a>

        <ul className="hidden gap-8 font-mono text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-bone">
                <span className="text-blood">./</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="hidden rounded border border-blood/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-bone transition hover:bg-blood md:inline-block"
        >
          Hire me
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="font-mono text-sm text-muted md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "[close]" : "[menu]"}
        </button>
      </nav>

      {open && (
        <ul className="border-t border-line bg-ink px-4 py-4 font-mono text-sm md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-muted hover:text-bone">
                <span className="text-blood">./</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

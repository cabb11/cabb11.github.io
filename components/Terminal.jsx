"use client";

import { useEffect, useState } from "react";

const lines = [
  { prompt: true, text: "whoami" },
  { text: "adrian_bagasbas // web developer + ui/ux designer" },
  { prompt: true, text: "cat stack.txt" },
  { text: "react  next.js  tailwind  ui/ux" },
  { prompt: true, text: "status --availability" },
  { text: "● open for freelance projects", accent: true },
];

export default function Terminal() {
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.length);
      return;
    }
    if (shown >= lines.length) return;
    const line = lines[shown];
    if (!line.prompt) {
      const t = setTimeout(() => setShown((s) => s + 1), 250);
      return () => clearTimeout(t);
    }
    if (typed.length < line.text.length) {
      const t = setTimeout(() => setTyped(line.text.slice(0, typed.length + 1)), 55);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setShown((s) => s + 1);
      setTyped("");
    }, 300);
    return () => clearTimeout(t);
  }, [shown, typed]);

  return (
    <div className="scanlines relative overflow-hidden rounded-lg border border-line bg-panel shadow-[0_0_60px_-15px_rgb(225_29_46/0.35)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-blood" />
        <span className="h-3 w-3 rounded-full bg-maroon" />
        <span className="h-3 w-3 rounded-full bg-wine" />
        <span className="ml-3 font-mono text-xs text-muted">adrian@portfolio: ~</span>
      </div>
      <div className="min-h-[220px] space-y-2 p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {lines.slice(0, shown).map((l, i) => (
          <Line key={i} {...l} />
        ))}
        {shown < lines.length && lines[shown].prompt && (
          <p>
            <span className="text-blood">$</span> {typed}
            <span className="caret" />
          </p>
        )}
        {shown >= lines.length && (
          <p>
            <span className="text-blood">$</span> <span className="caret" />
          </p>
        )}
      </div>
    </div>
  );
}

function Line({ prompt, text, accent }) {
  if (prompt) {
    return (
      <p>
        <span className="text-blood">$</span> {text}
      </p>
    );
  }
  return <p className={accent ? "text-blood" : "text-muted"}>{text}</p>;
}

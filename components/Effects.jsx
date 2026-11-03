"use client";

import { useEffect, useRef } from "react";

const finePointer = () => window.matchMedia("(pointer: fine)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fades/slides children in when they enter the viewport.
// variant: "up" (rise + unblur) or "mask" (wipe up from below, for headings)
export function Reveal({ children, as: Tag = "div", variant = "up", delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (reducedMotion()) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal reveal-${variant} ${className}`} style={{ "--delay": `${delay}ms` }}>
      {/* the mask clips an inner span so the observed element itself stays fully visible */}
      {variant === "mask" ? <span className="mask-inner block">{children}</span> : children}
    </Tag>
  );
}

// 3D tilt toward the cursor with a red glare that follows it.
export function Tilt({ children, className = "", max = 6 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!finePointer() || reducedMotion()) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
    }
    function onLeave() {
      el.style.transform = "";
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

// Pulls a button slightly toward the cursor while hovering.
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!finePointer() || reducedMotion()) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }
    function onLeave() {
      el.style.transform = "";
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="magnetic inline-block">
      {children}
    </span>
  );
}

// Soft red light that follows the cursor across the whole page.
export function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const el = ref.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let cx = x;
    let cy = y;
    let raf = 0;

    function onMove(e) {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
    }
    function loop() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      el.style.background = `radial-gradient(600px circle at ${cx}px ${cy}px, rgb(239 43 60 / 0.14), transparent 60%)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-700" />;
}

// Hero content drifts up, shrinks and fades as you scroll past, like a camera pulling away.
export function HeroScroll({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current;
    let raf = 0;

    function update() {
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      el.style.transform = `translateY(${p * 120}px) scale(${1 - p * 0.08})`;
      el.style.opacity = `${1 - p * 1.1}`;
      el.style.filter = `blur(${p * 6}px)`;
      raf = 0;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

// Thin red bar at the top that fills as you scroll the page.
export function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-blood shadow-[0_0_12px_rgb(225_29_46)]"
    />
  );
}

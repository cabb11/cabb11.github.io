"use client";

import { useEffect, useRef } from "react";

// Drifting red particles that link up when close and scatter away from the cursor,
// with the occasional light streak cutting across the frame.
export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let particles = [];
    let streaks = [];
    let raf = 0;
    let visible = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4,
      }));
    }

    function spawnStreak() {
      streaks.push({ x: Math.random() * w * 0.6 - w * 0.2, y: -40, len: 140 + Math.random() * 160, speed: 6 + Math.random() * 5 });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.vx += (dx / dist) * force * 0.6;
          p.vy += (dy / dist) * force * 0.6;
        }
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(239, 43, 60, ${(1 - d / 120) * 0.4})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < 180;
        ctx.fillStyle = near ? "rgba(255, 120, 130, 1)" : "rgba(239, 43, 60, 0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < 0.006) spawnStreak();
      streaks = streaks.filter((s) => s.y < h + s.len);
      for (const s of streaks) {
        s.x += s.speed * 0.6;
        s.y += s.speed;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len * 0.6, s.y - s.len);
        grad.addColorStop(0, "rgba(255, 120, 130, 0.8)");
        grad.addColorStop(1, "rgba(225, 29, 46, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 0.6, s.y - s.len);
        ctx.stroke();
      }
    }

    function loop() {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    if (reduced) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

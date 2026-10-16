import { useEffect, useRef } from "react";

// ---- colors ----
const GOLD = [255, 200, 87];
const SILVER = [214, 222, 235];
const METAL_RATIO = 0.3; // 30% of grains are gold/silver, the rest are white

// ---- feel ----
const SPRING = 0.006; // how strongly grains return home (higher = faster return)
const FRICTION = 0.9; // lower = more damping

export default function GrainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, radius: 170 };
    const parallax = { x: 0, y: 0 };
    let grains = [];
    let scrollImpulse = 0;
    let lastScroll = window.scrollY;
    let w = 0;
    let h = 0;
    let t = 0;
    let raf;

    const init = () => {
      const count = Math.min(1100, Math.floor((w * h) / 2200));
      grains = Array.from({ length: count }, () => {
        const z = Math.pow(Math.random(), 1.6) * 0.9 + 0.1;
        const metal = Math.random() < METAL_RATIO;
        const hx = Math.random() * w;
        const hy = Math.random() * h;
        return {
          x: hx,
          y: hy,
          hx, // home position
          hy,
          vx: 0,
          vy: 0,
          z,
          metal,
          size: 0.5 + z * 1.6 + (metal ? 0.3 : 0),
          alpha: Math.min(1, 0.15 + z * 0.65 + (metal ? 0.15 : 0)),
          phase: Math.random() * Math.PI * 2,
          twinkle: Math.random() * 0.03 + 0.01,
          // ambient floating around home
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: Math.random() * 0.004 + 0.001,
          driftAmp: 8 + z * 22,
          colorPhase: Math.random() * Math.PI * 2,
          colorSpeed: Math.random() * 0.02 + 0.006,
          heat: 0,
        };
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const animate = () => {
      t += 1;

      // fade previous frame for soft trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = reduceMotion ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.32)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // mouse velocity and parallax target
      if (mouse.x > -9000) {
        mouse.vx += (mouse.x - mouse.px - mouse.vx) * 0.3;
        mouse.vy += (mouse.y - mouse.py - mouse.vy) * 0.3;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        parallax.x += ((mouse.x - w / 2) * 0.03 - parallax.x) * 0.05;
        parallax.y += ((mouse.y - h / 2) * 0.03 - parallax.y) * 0.05;
      } else {
        mouse.vx *= 0.9;
        mouse.vy *= 0.9;
        parallax.x *= 0.97;
        parallax.y *= 0.97;
      }

      scrollImpulse *= 0.9;

      for (const g of grains) {
        // ambient target: a slow orbit around the home position
        const drift = reduceMotion ? 0 : 1;
        const tx =
          g.hx + Math.cos(t * g.driftSpeed + g.driftPhase) * g.driftAmp * drift;
        const ty =
          g.hy + Math.sin(t * g.driftSpeed * 1.3 + g.driftPhase) * g.driftAmp * drift;

        // spring back toward target
        g.vx += (tx - g.x) * SPRING;
        g.vy += (ty - g.y) * SPRING;

        // cursor: repel + swirl + wind drag
        const mx = g.x - mouse.x;
        const my = g.y - mouse.y;
        const dist = Math.hypot(mx, my) || 1;
        if (dist < mouse.radius) {
          const f = Math.pow(1 - dist / mouse.radius, 2);
          g.vx += (mx / dist) * f * 1.8 + (-my / dist) * f * 0.9 + mouse.vx * f * 0.06;
          g.vy += (my / dist) * f * 1.8 + (mx / dist) * f * 0.9 + mouse.vy * f * 0.06;
          g.heat = Math.max(g.heat, f);
        }

        // scroll streaks
        g.vy -= scrollImpulse * 0.02 * g.z;

        // integrate
        g.x += g.vx;
        g.y += g.vy;
        g.vx *= FRICTION;
        g.vy *= FRICTION;
        g.heat *= 0.95;

        // draw
        const tw = 0.65 + 0.35 * Math.sin(t * g.twinkle + g.phase);
        const a = Math.min(1, g.alpha * tw + g.heat * 0.8);
        const s = g.size + g.heat * 1.6;
        const px = g.x + parallax.x * g.z;
        const py = g.y + parallax.y * g.z;

        let r = 255,
          gr = 255,
          b = 255;
        if (g.metal) {
          const mix = 0.5 + 0.5 * Math.sin(t * g.colorSpeed + g.colorPhase);
          r = SILVER[0] + (GOLD[0] - SILVER[0]) * mix;
          gr = SILVER[1] + (GOLD[1] - SILVER[1]) * mix;
          b = SILVER[2] + (GOLD[2] - SILVER[2]) * mix;
        }

        ctx.fillStyle = `rgba(${r | 0},${gr | 0},${b | 0},${a})`;
        ctx.fillRect(px, py, s, s);
      }

      raf = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      if (mouse.x < -9000) {
        mouse.px = e.clientX;
        mouse.py = e.clientY;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onTouch = (e) => {
      onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    };
    const onScroll = () => {
      const d = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollImpulse = Math.max(-60, Math.min(60, scrollImpulse + d));
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <canvas
  ref={canvasRef}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 0,          // was: -1
    pointerEvents: "none",
  }}
/>
  );
}
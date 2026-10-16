import { useEffect, useRef } from "react";

const SPEED = 0.25;

// Settings are calculated from the size of the box, so small screens stay sparse
const getConfig = (w, h) => {
  const area = w * h;
  const small = w < 700;
  const count = Math.round(Math.min(38, Math.max(10, area / 20000)));
  const spacing = Math.sqrt(area / count);        // average gap between nodes

  return {
    count,
    linkDist: Math.min(190, spacing * 1.2),       // about 4 to 5 links per node
    fillAlpha: small ? 0.025 : 0.045,
    lineAlpha: small ? 0.22 : 0.35,
    bigDotRatio: small ? 0.12 : 0.25,
    maxTriangles: small ? 12 : 60,
  };
};

export default function PolyParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0;
    let visible = true;
    let nodes = [];
    let cfg = getConfig(1, 1);

    const init = () => {
      if (!w || !h) return;
      cfg = getConfig(w, h);
      nodes = Array.from({ length: cfg.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        r: Math.random() < cfg.bigDotRatio ? 3 : 1.5,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const animate = () => {
      if (!visible) { raf = 0; return; }
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      const triDist = cfg.linkDist * 0.8;
      let tris = 0;

      // soft triangles (capped so they never pile up)
      outer: for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) > triDist) continue;
          for (let k = j + 1; k < nodes.length; k++) {
            if (Math.hypot(nodes[i].x - nodes[k].x, nodes[i].y - nodes[k].y) > triDist) continue;
            if (Math.hypot(nodes[j].x - nodes[k].x, nodes[j].y - nodes[k].y) > triDist) continue;
            if (tris++ >= cfg.maxTriangles) break outer;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.lineTo(nodes[k].x, nodes[k].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(255,255,255,${cfg.fillAlpha})`;
            ctx.fill();
          }
        }
      }

      // lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < cfg.linkDist) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / cfg.linkDist) * cfg.lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = n.r > 2 ? 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(animate);
    };

    // resize with the container (fires again when the image finishes loading)
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // pause when the hero is off-screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(animate);
    });
    io.observe(parent);

    resize();
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="poly-canvas" />;
}
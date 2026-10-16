import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.opacity = 1;
      ring.style.opacity = 1;
    };

    const onLeave = () => {
      dot.style.opacity = 0;
      ring.style.opacity = 0;
    };

    const onOver = (e) => {
      const interactive = e.target.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor='hover']"
      );
      targetScale = interactive ? 1.5 : 1;
    };

    const onDown = () => (targetScale = 0.85);
    const onUp = () => (targetScale = 1);

    const animate = () => {
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;

      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      scale += (targetScale - scale) * 0.15;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`;

      raf = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const base = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 0.2s",
    willChange: "transform",
  };

  return (
    <>
      <div
        ref={ringRef}
        style={{
          ...base,
          zIndex: 9999,
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      />
      <div
        ref={dotRef}
        style={{
          ...base,
          zIndex: 10000,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    </>
  );
}
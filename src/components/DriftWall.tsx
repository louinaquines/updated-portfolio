"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import "./DriftWall.css";

export type DriftWallItem = {
  image?: string;
  title?: string;
  href?: string;
};

type DriftWallProps = {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
};

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = true,
  overlayColor = "#060010",
  className = "",
  style,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(prefersReducedMotion);

  const safeColumns = Math.max(1, Math.floor(columns));
  const columnItems = useMemo(() => {
    const cols = Array.from({ length: safeColumns }, () => [] as DriftWallItem[]);
    items.forEach((item, index) => cols[index % safeColumns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, safeColumns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((column) => {
      const copyHeight = Math.max(unit, column.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  const baseVelocities = useMemo(() => {
    const directionSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, index) => speed * columnFactor(index, variance) * directionSign * (index % 2 === 0 ? 1 : -1));
  }, [columnItems, speed, direction, variance]);

  const applyPlaneTransform = useCallback((px: number, py: number) => {
    if (!planeRef.current) return;
    planeRef.current.style.transform =
      `translate(-50%, -50%) scale(1.18) rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
  }, [tilt, turn, roll, depth]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => setContainerHeight(entry.contentRect.height || 600));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, index) => meta.copyHeight * ((index * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (lastTsRef.current === null) lastTsRef.current = timestamp;
      const dt = Math.min(0.05, Math.max(0, timestamp - lastTsRef.current) / 1000);
      lastTsRef.current = timestamp;

      const maxTilt = parallax * 8;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (pointerRef.current.x * maxTilt - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (-pointerRef.current.y * maxTilt - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      columnMeta.forEach((meta, index) => {
        const track = trackRefs.current[index];
        if (!track) return;
        const paused = wallHoveredRef.current && pauseOnHover;
        const target = baseVelocities[index] * (paused || hoveredColRef.current === index || reduced ? 0 : 1);
        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[index] += (target - velocitiesRef.current[index]) * ease;
        const next = ((offsetsRef.current[index] + velocitiesRef.current[index] * dt) % meta.copyHeight + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[index] = next;
        track.style.transform = `translate3d(0, ${-next}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [applyPlaneTransform, baseVelocities, columnMeta, pauseOnHover, parallax, reduced]);

  const activate = (id: string, column: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = column;
    setActiveId(id);
  };

  const release = () => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (parallax > 0 && !reduced) {
      pointerRef.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
    }
    const tile = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-tile-id]");
    if (!tile || tile.dataset.tileId === activeIdRef.current) return;
    activate(tile.dataset.tileId || "", Number(tile.dataset.col));
  };

  const cssVars = {
    "--dw-tile-w": `${tileWidth}px`,
    "--dw-tile-h": `${tileHeight}px`,
    "--dw-gap": `${gap}px`,
    "--dw-radius": `${radius}px`,
    "--dw-perspective": `${perspective}px`,
    "--dw-lift": `${lift}px`,
    "--dw-dim": dim,
    "--dw-gray": grayscale ? 1 : 0,
    "--dw-overlay": overlayColor,
    "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
    ...style,
  } as CSSProperties;

  const renderTile = (item: DriftWallItem, id: string, column: number) => {
    const content = (
      <span className="drift-wall__inner">
        {item.image ? <Image src={item.image} alt={item.title || ""} fill sizes="(max-width: 640px) 104px, (max-width: 1023px) 132px, 200px" quality={100} draggable={false} /> : <span className="drift-wall__placeholder">Coming soon</span>}
        <span className="drift-wall__overlay" aria-hidden="true" />
        <span className="drift-wall__label">{item.title}</span>
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? " is-active" : ""}`,
      "data-tile-id": id,
      "data-col": column,
      onFocus: () => activate(id, column),
      onBlur: release,
    };

    return item.href ? (
      <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>{content}</a>
    ) : (
      <div key={id} tabIndex={0} role="button" aria-label={item.title || "Project coming soon"} {...commonProps}>{content}</div>
    );
  };

  return (
    <div ref={containerRef} className={`drift-wall ${className}`} style={cssVars} onPointerMove={handlePointerMove} onPointerEnter={() => { wallHoveredRef.current = true; }} onPointerLeave={() => { wallHoveredRef.current = false; pointerRef.current = { x: 0, y: 0 }; release(); }} role="group" aria-label="Projects gallery">
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((column, columnIndex) => {
          const meta = columnMeta[columnIndex];
          return (
            <div className="drift-wall__col" key={`column-${columnIndex}`}>
              <div className="drift-wall__track" ref={(element) => { trackRefs.current[columnIndex] = element; }}>
                {Array.from({ length: meta.copies }).flatMap((_, copyIndex) => column.map((item, itemIndex) => renderTile(item, `${columnIndex}-${copyIndex}-${itemIndex}`, columnIndex)))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

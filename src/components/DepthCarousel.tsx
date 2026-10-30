"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { DriftWallItem } from "@/components/DriftWall";
import "./DepthCarousel.css";

type Props = { items: DriftWallItem[]; onSelect: (item: DriftWallItem) => void };

export default function DepthCarousel({ items, onSelect }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef<number | null>(null);
  const go = (step: number) => setActive((index) => (index + step + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % items.length), 6500);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;

  return (
    <div className="depth-carousel" onPointerDown={(event: PointerEvent<HTMLDivElement>) => { dragX.current = event.clientX; }} onPointerUp={(event) => {
      if (dragX.current !== null && Math.abs(event.clientX - dragX.current) > 48) go(event.clientX < dragX.current ? 1 : -1);
      dragX.current = null;
    }}>
      <div className="depth-carousel__stage" aria-label="Project gallery">
        {items.map((item, index) => {
          const rawOffset = index - active;
          const offset = rawOffset > items.length / 2 ? rawOffset - items.length : rawOffset < -items.length / 2 ? rawOffset + items.length : rawOffset;
          return (
            <div key={`${item.title}-${index}`} className="depth-carousel__slide" data-active={offset === 0} aria-hidden={offset !== 0} style={{ transform: `translate(calc(-50% + ${offset * 94}%), -50%) scale(${offset === 0 ? 1 : 0.82})`, opacity: Math.abs(offset) > 1 ? 0 : 1, zIndex: 10 - Math.abs(offset) }}>
              <button type="button" className="depth-carousel__screen" tabIndex={offset === 0 ? 0 : -1} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onClick={() => offset === 0 ? onSelect(item) : setActive(index)} aria-label={`Preview ${item.title}`}>
                {item.image && <Image src={item.image} alt="" fill sizes="(max-width: 640px) 90vw, (max-width: 1023px) 78vw, 900px" quality={100} draggable={false} />}
                {offset === 0 && <span className="depth-carousel__preview">Open preview ↗</span>}
              </button>
              {offset === 0 && <div className="depth-carousel__stand" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      <div className="depth-carousel__details">
        <div className="depth-carousel__heading"><h3>{items[active].title}</h3><p>Featured project · {String(active + 1).padStart(2, "0")}</p></div>
        <span className="depth-carousel__count">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <div className="depth-carousel__controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14.5 4.5-7.5 7.5 7.5 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <button type="button" onClick={() => go(1)} aria-label="Next project"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9.5 4.5 7.5 7.5-7.5 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        </div>
      </div>
    </div>
  );
}

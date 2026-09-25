"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import "./DepthCarousel.css";

export type DepthCarouselItem = {
  image?: string;
  alt?: string;
  title?: string;
  href?: string;
};

type DepthCarouselProps = {
  items: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  depth?: number;
  spread?: number;
  tilt?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
};

const mod = (value: number, length: number) => ((value % length) + length) % length;

export default function DepthCarousel({
  items,
  cardWidth = 280,
  cardHeight = 380,
  depth = 190,
  spread = 74,
  tilt = 18,
  visibleCards = 4,
  falloff = 0.2,
  blur = 4,
  autoplay = false,
  autoplayDelay = 3000,
  loop = true,
  showControls = true,
  showIndicators = true,
}: DepthCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeRef = useRef(0);
  const dragStart = useRef<{ x: number; index: number } | null>(null);
  const [active, setActive] = useState(0);

  const total = items.length;
  const setActiveIndex = useCallback((index: number) => {
    if (!total) return;
    const next = loop ? mod(index, total) : Math.max(0, Math.min(index, total - 1));
    activeRef.current = next;
    setActive(next);
  }, [loop, total]);

  const go = useCallback((direction: number) => {
    setActiveIndex(activeRef.current + direction);
  }, [setActiveIndex]);

  useEffect(() => {
    if (!total) return;
    const root = rootRef.current;
    if (!root) return;

    const layout = () => {
      const rect = root.getBoundingClientRect();
      const scale = Math.min(1, Math.max(0.58, (rect.width - 28) / (cardWidth + depth * 0.72)));

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - activeRef.current;
        if (loop) {
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
        }

        const visible = Math.abs(offset) <= visibleCards;
        const distance = Math.abs(offset);
        const x = offset * spread * scale;
        const z = offset === 0 ? depth : -distance * depth * 0.72;
        const rotation = offset * -tilt;
        const opacity = visible ? Math.max(0, 1 - distance * falloff) : 0;
        const blurAmount = Math.min(blur * distance, 12);

        gsap.to(card, {
          x,
          z,
          rotateY: rotation,
          scale: scale * (offset === 0 ? 1 : Math.max(0.72, 1 - distance * 0.08)),
          opacity,
          filter: `blur(${blurAmount}px)`,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
        card.style.pointerEvents = visible ? "auto" : "none";
        card.style.zIndex = String(100 - distance);
      });
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(root);
    return () => observer.disconnect();
  }, [active, blur, cardHeight, cardWidth, depth, falloff, loop, spread, tilt, total, visibleCards]);

  useEffect(() => {
    if (!autoplay || total < 2) return;
    const timer = window.setInterval(() => go(1), autoplayDelay);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, go, total]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, index: activeRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) > 42) setActiveIndex(start.index + (distance < 0 ? 1 : -1));
  };

  if (!total) return null;

  return (
    <div
      ref={rootRef}
      className="depth-carousel"
      style={{ "--dc-card-width": `${cardWidth}px`, "--dc-card-height": `${cardHeight}px` } as CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragStart.current = null; }}
    >
      <div className="depth-carousel__stage" aria-live="polite">
        {items.map((item, index) => (
          <div
            key={`${item.title ?? "project"}-${index}`}
            ref={(node) => { cardRefs.current[index] = node; }}
            className={`depth-carousel__card${index === active ? " is-active" : ""}`}
            role="button"
            tabIndex={index === active ? 0 : -1}
            aria-label={item.title ? `Show ${item.title}` : `Show project ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setActiveIndex(index);
            }}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.alt ?? item.title ?? "Project preview"}
                fill
                sizes="(max-width: 640px) calc(100vw - 58px), (max-width: 1023px) 560px, 700px"
                quality={100}
                priority={index === active}
                draggable={false}
              />
            ) : (
              <span className="depth-carousel__placeholder">Coming soon</span>
            )}
            <div className="depth-carousel__shade" />
            {index === active && item.title ? <span className="depth-carousel__title">{item.title}</span> : null}
            {index === active && item.href ? (
              <a className="depth-carousel__link" href={item.href} target="_blank" rel="noreferrer">
                Open project <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        ))}
      </div>

      {showControls ? (
        <div className="depth-carousel__controls" aria-label="Project carousel controls" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" className="depth-carousel__arrow" onClick={() => go(-1)} aria-label="Previous project">←</button>
          <button type="button" className="depth-carousel__arrow" onClick={() => go(1)} aria-label="Next project">→</button>
        </div>
      ) : null}

      {showIndicators ? (
        <div className="depth-carousel__indicators" aria-label="Choose a project">
          {items.map((item, index) => (
            <button
              key={`indicator-${index}`}
              type="button"
              className={`depth-carousel__indicator${index === active ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.title ?? `project ${index + 1}`}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import "./AccordionGallery.css";

export type AccordionGalleryItem = {
  image?: string;
  label: string;
  description?: string;
  link?: string;
  alt?: string;
};

type AccordionGalleryProps = {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  duration?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
};

export default function AccordionGallery({
  items,
  defaultIndex = 2,
  accentColor = "#d6c3a5",
  overlayColor = "#0b0b0b",
  textColor = "#f4f1eb",
  height = 460,
  gap = 10,
  radius = 0,
  expandRatio = 0.52,
  duration = 0.75,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef<number>(Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0)));
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0)));
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  const runLayout = (nextActive: number, animate: boolean) => {
    if (!items.length) return;

    // Kill all running tweens immediately for clean mid-flight switching
    tweensRef.current.forEach(t => t.kill());
    tweensRef.current = [];

    const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = items.length > 1 ? (ratio * (items.length - 1)) / (1 - ratio) : 1;
    const dur = animate ? duration : 0;
    const ease = "expo.out";

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const isActive = index === nextActive;
      const media = mediaRefs.current[index];

      const t1 = gsap.to(panel, {
        flexGrow: isActive ? grow : 1,
        duration: dur,
        ease,
        overwrite: true,
      });
      tweensRef.current.push(t1);

      if (media) {
        const t2 = gsap.to(media, {
          scale: isActive ? 1 : 1.06,
          filter: grayscale && !isActive ? "grayscale(1) brightness(0.7)" : "grayscale(0) brightness(1)",
          opacity: isActive ? 1 : 0.55,
          duration: dur,
          ease,
          overwrite: true,
        });
        tweensRef.current.push(t2);
      }
    });
  };

  // Set initial layout without animation on mount
  useEffect(() => {
    runLayout(activeRef.current, false);

    const resizeObserver = new ResizeObserver(() => runLayout(activeRef.current, false));
    if (rootRef.current) resizeObserver.observe(rootRef.current);

    return () => {
      resizeObserver.disconnect();
      tweensRef.current.forEach(t => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPanel = (index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index); // for className/CSS update only
    runLayout(index, true);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectPanel((index + 1) % items.length);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectPanel((index - 1 + items.length) % items.length);
    }
  };

  const style = {
    "--ag-accent": accentColor,
    "--ag-overlay": overlayColor,
    "--ag-text": textColor,
    "--ag-gap": `${gap}px`,
    "--ag-radius": `${radius}px`,
    height: `${height}px`,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="accordion-gallery" style={style} role="list" aria-label="Projects gallery">
      {items.map((item, index) => {
        const isActive = active === index;
        const className = `ag-panel${isActive ? " ag-panel--active" : ""}`;
        const content = (
          <>
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(element) => { mediaRefs.current[index] = element; }}>
                {item.image && <Image src={item.image} alt={item.alt || item.label} fill sizes="(max-width: 640px) 100vw, 60vw" quality={100} draggable={false} />}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label">
                <span className="ag-panel__bar" />
                <span className="ag-panel__copy">
                  <span className="ag-panel__text">{item.label}</span>
                  {item.description && <span className="ag-panel__description">{item.description}</span>}
                </span>
              </span>
            )}
          </>
        );

        return item.link ? (
          <a
            key={item.label}
            href={item.link}
            className={className}
            ref={(element) => { panelRefs.current[index] = element; }}
            onMouseEnter={() => trigger === "hover" && selectPanel(index)}
            onFocus={() => selectPanel(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onClick={(event) => { if (!isActive) { event.preventDefault(); selectPanel(index); } }}
            role="listitem"
            aria-current={isActive ? "true" : undefined}
          >{content}</a>
        ) : (
          <button
            key={item.label}
            type="button"
            className={className}
            ref={(element) => { panelRefs.current[index] = element; }}
            onMouseEnter={() => trigger === "hover" && selectPanel(index)}
            onFocus={() => selectPanel(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onClick={() => selectPanel(index)}
            role="listitem"
            aria-current={isActive ? "true" : undefined}
          >{content}</button>
        );
      })}
    </div>
  );
}

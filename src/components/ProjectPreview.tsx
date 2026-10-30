"use client";

import { useEffect, useRef } from "react";
import type { DriftWallItem } from "@/components/DriftWall";
import "./ProjectPreview.css";

type Props = {
  project: DriftWallItem;
  onClose: () => void;
};

export default function ProjectPreview({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="project-preview" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="project-preview__window" role="dialog" aria-modal="true" aria-label={`${project.title} project preview`}>
        <header className="project-preview__header">
          <span className="project-preview__title">{project.title}</span>
          <div className="project-preview__actions">
            {project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">Live site ↗</a>}
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close project preview">Close ×</button>
          </div>
        </header>
        {project.href ? (
          <iframe key={project.href} className="project-preview__frame" src={project.href} title={`${project.title} website`} loading="eager" referrerPolicy="no-referrer" />
        ) : (
          <div className="project-preview__unavailable">Preview unavailable</div>
        )}
      </div>
    </div>
  );
}

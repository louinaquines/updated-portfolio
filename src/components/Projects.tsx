"use client";

import { useEffect, useRef } from "react";
import AccordionGallery, { type AccordionGalleryItem } from "@/components/AccordionGallery";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects: AccordionGalleryItem[] = [
  { label: "Project 01", description: "A focused digital experience shaped for clear, everyday workflows.", image: "/images/project1.png", alt: "Project 01" },
  { label: "Project 02", description: "A full-stack product connecting a polished interface with dependable services.", image: "/images/project2.png", alt: "Project 02" },
  { label: "Project 03", description: "A responsive experience designed to feel fast and useful on every screen.", image: "/images/project3.png", alt: "Project 03" },
  { label: "Project 04", description: "A reserved project space for the next case study.", alt: "Project 04" },
  { label: "Project 05", description: "A practical product brought from interface direction through delivery.", image: "/images/project5.png", alt: "Project 05" },
];

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
          },
        }
      );
    }
    if (galleryRef.current) {
      gsap.fromTo(
        galleryRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 88%",
          },
        }
      );
    }
  }, []);

  return (
    <section id="projects" className="bg-[#0b0b0b] px-5 pb-28 text-[#f4f1eb] sm:px-8 sm:pb-36 lg:px-16">
      <div className="mx-auto max-w-[1500px] border-t border-white/20 pt-8">
        <div ref={headerRef} className="mb-10 flex flex-wrap items-end justify-between gap-5" style={{ opacity: 0 }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">03 / Projects</p>
            <SplitText
              tag="h2"
              text="Selected work"
              className="mt-4 font-serif text-5xl tracking-[-0.05em] sm:text-7xl"
              textAlign="left"
            />
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/55">Five project spaces ready for the interfaces, images, and stories that will make your work visible.</p>
        </div>
        <div ref={galleryRef} style={{ opacity: 0 }}>
          <AccordionGallery items={projects} defaultIndex={0} trigger="hover" height={460} expandRatio={0.52} duration={0.75} gap={10} radius={14} />
        </div>
      </div>
    </section>
  );
}




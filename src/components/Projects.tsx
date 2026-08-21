"use client";

import { useEffect, useRef } from "react";
import AccordionGallery, { type AccordionGalleryItem } from "@/components/AccordionGallery";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects: AccordionGalleryItem[] = [
  { label: "Cany", description: "An offline-first mobile utility that scans shelf price tags, tracks running totals, and warns users before they exceed their grocery budget.", image: "/images/project1.png", link: "https://cany-web.vercel.app/", alt: "Project 01" },
  { label: "Pagkainang-Sambayanan", description: "A full-stack donation management platform that connects donors with local organizations using emergency prioritization logic to route surplus food to communities in need.", image: "/images/project2.png", link: "https://pagkainang-sambayanan.onrender.com/", alt: "Project 02" },
  { label: "Readerly", description: "An AI-powered literacy platform built on a decoupled Laravel and Livewire stack that tracks reading progress and generates custom stories for students.", image: "/images/project3.png", link: "https://readerly-app.onrender.com/", alt: "Project 03" },
  { label: "Cookies N' Dream", description: "A modern, visually engaging landing page designed to showcase artisanal desserts and drive customer orders for a boutique shop.", alt: "Project 04" },
  { label: "Ai-Resume Builder", description: "An interactive, single-page conversational assistant that guides users through quick questions to automatically generate polished resumes in seconds.", image: "/images/project5.png", link: "https://ai-resume-ph.vercel.app/", alt: "Project 05" },
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
              text="Featured Works"
              className="mt-4 font-serif text-5xl tracking-[-0.05em] sm:text-7xl"
              textAlign="left"
            />
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/55">A curated showcase of digital products, full-stack applications, and interactive platforms engineered to solve real-world problems.</p>
        </div>
        <div ref={galleryRef} style={{ opacity: 0 }}>
          <AccordionGallery items={projects} defaultIndex={0} trigger="hover" height={460} expandRatio={0.52} duration={0.75} gap={10} radius={14} />
        </div>
      </div>
    </section>
  );
}



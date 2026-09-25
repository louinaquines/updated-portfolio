"use client";

import { useEffect, useRef, useState } from "react";
import DriftWall, { type DriftWallItem } from "@/components/DriftWall";
import DepthCarousel from "@/components/DepthCarousel";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects: DriftWallItem[] = [
  { title: "Cany", image: "/images/project1.png", href: "https://cany-web.vercel.app/" },
  { title: "Pagkainang-Sambayanan", image: "/images/project2.png", href: "https://pagkainang-sambayanan.onrender.com/" },
  { title: "Readerly", image: "/images/project3.png", href: "https://readerly-app.onrender.com/" },
  { title: "Cookies N' Dream", image: "/images/project4.png", href: "https://cookiesndream.vercel.app/" },
  { title: "AI Resume Builder", image: "/images/project5.png", href: "https://ai-resume-ph.vercel.app/" },
  { title: "rally.", image: "/images/project6.png", href: "https://pickleballrent.vercel.app/" },
  { title: "Shanel Crafts", image: "/images/project7.png", href: "https://shanelcrafts.vercel.app/" },
  { title: "Amadah Pastries", image: "/images/project8.png", href: "https://amadahpastries.vercel.app/" },
  { title: "Nihongojin", image: "/images/project9.png", href: "https://nihongojin.vercel.app/" },
  { title: "Orchard", image: "/images/project10.png", href: "https://orchardweb.vercel.app/" },
];

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"wall" | "carousel">("wall");

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
          <p className="max-w-sm text-sm leading-6 text-white/55">A curated showcase of digital products, full-stack applications, and interactive platforms.</p>
        </div>
        <div ref={galleryRef} style={{ opacity: 0 }}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Explore projects</p>
            <div className="flex items-center gap-1 rounded-full border border-white/20 p-1" role="group" aria-label="Project view options">
              <button type="button" className={`rounded-full px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors ${viewMode === "wall" ? "bg-white text-black" : "text-white/60 hover:text-white"}`} onClick={() => setViewMode("wall")} aria-pressed={viewMode === "wall"}>Wall</button>
              <button type="button" className={`rounded-full px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors ${viewMode === "carousel" ? "bg-white text-black" : "text-white/60 hover:text-white"}`} onClick={() => setViewMode("carousel")} aria-pressed={viewMode === "carousel"}>Carousel</button>
            </div>
          </div>
          <div className="h-[560px] sm:h-[620px] lg:h-[680px]">
            {viewMode === "wall" ? (
              <DriftWall items={projects} columns={5} tileWidth={200} tileHeight={132} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={34} direction="up" variance={0.45} parallax={0.6} lift={64} fade={0.6} dim={0.55} grayscale overlayColor="#060010" />
            ) : (
              <DepthCarousel items={projects} cardWidth={620} cardHeight={410} depth={190} spread={128} tilt={18} visibleCards={4} falloff={0.2} blur={0} showControls showIndicators />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import DriftWall, { type DriftWallItem } from "@/components/DriftWall";
import DepthCarousel from "@/components/DepthCarousel";
import ProjectPreview from "@/components/ProjectPreview";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects: DriftWallItem[] = [
  { title: "Cany", image: "/images/project1.png", href: "https://cany-web.vercel.app/" },
  { title: "Sync — Work + Study Hub", image: "/images/sync-studyhub.png", href: "https://sync-studyhub.vercel.app/#hero" },
  { title: "Sole Archive", image: "/images/project5.png", href: "https://solearchive-web.vercel.app/" },
  { title: "Cookies N' Dream", image: "/images/project4.png", href: "https://cookiesndream.vercel.app/" },
  { title: "Pagkainang-Sambayanan", image: "/images/project2.png", href: "https://pagkainang-sambayanan.onrender.com/" },
  { title: "Readerly", image: "/images/project3.png", href: "https://readerly-app.onrender.com/" },
  { title: "rally.", image: "/images/project6.png", href: "https://pickleballrent.vercel.app/" },
  { title: "Shanel Crafts", image: "/images/project7.png", href: "https://shanelcrafts.vercel.app/" },
  { title: "Amadah Pastries", image: "/images/project8.png", href: "https://amadahpastries.vercel.app/" },
  { title: "Nihongojin", image: "/images/project9.png", href: "https://nihongojin.vercel.app/" },
  { title: "Orchard", image: "/images/project10.png", href: "https://orchardweb.vercel.app/" },
];

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"wall" | "horizontal">("wall");
  const [preview, setPreview] = useState<DriftWallItem | null>(null);

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
            <div className="flex border border-white/25" role="group" aria-label="Project view options">
              <button type="button" className={`px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors ${viewMode === "wall" ? "bg-white text-black" : "text-white/70 hover:text-white"}`} onClick={() => setViewMode("wall")} aria-pressed={viewMode === "wall"}>Drift</button>
              <button type="button" className={`border-l border-white/25 px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors ${viewMode === "horizontal" ? "bg-white text-black" : "text-white/70 hover:text-white"}`} onClick={() => setViewMode("horizontal")} aria-pressed={viewMode === "horizontal"}>Horizontal</button>
            </div>
          </div>
          <div className="h-[500px] sm:h-[600px] lg:h-[700px]">
            {viewMode === "wall" ? (
              <DriftWall items={projects} onSelect={setPreview} columns={5} tileWidth={240} tileHeight={156} gap={18} radius={2} tilt={12} turn={-10} perspective={1200} depth={100} speed={14} direction="up" variance={0.35} parallax={0.45} lift={48} fade={0.48} dim={0.96} grayscale overlayColor="#0b0b0b" />
            ) : (
              <DepthCarousel items={projects} onSelect={setPreview} />
            )}
          </div>
        </div>
      </div>
      {preview && <ProjectPreview project={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}

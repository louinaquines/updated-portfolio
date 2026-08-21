"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import StaggeredMenu from "@/components/StaggeredMenu";
import ShinyText from "@/components/ShinyText";
import { gsap } from "gsap";

export default function Hero() {
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const scrollToAbout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#about");
  };

  useEffect(() => {
    const ease = "expo.out";
    const fromY = 28;

    // Elements that fade up in sequence
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.1 }
    );

    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.35 }
    );

    // subtitleRef — line under Hello World
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.75 }
    );

    // Intro block (h2, paragraph, buttons)
    gsap.fromTo(
      introBlockRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.9 }
    );

    // Location / capabilities line
    gsap.fromTo(
      statsRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 1.05 }
    );

    // Portrait photo — fades up from slightly lower
    gsap.fromTo(
      photoRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease, delay: 0.5 }
    );

    // Social links
    gsap.fromTo(
      socialRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.9, ease, delay: 1.15 }
    );

    // Footer
    gsap.fromTo(
      footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease, delay: 1.3 }
    );
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f6f6f7] text-[#1a1a1a] flex flex-col justify-between selection:bg-black selection:text-white">
      <div className="h-[88px] lg:hidden">
        <StaggeredMenu
          logoUrl="/images/lj-logo-transparent.png"
          items={[
            { label: "About", ariaLabel: "Go to about section", link: "#about" },
            { label: "Projects", ariaLabel: "Go to projects section", link: "#projects" },
            { label: "Contact", ariaLabel: "Go to contact section", link: "#contact" },
            { label: "View Resume", ariaLabel: "Open resume", link: "/images/NAQUINES%2C%20LOUI%20-%20RESUME.pdf" },
          ]}
          socialItems={[
            { label: "Email", link: "mailto:louinaquines@gmail.com" },
            { label: "Facebook", link: "https://www.facebook.com/loui.naquines" },
            { label: "Instagram", link: "https://www.instagram.com/_whitechocolateee" },
          ]}
          displaySocials
          displayItemNumbering
        />
      </div>
      {/* Top Navbar */}
      <header ref={navRef} className="relative z-50 hidden w-full bg-[#f6f6f7]/90 py-7 backdrop-blur-md lg:sticky lg:top-0 lg:block" style={{ opacity: 0 }}>
        {/* The logo stays anchored to the viewport while links share the Hello content grid. */}
        <Link href="/" className="absolute left-8 top-[calc(50%+4px)] hidden -translate-y-1/2 items-center gap-2 group sm:left-16 sm:top-1/2 lg:flex">
          <ShinyText
            maskImage="/images/lj-logo-transparent.png"
            speed={2}
            delay={1}
            color="#111111"
            shineColor="#ffffff"
            spread={120}
            className="h-12 w-16 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <nav className="mx-auto hidden w-full max-w-7xl items-center justify-end gap-9 px-6 text-sm font-medium tracking-wide text-zinc-600 sm:px-12 lg:flex">
          <Link href="#about" onClick={scrollToAbout} className="hover:text-black transition-colors">
            About
          </Link>
          <Link href="#projects" className="hover:text-black transition-colors">
            Projects
          </Link>
          <Link href="#contact" className="hover:text-black transition-colors">
            Contact
          </Link>
          <Link
            href="/images/NAQUINES%2C%20LOUI%20-%20RESUME.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
          >
            View resume
          </Link>
        </nav>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Moving name layer keeps the editorial energy behind the portrait. */}
        <div className="pointer-events-none absolute inset-x-1/2 top-[72%] z-0 w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden select-none text-center text-[23vw] font-black uppercase leading-[0.78] tracking-[-0.08em] text-black/10 sm:top-[62%] lg:top-[38%] lg:text-[16vw]">
          <div className="animate-marquee">
            <span>LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;LOUI NAQUINES&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>

        {/* Left Column Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center pt-6 pb-8 z-20">
          {/* Giant Editorial Heading & Subtitle */}
          <div className="mb-10">
            <p ref={badgeRef} className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500" style={{ opacity: 0 }}>
              Full-Stack Developer
            </p>
            <h1 className="mb-4 text-7xl font-semibold leading-none tracking-tighter text-black sm:text-8xl md:text-8xl">
              <ShinyText
                text="Hello World!"
                speed={1}
                delay={2}
                color="#111111"
                shineColor="#ffffff"
                spread={120}
                className="block"
              />
            </h1>
            <p ref={subtitleRef} className="text-sm sm:text-base font-normal text-zinc-700 flex items-center gap-2" style={{ opacity: 0 }}>
              <span className="w-6 h-[1.5px] bg-zinc-700 inline-block"></span>
              It&apos;s Loui Naquines, building for the web and beyond
            </p>
          </div>

          {/* Compact introduction and primary action */}
          <div ref={introBlockRef} className="max-w-lg border-y border-black/15 py-5" style={{ opacity: 0 }}>
            <h2 className="text-lg font-semibold tracking-tight text-black sm:text-xl">
              End-to-end digital products
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600 sm:text-base">
              I design and engineer full-stack web applications, seamless user interfaces, and reliable digital experiences from concept to deployment.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex items-center gap-4 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-0.5"
              >
                Let&apos;s collaborate <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-4 rounded-full border border-black/25 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
              >
                View about <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Location and capabilities */}
          <div ref={statsRef} className="mt-3 flex w-full max-w-lg items-center justify-between gap-5 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 sm:text-xs" style={{ opacity: 0 }}>
            <span className="shrink-0">Cebu, Philippines</span>
            <span className="text-right">Web · Mobile · Frontend/Backend</span>
          </div>
        </div>

        {/* Right Column Large Portrait Cutout */}
        <div className="relative w-full lg:w-1/2">
          <div ref={photoRef} className="flex h-[60vh] max-h-[780px] w-full items-end justify-center relative z-10 sm:h-[70vh] lg:h-[82vh] lg:justify-end" style={{ opacity: 0 }}>
            <div className="relative flex h-full w-full items-end justify-center lg:justify-end">
              <Image
                src="/images/hero-person-cutout.png"
                alt="Loui Naquines - Full-Stack Developer"
                width={900}
                height={1200}
                priority
                className="pointer-events-none h-full w-auto max-w-none select-none object-contain object-bottom drop-shadow-xl grayscale-[0.86] brightness-[1.08] contrast-[0.95]"
              />
            </div>
          </div>

          {/* Social/contact links stay attached to the portrait on small screens. */}
          <aside ref={socialRef} className="relative z-30 mt-4 flex w-full items-center justify-center gap-3 lg:absolute lg:bottom-10 lg:right-0 lg:mt-0 lg:grid lg:w-64 lg:translate-y-0" style={{ opacity: 0 }}>
            {[
              ["Email", "mailto:louinaquines@gmail.com", "email"],
              ["Facebook", "https://www.facebook.com/loui.naquines", "facebook"],
              ["Instagram", "https://www.instagram.com/_whitechocolateee", "instagram"],
            ].map(([label, href, icon]) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                title={label}
                className="flex size-11 items-center justify-center rounded-full border border-black/15 bg-white/80 p-0 text-zinc-700 backdrop-blur-sm transition-colors hover:border-black hover:bg-white hover:text-black lg:h-auto lg:w-full lg:justify-between lg:rounded-full lg:px-5 lg:py-3 lg:text-xs lg:font-semibold lg:uppercase lg:tracking-[0.1em]"
              >
                <span className="sr-only lg:not-sr-only">{label}</span>
                {icon === "email" && (
                  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                )}
                {icon === "facebook" && (
                  <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.67.33-1 1-1Z" />
                  </svg>
                )}
                {icon === "instagram" && (
                  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                )}
              </Link>
            ))}
          </aside>
        </div>
      </main>

      {/* Footer / Year Tag */}
      <footer ref={footerRef} className="w-full px-6 sm:px-12 py-6 flex items-center justify-between text-xs font-medium text-zinc-500 z-20" style={{ opacity: 0 }}>
        <div>2026</div>
      </footer>
    </div>
  );
}

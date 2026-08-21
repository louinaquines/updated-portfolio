"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  ["01", "Web products and interfaces", "Responsive frontends, clear architecture, and service integration"],
  ["02", "Complete application systems", "Web apps, APIs, databases, and secure user flows"],
  ["03", "Launch and maintenance", "Cross-platform releases, deployment, updates, and ongoing support"],
];

function useFadeUp(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
        },
      }
    );
  }, [ref, delay]);
}

export default function About() {
  const labelRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const servicesTitleRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useFadeUp(labelRef as React.RefObject<HTMLElement>);
  useFadeUp(bioRef as React.RefObject<HTMLElement>, 0.1);
  useFadeUp(profileRef as React.RefObject<HTMLElement>);
  useFadeUp(statsRef as React.RefObject<HTMLElement>, 0.1);
  useFadeUp(servicesTitleRef as React.RefObject<HTMLElement>, 0.1);

  // Stagger each service row
  useEffect(() => {
    if (!servicesRef.current) return;
    const rows = servicesRef.current.querySelectorAll<HTMLElement>(".service-row");
    rows.forEach((row, i) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="about" className="bg-[#0b0b0b] px-5 pb-24 pt-12 text-[#f4f1eb] sm:px-8 sm:pb-32 sm:pt-16 lg:px-16 lg:pb-36 lg:pt-20">
      <div className="mx-auto max-w-[1500px]">
        <div ref={labelRef} className="flex flex-wrap items-center justify-between gap-5 border-b border-white/20 pb-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/60" style={{ opacity: 0 }}>
          <span><strong className="text-white">02</strong> / About</span>
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-24 lg:py-24">
          {/* SplitText heading — left untouched, has its own animation */}
          <SplitText
            tag="h2"
            text="I turn complex ideas into dependable, easy-to-use software."
            className="max-w-5xl font-serif text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.055em]"
            textAlign="left"
          />
          <div ref={bioRef} className="max-w-xl self-end text-lg leading-8 text-white/70 sm:text-xl sm:leading-9" style={{ opacity: 0 }}>
            <p>I&apos;m Loui Naquines, a full-stack developer who builds dependable digital experiences from the first concept through production. I create responsive websites, business platforms, and mobile applications that are designed to feel clear, fast, and useful on every screen.</p>
            <p className="mt-7">I connect frontend interfaces with backend services, APIs, databases, authentication, third-party integrations, and deployment into one practical workflow. Whether I&apos;m shaping a web product, delivering a mobile app, or improving an existing system, I focus on maintainable code, reliable performance, and software that can grow with the people using it.</p>
            <Link href="#contact" className="mt-8 inline-flex items-center gap-4 border-b border-white/50 pb-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white">Let&apos;s work together <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="grid gap-12 border-t border-white/20 pt-12 lg:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.25fr)] lg:gap-24">
          <div ref={profileRef} style={{ opacity: 0 }}>
            <ProfileCard
              avatarUrl="/images/profile.png"
              handle="louinaquines"
              status="Cebu, Philippines"
              contactText="Contact"
            />
          </div>

          <div className="flex flex-col">
            <div ref={statsRef} className="grid border-y border-white/20 sm:grid-cols-3" style={{ opacity: 0 }}>
              <div className="border-b border-white/20 py-6 sm:border-b-0 sm:border-r sm:pr-6">
                <p className="font-serif text-5xl tracking-[-0.06em]">End to end</p>
                <p className="mt-4 text-xs uppercase leading-5 tracking-[0.12em] text-white/50">From system planning to polished release, handled in one workflow</p>
              </div>
              <div className="border-b border-white/20 py-6 sm:border-b-0 sm:border-r sm:px-6">
                <p className="font-serif text-5xl tracking-[-0.06em]">5+</p>
                <p className="mt-4 text-xs uppercase leading-5 tracking-[0.12em] text-white/50">Web, desktop, and mobile platforms supported</p>
              </div>
              <div className="py-6 sm:pl-6">
                <p className="font-serif text-5xl tracking-[-0.06em]">GMT+8</p>
                <p className="mt-4 text-xs uppercase leading-5 tracking-[0.12em] text-white/50">Working from the Philippines</p>
              </div>
            </div>

            <div className="mt-14" ref={servicesRef}>
              <p ref={servicesTitleRef} className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50" style={{ opacity: 0 }}>Areas of focus</p>
              {services.map(([number, title, description]) => (
                <div key={number} className="service-row grid grid-cols-[42px_1fr] gap-4 border-t border-white/20 py-6 sm:grid-cols-[64px_1fr] sm:gap-6" style={{ opacity: 0 }}>
                  <span className="text-xs font-semibold text-white/60">{number}</span>
                  <div>
                    <h3 className="font-serif text-2xl tracking-[-0.03em] sm:text-3xl">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/55 sm:text-base">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


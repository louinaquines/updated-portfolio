"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import SplitText from "@/components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [submissionState, setSubmissionState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const headerRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

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
    if (subtextRef.current) {
      gsap.fromTo(
        subtextRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: subtextRef.current,
            start: "top 88%",
          },
        }
      );
    }
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 88%",
          },
        }
      );
    }
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.25,
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 88%",
          },
        }
      );
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState("sending");
    setSubmissionMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setSubmissionState("error");
      setSubmissionMessage(result.error || "The message could not be sent right now.");
      return;
    }

    setSubmissionState("success");
    setSubmissionMessage("Thanks, your message has been sent.");
    form.reset();
  };

  return (
    <section id="contact" className="bg-[#f6f6f7] px-5 py-12 text-[#1a1a1a] sm:px-8 sm:py-16 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[1500px]">
        <div ref={headerRef} className="border-b border-black/15 pb-6 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500" style={{ opacity: 0 }}>
          <strong className="text-black">04</strong> / Contact
        </div>

        <div className="py-8 lg:py-10">
          <div>
            <SplitText
              tag="h2"
              text="Let's build something useful."
              className="max-w-5xl font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.86] tracking-[-0.055em]"
              textAlign="left"
            />
            <p ref={subtextRef} className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8" style={{ opacity: 0 }}>Have a website, mobile app, or full-stack product in mind? Send a few details and I&apos;ll get back to you with a practical next step.</p>
          </div>
        </div>

        <div className="grid gap-8 border-t border-black/15 pt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" style={{ opacity: 0 }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Your name</span>
                <input required name="name" type="text" placeholder="Your name" className="mt-2 w-full border-0 border-b border-black/25 bg-transparent px-0 pb-3 text-lg outline-none placeholder:text-zinc-400 focus:border-black" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Email address</span>
                <input required name="email" type="email" placeholder="you@example.com" className="mt-2 w-full border-0 border-b border-black/25 bg-transparent px-0 pb-3 text-lg outline-none placeholder:text-zinc-400 focus:border-black" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Project details</span>
              <textarea required name="message" rows={3} placeholder="Tell me about the website, app, or system you have in mind." className="mt-2 w-full resize-y border-0 border-b border-black/25 bg-transparent px-0 pb-3 text-lg outline-none placeholder:text-zinc-400 focus:border-black" />
            </label>
            <div className="flex flex-wrap items-center gap-6">
              <button disabled={submissionState === "sending"} type="submit" className="group inline-flex items-center gap-5 bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-none transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-[0_12px_24px_-14px_rgba(0,0,0,0.85)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60">
                {submissionState === "sending" ? "Sending..." : "Send message"} <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </button>
              {submissionMessage && <p className={`text-sm ${submissionState === "error" ? "text-red-700" : "text-zinc-600"}`} role="status">{submissionMessage}</p>}
            </div>
          </form>

          <aside ref={sidebarRef} className="lg:border-l lg:border-black/15 lg:pl-8" style={{ opacity: 0 }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Based in</p>
              <p className="mt-3 font-serif text-3xl leading-tight tracking-[-0.04em]">Cebu, Philippines · Asia/Manila (GMT+8)</p>
              <a href="tel:+639397837217" className="mt-6 inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-zinc-700 transition-colors hover:text-black">
                <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6.6 3.8 8.5 3a1.5 1.5 0 0 1 1.9.7l1.1 2.6a1.5 1.5 0 0 1-.4 1.7L9.8 9.2a13.5 13.5 0 0 0 5 5l1.2-1.3a1.5 1.5 0 0 1 1.7-.4l2.6 1.1a1.5 1.5 0 0 1 .7 1.9l-.8 1.9a2.5 2.5 0 0 1-2.7 1.5A16.5 16.5 0 0 1 5.1 6.5a2.5 2.5 0 0 1 1.5-2.7Z" /></svg>
                <span>+63 939 783 7217</span>
              </a>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Connect with me</p>
              <div className="mt-4 flex flex-wrap gap-3" aria-label="Contact and social links">
                <a href="mailto:louinaquines@gmail.com" title="Email" aria-label="Email" className="flex size-12 items-center justify-center rounded-full border border-black/20 text-zinc-700 transition-colors hover:bg-black hover:text-white">
                  <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                </a>
                <a href="https://www.facebook.com/loui.naquines" target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook" className="flex size-12 items-center justify-center rounded-full border border-black/20 text-zinc-700 transition-colors hover:bg-black hover:text-white">
                  <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.67.33-1 1-1Z" /></svg>
                </a>
                <a href="https://www.instagram.com/_whitechocolateee" target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram" className="flex size-12 items-center justify-center rounded-full border border-black/20 text-zinc-700 transition-colors hover:bg-black hover:text-white">
                  <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/loui-naquines-aba84324b" target="_blank" rel="noreferrer" title="LinkedIn" aria-label="LinkedIn" className="flex size-12 items-center justify-center rounded-full border border-black/20 text-zinc-700 transition-colors hover:bg-black hover:text-white">
                  <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 8.5A2 2 0 1 0 6.5 4.5a2 2 0 0 0 0 4ZM5 10h3v9H5v-9Zm5 0h3v1.3c.6-.9 1.6-1.7 3.3-1.7 3 0 3.7 2 3.7 4.7V19h-3v-4.1c0-1 0-2.3-1.5-2.3s-1.7 1.1-1.7 2.2V19h-3v-9Z" /></svg>
                </a>
                <a href="https://github.com/louinaquines" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub" className="flex size-12 items-center justify-center rounded-full border border-black/20 text-zinc-700 transition-colors hover:bg-black hover:text-white">
                  <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-2.84 17.54c.45.08.62-.2.62-.43v-1.52c-2.52.55-3.05-1.07-3.05-1.07-.41-1.05-1-1.33-1-1.33-.82-.56.06-.55.06-.55.91.07 1.39.94 1.39.94.81 1.39 2.12.99 2.64.76.08-.59.32-.99.58-1.22-2.01-.23-4.12-1.01-4.12-4.48 0-.99.35-1.8.93-2.43-.09-.23-.4-1.15.09-2.39 0 0 .76-.24 2.49.93A8.7 8.7 0 0 1 12 7.45c.77 0 1.54.1 2.26.33 1.73-1.17 2.49-.93 2.49-.93.49 1.24.18 2.16.09 2.39.58.63.93 1.44.93 2.43 0 3.48-2.12 4.25-4.14 4.47.33.29.62.86.62 1.74v2.58c0 .24.16.52.63.43A9 9 0 0 0 12 3Z" /></svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
        <footer className="mt-8 border-t border-black/15 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          © Loui Naquines
        </footer>
      </div>
    </section>
  );
}

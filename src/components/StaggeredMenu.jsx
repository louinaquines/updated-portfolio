"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ShinyText from "@/components/ShinyText";
import "./StaggeredMenu.css";

/** @typedef {{ label: string, link: string, ariaLabel?: string }} MenuItem */
/** @typedef {{ label: string, link: string }} SocialItem */

/**
 * @param {{ position?: "left" | "right", colors?: string[], items?: MenuItem[], socialItems?: SocialItem[], displaySocials?: boolean, displayItemNumbering?: boolean, className?: string, logoUrl: string, menuButtonColor?: string, openMenuButtonColor?: string, accentColor?: string, changeMenuColorOnOpen?: boolean, isFixed?: boolean, closeOnClickAway?: boolean }} props
 */
export default function StaggeredMenu({
  position = "right",
  colors = ["#dedede", "#bdbdbd"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = "#111111",
  openMenuButtonColor = "#111111",
  accentColor = "#111111",
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const iconRef = useRef(null);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const textInnerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel || !iconRef.current || !plusHRef.current || !plusVRef.current || !textInnerRef.current) return;

      const preLayers = preContainer ? Array.from(preContainer.querySelectorAll(".sm-prelayer")) : [];
      preLayerElsRef.current = preLayers;
      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      gsap.set(plusHRef.current, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusVRef.current, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInnerRef.current, { yPercent: 0 });
      gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });

    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
    const offscreen = position === "left" ? -100 : 100;
    const panelInsertTime = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0;
    const tl = gsap.timeline({ paused: true });

    gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    gsap.set(numberEls, { "--sm-num-opacity": 0 });
    gsap.set(socialTitle, { opacity: 0 });
    gsap.set(socialLinks, { y: 25, opacity: 0 });

    layers.forEach((layer, index) => {
      tl.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, index * 0.07);
    });
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: 0.65, ease: "power4.out" }, panelInsertTime);
    tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.1 }, panelInsertTime + 0.1);
    tl.to(numberEls, { duration: 0.6, ease: "power2.out", "--sm-num-opacity": 1, stagger: 0.08 }, panelInsertTime + 0.2);
    tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, panelInsertTime + 0.26);
    tl.to(socialLinks, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }, panelInsertTime + 0.3);
    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    const panel = panelRef.current;
    if (!panel) return;
    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...preLayerElsRef.current, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
    });
  }, [position]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const target = opening ? "Close" : "Menu";
    const sequence = [opening ? "Menu" : "Close", "Menu", target, target];
    setTextLines(sequence);
    gsap.set(inner, { yPercent: 0 });
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -75, duration: 0.75, ease: "power4.out" });
  }, []);

  const toggleMenu = useCallback(() => {
    const nextOpen = !openRef.current;
    openRef.current = nextOpen;
    setOpen(nextOpen);
    if (nextOpen) {
      const timeline = buildOpenTimeline();
      timeline?.play(0);
    } else {
      playClose();
    }
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(iconRef.current, { rotate: nextOpen ? 225 : 0, duration: nextOpen ? 0.8 : 0.35, ease: "power4.out" });
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      colorTweenRef.current = gsap.to(toggleBtnRef.current, { color: nextOpen ? openMenuButtonColor : menuButtonColor, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    }
    animateText(nextOpen);
  }, [animateText, buildOpenTimeline, changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor, playClose]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    playClose();
    gsap.to(iconRef.current, { rotate: 0, duration: 0.35, ease: "power3.inOut" });
    gsap.to(toggleBtnRef.current, { color: menuButtonColor, duration: 0.3, ease: "power2.out" });
    animateText(false);
  }, [animateText, menuButtonColor, playClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return undefined;
    const handleClickOutside = (event) => {
      if (!panelRef.current?.contains(event.target) && !toggleBtnRef.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu, closeOnClickAway, open]);

  React.useEffect(() => () => {
    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    spinTweenRef.current?.kill();
    textCycleAnimRef.current?.kill();
    colorTweenRef.current?.kill();
  }, []);

  return (
    <div className={`${className ? `${className} ` : ""}staggered-menu-wrapper${isFixed ? " fixed-wrapper" : ""}`} style={{ "--sm-accent": accentColor }} data-position={position} data-open={open || undefined}>
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 3).map((color, index) => <div key={index} className="sm-prelayer" style={{ background: color }} />)}
      </div>
      <header className="staggered-menu-header" aria-label="Mobile navigation header">
        <div className="sm-logo" aria-label="Logo">
          <ShinyText maskImage={logoUrl} speed={2} delay={1} color="#111111" shineColor="#ffffff" spread={120} className="sm-logo-img" />
        </div>
        <button ref={toggleBtnRef} className="sm-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="staggered-menu-panel" onClick={toggleMenu} type="button">
          <span className="sm-toggle-textWrap" aria-hidden="true"><span ref={textInnerRef} className="sm-toggle-textInner">{textLines.map((line, index) => <span className="sm-toggle-line" key={`${line}-${index}`}>{line}</span>)}</span></span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true"><span ref={plusHRef} className="sm-icon-line" /><span ref={plusVRef} className="sm-icon-line sm-icon-line-v" /></span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => (
              <li className="sm-panel-itemWrap" key={`${item.label}-${index}`}>
                <a className="sm-panel-item" href={item.link} aria-label={item.ariaLabel || item.label} onClick={closeMenu}>
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Connect with me</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((item, index) => <li key={`${item.label}-${index}`}><a href={item.link} target="_blank" rel="noreferrer" className="sm-socials-link">{item.label}</a></li>)}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export default function SplitText({
  text,
  className = "",
  delay = 35,
  duration = 1,
  ease = "power3.out",
  splitType = "words, chars",
  from = { opacity: 0, y: 28 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-80px",
  textAlign = "left",
  tag = "p",
  onLetterAnimationComplete = undefined,
}) {
  const ref = useRef(null);
  const completedRef = useRef(false);
  const callbackRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(() => typeof document !== "undefined" && document.fonts.status === "loaded");

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (fontsLoaded) return undefined;
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [fontsLoaded]);

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded || completedRef.current) return;
    const element = ref.current;
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
    const sign = marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    let targets;
    const splitInstance = new GSAPSplitText(element, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (self) => {
        if (splitType.includes("chars") && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes("words") && self.words.length) targets = self.words;
        if (!targets && splitType.includes("lines") && self.lines.length) targets = self.lines;
        targets = targets || self.chars || self.words || self.lines;

        return gsap.fromTo(targets, { ...from }, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: { trigger: element, start, once: true, fastScrollEnd: true, anticipatePin: 0.4 },
          onComplete: () => {
            completedRef.current = true;
            callbackRef.current?.();
          },
          willChange: "transform, opacity",
          force3D: true,
        });
      },
    });

    element._rbsplitInstance = splitInstance;
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) trigger.kill();
      });
      splitInstance.revert();
      element._rbsplitInstance = null;
    };
  }, { dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded] });

  const Tag = tag || "p";
  return <Tag ref={ref} style={{ textAlign, overflow: "hidden", display: "inline-block", whiteSpace: "normal", wordWrap: "break-word", willChange: "transform, opacity" }} className={`split-parent ${className}`.trim()}>{text}</Tag>;
}

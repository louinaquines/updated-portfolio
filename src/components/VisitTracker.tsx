"use client";

import { useEffect, useRef } from "react";

export default function VisitTracker() {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const sessionKey = "portfolio-visit-notified";
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    const sendVisit = async () => {
      const details: Record<string, string> = {
        path: window.location.pathname,
        referrer: document.referrer || "Direct",
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      try {
        const locationResponse = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(2500),
        });
        if (locationResponse.ok) {
          const location = await locationResponse.json() as {
            country_name?: string;
            region?: string;
            city?: string;
            timezone?: string;
          };
          details.country = location.country_name || "";
          details.region = location.region || "";
          details.city = location.city || "";
          details.timezone = location.timezone || details.clientTimezone;
        }
      } catch {
        // The server-side lookup remains available when the client lookup fails.
      }

      await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
        keepalive: true,
      });
    };

    void sendVisit().catch(() => {
      sessionStorage.removeItem(sessionKey);
    });
  }, []);

  return null;
}

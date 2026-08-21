import { NextRequest, NextResponse } from "next/server";

const VISIT_COOLDOWN_MS = 10 * 60 * 1000;
const recentVisits = new Map<string, number>();

type LocationDetails = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
};

type VisitDetails = LocationDetails & {
  path?: string;
  referrer?: string;
  clientTimezone?: string;
};

function isLikelyAutomatedRequest(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  return /bot|crawler|spider|headless|uptime|monitor|preview/i.test(userAgent);
}

function getVisitorKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 160) || "unknown";
  return `${forwardedFor || realIp || "unknown"}:${userAgent}`;
}

function pruneVisits(now: number) {
  for (const [key, timestamp] of recentVisits) {
    if (now - timestamp >= VISIT_COOLDOWN_MS) recentVisits.delete(key);
  }
}

async function getApproximateLocation(details: VisitDetails): Promise<Required<LocationDetails>> {
  const fallback = {
    country: details.country || "Unavailable",
    region: details.region || "Unavailable",
    city: details.city || "Unavailable",
    timezone: details.timezone || details.clientTimezone || "Unavailable",
  };
  // Only trust the browser lookup here. A server-side fallback can resolve to
  // Vercel's own infrastructure instead of the person viewing the portfolio.
  return fallback;
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return new NextResponse(null, { status: 204 });
  if (isLikelyAutomatedRequest(request)) return new NextResponse(null, { status: 204 });

  const now = Date.now();
  pruneVisits(now);
  const visitorKey = getVisitorKey(request);
  const lastVisit = recentVisits.get(visitorKey);

  if (lastVisit && now - lastVisit < VISIT_COOLDOWN_MS) {
    return new NextResponse(null, { status: 204 });
  }

  recentVisits.set(visitorKey, now);

  let details: VisitDetails = {};
  try {
    details = await request.json();
  } catch {
    // The notification still works when a client sends no optional details.
  }

  const location = await getApproximateLocation(details);

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Portfolio visits",
      embeds: [{
        title: "New portfolio visit",
        color: 11184810,
        fields: [
          { name: "Page", value: String(details.path || "/").slice(0, 100), inline: true },
          { name: "Referrer", value: String(details.referrer || "Direct").slice(0, 200), inline: true },
          { name: "Country", value: location.country.slice(0, 100), inline: true },
          { name: "Region", value: location.region.slice(0, 100), inline: true },
          { name: "City", value: location.city.slice(0, 100), inline: true },
          { name: "Time zone", value: location.timezone.slice(0, 100), inline: true },
          { name: "Location accuracy", value: "Approximate (IP-based)", inline: true },
        ],
        timestamp: new Date(now).toISOString(),
      }],
    }),
  });

  if (!discordResponse.ok) {
    recentVisits.delete(visitorKey);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return new NextResponse(null, { status: 204 });
}

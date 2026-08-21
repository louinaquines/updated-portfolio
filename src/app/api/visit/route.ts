import { NextRequest, NextResponse } from "next/server";

const VISIT_COOLDOWN_MS = 10 * 60 * 1000;
const recentVisits = new Map<string, number>();

type LocationDetails = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
};

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

function getClientIp(request: NextRequest) {
  const candidates = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
  ];

  return candidates
    .flatMap((value) => value?.split(",") || [])
    .map((value) => value.trim())
    .find((value) => value && value !== "unknown") || "";
}

function isLocalAddress(ip: string) {
  return !ip
    || ip === "::1"
    || ip === "127.0.0.1"
    || ip === "::ffff:127.0.0.1"
    || ip.startsWith("10.")
    || ip.startsWith("192.168.")
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip);
}

async function getApproximateLocation(request: NextRequest, clientTimezone?: string): Promise<Required<LocationDetails>> {
  const fallback = {
    country: "Unavailable",
    region: "Unavailable",
    city: "Unavailable",
    timezone: clientTimezone || "Unavailable",
  };
  const ip = getClientIp(request);
  if (isLocalAddress(ip)) return fallback;

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return fallback;
    const data = await response.json() as LocationDetails;
    return {
      country: data.country || fallback.country,
      region: data.region || fallback.region,
      city: data.city || fallback.city,
      timezone: data.timezone || fallback.timezone,
    };
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return new NextResponse(null, { status: 204 });

  const now = Date.now();
  pruneVisits(now);
  const visitorKey = getVisitorKey(request);
  const lastVisit = recentVisits.get(visitorKey);

  if (lastVisit && now - lastVisit < VISIT_COOLDOWN_MS) {
    return new NextResponse(null, { status: 204 });
  }

  recentVisits.set(visitorKey, now);

  let details: { path?: string; referrer?: string; clientTimezone?: string } = {};
  try {
    details = await request.json();
  } catch {
    // The notification still works when a client sends no optional details.
  }

  const location = await getApproximateLocation(request, details.clientTimezone);

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

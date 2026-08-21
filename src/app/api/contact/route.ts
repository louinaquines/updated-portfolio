import { NextRequest, NextResponse } from "next/server";

const CONTACT_COOLDOWN_MS = 60 * 1000;
const recentSubmissions = new Map<string, number>();

function getClientKey(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
  return ip;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email service is not configured." }, { status: 503 });

  const clientKey = getClientKey(request);
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(clientKey);
  if (lastSubmission && now - lastSubmission < CONTACT_COOLDOWN_MS) {
    return NextResponse.json({ error: "Please wait a moment before sending another message." }, { status: 429 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim().slice(0, 120);
  const email = body.email?.trim().slice(0, 160);
  const message = body.message?.trim().slice(0, 5000);
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid name, email, and message." }, { status: 400 });
  }

  recentSubmissions.set(clientKey, now);
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: ["louinaquines@gmail.com"],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!emailResponse.ok) {
    recentSubmissions.delete(clientKey);
    return NextResponse.json({ error: "The message could not be sent right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

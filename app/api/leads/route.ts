import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lead } = await req.json();

    const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "there";
    const services = (lead.interestedServices ?? []).join(", ") || "our services";
    const summary = lead.summary ?? "";

    const prompt = `You are a follow-up specialist for Desert Glow Medical Aesthetics and Wellness, a boutique medical spa in Palm Desert, California.

Write a warm, personalized follow-up message for a potential client based on this context:
- Name: ${name}
- Services they expressed interest in: ${services}
- Conversation summary: ${summary}

Guidelines:
- Address them by first name (or "there" if unknown)
- Reference the specific services they were curious about — be specific, not generic
- Invite them to book a complimentary 30-minute skin assessment or consultation
- Mention the boutique, personal experience and the board-certified team
- Close with contact info: pam@desertglowspa.com or (760) 565-3990
- Tone: warm, welcoming, never pushy
- Length: 3 short paragraphs — no more
- Do NOT quote any pricing
- Do NOT reference any health conditions or diagnoses

Write only the message body — no subject line, no "Dear", just the message starting with their name.`;

    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-4-31b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.75,
        max_tokens: 400,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "LM Studio unavailable" }, { status: 502 });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Failed to generate follow-up" }, { status: 500 });
  }
}

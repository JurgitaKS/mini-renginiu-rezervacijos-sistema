import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

type ReqBody = {
  title?: string;
  category?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
};

async function callOpenAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "minimax-2.5",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that writes short Lithuanian event descriptions (1-3 sentences). Be friendly, clear, not overly promotional, and do not invent missing date, location, or price information.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${txt}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Pirmiausia įveskite renginio pavadinimą." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await isAdminUser(supabase, user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parts = [
      `Pavadinimas: ${body.title}`,
      body.category ? `Kategorija: ${body.category}` : null,
      body.location ? `Vieta: ${body.location}` : null,
      body.event_date ? `Data: ${body.event_date}` : null,
      body.event_time ? `Laikas: ${body.event_time}` : null,
    ].filter(Boolean as any) as string[];

    const prompt = `Parašyk trumpą (1–3 sakiniai) lietuvišką, draugišką renginio aprašymą tinkančią renginių rezervacijos svetainei. Naudok tik pateiktą informaciją: ${parts.join(", ")}. Jei informacijos trūksta, jos neįsivaizduok ir nieko nekurk.`;

    let description: string | null = null;
    try {
      description = await callOpenAI(prompt);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "AI aprašymo sugeneruoti nepavyko." }, { status: 500 });
    }

    if (!description) {
      return NextResponse.json({ error: "AI aprašymo sugeneruoti nepavyko." }, { status: 500 });
    }

    return NextResponse.json({ description });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI aprašymo sugeneruoti nepavyko." }, { status: 500 });
  }
}

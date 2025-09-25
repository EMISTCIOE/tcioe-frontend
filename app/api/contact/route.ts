import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Minimal placeholder handler until backend integration is ready
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, email, category, description, subscribe } = body || {};

    if (!subject || !email || !description) {
      return NextResponse.json(
        { message: "Subject, email and description are required" },
        { status: 400 }
      );
    }

    // In lieu of a real backend, just acknowledge the message.
    // This is the only place that will change when wiring a real provider.
    const received = {
      subject,
      email,
      category: category || "general",
      subscribe: Boolean(subscribe),
      description,
      receivedAt: new Date().toISOString(),
    };

    // eslint-disable-next-line no-console
    console.log("Contact form submission:", received);

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks for contacting us. Your message has been received. We’ll reach out soon.",
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unable to process request" },
      { status: 500 }
    );
  }
}


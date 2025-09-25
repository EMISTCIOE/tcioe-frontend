import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function checkUrl(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(id);
    const ms = Date.now() - startedAt;
    return {
      url,
      ok: res.ok,
      status: res.status,
      ms,
    };
  } catch (e: any) {
    clearTimeout(id);
    return {
      url,
      ok: false,
      status: 0,
      ms: Date.now() - startedAt,
      error: e?.name === "AbortError" ? "timeout" : e?.message || "fetch_error",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { urls, timeoutMs = 6000 } = await req.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ message: "urls array required" }, { status: 400 });
    }

    const results = await Promise.all(urls.map((u: string) => checkUrl(u, timeoutMs)));
    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unable to check status" },
      { status: 500 }
    );
  }
}


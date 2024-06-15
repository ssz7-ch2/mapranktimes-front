import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  // 120 requests per day
  limiter: Ratelimit.slidingWindow(120, "1d"),
});

export const config = {
  matcher: "/",
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip,
  );
  return success ? NextResponse.next() : Response.json(
    { message: "rate limited" },
    { status: 429 },
  );
}

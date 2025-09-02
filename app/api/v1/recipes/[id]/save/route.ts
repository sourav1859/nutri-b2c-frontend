// app/api/v1/recipes/[id]/save/route.ts
import type { NextRequest } from "next/server";

const API_BASE = (process.env.API_BASE_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const jwt = req.headers.get("x-appwrite-jwt") || "";
  const res = await fetch(`${API_BASE}/api/v1/recipes/${id}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { "X-Appwrite-JWT": jwt } : {}),
    },
    cache: "no-store",
  });

  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

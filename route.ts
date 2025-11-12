// app/api/generate/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs"; // edge 말고 node로

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "prompt required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 네가 아까 캡처한 Space의 엔드포인트
    const spaceUrl =
      "https://stabilityai-stable-diffusion-3-5-medium.hf.space/run/infer";

    const resp = await fetch(spaceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          prompt, // prompt
          "", // negative_prompt
          0, // seed
          true, // randomize_seed
          1024, // width
          1024, // height
          4.5, // guidance_scale
          40, // num_inference_steps
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ detail: text }), {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await resp.json();
    const imageUrl = result.data?.[0]?.url || result.data?.[0];

    if (!imageUrl) {
      return new Response(JSON.stringify({ detail: "no image in response" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ detail: e.message ?? "fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

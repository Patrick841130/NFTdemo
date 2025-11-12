// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "HF_TOKEN missing on server" });
  }

  try {
    const hf = new HfInference(token);

    // 타입이 provider를 아직 모르는 버전이라 any로 우회
    const imgBlob = await (hf as any).textToImage({
      model: "stabilityai/stable-diffusion-3.5-medium",
      provider: "fal-ai",              // <- 네가 UI에서 본 그 값
      inputs: prompt,
      parameters: {
        num_inference_steps: 5,
      },
    });

    const arrayBuffer = await imgBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return res.status(200).json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "image generation failed" });
  }
}

// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";

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
    const response = await fetch("https://router.huggingface.co/hf-inference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // 이걸 넣어야 바이너리 이미지로 바로 온다
        Accept: "image/png",
      },
      body: JSON.stringify({
        // 👇 네가 캡처한 모델 이름
        model: "stabilityai/stable-diffusion-3.5-medium",
        // 👇 이 모델은 provider를 지정해야 한다
        provider: "fal-ai",
        inputs: prompt,
        // 옵션도 캡처에 있던 그대로 넣어줄 수 있음
        parameters: {
          num_inference_steps: 5,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return res.status(200).json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "image generation failed" });
  }
}

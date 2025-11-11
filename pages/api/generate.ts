import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: "HF_TOKEN missing" });

  try {
    const response = await fetch("https://router.huggingface.co/hf-inference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-2-1", // 무료 공개 모델
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    res.status(200).json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "image generation failed" });
  }
}

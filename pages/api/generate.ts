// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    return res.status(400).json({ error: 'prompt required' });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is missing on server' });
  }

  try {
    // Replicate 모델 실행
    // 모델 이름은 UI에서 봤던 그대로: "google/imagen-4"
    const output = (await replicate.run(
      'google/imagen-4',
      {
        input: {
          prompt,
          // 필요하면 옵션 더 넣기
          // aspect_ratio: '16:9',
          // safety_filter_level: 'block_medium_and_above',
        },
      }
    )) as any;

    // Replicate는 보통 이미지 URL 배열로 줘요.
    // 모델마다 조금 다르긴 한데, imagen 계열은 [ "https://..." ] 이런 식이라 이렇게 처리해요.
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return res.status(500).json({ error: 'no image returned from replicate' });
    }

    return res.status(200).json({ imageUrl });
  } catch (err: any) {
    console.error('replicate error', err);
    return res.status(500).json({ error: err?.message ?? 'replicate failed' });
  }
}

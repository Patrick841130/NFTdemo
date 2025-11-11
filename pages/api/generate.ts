// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

// ✅ 여기서 두 이름을 다 본다
const token =
  process.env.REPLICATE_API_TOKEN ||
  process.env.REPLICATE_API_KEY ||
  '';

const replicate = new Replicate({
  auth: token,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    return res.status(400).json({ error: 'prompt required' });
  }

  // ✅ 여기서도 한 번 더 체크해서 바로 알려주자
  if (!token) {
    return res
      .status(500)
      .json({ error: 'REPLICATE_API_TOKEN / REPLICATE_API_KEY is missing on server' });
  }

  try {
    const output = (await replicate.run('google/imagen-4', {
      input: {
        prompt,
      },
    })) as any;

    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return res.status(500).json({ error: 'no image returned from replicate' });
    }

    return res.status(200).json({ imageUrl });
  } catch (err: any) {
    // 이게 지금 네 alert에 찍힌 그 401이야
    return res.status(500).json({
      error: `Request to Replicate failed: ${err?.message ?? 'unknown'}`,
    });
  }
}

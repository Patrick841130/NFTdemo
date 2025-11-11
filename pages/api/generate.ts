// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    return res.status(400).json({ error: 'prompt required' });
  }

  // TODO: 여기에 실제 생성형 AI 호출 넣기
  // 예: Replicate, OpenAI Images, Stability 등
  // 지금은 임시로 picsum 리턴
  const imageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;

  return res.status(200).json({ imageUrl });
}

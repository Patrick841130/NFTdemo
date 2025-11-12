// api/generate.ts

export default async function handler(req: any, res: any) {
  // 공통 CORS 헤더 (동일 출처라도 OPTIONS 대비)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 1) 프리플라이트 허용
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // no body
  }

  // 2) POST 이외 거부하되 항상 JSON 바디 주기
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'POST only', received: req.method || 'UNKNOWN' });
  }

  // 3) body 안전 파싱
  const body =
    typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const prompt = body?.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt required' });
  }

  try {
    const spaceUrl =
      'https://stabilityai-stable-diffusion-3-5-medium.hf.space/run/infer';

    const resp = await fetch(spaceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          prompt, // prompt
          '',     // negative_prompt
          0,      // seed
          true,   // randomize_seed
          1024,   // width
          1024,   // height
          4.5,    // guidance_scale
          40      // num_inference_steps
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ detail: text || 'upstream error' });
    }

    const result = await resp.json();
    const imageUrl = result.data?.[0]?.url || result.data?.[0];
    if (!imageUrl) {
      return res.status(500).json({ detail: 'no image in response' });
    }

    return res.status(200).json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ detail: err?.message ?? 'fetch failed (server)' });
  }
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('카페 로얄티 카드, 귀여운 스타일');
  const [image, setImage] = useState<string | null>(null);

  const generate = () => {
    setImage('https://picsum.photos/400/400?random=' + Date.now());
  };

  return (
    <div style={{ padding: '3rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nifty MVP</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>AI로 1분 만에 단골 NFT 만들기</p>

      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '1rem' }}
        placeholder="프롬프트 입력"
      />

      <button
        onClick={generate}
        style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}
      >
        AI 이미지 생성
      </button>

      {image && (
        <div style={{ marginTop: '2rem' }}>
          <img src={image} alt="NFT" style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} />
          <p style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
            민팅 준비 완료! (다음 단계에서 연결)
          </p>
        </div>
      )}
    </div>
  );
}

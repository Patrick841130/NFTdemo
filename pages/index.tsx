import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('카페 로얄티 카드, 귀여운 스타일');
  const [image, setImage] = useState<string | null>(null);

  const generate = () => {
    setImage(`https://picsum.photos/400/400?random=${Date.now()}`);
  };

  return (
    <div style={{ padding: '3rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: '#10b981' }}>Nifty MVP</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.2rem' }}>
        AI로 1분 만에 단골 NFT 만들기
      </p>

      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '1rem', 
          fontSize: '1.1rem', 
          borderRadius: '12px', 
          border: '2px solid #e5e7eb', 
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}
        placeholder="프롬프트 입력 (예: 미용실 멤버십)"
      />

      <button
        onClick={generate}
        style={{ 
          width: '100%', 
          padding: '1.2rem', 
          background: '#10b981', 
          color: 'white', 
          border: 'none', 
          borderRadius: '12px', 
          fontSize: '1.3rem', 
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 15px rgba(16,185,129,0.3)',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        AI 이미지 생성
      </button>

      {image && (
        <div style={{ marginTop: '3rem' }}>
          <img 
            src={image} 
            alt="NFT" 
            style={{ 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxWidth: '100%'
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            color: '#10b981' 
          }}>
            민팅 준비 완료! 
          </p>
        </div>
      )}
    </div>
  );
}

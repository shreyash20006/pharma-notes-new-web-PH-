import { useEffect } from 'react';
import './LiveItUp.css';

export default function LiveItUp() {
  useEffect(() => {
    // Generate floating food particles
    const colors = ['#1a6ff4', '#60a5fa', '#2563eb', '#93c5fd', '#1d4ed8'];
    const emojis = ['🍕', '🍔', '🌮', '🍜', '🥗', '🍱'];
    const container = document.getElementById('particles');
    
    if (container) {
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const isEmoji = Math.random() > 0.5;
        
        if (isEmoji) {
          p.style.cssText = `
            width: auto; height: auto; background: none;
            font-size: ${10 + Math.random() * 10}px;
            left: ${Math.random() * 90 + 5}%;
            bottom: ${Math.random() * 20}%;
            animation-delay: ${Math.random() * 4}s;
            animation-duration: ${3 + Math.random() * 3}s;
          `;
          p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        } else {
          p.style.cssText = `
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 90 + 5}%;
            bottom: ${Math.random() * 20}%;
            animation-delay: ${Math.random() * 4}s;
            animation-duration: ${3 + Math.random() * 3}s;
            width: ${4 + Math.random() * 6}px;
            height: ${4 + Math.random() * 6}px;
          `;
        }
        container.appendChild(p);
      }
    }
  }, []);

  return (
    <div className="live-it-up-page">
      {/* 3D Animated Scene */}
      <div className="scene-wrap">
        {/* Particles */}
        <div className="particles" id="particles"></div>

        {/* STALL SVG */}
        <div className="stall">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="80" width="180" height="110" rx="4" fill="#c5d9f9" />
            <rect x="170" y="80" width="20" height="110" rx="2" fill="#a0b8e8" opacity="0.6" />
            <rect x="0" y="60" width="200" height="30" rx="4" fill="url(#awningGrad)" />
            <ellipse cx="16" cy="90" rx="16" ry="10" fill="#c5d9f9" />
            <ellipse cx="48" cy="90" rx="16" ry="10" fill="#a0b8e8" />
            <ellipse cx="80" cy="90" rx="16" ry="10" fill="#c5d9f9" />
            <ellipse cx="112" cy="90" rx="16" ry="10" fill="#a0b8e8" />
            <ellipse cx="144" cy="90" rx="16" ry="10" fill="#c5d9f9" />
            <ellipse cx="176" cy="90" rx="16" ry="10" fill="#a0b8e8" />
            <rect x="10" y="145" width="180" height="10" rx="2" fill="#6090d8" />
            <rect x="30" y="92" width="120" height="50" rx="3" fill="#e8f0ff" />
            <g transform="translate(80,70)">
              <rect x="10" y="50" width="22" height="28" rx="4" fill="#1a6ff4" />
              <circle cx="21" cy="44" r="13" fill="#c68642" />
              <ellipse cx="21" cy="33" rx="13" ry="9" fill="#1a0a00" />
              <ellipse cx="30" cy="44" rx="5" ry="12" fill="#1a0a00" />
              <circle cx="17" cy="45" r="1.5" fill="#5a2d00" />
              <circle cx="25" cy="45" r="1.5" fill="#5a2d00" />
              <path d="M17 51 Q21 55 25 51" stroke="#c0503a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M14 50 L21 56 L28 50" stroke="#fff" strokeWidth="2" fill="none" />
              <g className="lady-arm">
                <rect x="32" y="52" width="8" height="20" rx="4" fill="#c68642" />
              </g>
              <rect x="0" y="52" width="8" height="20" rx="4" fill="#c68642" />
            </g>
            <rect x="140" y="130" width="28" height="22" rx="3" fill="#f5c842" />
            <rect x="148" y="124" width="12" height="10" rx="2" fill="#d4aa30" />
            <rect x="50" y="126" width="40" height="26" rx="3" fill="#4fc3f7" />
            <rect x="53" y="129" width="34" height="18" rx="2" fill="#81d4fa" />
            <defs>
              <linearGradient id="awningGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#90bbff" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* BIKE + RIDER SVG */}
        <div className="bike-group">
          <div className="puff"></div>
          <div className="puff"></div>
          <div className="puff"></div>

          <svg viewBox="0 0 210 200" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(50,148)">
              <circle cx="0" cy="0" r="30" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle cx="0" cy="0" r="18" fill="none" stroke="#333" strokeWidth="5" />
              <circle cx="0" cy="0" r="6" fill="#555" />
              <g className="wheel">
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#555" strokeWidth="3" />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#555" strokeWidth="3" />
                <line x1="-13" y1="-13" x2="13" y2="13" stroke="#555" strokeWidth="2" />
                <line x1="13" y1="-13" x2="-13" y2="13" stroke="#555" strokeWidth="2" />
              </g>
            </g>
            <g transform="translate(162,148)">
              <circle cx="0" cy="0" r="28" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#333" strokeWidth="5" />
              <circle cx="0" cy="0" r="6" fill="#555" />
              <g className="wheel">
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#555" strokeWidth="3" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#555" strokeWidth="3" />
                <line x1="-11" y1="-11" x2="11" y2="11" stroke="#555" strokeWidth="2" />
                <line x1="11" y1="-11" x2="-11" y2="11" stroke="#555" strokeWidth="2" />
              </g>
            </g>
            <path d="M50 148 L90 90 L140 90 L162 148" fill="none" stroke="#e8e8e8" strokeWidth="6" strokeLinecap="round" />
            <path d="M90 90 L80 148" fill="none" stroke="#ddd" strokeWidth="5" strokeLinecap="round" />
            <path d="M140 90 L162 90 L162 120" fill="none" stroke="#ddd" strokeWidth="5" strokeLinecap="round" />
            <rect x="78" y="100" width="50" height="40" rx="5" fill="#ccc" />
            <ellipse cx="110" cy="88" rx="28" ry="7" fill="#888" />
            <path d="M155 90 Q168 80 174 76" stroke="#aaa" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="58" y="78" width="50" height="44" rx="5" fill="#111" />
            <circle cx="83" cy="100" r="10" fill="none" stroke="#1a6ff4" strokeWidth="2" />
            <path d="M78 100 L83 95 L88 100 L83 105 Z" fill="#1a6ff4" />
            <rect x="90" y="52" width="28" height="36" rx="6" fill="#1a6ff4" />
            <rect x="90" y="82" width="12" height="30" rx="5" fill="#1a6ff4" />
            <rect x="104" y="82" width="12" height="30" rx="5" fill="#1050d0" />
            <ellipse cx="96" cy="112" rx="8" ry="5" fill="#1a1a1a" />
            <ellipse cx="110" cy="112" rx="8" ry="5" fill="#1a1a1a" />
            <path d="M118 62 Q150 68 166 76" stroke="#1a6ff4" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M90 56 Q84 70 90 82" stroke="#1050d0" strokeWidth="3" fill="none" />
            <ellipse cx="104" cy="46" rx="18" ry="16" fill="#0035aa" />
            <ellipse cx="104" cy="46" rx="14" ry="10" fill="#1050d0" />
            <path d="M89 48 Q104 58 119 48" fill="#1a1a1a" opacity="0.7" />
            <path d="M96 36 Q100 32 108 36" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Road */}
        <div className="road">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="live-it">
          <span className="live">Live</span>
          <span className="it-up">it up!</span>
        </div>
        <div className="crafted">
          Crafted with <span className="heart">♥</span> in Nagpur, India
        </div>
      </div>
    </div>
  );
}

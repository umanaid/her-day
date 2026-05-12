import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Caveat:wght@400;600&family=DM+Sans:wght@300;400&display=swap');

  .ap-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* ── FULL-PAGE B&W BACKGROUND ── */
  .ap-bg-photo {
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0;
    transition: opacity 1.8s ease 0.4s;
    pointer-events: none;
  }
  .ap-bg-photo.visible {
    opacity: 1;
  }
  .ap-bg-photo img {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    object-fit: cover;
    object-position: center center;
    filter: grayscale(100%) contrast(1.05) brightness(0.38);
    display: block;
  }
  /* soft vignette overlay so content stays readable */
  .ap-bg-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.62) 100%);
  }

  /* everything above the bg photo */
  .ap-root > *:not(.ap-bg-photo) {
    position: relative;
    z-index: 1;
  }

  .back-btn {
    position: fixed;
    top: 24px; left: 24px; z-index: 100;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(242,196,206,.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; cursor: pointer; transition: all .3s;
    color: #c0607a;
  }
  .back-btn:hover { background: rgba(255,255,255,.96); transform: scale(1.1); }



  /* REVEAL */
  .ap-reveal {
    width: 100%; max-width: 900px;
    margin: 0 auto; padding: 60px 24px 100px;
    opacity: 0; transform: translateY(50px);
    transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
  }
  .ap-reveal.visible { opacity: 1; transform: translateY(0); }

  .ap-page-top { text-align: center; margin-bottom: 80px; }
  .ap-page-tag {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(255,255,255,0.65); margin-bottom: 16px; display: block;
  }
  .ap-page-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 9vw, 84px);
    font-weight: 300; font-style: italic;
    color: #fff;
    line-height: 1;
    text-shadow: 0 2px 24px rgba(0,0,0,0.5);
  }
  .ap-page-hearts { display: block; font-size: 22px; letter-spacing: 8px; margin-top: 18px; }

  /* SCRAPBOOK */
  .ap-scrapbook {
    display: flex; flex-direction: column;
    align-items: center; gap: 48px; margin-bottom: 72px;
    position: relative;
  }

  /* ── staggered entrance ── */
  .ap-pol-wrap {
    display: flex; width: 100%;
    opacity: 0;
    transform: translateY(60px);
    transition: opacity 1.1s cubic-bezier(0.23,1,0.32,1),
                transform 1.1s cubic-bezier(0.23,1,0.32,1);
  }
  .ap-pol-wrap.entered {
    opacity: 1;
    transform: translateY(0);
  }
  .ap-pol-wrap.left   { justify-content: flex-start; padding-left: 5%; }
  .ap-pol-wrap.right  { justify-content: flex-end;   padding-right: 5%; }
  .ap-pol-wrap.center { justify-content: center; }

  /* FLIP CARD */
  .ap-flip-card {
    width: 260px; flex-shrink: 0;
    perspective: 1000px; cursor: pointer;
  }

  .ap-pol-wrap:nth-child(1) .ap-flip-inner { transform: rotate(-4deg); }
  .ap-pol-wrap:nth-child(2) .ap-flip-inner { transform: rotate(3.5deg); }
  .ap-pol-wrap:nth-child(3) .ap-flip-inner { transform: rotate(-2.5deg); }
  .ap-pol-wrap:nth-child(4) .ap-flip-inner { transform: rotate(4deg); }
  .ap-pol-wrap:nth-child(5) .ap-flip-inner { transform: rotate(-3deg); }
  .ap-pol-wrap:nth-child(6) .ap-flip-inner { transform: rotate(2.8deg); }

  .ap-pol-wrap:nth-child(1) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(-4deg)  rotateY(180deg); }
  .ap-pol-wrap:nth-child(2) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(3.5deg) rotateY(180deg); }
  .ap-pol-wrap:nth-child(3) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(-2.5deg) rotateY(180deg); }
  .ap-pol-wrap:nth-child(4) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(4deg)   rotateY(180deg); }
  .ap-pol-wrap:nth-child(5) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(-3deg)  rotateY(180deg); }
  .ap-pol-wrap:nth-child(6) .ap-flip-card.flipped .ap-flip-inner { transform: rotate(2.8deg) rotateY(180deg); }

  .ap-flip-inner {
    position: relative; width: 100%; height: 342px;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 10px 28px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05);
  }

  .ap-polaroid {
    position: absolute; inset: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    background: #fff;
    padding: 18px 18px 64px 18px; box-sizing: border-box;
  }

  .ap-pol-wrap:nth-child(1) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(-1deg) scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }
  .ap-pol-wrap:nth-child(2) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(1deg)  scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }
  .ap-pol-wrap:nth-child(3) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(-1deg) scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }
  .ap-pol-wrap:nth-child(4) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(1deg)  scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }
  .ap-pol-wrap:nth-child(5) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(-1deg) scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }
  .ap-pol-wrap:nth-child(6) .ap-flip-card:not(.flipped):hover .ap-flip-inner { transform: rotate(1deg)  scale(1.04); box-shadow: 0 20px 48px rgba(0,0,0,0.18); z-index: 10; }

  .ap-tape {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    width: 68px; height: 26px; border-radius: 3px; z-index: 10; opacity: 0.75;
  }
  .ap-pol-wrap:nth-child(1) .ap-tape { background: rgba(242,196,206,0.9);  transform: translateX(-50%) rotate(-2deg); }
  .ap-pol-wrap:nth-child(2) .ap-tape { background: rgba(216,207,240,0.9);  transform: translateX(-50%) rotate(3deg);  }
  .ap-pol-wrap:nth-child(3) .ap-tape { background: rgba(194,232,216,0.9);  transform: translateX(-50%) rotate(-3deg); }
  .ap-pol-wrap:nth-child(4) .ap-tape { background: rgba(250,212,187,0.95); transform: translateX(-50%) rotate(2deg);  }
  .ap-pol-wrap:nth-child(5) .ap-tape { background: rgba(242,196,206,0.85); transform: translateX(-50%) rotate(-2deg); }
  .ap-pol-wrap:nth-child(6) .ap-tape { background: rgba(216,207,240,0.85); transform: translateX(-50%) rotate(3deg);  }

  .ap-photo-area {
    width: 100%; aspect-ratio: 1 / 1; overflow: hidden; display: block;
    background: linear-gradient(135deg, #f5e8ee 0%, #e8eaf6 50%, #e3f2fd 100%);
    position: relative;
  }
  .ap-photo-area img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .ap-pol-caption {
    position: absolute; bottom: 0; left: 0; right: 0; height: 64px;
    display: flex; align-items: center; justify-content: center; padding: 0 12px;
  }
  .ap-pol-caption span {
    font-family: 'Caveat', cursive;
    font-size: 17px; color: #6a4a58; text-align: center; line-height: 1.3;
  }

  /* ── BACK FACE ── */
  .ap-polaroid-back {
    position: absolute; inset: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    transform: rotateY(180deg);
    overflow: hidden; border-radius: 2px;
    background: #1c1218;
  }

  .ap-back-photo {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.08) brightness(0.55);
    display: block;
  }

  .ap-back-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.28) 55%,
      rgba(0,0,0,0.10) 100%
    );
    z-index: 1;
  }

  .ap-back-top-stripe {
    position: absolute; top: 0; left: 0; right: 0;
    height: 38px;
    background: rgba(0,0,0,0.45);
    z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-back-top-stripe span {
    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    font-family: 'DM Sans', sans-serif;
  }

  .ap-back-caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 22px 18px 22px; z-index: 3; text-align: center;
  }
  .ap-back-caption .ap-back-emoji {
    font-size: 28px; display: block; margin-bottom: 8px;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6));
  }
  .ap-back-caption span.ap-back-text {
    font-family: 'Caveat', cursive;
    font-size: 20px;
    color: rgba(255,255,255,0.94);
    text-shadow: 0 1px 8px rgba(0,0,0,0.7);
    line-height: 1.4; display: block;
  }

  .ap-back-hint {
    position: absolute; top: 46px; right: 12px;
    font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.32); z-index: 3;
  }

  /* HEARTFELT MESSAGE */
  .ap-heart-msg {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 32px; padding: 64px 56px;
    border: 1px solid rgba(255,255,255,0.2);
    text-align: center; position: relative; overflow: hidden;
  }
  .ap-hm-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(circle at 10% 20%, rgba(242,196,206,0.10) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(216,207,240,0.12) 0%, transparent 50%);
  }
  .ap-hm-corner { position: absolute; font-size: 30px; opacity: 0.4; }
  .ap-hm-corner.tl { top: 22px;    left: 26px;  transform: rotate(-15deg); }
  .ap-hm-corner.tr { top: 22px;    right: 26px; transform: rotate(15deg);  }
  .ap-hm-corner.bl { bottom: 22px; left: 26px;  transform: rotate(15deg);  }
  .ap-hm-corner.br { bottom: 22px; right: 26px; transform: rotate(-15deg); }
  .ap-hm-eyebrow {
    font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(255,255,255,0.55); margin-bottom: 36px; display: block; position: relative; z-index: 1;
  }
  .ap-hm-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 3.2vw, 30px);
    font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.92);
    line-height: 1.9; position: relative; z-index: 1;
    text-shadow: 0 1px 12px rgba(0,0,0,0.4);
  }
  .ap-hm-text::before {
    content: '\u201C'; font-family: 'Cormorant Garamond', serif;
    font-size: 88px; line-height: 0; vertical-align: -34px;
    color: rgba(242,196,206,0.7); margin-right: 2px;
  }
  .ap-hm-text::after {
    content: '\u201D'; font-family: 'Cormorant Garamond', serif;
    font-size: 88px; line-height: 0; vertical-align: -34px;
    color: rgba(242,196,206,0.7); margin-left: 2px;
  }
  .ap-hm-sign {
    margin-top: 36px; font-family: 'Caveat', cursive;
    font-size: 24px; color: #f2c4ce; position: relative; z-index: 1;
  }
  .ap-hm-hearts {
    display: block; font-size: 18px; margin-top: 14px;
    letter-spacing: 6px; opacity: 0.65; position: relative; z-index: 1;
  }



  @media (max-width: 640px) {
    .ap-pol-wrap.left  { padding-left: 2%; }
    .ap-pol-wrap.right { padding-right: 2%; }
    .ap-flip-card { width: 210px; }
    .ap-flip-inner { height: 292px; }
    .ap-polaroid { padding: 14px 14px 56px; }
    .ap-heart-msg { padding: 44px 24px; }
  }
  @media (max-width: 420px) {
    .ap-flip-card { width: 180px; }
    .ap-flip-inner { height: 256px; }
    .ap-polaroid { padding: 12px 12px 52px; }
    .ap-pol-wrap.left  { padding-left: 0; }
    .ap-pol-wrap.right { padding-right: 0; }
  }
`;

const PHOTOS = [
  { side: "left",  caption: "our favourite memory ✨", backCaption: "always & forever",   backEmoji: "🤍" },
  { side: "right", caption: "us being silly 💜",       backCaption: "my favourite human", backEmoji: "💜" },
  { side: "left",  caption: "the best of days 🌙",     backCaption: "golden hour with you",backEmoji: "🌙" },
  { side: "right", caption: "always laughing 🌸",      backCaption: "nothing but joy",    backEmoji: "🌸" },
  { side: "left",  caption: "golden moments 🌟",       backCaption: "cherished forever",  backEmoji: "🌟" },
  { side: "right", caption: "always & forever 🎀",     backCaption: "love you always",    backEmoji: "🎀" },
];

// ── one background photo shown after the gift opens ──
// Replace "/bg-photo.jpg" with your actual background image path
const BG_PHOTO_SRC = "/photo6.png";

const STAGGER_MS = 150;

export default function AboutPage({ onNav }) {
  const [flipped, setFlipped] = useState({});
  const [entered, setEntered] = useState({});
  const cardRefs = useRef([]);

  // ── staggered entrance via IntersectionObserver ──
  useEffect(() => {
    const timers = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              setEntered(prev => ({ ...prev, [i]: true }));
            }, i * STAGGER_MS);
            timers.push(t);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const toggleFlip = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <>
      <style>{css}</style>
      <div className="ap-root">

        {/* ── SINGLE B&W BACKGROUND PHOTO ── */}
        <div className="ap-bg-photo visible">
          <img src={BG_PHOTO_SRC} alt="" aria-hidden="true" />
        </div>

        {/* REVEAL */}
        <div className="ap-reveal visible">

            <button className="back-btn" onClick={() => onNav("home")} title="Back to home">←</button>

            <div className="ap-page-top">
              <span className="ap-page-tag">✦ &nbsp; for my favourite person &nbsp; ✦</span>
              <div className="ap-page-name">Remembering our small moments</div>
              
            </div>

            {/* ZIGZAG POLAROIDS */}
            <div className="ap-scrapbook">
              {PHOTOS.map((p, i) => (
                <div
                  key={i}
                  ref={el => cardRefs.current[i] = el}
                  className={`ap-pol-wrap ${p.side}${entered[i] ? " entered" : ""}`}
                >
                  <div
                    className={`ap-flip-card${flipped[i] ? " flipped" : ""}`}
                    onClick={() => toggleFlip(i)}
                    role="button" tabIndex={0}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggleFlip(i)}
                    title="Tap to flip"
                  >
                    <div className="ap-flip-inner">

                      {/* FRONT */}
                      <div className="ap-polaroid">
                        <div className="ap-tape" />
                        <div className="ap-photo-area">
                          <img src={`/photo${i + 1}.png`} alt="memory" />
                        </div>
                        <div className="ap-pol-caption">
                          <span>{p.caption}</span>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="ap-polaroid-back">
                        <img
                          className="ap-back-photo"
                          src={`/photo${i + 1}.png`}
                          alt=""
                        />
                        <div className="ap-back-overlay" />
                        <div className="ap-back-top-stripe">
                          <span>tap to flip back</span>
                        </div>
                        <span className="ap-back-hint">memory {i + 1}</span>
                        <div className="ap-back-caption">
                          <span className="ap-back-emoji">{p.backEmoji}</span>
                          <span className="ap-back-text">{p.backCaption}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* HEARTFELT MESSAGE */}
            <div className="ap-heart-msg">
              <div className="ap-hm-bg" />
              {/* <span className="ap-hm-corner tl">🌸</span>
              <span className="ap-hm-corner tr">💜</span>
              <span className="ap-hm-corner bl">✨</span>
              <span className="ap-hm-corner br">🌙</span> */}
              <span className="ap-hm-eyebrow">✦ &nbsp; written with all my heart &nbsp; ✦</span>
              <p className="ap-hm-text">
                You are the person I call when everything is perfect and also when everything falls apart.
                You make ordinary moments feel magical, hard days feel lighter, and every memory feel
                worth keeping forever. I don&apos;t know what I&apos;d do without your laugh, your chaos,
                your warmth, and your heart. I am so endlessly lucky to have you in my life —
                and I hope today reminds you of just how deeply you are loved.
                Happy Birthday, my favourite person. 
              </p>
              <p className="ap-hm-sign">— always yours 🤍</p>
            </div>

          </div>
        </div>
    </>
  );
}

import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Pinyon+Script&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════
     GIFT BOX ANIMATION
  ══════════════════════ */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-24px); }
  }
  @keyframes sp-fly {
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0);
      opacity: 0;
    }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .wp-gift-stage {
    position: fixed; inset: 0; z-index: 200;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: linear-gradient(135deg, #f5ede0 0%, #e8d5c0 100%);
    transition: opacity 0.8s ease, transform 0.8s ease;
    pointer-events: auto;
  }
  .wp-gift-stage.hide {
    opacity: 0; transform: scale(0.92); pointer-events: none;
  }

  .wp-stage-label {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: #9a7585; margin-bottom: 52px; text-align: center;
    font-family: 'DM Sans', sans-serif;
  }

  .wp-gift-wrap {
    cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; outline: none;
  }

  .wp-gift-box {
    width: 280px; height: 280px; position: relative;
    animation: float 3.2s ease-in-out infinite;
    filter: drop-shadow(0 28px 44px rgba(242,196,206,0.6));
  }

  .wp-gb-body {
    position: absolute; bottom: 0; left: 0;
    width: 280px; height: 189px; border-radius: 18px;
    background: linear-gradient(145deg, #f5ccd4, #eaa8be, #d890aa);
    box-shadow: inset 0 -6px 20px rgba(0,0,0,0.08), inset 0 4px 12px rgba(255,255,255,0.28);
  }

  .wp-gb-ribbon-v {
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 32px; height: 189px;
    background: linear-gradient(180deg, #c8bcec, #a898d8);
    border-radius: 4px; z-index: 2;
  }

  .wp-gb-ribbon-h {
    position: absolute; bottom: 84px; left: 0;
    width: 280px; height: 22px;
    background: linear-gradient(90deg, #b8ace4, #d0c8f4, #b8ace4); z-index: 3;
  }

  .wp-gb-shine {
    position: absolute; bottom: 93px; left: 24px;
    width: 48px; height: 94px; border-radius: 50%;
    background: rgba(255,255,255,0.18); transform: rotate(-30deg);
    z-index: 4; pointer-events: none;
  }

  .wp-gb-lid {
    position: absolute; bottom: 182px; left: -14px;
    width: 308px; height: 52px; border-radius: 14px;
    background: linear-gradient(145deg, #f8d8e0, #f0b8cc, #e098b8);
    box-shadow: inset 0 3px 10px rgba(255,255,255,0.35), 0 6px 20px rgba(242,196,206,0.4);
    transform-origin: center 0%;
    transition: transform 1.4s cubic-bezier(0.23,1,0.32,1), opacity 1s ease;
    z-index: 5;
  }

  .wp-gb-lid.opened {
    transform: perspective(600px) rotateX(-110deg) translateY(-20px);
    opacity: 0;
  }

  .wp-gb-lid-ribbon {
    position: absolute; bottom: 182px; left: 50%; transform: translateX(-50%);
    width: 32px; height: 52px;
    background: linear-gradient(180deg, #c0b4ec, #a898d8);
    z-index: 6; transition: opacity 1s ease;
  }

  .wp-gb-lid-ribbon.opened { opacity: 0; }

  .wp-gb-bow {
    position: absolute; bottom: 194px; left: 50%; transform: translateX(-50%);
    font-size: 64px; line-height: 1; z-index: 7;
    transition: transform 1.2s ease, opacity 1s ease;
    filter: drop-shadow(0 4px 8px rgba(180,130,80,0.6));
  }

  .wp-gb-bow.opened {
    transform: translateX(-50%) translateY(-50px) scale(0.4);
    opacity: 0;
  }

  .wp-gift-hint {
    margin-top: 44px; font-size: 13px; color: #9a7585;
    letter-spacing: 1px; animation: pulse 2.2s ease-in-out infinite;
    font-family: 'DM Sans', sans-serif;
  }

  .wp-sparkle {
    position: fixed; pointer-events: none; z-index: 999;
    animation: sp-fly 2s ease-out forwards; opacity: 0;
  }

  .wishes-root {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    background: #f5ede0;
    font-family: 'Cormorant Garamond', serif;
    overflow: hidden;
  }

  /* ── Back button ── */
  .back-btn {
    position: fixed; top: 24px; left: 24px; z-index: 300;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,248,240,.9); backdrop-filter: blur(10px);
    border: 1px solid rgba(180,130,90,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer; transition: all .3s;
    color: #7a4828; box-shadow: 0 3px 14px rgba(120,70,30,.12);
  }
  .back-btn:hover { background: #fff8f0; transform: scale(1.08); }

  /* ══════════════════════
     LEFT — Photo panel
  ══════════════════════ */
  .left-panel {
    width: 42%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .left-panel img.main-photo {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .left-photo-fallback {
    width: 100%; height: 100%;
    background: linear-gradient(160deg, #e8d5c0, #d4bca8, #c0a48e);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 14px;
  }
  .left-photo-fallback .ph-icon { font-size: 52px; opacity: .35; }
  .left-photo-fallback .ph-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-style: italic; color: #7a5a40; opacity: .7;
  }

  /* Soft overlay — fades right into parchment bg */
  .left-overlay {
    position: absolute; inset: 0;
    background:
      linear-gradient(to right, transparent 52%, #f5ede0 100%),
      linear-gradient(to top, rgba(80,40,15,.5) 0%, transparent 48%),
      linear-gradient(to bottom, rgba(80,40,15,.2) 0%, transparent 28%);
  }

  .left-caption {
    position: absolute; bottom: 44px; left: 38px; right: 38px;
  }
  .lc-tag {
    font-size: 9px; letter-spacing: 5px; text-transform: uppercase;
    color: rgba(255,245,235,.65); margin-bottom: 10px; display: block;
    font-family: 'DM Sans', sans-serif;
  }
  .lc-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(36px, 3.8vw, 58px);
    color: #fff8f0; line-height: 1.1;
    text-shadow: 0 2px 18px rgba(60,20,5,.45);
  }
  .lc-title em { color: #f2c4b0; font-style: normal; }
  .lc-line {
    width: 48px; height: 1px; margin-top: 16px;
    background: linear-gradient(to right, rgba(255,220,190,.55), transparent);
  }

  /* ══════════════════════
     RIGHT — Book panel
  ══════════════════════ */
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 44px 44px;
    background: #f5ede0;
    overflow-y: auto;
    position: relative;
  }

  /* Subtle floral-style radial warmth */
  .right-panel::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(220,170,120,.13) 0%, transparent 55%),
      radial-gradient(ellipse at 20% 85%, rgba(200,150,110,.1) 0%, transparent 50%);
  }

  /* Header */
  .book-header {
    text-align: center; margin-bottom: 28px; position: relative; z-index: 1;
  }
  .bh-tag {
    font-size: 9px; letter-spacing: 5px; text-transform: uppercase;
    color: rgba(140,90,55,.5); margin-bottom: 10px; display: block;
    font-family: 'DM Sans', sans-serif;
  }
  .bh-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(32px, 3.2vw, 48px);
    color: #5a2e12; line-height: 1.1;
  }
  .bh-line {
    width: 48px; height: 1px; margin: 12px auto 0;
    background: linear-gradient(to right, transparent, rgba(140,80,40,.35), transparent);
  }
  .bh-sub {
    margin-top: 9px; font-size: 15px; font-weight: 300;
    color: rgba(120,75,45,.6); font-style: italic;
  }

  /* ══════════════════════
     BOOK WRAP
  ══════════════════════ */
  .book-wrap {
    position: relative; z-index: 1;
    width: 100%; max-width: 500px;
  }

  /* ── Closed book ── */
  .book-closed {
    width: 100%;
    background: linear-gradient(160deg, #c49a6c 0%, #a87848 50%, #8a5e30 100%);
    border-radius: 3px 16px 16px 3px;
    box-shadow:
      -5px 0 0 #6a3e18,
      -9px 0 0 #4e2c10,
      0 20px 55px rgba(100,55,20,.28),
      0 8px 18px rgba(100,55,20,.18),
      inset 0 1px 0 rgba(255,255,255,.1),
      inset 0 -1px 0 rgba(0,0,0,.15);
    padding: 48px 40px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 18px;
    cursor: pointer;
    transition: transform .45s cubic-bezier(.22,.68,0,1.15), box-shadow .45s;
    min-height: 260px;
    position: relative; overflow: hidden;
  }
  /* Leather grain */
  .book-closed::before {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      transparent, transparent 3px,
      rgba(0,0,0,.025) 3px, rgba(0,0,0,.025) 6px
    );
    pointer-events: none;
  }
  /* Spine highlight */
  .book-closed::after {
    content: '';
    position: absolute; left: 20px; top: 14px; bottom: 14px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,.15) 30%, rgba(255,255,255,.15) 70%, transparent);
  }
  .book-closed:hover {
    transform: translateY(-8px) rotate(-1deg);
    box-shadow:
      -5px 0 0 #6a3e18,
      -9px 0 0 #4e2c10,
      0 36px 70px rgba(100,55,20,.35),
      0 14px 28px rgba(100,55,20,.22),
      inset 0 1px 0 rgba(255,255,255,.1);
  }

  .bc-ornament {
    font-size: 16px; color: rgba(255,240,210,.4); letter-spacing: 8px;
    position: relative; z-index: 1;
  }
  .bc-deco {
    width: 60px; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,240,210,.35), transparent);
    position: relative; z-index: 1;
  }
  .bc-title {
    font-family: 'Pinyon Script', cursive;
    font-size: 44px; color: rgba(255,245,225,.9);
    text-align: center; line-height: 1.2;
    text-shadow: 0 2px 12px rgba(0,0,0,.25);
    position: relative; z-index: 1;
  }
  .bc-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: rgba(255,235,200,.42); text-align: center;
    position: relative; z-index: 1;
  }
  .bc-hint {
    display: flex; align-items: center; gap: 8px; margin-top: 4px;
    font-size: 13px; color: rgba(255,235,200,.35); font-style: italic;
    position: relative; z-index: 1;
  }
  .bc-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,210,170,.5);
    animation: bpulse 2.2s ease-in-out infinite;
  }
  @keyframes bpulse { 0%,100%{opacity:1;} 50%{opacity:.1;} }

  /* ── Open book ── */
  .book-open {
    width: 100%;
    border-radius: 3px 16px 16px 3px;
    box-shadow:
      -5px 0 0 #6a3e18,
      -9px 0 0 #4e2c10,
      0 20px 55px rgba(100,55,20,.22),
      0 8px 18px rgba(100,55,20,.14);
    animation: bookOpen .5s cubic-bezier(.22,.68,0,1.15) both;
    overflow: hidden;
  }
  @keyframes bookOpen {
    from { opacity:0; transform:perspective(900px) rotateY(-22deg) scaleX(.45); transform-origin:left center; }
    to   { opacity:1; transform:perspective(900px) rotateY(0deg) scaleX(1); }
  }

  /* Book top bar */
  .book-bar {
    background: linear-gradient(135deg, #b8845a 0%, #9a6840 100%);
    padding: 16px 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(160,100,50,.25);
    position: relative;
  }
  .book-bar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,225,180,.3), transparent);
  }
  .book-bar-title {
    font-family: 'Pinyon Script', cursive;
    font-size: 24px; color: rgba(255,245,225,.9);
    text-shadow: 0 1px 6px rgba(0,0,0,.2);
  }
  .book-bar-right { display: flex; align-items: center; gap: 10px; }
  .page-pill {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,235,200,.6); background: rgba(0,0,0,.12);
    padding: 4px 12px; border-radius: 999px;
    border: 1px solid rgba(255,200,140,.18);
  }
  .close-btn {
    font-family: 'DM Sans', sans-serif;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,225,180,.25);
    border-radius: 999px; padding: 5px 14px;
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,235,205,.7); cursor: pointer; transition: all .2s;
  }
  .close-btn:hover { background: rgba(255,255,255,.2); color: rgba(255,245,225,.95); }

  /* Letter image */
  .letter-img-wrap {
    position: relative;
    width: 100%;
    background: #ede0c8;
    min-height: 520px;
    display: flex; align-items: stretch; justify-content: center;
    overflow: hidden;
  }
  /* Warm parchment tint */
  .letter-img-wrap::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse at 8% 8%, rgba(180,120,60,.09) 0%, transparent 45%),
      radial-gradient(ellipse at 92% 92%, rgba(150,90,40,.08) 0%, transparent 45%);
  }
  /* Spine shadow */
  .letter-img-wrap::after {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 20px; z-index: 2; pointer-events: none;
    background: linear-gradient(to right, rgba(80,40,10,.12), transparent);
  }

  .letter-img {
    width: 100%; height: auto;
    object-fit: cover; display: block;
    position: relative; z-index: 1;
    min-height: 500px;
    max-height: 620px;
    animation: pageFlip .35s ease both;
  }
  @keyframes pageFlip {
    from { opacity: 0; transform: translateX(20px) scale(.98); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }

  .letter-img-fallback {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px; padding: 56px 28px;
    position: relative; z-index: 1;
  }
  .lif-ornament { font-size: 36px; opacity: .3; }
  .lif-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-style: italic; color: #8b6a44;
    text-align: center; line-height: 1.8; opacity: .8;
  }

  /* Navigation bar — warm parchment */
  .book-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px;
    background: linear-gradient(to bottom, #e8d8be, #deccaa);
    border-top: 1px solid rgba(160,110,60,.18);
  }
  .nav-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(140,80,30,.08); border: 1px solid rgba(140,80,30,.2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6a3e1a; font-size: 16px;
    transition: all .2s; flex-shrink: 0; font-family: serif;
  }
  .nav-btn:hover:not(:disabled) {
    background: rgba(140,80,30,.16); border-color: rgba(140,80,30,.38);
    transform: scale(1.1);
  }
  .nav-btn:disabled { opacity: .22; cursor: default; }

  .nav-center { text-align: center; }
  .nav-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-style: italic; color: #6a3e1a; opacity: .75;
  }
  .nav-dots {
    display: flex; gap: 5px; justify-content: center; margin-top: 6px;
    flex-wrap: wrap; max-width: 160px;
  }
  .nav-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(120,70,25,.2); cursor: pointer;
    transition: all .2s; border: none; padding: 0;
    flex-shrink: 0;
  }
  .nav-dot.active {
    background: #8a4e22; transform: scale(1.4);
  }
  .nav-dot:hover { background: rgba(120,70,25,.4); }

  /* Footer ornament */
  .book-footer {
    background: linear-gradient(to bottom, #deccaa, #d0be98);
    padding: 10px 28px 14px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    border-top: 1px solid rgba(160,110,60,.14);
  }
  .footer-line {
    flex: 1; height: 1px;
    background: linear-gradient(to right, transparent, rgba(130,80,35,.2), transparent);
  }
  .footer-ornament {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; color: rgba(100,60,25,.4); letter-spacing: 5px;
    font-style: italic;
  }

  /* ══════════════════════
     MOBILE
  ══════════════════════ */
  @media(max-width:768px) {
    .wishes-root { flex-direction: column; overflow: auto; min-height: 100vh; }
    .left-panel { width: 100%; height: 58vw; min-height: 210px; max-height: 320px; flex-shrink: 0; }
    .left-overlay {
      background:
        linear-gradient(to bottom, rgba(60,25,5,.25) 0%, transparent 30%),
        linear-gradient(to top, rgba(60,25,5,.65) 0%, transparent 50%);
    }
    .right-panel { padding: 28px 16px 48px; justify-content: flex-start; }
    .book-wrap { max-width: 100%; }
    .letter-img-wrap { min-height: 300px; }
    .letter-img { max-height: 420px; }
    .book-bar { padding: 12px 16px; }
    .book-nav { padding: 12px 18px; }
    .book-footer { padding: 8px 18px 12px; }
    .back-btn { top: 12px; left: 12px; }
  }
`;

const TOTAL = 21;
const LETTERS = Array.from({ length: TOTAL }, (_, i) => ({
  n: i + 1,
  src: `/letter${i + 1}.png`,
}));

export default function WishesPage({ onNav }) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [giftHiding, setGiftHiding] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [showBook, setShowBook] = useState(false);
  
  const [bookOpen, setBookOpen] = useState(false);
  const [idx,      setIdx]      = useState(0);
  const [imgErr,   setImgErr]   = useState({});

  const letter = LETTERS[idx];

  const goNext = () => setIdx(i => Math.min(TOTAL - 1, i + 1));
  const goPrev = () => setIdx(i => Math.max(0, i - 1));

  const openGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);

    const emojis = ["✨","🌸","💜","⭐","🎀","🌟","💖","🦋","🎊","🌺"];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setSparkles(
      Array.from({ length: 38 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 100 + Math.random() * 280;
        return {
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          x: cx, y: cy,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          rot: (Math.random() - 0.5) * 360,
          size: 16 + Math.random() * 22,
          delay: i * 36,
        };
      })
    );
    setTimeout(() => setSparkles([]), 2800);
    setTimeout(() => setGiftHiding(true), 800);
    setTimeout(() => setShowBook(true), 1500);
  };

  return (
    <>
      <style>{css}</style>

      {/* SPARKLES */}
      {sparkles.map(s => (
        <span key={s.id} className="wp-sparkle" style={{
          left: s.x, top: s.y, fontSize: s.size,
          animationDelay: `${s.delay}ms`,
          "--tx": `${s.tx}px`,
          "--ty": `${s.ty}px`,
          "--rot": `${s.rot}deg`,
        }}>{s.emoji}</span>
      ))}

      {/* GIFT STAGE */}
      {!showBook && (
        <div className={`wp-gift-stage${giftHiding ? " hide" : ""}`}>
          <p className="wp-stage-label">✦ &nbsp; a special gift for you &nbsp; ✦</p>
          <div
            className="wp-gift-wrap"
            onClick={openGift}
            role="button" tabIndex={0}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && openGift()}
          >
            <div className="wp-gift-box">
              <div className="wp-gb-body" />
              <div className="wp-gb-shine" />
              <div className="wp-gb-ribbon-v" />
              <div className="wp-gb-ribbon-h" />
              <div className={`wp-gb-lid${giftOpened ? " opened" : ""}`} />
              <div className={`wp-gb-lid-ribbon${giftOpened ? " opened" : ""}`} />
              <div className={`wp-gb-bow${giftOpened ? " opened" : ""}`}>🎀</div>
            </div>
          </div>
          <p className="wp-gift-hint">✨ &nbsp; tap the gift to open &nbsp; ✨</p>
        </div>
      )}

      <button className="back-btn" onClick={() => onNav && onNav("home")} title="Back">←</button>

      <div className="wishes-root" style={{ display: showBook ? "flex" : "none" }}>

        {/* ── LEFT: Photo ── */}
        <div className="left-panel">
          <img
            className="main-photo"
            src="/photo-main.jpeg"
            alt="Her"
            onError={e => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
          <div className="left-photo-fallback" style={{ display:"none" }}>
            <div className="ph-icon">🌸</div>
            <div className="ph-text">Add photo-main.jpeg to /public</div>
          </div>
          <div className="left-overlay" />
          <div className="left-caption">
            <span className="lc-tag">✦ for her ✦</span>
            <div className="lc-title">Happy Birthday<br/><em>My Love</em></div>
            <div className="lc-line" />
          </div>
        </div>

        {/* ── RIGHT: Book ── */}
        <div className="right-panel">
          <div className="book-header">
            <span className="bh-tag">✦ written with love ✦</span>
            <div className="bh-title">21 Letters for You on your 21st Birthday</div>
            <div className="bh-line" />
            <div className="bh-sub">Each one from the heart — click the book to open</div>
          </div>

          <div className="book-wrap">

            {!bookOpen ? (
              <div className="book-closed" onClick={() => { setBookOpen(true); setIdx(0); }}>
                <div className="bc-ornament">✦ ✦ ✦</div>
                <div className="bc-deco" />
                <div className="bc-title">Letters for You</div>
                <div className="bc-deco" />
                <div className="bc-sub">21 letters · written with love</div>
                <div className="bc-hint">
                  <div className="bc-dot" />
                  Click to open
                </div>
              </div>
            ) : (
              <div className="book-open">

                <div className="book-bar">
                  <div className="book-bar-title">Letters for You</div>
                  <div className="book-bar-right">
                    <div className="page-pill">{idx + 1} of {TOTAL}</div>
                    <button className="close-btn" onClick={() => setBookOpen(false)}>Close</button>
                  </div>
                </div>

                <div className="letter-img-wrap">
                  {!imgErr[idx] ? (
                    <img
                      key={idx}
                      className="letter-img"
                      src={letter.src}
                      alt={`Letter ${letter.n}`}
                      onError={() => setImgErr(e => ({ ...e, [idx]: true }))}
                    />
                  ) : (
                    <div className="letter-img-fallback">
                      <div className="lif-ornament">💌</div>
                      <div className="lif-text">
                        Letter {letter.n}<br/>
                        <span style={{ fontSize:"13px", opacity:.6 }}>
                          Add letter{letter.n}.png to /public
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="book-nav">
                  <button className="nav-btn" onClick={goPrev} disabled={idx === 0}>←</button>
                  <div className="nav-center">
                    <div className="nav-label">{idx + 1} of {TOTAL}</div>
                    <div className="nav-dots">
                      {LETTERS.map((_, i) => (
                        <button
                          key={i}
                          className={`nav-dot${i === idx ? " active" : ""}`}
                          onClick={() => setIdx(i)}
                          title={`Letter ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <button className="nav-btn" onClick={goNext} disabled={idx === TOTAL - 1}>→</button>
                </div>

                <div className="book-footer">
                  <div className="footer-line" />
                  <div className="footer-ornament">✦ ✦ ✦</div>
                  <div className="footer-line" />
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </>
  );
}
import { useEffect, useState, useRef } from "react";

const css = `
/* ─── BASE ─── */
.home {
  min-height:100vh; position:relative; overflow:hidden;
  display:flex; flex-direction:column; align-items:center;
}
.home-bg {
  position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 65% 50% at 12% 12%, rgba(216,207,240,.55) 0%, transparent 65%),
    radial-gradient(ellipse 55% 45% at 88% 85%, rgba(242,196,206,.55) 0%, transparent 65%),
    radial-gradient(ellipse 45% 35% at 50% 55%, rgba(194,232,216,.25) 0%, transparent 60%),
    var(--cream, #fff9f5);
}
.home-orb {
  position:fixed; border-radius:50%; pointer-events:none;
  filter:blur(1px); animation:rise linear infinite;
}
@keyframes rise {
  0%   { transform:translateY(0) scale(1); opacity:.5; }
  50%  { opacity:.25; }
  100% { transform:translateY(-110vh) scale(1.2); opacity:0; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ─── HERO ─── */
.hero-slideshow {
  position:relative; z-index:1;
  width:100%; height:100vh; overflow:hidden;
}
.hero-slide {
  position:absolute; inset:0;
  opacity:0; transition:opacity 1.4s ease;
}
.hero-slide.active { opacity:1; }
.hero-slide img {
  width:100%; height:100%;
  object-fit:cover; object-position:center top; display:block;
}
.slide-dots {
  position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
  display:flex; gap:10px; z-index:4;
}
.slide-dot {
  width:7px; height:7px; border-radius:50%;
  background:rgba(255,255,255,.4); border:none; cursor:pointer;
  transition:all .4s; padding:0;
}
.slide-dot.active { background:#fff; transform:scale(1.25); }
.hero-overlay {
  position:absolute; inset:0; z-index:2;
  background:linear-gradient(to bottom,
    rgba(0,0,0,.08) 0%, rgba(0,0,0,.22) 35%,
    rgba(0,0,0,.42) 70%, rgba(0,0,0,.58) 100%);
}
.hero-content {
  position:absolute; inset:0; z-index:3;
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; text-align:center;
  padding:0 20px; padding-top:70px;
}
.home-eyebrow {
  display:flex; align-items:center; gap:12px;
  font-size:10px; letter-spacing:4px; text-transform:uppercase;
  color:rgba(255,255,255,.75); margin-bottom:22px;
  animation:fadeUp .7s ease both;
}
.home-line { width:36px; height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,.6)); }
.home-line.r { background:linear-gradient(to left,transparent,rgba(255,255,255,.6)); }
.home-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(48px,10vw,128px); font-weight:300; line-height:.95;
  color:#fff; animation:fadeUp .8s .1s ease both;
  text-shadow:0 4px 32px rgba(0,0,0,.25);
}
.home-title em {
  font-style:italic; display:block;
  color:rgba(242,196,206,1);
  text-shadow:0 4px 32px rgba(0,0,0,.3);
}
.home-sub {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(16px,3vw,26px); font-style:italic; font-weight:300;
  color:rgba(255,255,255,.82); margin:18px 0 0;
  animation:fadeUp .8s .2s ease both;
  text-shadow:0 2px 12px rgba(0,0,0,.3);
}
.home-divider {
  display:flex; gap:10px; align-items:center;
  margin:18px 0; font-size:16px; opacity:.85;
  animation:fadeUp .8s .3s ease both;
}
.home-msg {
  max-width:480px; font-size:14px; font-weight:300; line-height:2;
  color:rgba(255,255,255,.78); margin-bottom:36px;
  animation:fadeUp .8s .35s ease both;
  text-shadow:0 1px 8px rgba(0,0,0,.3);
  padding:0 8px;
}

/* ─── CARDS GRID ─── */
.home-cards {
  position:relative; z-index:1;
  display:grid; grid-template-columns:repeat(3,1fr); gap:18px;
  max-width:980px; width:100%; padding:52px 20px 90px; margin:0 auto;
  animation:fadeUp .8s .55s ease both;
  box-sizing:border-box;
}
.home-card {
  background:rgba(255,255,255,.74); backdrop-filter:blur(12px);
  border:1px solid rgba(242,196,206,.4); border-radius:22px;
  padding:24px 18px 20px; text-align:center; cursor:pointer;
  transition:transform .3s, box-shadow .3s, background .3s;
  overflow:visible;
  box-sizing:border-box;
}
.home-card:hover {
  transform:translateY(-6px);
  box-shadow:0 20px 48px rgba(176,96,122,.14);
  background:rgba(255,255,255,.94);
}
.hc-title {
  font-family:'Cormorant Garamond',serif;
  font-size:21px; font-weight:400; color:var(--text,#2d1a3a); margin-bottom:6px;
}
.hc-desc  { font-size:12.5px; font-weight:300; color:var(--soft,#9e7c8a); line-height:1.7; }
.hc-link  {
  display:inline-block; margin-top:10px;
  font-size:10.5px; letter-spacing:2px; text-transform:uppercase;
  color:var(--accent,#b06070); font-weight:500;
}

/* ─── CARD 1 — GALLERY ─── */
.cam-scene {
  position:relative; height:215px;
  display:flex; align-items:center; justify-content:center;
}
.cam-img-wrap {
  position:relative; cursor:pointer;
  animation:camFloat 3s ease-in-out infinite;
  display:inline-block;
}
@keyframes camFloat {
  0%,100% { transform:translateY(0) rotate(-2deg); }
  50%      { transform:translateY(-9px) rotate(2deg); }
}
.cam-img-wrap.snap { animation:camSnap .45s ease forwards; }
@keyframes camSnap {
  0%   { transform:translateY(0) rotate(-2deg) scale(1); }
  30%  { transform:translateY(-16px) rotate(0deg) scale(1.08); }
  60%  { transform:translateY(3px) rotate(1deg) scale(.97); }
  100% { transform:translateY(0) rotate(0deg) scale(1); }
}
.cam-click-btn {
  position:absolute; bottom:-32px; left:50%; transform:translateX(-50%);
  border:none; background:#f8d0df; color:#9e466f;
  padding:8px 14px; border-radius:999px;
  font-size:11px; letter-spacing:1.2px; text-transform:uppercase;
  cursor:pointer; box-shadow:0 10px 20px rgba(186,94,124,.16);
  transition:transform .2s, background .2s;
}
.cam-click-btn:hover { transform:translateX(-50%) translateY(-2px); background:#f6b7d1; }
.cam-flash-overlay {
  position:fixed; inset:0; z-index:9999;
  background:#fff; opacity:0; pointer-events:none;
}
.cam-flash-overlay.flash { animation:whiteFlash .55s ease forwards; }
@keyframes whiteFlash {
  0%  { opacity:0; }
  18% { opacity:.9; }
  100%{ opacity:0; }
}
.polaroid-strip {
  position:absolute; bottom:-12px; left:50%;
  transform:translateX(-50%) translateY(20px) scaleY(0.4);
  transform-origin:top center;
  opacity:0; pointer-events:none;
  transition:all .55s cubic-bezier(.22,1,.36,1);
  background:#fff; padding:10px 10px 28px;
  box-shadow:0 10px 32px rgba(0,0,0,.22);
  border-radius:3px; width:126px; z-index:10;
}
.polaroid-strip.show {
  opacity:1; pointer-events:all;
  transform:translateX(-50%) translateY(0) scaleY(1);
}
.polaroid-inner { width:106px; height:98px; border-radius:2px; overflow:hidden; }
.polaroid-see-btn {
  display:block; width:100%;
  font-size:9px; letter-spacing:1.5px; text-transform:uppercase;
  color:#b06070; font-weight:700; background:none; border:none;
  cursor:pointer; text-align:center; padding-top:7px;
}
.shutter-ring {
  position:absolute; border-radius:50%;
  border:2px solid #f4b8cc; opacity:0; pointer-events:none;
}
.shutter-ring.pop { animation:shutterRing .5s ease forwards; }
@keyframes shutterRing {
  0%   { transform:scale(.5); opacity:.8; }
  100% { transform:scale(2.6); opacity:0; }
}

/* ─── CARD 2 — ABOUT HER ─── */
.about-photo-card { padding:0 !important; overflow:hidden; border-radius:22px; }
.about-photo-wrap {
  width:100%; aspect-ratio:3/4; position:relative;
  background:linear-gradient(160deg,#f9e4ea,#d8cff0);
  display:flex; align-items:center; justify-content:center;
  font-size:52px; overflow:hidden; border-radius:22px;
}
.about-photo-wrap img {
  width:100%; height:100%; object-fit:cover; object-position:top; display:block;
  animation:photoBreath 5s ease-in-out infinite;
}
.about-photo-emoji { animation:photoBreath 5s ease-in-out infinite; }
@keyframes photoBreath {
  0%,100% { transform:scale(1); }
  50%      { transform:scale(1.045); }
}
.about-overlay {
  position:absolute; bottom:0; left:0; right:0;
  background:rgba(44,26,34,.55); padding:14px;
  display:flex; flex-direction:column; align-items:center; gap:8px;
}
.about-overlay-title {
  font-family:'Cormorant Garamond',serif;
  font-size:18px; color:#fff; font-weight:300;
}
.about-overlay-btn {
  font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
  color:#fff; border:1px solid rgba(255,255,255,.65);
  background:transparent; border-radius:20px;
  padding:5px 16px; cursor:pointer; transition:all .3s;
}
.about-overlay-btn:hover { background:rgba(255,255,255,.18); }
.about-hearts { position:absolute; top:12px; right:12px; display:flex; flex-direction:column; gap:0; }
.ah { font-size:13px; opacity:0; animation:heartUp 3s ease-in-out infinite; }
.ah:nth-child(1){ animation-delay:0s; }
.ah:nth-child(2){ animation-delay:1s; }
.ah:nth-child(3){ animation-delay:2s; }
@keyframes heartUp {
  0%  { opacity:0; transform:translateY(0) scale(.7); }
  20% { opacity:1; }
  80% { opacity:.4; transform:translateY(-36px) scale(1.1); }
  100%{ opacity:0; transform:translateY(-52px); }
}

/* ─── CARD 3 — TEDDY (UPDATED FOR FULL LENGTH) ─── */
.doll-scene {
  position:relative; 
  height:260px; /* Increased to fill card */
  display:flex; 
  align-items:flex-end; 
  justify-content:center;
  padding-bottom:10px;
  padding-top:26px;
  overflow:visible;
}
.doll-wrap {
  position:relative;
  display:inline-block;
  width: 100%;
  text-align: center;
}
.teddy-banner {
  position:absolute; top:-18px; left:50%;
  transform:translateX(-50%);
  white-space:nowrap;
  background:#fce4ec; border:2px solid #f4b8cc;
  border-radius:10px; padding:5px 14px;
  font-size:12px; color:#7a2050; font-weight:700; letter-spacing:.8px;
  box-shadow:0 4px 18px rgba(220,100,160,.28);
  animation:bannerBounce 2.5s ease-in-out infinite;
  z-index:10;
}
@keyframes bannerBounce {
  0%,100% { transform:translateX(-50%) translateY(0) rotate(-2deg); }
  50%      { transform:translateX(-50%) translateY(-8px) rotate(2deg); }
}
.t-spark {
  position:absolute; font-size:13px; opacity:0;
  animation:sparkPop 2s ease-in-out infinite;
  pointer-events:none; z-index:4;
}
.t-spark:nth-child(2){ top:-18px; left:-12px;  animation-delay:0s; }
.t-spark:nth-child(3){ top:-18px; right:-12px; animation-delay:.65s; }
.t-spark:nth-child(4){ top:6px;    right:-26px; animation-delay:1.3s; }
@keyframes sparkPop {
  0%,100%{ opacity:0; transform:scale(.4) rotate(0deg); }
  50%    { opacity:1; transform:scale(1.3) rotate(25deg); }
}

/* ─── RESPONSIVE ─── */
@media (max-width:900px) {
  .home-cards { gap:14px; padding:44px 16px 80px; }
}
@media (max-width:700px) {
  .hero-slideshow  { height:75vh; min-height:480px; }
  .hero-slide img  { object-position:center center; }
  .hero-content    { padding-top:50px; }
  .home-title      { font-size:clamp(36px,11vw,64px); }
  .home-sub        { font-size:15px; }
  .home-msg        { font-size:13px; max-width:96%; padding:0 4px; }
  .home-divider    { font-size:14px; margin:12px 0; }
  .home-eyebrow    { font-size:9px; letter-spacing:3px; }
  .home-cards {
    grid-template-columns: 1fr 1fr;
    gap:12px; padding:32px 14px 70px;
  }
  .home-card.about-photo-card { grid-column: 1 / -1; }
  .hc-title   { font-size:19px; }
  .hc-desc    { font-size:12px; }
  .cam-scene  { height:190px; }
  .doll-scene { height:220px; padding-top:36px; }
  .teddy-banner { z-index:5; }
  .home-card  { padding:18px 14px 16px; border-radius:18px; }
}
@media (max-width:420px) {
  .hero-slideshow { height:68vh; min-height:400px; }
  .home-title     { font-size:clamp(30px,12vw,54px); }
  .home-msg       { display:none; }
  .home-divider   { margin:10px 0; }
  .home-cards {
    grid-template-columns: 1fr;
    gap:12px; padding:26px 12px 60px;
  }
  .home-card.about-photo-card { grid-column: auto; }
  .cam-scene  { height:215px; }
  .doll-scene { height:240px; padding-top:40px; }
  .teddy-banner { z-index:5; }
  .hc-title   { font-size:20px; }
  .home-card  { padding:20px 16px 18px; }
}
`;

const ORBS = Array.from({length:18},(_, i)=>({
  id:i, size:Math.random()*22+7, left:Math.random()*100,
  delay:Math.random()*16, dur:Math.random()*13+11,
  color:["#f2c4ce","#d8cff0","#c2e8d8","#fad4bb","#bdd9f0","#fce8ee"][i%6],
  op:Math.random()*.4+.2,
}));

const SLIDES = [
  { src:"/hero1.jpeg", bw:false,  brightness:0.72 },
  { src:"/hero2.jpeg", bw:false,  brightness:0.88 },
  { src:"/hero3.jpeg", bw:true,   brightness:0.88 },
  { src:"/hero4.jpeg", bw:false,  brightness:0.72 },
];

function InstaxCameraSVG() {
  return (
    <svg width="188" height="158" viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="28" width="114" height="72" rx="12" fill="#f06fa0"/>
      <rect x="28" y="20" width="74" height="16" rx="6" fill="#e05590"/>
      <rect x="78" y="12" width="28" height="14" rx="5" fill="#e05590"/>
      <rect x="10" y="16" width="18" height="12" rx="4" fill="#fce4ec"/>
      <rect x="12" y="18" width="14" height="8" rx="3" fill="#ffeb8a"/>
      <circle cx="52" cy="65" r="26" fill="#c8447a"/>
      <circle cx="52" cy="65" r="21" fill="#2d1a3a"/>
      <circle cx="52" cy="65" r="17" fill="none" stroke="#4a2a5a" strokeWidth="2.5"/>
      <circle cx="52" cy="65" r="12" fill="#1a0f28"/>
      <circle cx="52" cy="65" r="8"  fill="#0d0718"/>
      <ellipse cx="44" cy="57" rx="4" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 44 57)"/>
      <ellipse cx="47" cy="54" rx="1.5" ry="1" fill="rgba(255,255,255,0.55)" transform="rotate(-20 47 54)"/>
      <circle cx="98" cy="34" r="7" fill="#ff85b3"/>
      <circle cx="98" cy="34" r="5" fill="#ffc0d8"/>
      <rect x="78" y="52" width="36" height="22" rx="6" fill="#c8447a"/>
      <text x="96" y="66" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="700" fill="#fce4ec" letterSpacing="1">instax</text>
      <text x="96" y="73" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fill="#fce4ec">mini</text>
      <rect x="30" y="96" width="70" height="5" rx="2" fill="#c8447a"/>
      <rect x="38" y="97" width="54" height="3" rx="1" fill="#2d1a3a"/>
      <rect x="4"   y="48" width="8" height="18" rx="4" fill="#e05590"/>
      <rect x="118" y="48" width="8" height="18" rx="4" fill="#e05590"/>
    </svg>
  );
}

/* ── BEAR SVG ── */
function BearDollSVG() {
  return (
    <svg width="220" height="240" viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Fur Filter */}
        <filter id="plushFur">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
        {/* Balloon Gradient */}
        <radialGradient id="balloonG" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffb3c6" />
          <stop offset="100%" stopColor="#fb6f92" />
        </radialGradient>
      </defs>
      
      <style>{`
        .bear-float { animation: bearFly 4s ease-in-out infinite; }
        .balloon-sway { animation: sway 3s ease-in-out infinite; transform-origin: bottom center; }
        @keyframes bearFly { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
      `}</style>

      <g className="bear-float">
        {/* BALLOONS (Right side) */}
        <g className="balloon-sway" transform="translate(155, 10)">
           <path d="M0,80 Q-15,130 -35,160" stroke="#fbc4d2" fill="none" strokeWidth="1.2" />
           <path d="M15,85 Q25,135 5,165" stroke="#fbc4d2" fill="none" strokeWidth="1.2" />
           {/* Balloon 1 */}
           <path d="M0,45 C-25,15 -45,35 -25,60 L0,85 L25,60 C45,35 25,15 0,45" fill="url(#balloonG)" filter="url(#plushFur)" />
           {/* Balloon 2 */}
           <path d="M30,55 C15,30 0,50 15,70 L30,90 L45,70 C60,50 45,30 30,55" fill="#ff8fab" filter="url(#plushFur)" opacity="0.85" />
        </g>

        {/* LEGS */}
        <circle cx="75" cy="200" r="38" fill="#ffcad4" filter="url(#plushFur)" />
        <circle cx="145" cy="200" r="38" fill="#ffcad4" filter="url(#plushFur)" />
        <circle cx="75" cy="202" r="24" fill="#ffe5ec" opacity="0.7" />
        <circle cx="145" cy="202" r="24" fill="#ffe5ec" opacity="0.7" />

        {/* ARMS */}
        <circle cx="55" cy="140" r="32" fill="#ffcad4" filter="url(#plushFur)" />
        <circle cx="165" cy="140" r="32" fill="#ffcad4" filter="url(#plushFur)" />

        {/* BODY */}
        <circle cx="110" cy="150" r="65" fill="#ffcad4" filter="url(#plushFur)" />

        {/* HEAD */}
        <circle cx="110" cy="75" r="58" fill="#ffcad4" filter="url(#plushFur)" />

        {/* EARS */}
        <circle cx="60" cy="35" r="20" fill="#ffcad4" filter="url(#plushFur)" />
        <circle cx="160" cy="35" r="20" fill="#ffcad4" filter="url(#plushFur)" />
        <circle cx="60" cy="35" r="11" fill="#ffe5ec" />
        <circle cx="160" cy="35" r="11" fill="#ffe5ec" />

        {/* FACE */}
        <ellipse cx="110" cy="92" rx="30" ry="24" fill="#fff" filter="url(#plushFur)" />
        <circle cx="88" cy="78" r="5.5" fill="#2d1a3a" />
        <circle cx="132" cy="78" r="5.5" fill="#2d1a3a" />
        <circle cx="86" cy="76" r="1.8" fill="#fff" />
        <circle cx="130" cy="76" r="1.8" fill="#fff" />
        <path d="M102,88 Q110,80 118,88 Q118,96 110,96 Q102,96 102,88" fill="#5d4037" />
        <path d="M100,102 Q110,110 120,102" stroke="#5d4037" fill="none" strokeWidth="1.5" strokeLinecap="round" />

        {/* BOW (Matches Image) */}
        <g transform="translate(110, 115)">
           <path d="M-28,-12 L28,12 L28,-12 L-28,12 Z" fill="#ff8fab" stroke="#fb6f92" strokeWidth="1" />
           <rect x="-7" y="-7" width="14" height="14" rx="3" fill="#fb6f92" />
        </g>
      </g>
    </svg>
  );
}

export default function HomePage({ onNav }) {
  const [ready,      setReady]      = useState(false);
  const [current,    setCurrent]    = useState(0);
  const [camPopped, setCamPopped] = useState(false);
  const [snapping,  setSnapping]  = useState(false);
  const [flashing,  setFlashing]  = useState(false);
  const [ringPop,    setRingPop]    = useState(false);
  const snapRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(()=>{ setTimeout(()=>setReady(true), 60); },[]);

  useEffect(()=>{
    const t = setInterval(()=>{
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(t);
  },[]);

  useEffect(()=>{
    if (!camPopped) return;
    const close = (e) => {
      if (!e.target.closest(".cam-scene")) setCamPopped(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  },[camPopped]);

  const handleCamClick = (e) => {
    e.stopPropagation();
    setFlashing(false);
    requestAnimationFrame(()=> setFlashing(true));
    setTimeout(()=> setFlashing(false), 650);
    setSnapping(true);
    clearTimeout(snapRef.current);
    snapRef.current = setTimeout(()=> setSnapping(false), 500);
    setRingPop(false);
    clearTimeout(ringRef.current);
    requestAnimationFrame(()=> setRingPop(true));
    ringRef.current = setTimeout(()=> setRingPop(false), 600);
    setCamPopped(v => !v);
  };

  return (
    <>
      <style>{css}</style>
      <div className={`cam-flash-overlay${flashing ? " flash" : ""}`} />

      <div className="home">
        <div className="home-bg"/>

        {ready && ORBS.map(o=>(
          <div key={o.id} className="home-orb" style={{
            width:o.size, height:o.size, left:`${o.left}%`, bottom:"-60px",
            background:o.color, opacity:o.op,
            animationDuration:`${o.dur}s`, animationDelay:`${o.delay}s`,
          }}/>
        ))}

        {/* ══ HERO SLIDESHOW ══ */}
        <div className="hero-slideshow">
          {SLIDES.map((slide, i) => (
            <div key={i} className={`hero-slide${i===current?" active":""}`}>
              <img
                src={slide.src}
                alt={`Slide ${i+1}`}
                style={{
                  filter:`${slide.bw?"grayscale(100%) ":""}contrast(1.05) brightness(${slide.brightness})`,
                }}
              />
            </div>
          ))}

          <div className="hero-overlay"/>

          <div className="hero-content">
            <div className="home-eyebrow">
              <div className="home-line"/> a birthday celebration <div className="home-line r"/>
            </div>
            <h1 className="home-title">
              Happy Birthday
              <em>My Best Friend</em>
            </h1>
            <p className="home-sub">Today is entirely yours — enjoy every moment 🌙</p>
            <div className="home-divider">🌸 ✦ 💫 ✦ 🌸</div>
            <p className="home-msg">
              You are one of the most radiant, kind-hearted, genuinely wonderful people I've ever known.
              This little website is made with all the love in the world — just for you. 💜
            </p>
          </div>

          <div className="slide-dots">
            {SLIDES.map((_, i)=>(
              <button
                key={i}
                className={`slide-dot${i===current?" active":""}`}
                onClick={()=>setCurrent(i)}
              />
            ))}
          </div>
        </div>

        {/* ══ CARDS ══ */}
        <div className="home-cards">

          {/* CARD 1 — GALLERY */}
          <div className="home-card">
            <div className="cam-scene">
              <div
                className={`cam-img-wrap${snapping?" snap":""}`}
                onClick={handleCamClick}
              >
                <InstaxCameraSVG />
                <div
                  className={`shutter-ring${ringPop?" pop":""}`}
                  style={{ width:"74px", height:"74px", top:"38px", left:"30px", position:"absolute" }}
                />
                <button type="button" className="cam-click-btn" onClick={handleCamClick}>agu agu ela ra photo tistha</button>
                <div className={`polaroid-strip${camPopped?" show":""}`}>
                  <div className="polaroid-inner">
                    <img src="/polaroid.jpeg" alt="memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button
                    type="button"
                    className="polaroid-see-btn"
                    onClick={e=>{ e.preventDefault(); e.stopPropagation(); onNav("gallery"); }}
                  >
                    See more →
                  </button>
                </div>
              </div>
            </div>
            <div className="hc-title" style={{marginTop:14}}>Gallery</div>
            <div className="hc-desc">Tap the camera — a memory pops out 🎞️</div>
          </div>

          {/* CARD 2 — ABOUT HER */}
          <div
            className="home-card about-photo-card"
            onClick={()=>onNav("about")}
          >
            <div className="about-photo-wrap">
              <img src="/little.jpeg" alt="About Her" />
              <div className="about-hearts">
                <span className="ah">💗</span>
                <span className="ah">💗</span>
                <span className="ah">💗</span>
              </div>
              <div className="about-overlay">
                <div className="about-overlay-title">Something For You</div>
                <button className="about-overlay-btn">Come here <span className="ah">💗</span></button>
              </div>
            </div>
          </div>

          {/* CARD 3 — WISHES / TEDDY */}
          <div className="home-card" onClick={()=>onNav("wishes")}>
            <div className="doll-scene">
              <div className="doll-wrap">
                <div className="teddy-banner">🎉 Surprise!</div>
                <span className="t-spark">✦</span>
                <span className="t-spark">✦</span>
                <span className="t-spark">✨</span>
                <div style={{marginTop: 20}}>
                  <BearDollSVG />
                </div>
              </div>
            </div>
            <div className="hc-title" style={{marginTop:8}}>Wishes</div>
            <div className="hc-desc">A little surprise is waiting — tap to reveal! 🎀</div>
          </div>

        </div>
      </div>
    </>
  );
}
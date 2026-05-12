import { useEffect, useRef, useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .gallery-page {
    min-height: 100vh;
    padding: 100px 24px 80px;
    max-width: 1300px;
    margin: 0 auto;
    animation: fadeUp .7s ease both;
    position: relative;
  }

  /* ── Back Button ── */
  .back-btn {
    position: fixed;
    top: 24px;
    left: 24px;
    z-index: 100;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(242,196,206,.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    transition: all .3s;
    color: var(--accent);
  }
  .back-btn:hover {
    background: rgba(255,255,255,.96);
    transform: scale(1.1);
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Header ── */
  .page-header { text-align:center; margin-bottom:56px; }
  .page-tag {
    display:inline-block; font-family:'DM Sans',sans-serif;
    font-size:11px; letter-spacing:4px; text-transform:uppercase;
    color:var(--soft); margin-bottom:14px;
  }
  .page-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(40px,6vw,70px);
    font-weight:300; line-height:1.05; color:var(--text);
  }
  .page-title em { font-style:italic; color:var(--accent); }
  .page-line {
    width:52px; height:1.5px;
    background:linear-gradient(to right,var(--rose),var(--lavender));
    margin:18px auto 0; border-radius:2px;
  }
  .page-sub {
    margin-top:14px; font-family:'Cormorant Garamond',serif;
    font-size:18px; font-weight:300; font-style:italic;
    color:var(--soft); line-height:1.6;
    max-width:500px; margin-left:auto; margin-right:auto;
  }

  /* ── Music indicator ── */
  .music-indicator {
    position:fixed; top:20px; right:24px; z-index:200;
    display:flex; align-items:center; gap:7px;
    background:rgba(255,255,255,.8); backdrop-filter:blur(12px);
    border:1px solid rgba(216,207,240,.5);
    border-radius:999px; padding:6px 14px;
    pointer-events:none; opacity:0; transition:opacity .5s;
  }
  .music-indicator.visible { opacity:1; }
  .m-dot {
    width:7px; height:7px; border-radius:50%; background:var(--rose);
    animation:mpulse 1.5s ease-in-out infinite;
  }
  @keyframes mpulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.25;transform:scale(.55);} }
  .m-label {
    font-family:'DM Sans',sans-serif;
    font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--soft);
  }

  /* ══════════════════════════════════════════
     ZIGZAG GRID — 12-column base, auto rows
  ══════════════════════════════════════════ */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 90px;   /* slightly taller rows = less cropping */
    gap: 14px;
  }

  /* ── Card base ── */
  .g-card {
    position:relative; border-radius:22px; overflow:hidden;
    cursor:pointer; transition:transform .38s cubic-bezier(.22,.68,0,1.2), box-shadow .38s;
  }
  .g-card:hover {
    transform:translateY(-5px) scale(1.013);
    box-shadow:0 26px 56px rgba(176,96,122,.26); z-index:3;
  }

  /* ── Media wrapper fills card, content never cropped ── */
  .g-media-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .g-media-wrap img,
  .g-media-wrap video {
    width: 100%;
    height: 100%;
    display: block;
    /* contain = never crop, whole subject always visible */
    object-fit: contain;
    border-radius: 22px;
  }

  /* Fallback placeholder */
  .g-placeholder {
    width:100%; height:100%; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:10px;
    border:2px dashed rgba(242,196,206,.6); border-radius:22px; transition:all .3s;
  }
  .g-card:hover .g-placeholder { border-color:var(--rose); }
  .g-ph-emoji { font-size:30px; }
  .g-ph-label {
    font-family:'DM Sans',sans-serif; font-size:11px;
    letter-spacing:1.5px; text-transform:uppercase;
    color:var(--soft); text-align:center; padding:0 12px;
  }

  /* Colour backgrounds */
  .c1  { background:linear-gradient(145deg,#fce8ee,#f5d0dc); }
  .c2  { background:linear-gradient(145deg,#ede8f8,#ddd5f5); }
  .c3  { background:linear-gradient(145deg,#e2f4ed,#c8eadc); }
  .c4  { background:linear-gradient(145deg,#fef3e8,#fcdfc4); }
  .c5  { background:linear-gradient(145deg,#e4eef8,#c8dcf0); }
  .c6  { background:linear-gradient(145deg,#fce8f4,#f5c8e8); }
  .c7  { background:linear-gradient(145deg,#f8f0e4,#f0dfc4); }
  .c8  { background:linear-gradient(145deg,#e8f8f4,#c4f0e4); }
  .c9  { background:linear-gradient(145deg,#f0e8fc,#dcc4f0); }
  .c10 { background:linear-gradient(145deg,#f8fce8,#e4f0c4); }
  .c11 { background:linear-gradient(145deg,#fce8e8,#f0c4c4); }

  /* Bottom caption — always visible */
  .g-bottom {
    position:absolute; bottom:0; left:0; right:0;
    background:linear-gradient(transparent, rgba(28,12,22,.6) 38%, rgba(28,12,22,.82));
    border-radius:0 0 22px 22px;
    padding:28px 14px 14px;
    display:flex; flex-direction:column; align-items:center; gap:7px;
    /* sits above media wrap */
    z-index: 2;
  }
  .g-bottom-title {
    font-family:'Cormorant Garamond',serif;
    font-size:15px; font-weight:300; font-style:italic;
    color:rgba(255,255,255,.93); text-align:center;
    text-shadow:0 1px 6px rgba(0,0,0,.35); line-height:1.3;
  }
  .g-bottom-btn {
    display:inline-flex; align-items:center; gap:5px;
    border:1px solid rgba(255,255,255,.45); border-radius:999px;
    padding:4px 13px; font-family:'DM Sans',sans-serif;
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    color:rgba(255,255,255,.88); background:rgba(255,255,255,.1);
    backdrop-filter:blur(4px);
    transition:background .25s, border-color .25s;
  }
  .g-card:hover .g-bottom-btn {
    background:rgba(255,255,255,.22); border-color:rgba(255,255,255,.75);
  }
  .g-heart { color:#f97fa0; font-size:11px; }

  /* Video play hint */
  .play-hint {
    position:absolute; top:38%; left:50%;
    transform:translate(-50%,-50%);
    width:40px; height:40px; border-radius:50%;
    background:rgba(255,255,255,.18); backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,.5);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .3s; pointer-events:none;
    z-index: 2;
  }
  .play-hint svg { width:14px; height:14px; fill:white; margin-left:2px; }
  .g-card:hover .play-hint { opacity:1; }

  /* ══════════════════════════════════
     RESPONSIVE — tablet
  ══════════════════════════════════ */
  @media(max-width:900px) {
    .gallery-grid {
      grid-template-columns: repeat(6, 1fr);
      grid-auto-rows: 80px;
    }
  }

  /* ══════════════════════════════════
     RESPONSIVE — mobile (fixed)
  ══════════════════════════════════ */
  @media(max-width:540px) {
    .gallery-page { padding:76px 12px 60px; }
    .page-header { margin-bottom:36px; }
    .page-sub { font-size:15px; }

    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 200px;   /* taller rows on mobile for full media */
      gap: 10px;
    }

    /* Force all cards to uniform 1-col x 1-row on mobile */
    .g-card {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
      border-radius: 16px;
    }

    .g-bottom {
      padding: 22px 10px 10px;
    }
    .g-bottom-title { font-size:12px; }
    .g-bottom-btn   { font-size:9px; padding:3px 10px; }
    .g-ph-emoji     { font-size:22px; }
    .g-ph-label     { font-size:10px; }
    .music-indicator { top:12px; right:12px; }
  }
`;

const SONG_SRC = "/song.mp3";

const MEDIA = [
  // Row 1 — big left block + two stacked right
  { id:1,  type:"image", src:"/gallery1.png",  cls:"c1",
    col:1,  cs:5, rs:5,  tcol:1, tcs:3, trs:4,
    title:"Look at that smile",               btn:"I love your smile 🌸" },
  { id:2,  type:"image", src:"/hero1.jpeg",  cls:"c2",
    col:6,  cs:4, rs:3,  tcol:4, tcs:3, trs:3,
    title:"Your laugh is everything",          btn:"Could listen forever ♥" },
  { id:3,  type:"video", src:"/video2.mp4", cls:"c6",
    col:10, cs:3, rs:2,  tcol:1, tcs:2, trs:2,
    title:"Your hair drives crazy",         btn:"Obsessed with it ✨" },

  // Row 2 continuation
  { id:4,  type:"image", src:"/gallery2.png",  cls:"c4",
    col:6,  cs:2, rs:2,  tcol:3, tcs:2, trs:2,
    title:"Wherever you go, I notice you",     btn:"Always you 🌟" },
  { id:5,  type:"video", src:"/video3.mp4", cls:"c5",
    col:8,  cs:2, rs:3,  tcol:5, tcs:2, trs:3,
    title:"being too much cute", btn:"Just your pretty face 🌿" },
  { id:6,  type:"image", src:"/gallery3.png",  cls:"c3",
    col:10, cs:3, rs:3,  tcol:1, tcs:3, trs:3,
    title:"No filter, just you",               btn:"Naturally you 💫" },

  // Row 3 — wide strip + small
  { id:7,  type:"image", src:"/gallery5.png", cls:"c7",
    col:1,  cs:5, rs:3,  tcol:4, tcs:3, trs:3,
    title:"The way you move, honestly",        btn:"You got me 🎬" },
  { id:8,  type:"video", src:"/video4.mp4", cls:"c9",
    col:6,  cs:3, rs:4,  tcol:1, tcs:3, trs:4,
    title:"sokuladi swapna sundari",            btn:"aa navvu chudu 🌸" },
  { id:9,  type:"image", src:"/gallery4.png",  cls:"c8",
    col:9,  cs:4, rs:2,  tcol:4, tcs:3, trs:2,
    title:"You do whatever you want",          btn:"That's you ♡" },

  // Row 4
  { id:10, type:"image", src:"/gallery6.png",  cls:"c11",
    col:1,  cs:3, rs:4,  tcol:4, tcs:3, trs:3,
    title:"You just threw this on",            btn:"Still look like that 💜" },
  { id:11, type:"image", src:"/hero4.jpeg",  cls:"c2",
    col:4,  cs:2, rs:2,  tcol:1, tcs:3, trs:2,
    title:"You didn't know I was watching",    btn:"Caught you ✦" },
  { id:12, type:"video", src:"/video1.mp4", cls:"c4",
    col:9,  cs:4, rs:4,  tcol:4, tcs:3, trs:4,
    title:"felt like cute puppy",        btn:"Too good honestly 🌺" },

  // Row 5
  { id:13, type:"video", src:"/video5.mp4", cls:"c6",
    col:4,  cs:5, rs:3,  tcol:1, tcs:3, trs:3,
    title:"curls are curling ani anukovali",          btn:"hair filps avasarm jeevithamlo" },
  { id:14, type:"image", src:"/gallery7.png",  cls:"c10",
    col:1,  cs:3, rs:3,  tcol:4, tcs:3, trs:3,
    title:"Your curls today, seriously",       btn:"I'm obsessed 🌀" },

  // Row 6 — asymmetric
  { id:15, type:"video", src:"/video6.mp4", cls:"c1",
    col:1,  cs:4, rs:4,  tcol:1, tcs:4, trs:4,
    title:"sundari♥",           btn:"No one else like you ♛" },
  { id:16, type:"video", src:"/video7.mp4", cls:"c5",
    col:5,  cs:3, rs:3,  tcol:5, tcs:2, trs:3,
    title:"those wink ufff",   btn:"🌙" },
  { id:17, type:"image", src:"/gallery8.png",  cls:"c3",
    col:8,  cs:5, rs:2,  tcol:1, tcs:4, trs:2,
    title:"Can't get you out of my head",      btn:"Not even trying ♥" },

  // Row 7
  { id:18, type:"video", src:"/video8.mp4", cls:"c7",
    col:5,  cs:4, rs:4,  tcol:1, tcs:3, trs:4,
    title:"When you're this happy",            btn:"Makes my day 🌼" },
  { id:19, type:"video", src:"/video9.mp4", cls:"c9",
    col:9,  cs:4, rs:3,  tcol:4, tcs:3, trs:3,
    title:"Bane extraluuuu",  btn:"but felt cute" },
  { id:20, type:"image", src:"/little.jpeg", cls:"c11",
    col:1,  cs:4, rs:3,  tcol:1, tcs:3, trs:3,
    title:"There's literally no one like you", btn:"Only you ✨" },

  // Row 8 — wide closing card
  { id:21, type:"video", src:"/video10.mp4", cls:"c6",
    col:1,  cs:5, rs:3, tcol:5, tcs:6, trs:3,
    title:"edhe last inka",    btn:"ILY🤍" },
];

export default function GalleryPage({ onNav }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let active = true;

    audio.autoplay = true;
    audio.preload = "auto";

    const playAudio = async () => {
      if (!active || !audio.paused) return;
      try {
        await audio.play();
        if (active) setPlaying(true);
      } catch (error) {
        // If autoplay is blocked, we will start on interaction.
      }
    };

    const startOnInteraction = () => {
      if (active) playAudio();
    };

    const onCanPlayThrough = () => {
      if (active) playAudio();
    };

    window.addEventListener("click",      startOnInteraction, { once: true });
    window.addEventListener("keydown",    startOnInteraction, { once: true });
    window.addEventListener("touchstart", startOnInteraction, { once: true });
    audio.addEventListener("canplaythrough", onCanPlayThrough, { once: true });

    const onVisibilityChange = () => {
      if (!active) return;
      if (document.hidden) {
        audio.pause();
        setPlaying(false);
      } else if (audio.paused) {
        playAudio();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onPageLeave = () => {
      if (!active) return;
      audio.pause();
      setPlaying(false);
    };
    window.addEventListener("pagehide",     onPageLeave);
    window.addEventListener("beforeunload", onPageLeave);

    playAudio();

    return () => {
      active = false;
      window.removeEventListener("click",      startOnInteraction);
      window.removeEventListener("keydown",    startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide",   onPageLeave);
      window.removeEventListener("beforeunload", onPageLeave);
      audio.pause();
      setPlaying(false);
    };
  }, []);

  // Read viewport to pick the right col/span values
  const getStyle = (item) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;

    // Mobile: uniform 2-col grid, every card same size
    if (w <= 540) {
      return {
        gridColumn: `span 1`,
        gridRow:    `span 1`,
      };
    }

    // Tablet
    if (w <= 900) {
      return {
        gridColumn: `${item.tcol} / span ${item.tcs}`,
        gridRow:    `span ${item.trs}`,
      };
    }

    // Desktop
    return {
      gridColumn: `${item.col} / span ${item.cs}`,
      gridRow:    `span ${item.rs}`,
    };
  };

  return (
    <>
      <style>{css}</style>
      <button className="back-btn" onClick={() => onNav("home")} title="Back to home">
        ←
      </button>
      <audio ref={audioRef} src={SONG_SRC} loop preload="auto" />

      <div className={`music-indicator${playing ? " visible" : ""}`}>
        <div className="m-dot" />
        <span className="m-label">Playing for you…</span>
      </div>

      <div className="gallery-page">
        <div className="page-header">
          <div className="page-tag">✦ just you ✦</div>
          <h1 className="page-title">All of <em>You</em></h1>
          <div className="page-line" />
          <p className="page-sub">
            Your smile, your hair, your eyes — everything about you, right here
          </p>
        </div>

        <div className="gallery-grid">
          {MEDIA.map(item => (
            <div key={item.id} className={`g-card ${item.cls}`} style={getStyle(item)}>

              {/* Media wrapper — object-fit:contain keeps full subject in frame */}
              <div className="g-media-wrap">
                {item.type === "image" ? (
                  <>
                    <img
                      src={item.src}
                      alt={item.title}
                      onError={e => {
                        e.target.style.display = "none";
                        const fb = e.target.nextElementSibling;
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                    <div className="g-placeholder" style={{ display:"none" }}>
                      <div className="g-ph-emoji">🌸</div>
                      <div className="g-ph-label">{item.title}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <video
                      src={item.src}
                      autoPlay muted loop playsInline preload="auto"
                      onError={e => {
                        e.target.style.display = "none";
                        const fb = e.target.nextElementSibling;
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                    <div className="g-placeholder" style={{ display:"none" }}>
                      <div className="g-ph-emoji">🎬</div>
                      <div className="g-ph-label">{item.title}</div>
                    </div>
                  </>
                )}
              </div>

              <div className="g-bottom">
                <div className="g-bottom-title">{item.title}</div>
                <div className="g-bottom-btn">
                  {item.btn} <span className="g-heart">♥</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}
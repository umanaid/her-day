import { useState } from "react";
import HomePage from "./HomePage.js";
import GalleryPage from "./GalleryPage.js";
import WishesPage from "./WishesPage";
import AboutPage from "./AboutPage";

const base = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --rose:#f2c4ce; --lavender:#d8cff0; --mint:#c2e8d8;
    --peach:#fad4bb; --sky:#bdd9f0; --cream:#fdf8f5;
    --blush:#fce8ee; --lilac:#ede8f8;
    --text:#2e1f29; --soft:#7a5c68; --accent:#b0607a;
  }
  html { scroll-behavior:smooth; }
  body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--text); overflow-x:hidden; }
  ::selection { background:var(--rose); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes rise   { 0%{transform:translateY(110vh);opacity:0} 10%{opacity:.5} 90%{opacity:.4} 100%{transform:translateY(-20vh);opacity:0} }
  @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes slideIn{ from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
  @keyframes sparkle{ 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
`;

export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{base}</style>
      {page === "home"    && <HomePage    onNav={navigate} />}
      {page === "gallery" && <GalleryPage onNav={navigate} />}
      {page === "wishes"  && <WishesPage  onNav={navigate} />}
      {page === "about"   && <AboutPage   onNav={navigate} />}
    </>
  );
}
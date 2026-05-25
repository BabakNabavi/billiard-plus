'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Star, Building2, ShoppingBag, Clock, Eye, Play, Pause, ArrowLeft, Zap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal/ScrollReveal';

const featuredClubs = [
  { id: '1', name: 'باشگاه ستاره تهران', city: 'تهران', tables: 12, rating: 4.8, type: 'اسنوکر', img: '/images/billiadr-club-1.jpg' },
  { id: '2', name: 'باشگاه المپیک مشهد', city: 'مشهد', tables: 8, rating: 4.6, type: 'پاکت', img: '/images/billiadr-club-2.jpg' },
  { id: '3', name: 'باشگاه پیروزی اصفهان', city: 'اصفهان', tables: 10, rating: 4.7, type: 'هی‌بال', img: '/images/billiadr-club-3.jpg' },
];

const upcomingEvents = [
  { id: '1', title: 'مسابقات سراسری اسنوکر ایران ۱۴۰۴', date: '۱۵ خرداد ۱۴۰۴', prize: '۵۰ میلیون', participants: 48, maxParticipants: 64, color: '#10b981' },
  { id: '2', title: 'جام بیلیارد پاکت تهران', date: '۲۲ خرداد ۱۴۰۴', prize: '۳۰ میلیون', participants: 24, maxParticipants: 32, color: '#06b6d4' },
  { id: '3', title: 'لیگ هی‌بال استان‌ها', date: '۱ تیر ۱۴۰۴', prize: '۲۰ میلیون', participants: 16, maxParticipants: 24, color: '#a78bfa' },
];

const latestNews = [
  { id: '1', title: 'برگزاری اولین دوره مسابقات بین‌المللی بیلیارد در تهران', date: '۵ خرداد ۱۴۰۴', views: 2341, category: 'مسابقات', categoryColor: '#10b981', img: '/images/billiadr-club-1.jpg' },
  { id: '2', title: 'معرفی جدیدترین میزهای اسنوکر وارداتی به بازار ایران', date: '۳ خرداد ۱۴۰۴', views: 1876, category: 'تجهیزات', categoryColor: '#06b6d4', img: '/images/billiadr-club-2.jpg' },
  { id: '3', title: 'آکادمی بیلیارد پلاس؛ آموزش آنلاین برای مبتدیان', date: '۱ خرداد ۱۴۰۴', views: 3102, category: 'آموزش', categoryColor: '#a78bfa', img: '/images/billiadr-club-3.jpg' },
];

const featuredProducts = [
  { id: '1', title: 'چوب بیلیارد Predator 314-3', price: 12000000, discountPrice: 9600000, discountPercent: 20, img: '/images/billiadr-club-1.jpg' },
  { id: '2', title: 'ست توپ Aramith Tournament', price: 4500000, discountPrice: 3800000, discountPercent: 16, img: '/images/billiadr-club-2.jpg' },
  { id: '3', title: 'میز اسنوکر Viraka M1 Gold', price: 85000000, discountPrice: 72000000, discountPercent: 15, img: '/images/billiadr-club-3.jpg' },
  { id: '4', title: 'گچ Master Blue Diamond', price: 850000, discountPrice: 680000, discountPercent: 20, img: '/images/billiadr-club-1.jpg' },
];

const heroSlides = [
  { img: '/images/billiadr-club-1.jpg', title: 'بیلیارد پلاس', sub: 'اولین پلتفرم جامع تخصصی بیلیارد ایران', accent: '#10b981' },
  { img: '/images/billiadr-club-2.jpg', title: 'رزرو آنلاین', sub: 'میز مورد نظرت رو همین الان رزرو کن', accent: '#06b6d4' },
  { img: '/images/billiadr-club-3.jpg', title: 'مسابقات حرفه‌ای', sub: 'در بزرگ‌ترین رویدادهای بیلیارد ایران شرکت کن', accent: '#a78bfa' },
  { img: '/images/billiadr-club-3.jpg', title: 'فروشگاه تجهیزات', sub: 'در بزرگ‌ترین رویدادهای بیلیارد ایران شرکت کن', accent: '#a78bfa' },

];

// Dark glass card component
function DarkCard({ children, style = {}, hoverGlow = '#10b981' }: { children: React.ReactNode; style?: React.CSSProperties; hoverGlow?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? `${hoverGlow}40` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '20px',
        backdropFilter: 'blur(24px)',
        boxShadow: hovered
          ? `0 0 0 1px ${hoverGlow}20, 0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${hoverGlow}10`
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const currentSlide = heroSlides[heroSlide] ?? heroSlides[0]!;
  const [scrollY, setScrollY] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 700);
  const heroScale = 1 + scrollY * 0.0002;
  const contentTranslateY = scrollY * 0.1;

  return (
    <>
      <style>{`
        :root {
          --dark-bg: #060d0a;
          --dark-surface: #0a1410;
          --dark-card: rgba(255,255,255,0.03);
          --green-neon: #10b981;
          --green-glow: rgba(16,185,129,0.15);
          --text-primary: #f0faf5;
          --text-secondary: rgba(240,250,245,0.55);
          --text-muted: rgba(240,250,245,0.3);
        }

        @keyframes heroFadeIn {
          from { opacity:0; transform:translateY(40px) scale(0.98); filter:blur(8px); }
          to   { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
        }
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5), 0 0 20px rgba(16,185,129,0.2); }
          50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0), 0 0 40px rgba(16,185,129,0.4); }
        }
        @keyframes scrollHint {
          0%,100% { transform:translateY(0); opacity:0.8; }
          50%      { transform:translateY(10px); opacity:0.2; }
        }
        @keyframes ambientFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.05); }
          66%      { transform: translate(-20px,15px) scale(0.98); }
        }
        @keyframes lineReveal {
          from { width:0; opacity:0; }
          to   { width:60px; opacity:1; }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .ha { animation: heroFadeIn 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .hb { animation: heroFadeIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
        .hc { animation: heroFadeIn 1s cubic-bezier(0.22,1,0.36,1) 0.8s both; }
        .hd { animation: heroFadeIn 1s cubic-bezier(0.22,1,0.36,1) 1.1s both; }

        .section-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .section-title {
          font-size: clamp(22px,3vw,30px);
          font-weight: 900;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .section-line {
          height: 1px;
          width: 60px;
          margin-top: 12px;
          border-radius: 1px;
          animation: lineReveal 0.8s ease both;
        }

        .neon-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 13px 30px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 8px 32px rgba(16,185,129,0.3);
        }
        .neon-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .neon-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.5), 0 12px 40px rgba(16,185,129,0.45), 0 0 60px rgba(16,185,129,0.15);
        }
        .neon-btn:hover::before { opacity: 1; }

        .ghost-btn {
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 13px 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .ghost-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(16,185,129,0.4);
          box-shadow: 0 0 20px rgba(16,185,129,0.1);
        }

        .club-img {
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .club-card:hover .club-img {
          transform: scale(1.08);
        }

        @media(max-width:900px) {
          .clubs-g  { grid-template-columns: repeat(2,1fr) !important; }
          .events-g { grid-template-columns: 1fr !important; }
          .news-g   { grid-template-columns: 1fr !important; }
          .shop-g   { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:480px) {
          .clubs-g  { grid-template-columns: 1fr !important; }
          .shop-g   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ==================== CINEMATIC HERO ==================== */}
      <div style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden', background: '#020806' }}>

        {/* ── Background image slides ── */}
        {heroSlides.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === heroSlide ? 1 : 0,
            transition: 'opacity 2.5s cubic-bezier(0.4,0,0.2,1)',
            transform: `scale(${heroScale})`,
            willChange: 'transform',
            zIndex: 0,
          }}>
            <img src={s.img} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.18) saturate(0.5) contrast(1.1)',
            }} />
          </div>
        ))}

        {/* ── Video layer ── */}
        <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.06,
          transform: `scale(${heroScale})`, zIndex: 1,
        }}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* ── Cinematic vignette ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: `
            linear-gradient(to bottom,
              rgba(2,8,6,0.75) 0%,
              rgba(2,8,6,0.1) 25%,
              rgba(2,8,6,0.1) 60%,
              rgba(2,8,6,0.95) 100%
            ),
            linear-gradient(to right,
              rgba(2,8,6,0.0) 40%,
              rgba(2,8,6,0.7) 100%
            )
          `,
        }} />

        {/* ── Neon accent ambient ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: `radial-gradient(ellipse 60% 60% at 28% 65%, ${currentSlide.accent}0e 0%, transparent 100%)`,
          transition: 'background 2.5s ease',
        }} />

        {/* ── Floating ambient orb top-left ── */}
        <div style={{
          position: 'absolute', top: '-5%', left: '-5%',
          width: '55vw', height: '55vw', maxWidth: '700px', maxHeight: '700px',
          borderRadius: '50%', zIndex: 3, pointerEvents: 'none',
          background: `radial-gradient(ellipse, ${currentSlide.accent}07 0%, transparent 65%)`,
          animation: 'ambientFloat 14s ease-in-out infinite',
          transition: 'background 2.5s ease',
        }} />

        {/* ── Right-side vertical neon rule ── */}
        <div style={{
          position: 'absolute', right: '52px', top: '30%', bottom: '30%',
          width: '1px', zIndex: 5, pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent, ${currentSlide.accent}55, transparent)`,
          boxShadow: `0 0 16px ${currentSlide.accent}40`,
          transition: 'all 2.5s ease',
        }} />

        {/* ── Bottom neon rule ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: '8%', right: '8%', height: '1px',
          zIndex: 5, pointerEvents: 'none',
          background: `linear-gradient(to right, transparent, ${currentSlide.accent}25, transparent)`,
        }} />

        {/* ── HERO CONTENT ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'center',
          padding: '0 7% 0 7%',
          transform: `translateY(${contentTranslateY}px)`,
          opacity: heroOpacity,
        }}>
          <div style={{ maxWidth: '560px', textAlign: 'right' }}>

            {/* eyebrow badge */}
            <div className="hb" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: `rgba(255,255,255,0.04)`,
              border: `1px solid ${currentSlide.accent}30`,
              borderRadius: '100px', padding: '8px 22px', marginBottom: '28px',
              backdropFilter: 'blur(24px)',
              boxShadow: `0 0 24px ${currentSlide.accent}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
              transition: 'all 2.5s ease',
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: currentSlide.accent,
                boxShadow: `0 0 10px ${currentSlide.accent}, 0 0 20px ${currentSlide.accent}80`,
                animation: 'neonPulse 3s infinite',
                display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ color: currentSlide.accent, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em' }}>
                BILLIARD PLUS
              </span>
            </div>

            {/* main title */}
            <h1 className="ha" style={{
              fontSize: 'clamp(44px,7.5vw,96px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.0,
              margin: '0 0 20px',
              letterSpacing: '-0.04em',
              textShadow: `0 0 120px ${currentSlide.accent}20, 0 2px 0 rgba(0,0,0,0.5)`,
            }}>
              {currentSlide.title}
            </h1>

            {/* accent divider */}
            <div style={{
              height: '1px',
              width: '56px',
              background: `linear-gradient(90deg, ${currentSlide.accent}, transparent)`,
              boxShadow: `0 0 16px ${currentSlide.accent}90`,
              marginBottom: '22px',
              transition: 'background 2.5s, box-shadow 2.5s',
            }} />

            {/* subtitle */}
            <p className="hb" style={{
              fontSize: 'clamp(15px,1.8vw,19px)',
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 40px',
              lineHeight: 1.85,
              fontWeight: 400,
              maxWidth: '420px',
            }}>
              {currentSlide.sub}
            </p>

            {/* CTA row */}
            <div className="hc" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/clubs">
                <button className="neon-btn">یافتن باشگاه</button>
              </Link>
              <Link href="/register">
                <button className="ghost-btn">ثبت‌نام رایگان</button>
              </Link>
            </div>

            {/* stats row */}
            <div className="hd" style={{
              display: 'flex', gap: '0', marginTop: '52px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '28px',
            }}>
              {[
                { v: '۵۰۰+', l: 'باشگاه فعال' },
                { v: '۱۰K+', l: 'بازیکن' },
                { v: '۲۰۰+', l: 'مسابقه' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1,
                  textAlign: 'center',
                  borderLeft: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  padding: '0 20px',
                }}>
                  <div style={{
                    fontSize: 'clamp(22px,3vw,30px)',
                    fontWeight: 900, color: '#fff', lineHeight: 1,
                    letterSpacing: '-0.03em',
                    textShadow: `0 0 30px ${currentSlide.accent}30`,
                  }}>{s.v}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '6px', letterSpacing: '0.08em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide indicators ── */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', gap: '10px',
          opacity: heroOpacity,
        }}>
          {heroSlides.map((s, i) => (
            <button key={i} onClick={() => setHeroSlide(i)} style={{
              height: '2px',
              width: i === heroSlide ? '36px' : '10px',
              borderRadius: '1px', border: 'none', cursor: 'pointer', padding: 0,
              background: i === heroSlide ? s.accent : 'rgba(255,255,255,0.18)',
              transition: 'all 0.5s ease',
              boxShadow: i === heroSlide ? `0 0 14px ${s.accent}` : 'none',
            }} />
          ))}
        </div>

        {/* ── Video play/pause ── */}
        <button onClick={() => {
          if (videoRef.current) {
            if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false); }
            else { videoRef.current.play(); setVideoPlaying(true); }
          }
        }} style={{
          position: 'absolute', bottom: '36px', right: '52px', zIndex: 10,
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(16px)',
          opacity: heroOpacity, transition: 'all 0.3s',
        }}>
          {videoPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>

        {/* ── Scroll hint ── */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '52px', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          opacity: Math.max(0, heroOpacity - 0.15),
        }}>
          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.22em', writingMode: 'vertical-rl' }}>SCROLL</span>
          <div style={{
            width: '1px', height: '40px',
            background: `linear-gradient(to bottom, ${currentSlide.accent}50, transparent)`,
            animation: 'scrollHint 2.5s ease infinite',
          }} />
        </div>
      </div>

      {/* ==================== DARK CONTENT ==================== */}
      <div style={{ background: 'linear-gradient(180deg, #060d0a 0%, #080f0b 40%, #0a1210 70%, #060d0a 100%)', position: 'relative' }}>

        {/* Ambient background glows */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 30%, rgba(16,185,129,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.03) 0%, transparent 50%)' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px 80px', position: 'relative', zIndex: 1 }}>

          {/* ===== CLUBS ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <div className="section-label" style={{ color: '#10b981' }}>PREMIUM VENUES</div>
                  <h2 className="section-title">باشگاه‌های برتر</h2>
                  <div className="section-line" style={{ background: 'linear-gradient(90deg, #10b981, transparent)', boxShadow: '0 0 12px rgba(16,185,129,0.4)' }} />
                </div>
                <Link href="/clubs" style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s' }}>
                  مشاهده همه <ArrowLeft size={14} />
                </Link>
              </div>

              <div className="clubs-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                {featuredClubs.map((club, idx) => (
                  <Link key={club.id} href={`/clubs/${club.id}`} style={{ textDecoration: 'none' }}>
                    <DarkCard hoverGlow="#10b981">
                      <div className="club-card" style={{ height: '100%' }}>
                        {/* Image */}
                        <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                          <img className="club-img" src={club.img} alt={club.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.8)' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(6,13,10,0.8) 100%)' }} />

                          {/* Type badge */}
                          <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', backdropFilter: 'blur(10px)', letterSpacing: '0.05em' }}>
                            {club.type}
                          </div>

                          {/* Rank badge */}
                          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                            #{(idx + 1).toLocaleString('fa-IR')}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '18px' }}>
                          <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontSize: '15px', letterSpacing: '-0.01em' }}>{club.name}</h3>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                            <span>{club.city}</span>
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                            <span>{club.tables.toLocaleString('fa-IR')} میز</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '3px' }}>
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} style={{ color: s <= Math.floor(club.rating) ? '#f59e0b' : 'rgba(255,255,255,0.1)', fill: s <= Math.floor(club.rating) ? '#f59e0b' : 'transparent' }} />)}
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginRight: '4px' }}>{club.rating}</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>رزرو آنلاین</span>
                          </div>
                        </div>
                      </div>
                    </DarkCard>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== AD BANNER ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '100px' }}>
              <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', minHeight: '180px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #031a0f 0%, #052e1a 50%, #064e3b 100%)' }} />
                <img src="/images/billiadr-club-2.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />

                {/* Neon border */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '28px', border: '1px solid rgba(16,185,129,0.2)', pointerEvents: 'none' }} />

                {/* Ambient glow */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(rgba(16,185,129,0.15), transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 48px', flexWrap: 'wrap', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: 'rgba(16,185,129,0.5)', letterSpacing: '0.25em', marginBottom: '10px', fontWeight: 700 }}>ADVERTISEMENT</div>
                    <h3 style={{ fontSize: 'clamp(20px,3vw,32px)', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>باشگاه خود را معرفی کنید</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>به هزاران بازیکن و علاقه‌مند دسترسی پیدا کنید</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {[{ v: '۵۰K+', l: 'بازدید ماهانه' }, { v: '۱۰K+', l: 'کاربر فعال' }].map((s, i) => (
                      <div key={i} style={{ textAlign: 'center', padding: '12px 20px', background: 'rgba(16,185,129,0.06)', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>{s.v}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{s.l}</div>
                      </div>
                    ))}
                    <button className="neon-btn" style={{ padding: '12px 24px', fontSize: '13px' }}>درخواست تبلیغ</button>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ===== EVENTS ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <div className="section-label" style={{ color: '#f59e0b' }}>UPCOMING EVENTS</div>
                  <h2 className="section-title">مسابقات پیش رو</h2>
                  <div className="section-line" style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)', boxShadow: '0 0 12px rgba(245,158,11,0.4)' }} />
                </div>
                <Link href="/events" style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', opacity: 0.7 }}>
                  مشاهده همه <ArrowLeft size={14} />
                </Link>
              </div>

              <div className="events-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                {upcomingEvents.map(event => (
                  <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                    <DarkCard hoverGlow={event.color} style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.color, boxShadow: `0 0 12px ${event.color}, 0 0 24px ${event.color}60`, flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{event.date}</span>
                      </div>
                      <h3 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', fontSize: '14px', lineHeight: 1.65, letterSpacing: '-0.01em' }}>{event.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.05em' }}>جایزه</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.4)' }}>{event.prize}</div>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.05em' }}>ثبت‌نام</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>{event.participants.toLocaleString('fa-IR')}/{event.maxParticipants.toLocaleString('fa-IR')}</div>
                        </div>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: event.color, borderRadius: '2px', width: `${(event.participants / event.maxParticipants) * 100}%`, boxShadow: `0 0 8px ${event.color}` }} />
                      </div>
                    </DarkCard>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== NEWS ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <div className="section-label" style={{ color: '#06b6d4' }}>LATEST NEWS</div>
                  <h2 className="section-title">آخرین اخبار</h2>
                  <div className="section-line" style={{ background: 'linear-gradient(90deg, #06b6d4, transparent)', boxShadow: '0 0 12px rgba(6,182,212,0.4)' }} />
                </div>
                <Link href="/news" style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', opacity: 0.7 }}>
                  مشاهده همه <ArrowLeft size={14} />
                </Link>
              </div>

              <div className="news-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                {latestNews.map(news => (
                  <Link key={news.id} href={`/news/${news.id}`} style={{ textDecoration: 'none' }}>
                    <DarkCard hoverGlow={news.categoryColor}>
                      <div style={{ height: '150px', position: 'relative', overflow: 'hidden' }}>
                        <img src={news.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(0.7)', transition: 'transform 0.5s ease' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(6,13,10,0.9) 100%)' }} />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', color: news.categoryColor, background: `${news.categoryColor}15`, border: `1px solid ${news.categoryColor}30`, backdropFilter: 'blur(10px)' }}>
                          {news.category}
                        </div>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.75, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.title}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} />{news.date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={10} />{news.views.toLocaleString('fa-IR')}</span>
                        </div>
                      </div>
                    </DarkCard>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SHOP ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <div className="section-label" style={{ color: '#a78bfa' }}>PREMIUM EQUIPMENT</div>
                  <h2 className="section-title">فروشگاه تجهیزات</h2>
                  <div className="section-line" style={{ background: 'linear-gradient(90deg, #a78bfa, transparent)', boxShadow: '0 0 12px rgba(167,139,250,0.4)' }} />
                </div>
                <Link href="/shop" style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', opacity: 0.7 }}>
                  مشاهده همه <ArrowLeft size={14} />
                </Link>
              </div>

              <div className="shop-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {featuredProducts.map(product => (
                  <Link key={product.id} href={`/shop/${product.id}`} style={{ textDecoration: 'none' }}>
                    <DarkCard hoverGlow="#a78bfa">
                      <div style={{ height: '130px', position: 'relative', overflow: 'hidden' }}>
                        <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) saturate(0.6)', transition: 'transform 0.5s ease' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(6,13,10,0.9) 100%)' }} />
                        <ShoppingBag size={20} style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'rgba(167,139,250,0.3)' }} />
                        {product.discountPercent > 0 && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>
                            {product.discountPercent.toLocaleString('fa-IR')}٪
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '14px' }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '12px', lineHeight: 1.6, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.title}</h3>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '2px' }}>{product.price.toLocaleString('fa-IR')}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#10b981', textShadow: '0 0 16px rgba(16,185,129,0.4)' }}>{(product.discountPrice || product.price).toLocaleString('fa-IR')} ت</div>
                      </div>
                    </DarkCard>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== CTA ===== */}
          <ScrollReveal>
            <section style={{ marginBottom: '40px' }}>
              <div style={{
                position: 'relative', borderRadius: '32px', overflow: 'hidden',
                padding: '64px 48px', textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(16,185,129,0.15)',
                backdropFilter: 'blur(24px)',
              }}>
                {/* Ambient glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(16,185,129,0.08), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '1px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', boxShadow: '0 0 20px rgba(16,185,129,0.5)' }} />

                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
                    <Zap size={12} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '10px', color: '#10b981', letterSpacing: '0.15em', fontWeight: 700 }}>JOIN THE ELITE</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.03em' }}>همین الان شروع کن</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '16px', lineHeight: 1.7 }}>رایگان ثبت‌نام کن و به جامعه بیلیارد ایران بپیوند</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href="/register">
                      <button className="neon-btn" style={{ padding: '15px 36px', fontSize: '15px' }}>ثبت‌نام رایگان</button>
                    </Link>
                    <Link href="/clubs">
                      <button className="ghost-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '15px 36px', fontSize: '15px' }}>
                        <Building2 size={16} /> یافتن باشگاه
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </div>
    </>
  );
}
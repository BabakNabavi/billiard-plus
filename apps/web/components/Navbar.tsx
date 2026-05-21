'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Search, Bell, ShoppingCart, ChevronDown, User, X, Trophy, Users, BookOpen, ShoppingBag, Building2, Radio, Star, Wrench, Newspaper, Calendar } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const exploreMenu = [
  {
    title: 'بازیکنان و افراد',
    items: [
      { href: '/players', label: 'بازیکنان', icon: <Users size={16} />, desc: 'بازیکنان حرفه‌ای' },
      { href: '/coaches', label: 'مربیان', icon: <Star size={16} />, desc: 'مربیان مجاز' },
      { href: '/referees', label: 'داوران', icon: <Trophy size={16} />, desc: 'داوران رسمی' },
    ]
  },
  {
    title: 'فروشندگان',
    items: [
      { href: '/sellers', label: 'فروشگاه‌ها', icon: <ShoppingBag size={16} />, desc: 'فروشندگان تجهیزات' },
      { href: '/manufacturers', label: 'تولیدکنندگان', icon: <Wrench size={16} />, desc: 'سازندگان تجهیزات' },
      { href: '/installers', label: 'متخصصین نصب', icon: <Wrench size={16} />, desc: 'نصب و راه‌اندازی' },
    ]
  },
  {
    title: 'محتوا و آموزش',
    items: [
      { href: '/news', label: 'اخبار', icon: <Newspaper size={16} />, desc: 'آخرین اخبار بیلیارد' },
      { href: '/events', label: 'مسابقات', icon: <Calendar size={16} />, desc: 'رویدادها و مسابقات' },
      { href: '/education', label: 'آموزش', icon: <BookOpen size={16} />, desc: 'ویدیو و مطالب آموزشی' },
    ]
  },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navBg = isHomePage
    ? scrolled
      ? 'rgba(3,10,6,0.95)'
      : 'rgba(0,0,0,0)'
    : 'rgba(3,10,6,0.98)';

  const navBorder = isHomePage
    ? scrolled ? '1px solid rgba(16,185,129,0.1)' : '1px solid transparent'
    : '1px solid rgba(16,185,129,0.08)';

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          padding: 6px 2px;
          transition: color 0.3s ease;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .nav-link:hover { color: rgba(255,255,255,0.95); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, #10b981, #06b6d4);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .explore-btn {
          display: flex; align-items: center; gap: 4px;
          color: rgba(255,255,255,0.6);
          font-size: 13px; font-weight: 500;
          padding: 6px 2px;
          transition: color 0.3s ease;
          background: none; border: none; cursor: pointer;
          white-space: nowrap;
        }
        .explore-btn:hover { color: rgba(255,255,255,0.95); }
        .dropdown-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: rgba(16,185,129,0.08);
        }
        .dropdown-item:hover .item-icon { color: #10b981; }
        .dropdown-item:hover .item-label { color: #e2e8f0; }
        .item-icon { color: rgba(255,255,255,0.3); transition: color 0.2s ease; margin-top: 2px; flex-shrink: 0; }
        .item-label { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; transition: color 0.2s ease; }
        .item-desc { color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 2px; }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-input:focus { outline: none; }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-anim { animation: dropdownIn 0.2s ease forwards; }
      `}</style>

      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: navBg,
        borderBottom: navBorder,
        backdropFilter: scrolled || !isHomePage ? 'blur(20px) saturate(1.5)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '24px' }}>

          {/* لوگو */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16,185,129,0.3)',
              fontWeight: 900, fontSize: '16px', color: '#000',
            }}>B</div>
            <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
              بیلیارد <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>پلاس</span>
            </span>
          </Link>

          {/* منوی اصلی */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginRight: '8px' }}>
            <Link href="/clubs" className="nav-link">باشگاه‌ها</Link>
            <Link href="/shop" className="nav-link">فروشگاه</Link>
            <Link href="/rankings" className="nav-link">رنکینگ</Link>
            <Link href="/live" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, padding: '6px 2px', transition: 'color 0.3s ease', whiteSpace: 'nowrap', textDecoration: 'none' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444', animation: 'glowPulse 2s infinite', display: 'inline-block', flexShrink: 0 }} />
              زنده
            </Link>

            {/* اکتشاف */}
            <div ref={exploreRef} style={{ position: 'relative' }}>
              <button className="explore-btn" onClick={() => setExploreOpen(p => !p)}>
                اکتشاف
                <ChevronDown size={13} style={{ transition: 'transform 0.3s ease', transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {exploreOpen && (
                <div className="dropdown-anim" style={{
                  position: 'absolute',
                  top: 'calc(100% + 16px)',
                  right: '-20px',
                  width: '640px',
                  background: 'rgba(5,15,10,0.97)',
                  border: '1px solid rgba(16,185,129,0.12)',
                  borderRadius: '20px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.05)',
                  backdropFilter: 'blur(30px)',
                  padding: '20px',
                  zIndex: 200,
                }}>
                  {/* هدر dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#10b981', letterSpacing: '0.15em', fontWeight: 600 }}>EXPLORE BILLIARD PLUS</span>
                    <button onClick={() => setExploreOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '4px' }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* گریدِ منو */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {exploreMenu.map((section, si) => (
                      <div key={si}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '8px', padding: '0 12px' }}>
                          {section.title.toUpperCase()}
                        </div>
                        {section.items.map((item, ii) => (
                          <Link key={ii} href={item.href} className="dropdown-item" onClick={() => setExploreOpen(false)}>
                            <span className="item-icon">{item.icon}</span>
                            <div>
                              <div className="item-label">{item.label}</div>
                              <div className="item-desc">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* فوتر dropdown */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>پلتفرم تخصصی بیلیارد ایران</span>
                    <Link href="/register" onClick={() => setExploreOpen(false)} style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      ثبت‌نام رایگان ←
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* سرچ */}
          <div style={{ flex: 1, maxWidth: '300px', marginRight: 'auto' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '8px 14px',
              transition: 'all 0.3s ease',
            }}>
              <Search size={14} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="جستجو..."
                className="search-input"
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '13px', width: '100%' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0 }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* سمت چپ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

            {/* زنگوله */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s ease' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px #ef4444' }} />
            </button>

            {/* سبد خرید */}
            <Link href="/shop" style={{ position: 'relative', padding: '8px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s ease', display: 'flex' }}>
              <ShoppingCart size={18} />
            </Link>

            {/* پروفایل */}
            {!user ? (
              <Link href="/login">
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '10px',
                  padding: '7px 16px',
                  color: '#6ee7b7',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}>
                  <User size={14} />
                  ورود
                </button>
              </Link>
            ) : (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(p => !p)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '12px' }}>
                    {user.firstName?.[0]}
                  </div>
                  {user.firstName}
                  <ChevronDown size={12} style={{ transition: 'transform 0.3s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {profileOpen && (
                  <div className="dropdown-anim" style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: 0,
                    width: '200px',
                    background: 'rgba(5,15,10,0.97)',
                    border: '1px solid rgba(16,185,129,0.12)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(30px)',
                    padding: '8px',
                    zIndex: 200,
                  }}>
                    {[
                      { href: '/dashboard', label: 'داشبورد' },
                      { href: '/dashboard/shop', label: 'فروشگاه من' },
                      ...(user.primaryRole === 'club_owner' ? [{ href: '/dashboard/club', label: 'مدیریت باشگاه' }] : []),
                      ...(user.primaryRole === 'admin' ? [{ href: '/admin', label: '⚡ پنل ادمین' }] : []),
                      { href: '/profile', label: 'ویرایش پروفایل' },
                    ].map((item, i) => (
                      <Link key={i} href={item.href} onClick={() => setProfileOpen(false)} style={{ display: 'block', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, transition: 'all 0.2s ease', textDecoration: 'none' }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(16,185,129,0.08)'; (e.target as HTMLElement).style.color = '#e2e8f0'; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                    <button onClick={() => { logout(); setProfileOpen(false); router.push('/'); }} style={{ display: 'block', width: '100%', textAlign: 'right', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', color: 'rgba(239,68,68,0.7)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.target as HTMLElement).style.color = '#fca5a5'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = 'rgba(239,68,68,0.7)'; }}>
                      خروج
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* spacer برای صفحات غیر home */}
      {!isHomePage && <div style={{ height: '64px' }} />}
    </>
  );
}
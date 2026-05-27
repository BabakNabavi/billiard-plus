'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import {
  Menu, X, ChevronDown, Bell, User, LogOut,
  LayoutDashboard, MessageCircle, ShoppingBag,
  Trophy, Shield, Calendar, Wrench, Users,
  Home, BookOpen, Store, Search,
} from 'lucide-react';

const NAV_LINKS = [
  {
    label: 'اکوسیستم',
    icon: <Home size={14}/>,
    children: [
      { href:'/clubs',    label:'باشگاه‌ها',     icon:'🎱', desc:'کشف بهترین باشگاه‌ها' },
      { href:'/players',  label:'بازیکنان',       icon:'👤', desc:'پروفایل و رنکینگ' },
      { href:'/coaches',  label:'مربیان',          icon:'⭐', desc:'آموزش تخصصی' },
      { href:'/referees', label:'داوران',          icon:'🛡️', desc:'داوران رسمی' },
    ],
  },
  {
    label: 'مسابقات',
    icon: <Trophy size={14}/>,
    children: [
      { href:'/events',   label:'مسابقات',        icon:'🏆', desc:'تورنومنت‌های فعال' },
      { href:'/live',     label:'زنده',            icon:'🔴', desc:'نتایج آنی' },
      { href:'/rankings', label:'رنکینگ',          icon:'📊', desc:'جدول رتبه‌بندی' },
    ],
  },
  {
    label: 'بازار',
    icon: <Store size={14}/>,
    children: [
      { href:'/shop',     label:'فروشگاه',         icon:'🛒', desc:'تجهیزات حرفه‌ای' },
      { href:'/brands',   label:'برندها',           icon:'🏷️', desc:'برندهای معتبر' },
      { href:'/services', label:'خدمات فنی',        icon:'🔧', desc:'نصب و تعمیر' },
    ],
  },
  {
    label: 'رویدادها',
    icon: <Calendar size={14}/>,
    children: [
      { href:'/expo',     label:'نمایشگاه‌ها',    icon:'🏛️', desc:'اکسپو و همایش' },
      { href:'/news',     label:'اخبار',            icon:'📰', desc:'جدیدترین اخبار' },
    ],
  },
];

function toFa(v: string|number){ return String(v).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d))); }

export default function Navbar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, logout, _hydrated } = useAuthStore();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu,   setOpenMenu]   = useState<string|null>(null);
  const [userOpen,   setUserOpen]   = useState(false);
  const dropRef     = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);

  /* scroll detect */
  useEffect(() => {
    const fn = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    window.addEventListener('scroll', fn, { passive:true });
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* close on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpenMenu(null); setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* close mobile on nav */
  useEffect(() => { setMobileOpen(false); setOpenMenu(null); }, [pathname]);

  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => { logout(); router.push('/'); setUserOpen(false); };

  return (
    <>
      <style>{`
        @keyframes navDropIn  { from{opacity:0;transform:translateY(-8px) scale(0.97);}to{opacity:1;transform:none;} }
        @keyframes mobileIn   { from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:none;} }
        @keyframes fadeInFast { from{opacity:0;}to{opacity:1;} }

        .nav-item-link {
          display:flex; align-items:center; gap:8px;
          padding:7px 12px; border-radius:10px;
          font-size:13.5px; font-weight:600;
          color:rgba(15,31,20,0.62);
          text-decoration:none;
          transition:all 0.18s cubic-bezier(0.4,0,0.2,1);
          white-space:nowrap; cursor:pointer;
          background:transparent; border:none; font-family:inherit;
          position:relative;
        }
        .nav-item-link:hover {
          color:#15803d;
          background:rgba(22,163,74,0.07);
        }
        .nav-item-link.open {
          color:#15803d;
          background:rgba(22,163,74,0.08);
        }
        .nav-item-link.active {
          color:#15803d;
          background:rgba(22,163,74,0.10);
          font-weight:700;
        }

        .drop-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; border-radius:12px;
          text-decoration:none; transition:all 0.18s;
          cursor:pointer;
        }
        .drop-item:hover {
          background:rgba(22,163,74,0.07);
        }
        .drop-item:hover .drop-label { color:#15803d; }

        .mobile-link {
          display:flex; align-items:center; gap:12px;
          padding:14px 20px; text-decoration:none;
          font-size:15px; font-weight:600;
          color:rgba(15,31,20,0.75);
          border-bottom:1px solid rgba(0,40,18,0.05);
          transition:all 0.18s;
        }
        .mobile-link:hover { background:rgba(22,163,74,0.05); color:#15803d; }
        .mobile-link:last-child { border-bottom:none; }

        .user-drop-item {
          display:flex; align-items:center; gap:10px;
          padding:9px 14px; border-radius:10px;
          font-size:13px; font-weight:600;
          color:rgba(15,31,20,0.65);
          transition:all 0.18s; cursor:pointer;
          border:none; background:none; font-family:inherit; width:100%; text-align:right;
          text-decoration:none;
        }
        .user-drop-item:hover { background:rgba(22,163,74,0.06); color:#15803d; }
        .user-drop-item.danger:hover { background:rgba(220,38,38,0.06); color:#dc2626; }

        /* Chevron rotate */
        .nav-chevron { transition:transform 0.22s ease; }
        .nav-chevron.open { transform:rotate(180deg); }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '62px',
        background: scrolled
          ? 'rgba(236,244,236,0.85)'
          : 'rgba(240,246,240,0.72)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.65)'
          : '1px solid rgba(255,255,255,0.50)',
        boxShadow: scrolled
          ? '0 2px 20px rgba(0,30,12,0.07), 0 1px 0 rgba(255,255,255,0.8)'
          : '0 1px 0 rgba(255,255,255,0.60)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Inner */}
        <div style={{
          maxWidth: '1320px', margin: '0 auto',
          height: '100%', padding: '0 clamp(14px,3vw,32px)',
          display: 'flex', alignItems: 'center', gap: '6px',
          position: 'relative',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            textDecoration: 'none', flexShrink: 0, marginLeft: '20px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 900, color: '#fff',
              boxShadow: '0 3px 10px rgba(22,163,74,0.30), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>B</div>
            <span style={{
              fontSize: '17px', fontWeight: 900, letterSpacing: '-0.025em',
              color: '#0f1f14',
            }}>
              بیلیارد{' '}
              <span style={{
                background: 'linear-gradient(135deg,#16a34a,#0d9488)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>پلاس</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav ref={dropRef} style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            flex: 1,
          }} className="hidden-mobile">

            {NAV_LINKS.map(item => (
              <div key={item.label} style={{ position: 'relative' }}>
                <button
                  className={`nav-item-link ${openMenu===item.label?'open':''}`}
                  onClick={() => setOpenMenu(openMenu===item.label ? null : item.label)}
                >
                  {item.icon}
                  {item.label}
                  <ChevronDown size={13} className={`nav-chevron ${openMenu===item.label?'open':''}`} style={{ opacity:0.5 }}/>
                </button>

                {/* Dropdown */}
                {openMenu === item.label && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    minWidth: '240px',
                    background: 'rgba(248,252,248,0.94)',
                    border: '1px solid rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: '18px',
                    padding: '8px',
                    boxShadow: '0 12px 48px rgba(0,30,12,0.12), 0 2px 8px rgba(0,30,12,0.06), inset 0 1px 0 rgba(255,255,255,0.80)',
                    animation: 'navDropIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
                    zIndex: 200,
                  }}>
                    {/* Shimmer top */}
                    <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)', borderRadius:'1px' }}/>

                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} className="drop-item"
                        onClick={() => setOpenMenu(null)}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: 'rgba(22,163,74,0.07)',
                          border: '1px solid rgba(22,163,74,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', flexShrink: 0,
                        }}>{child.icon}</div>
                        <div>
                          <div className="drop-label" style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(15,31,20,0.85)', transition: 'color 0.18s', marginBottom: '2px' }}>
                            {child.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(15,31,20,0.40)' }}>{child.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Direct links */}
            <Link href="/messages" className={`nav-item-link ${pathname==='/messages'?'active':''}`} style={{ position:'relative' }}>
              <MessageCircle size={14}/>
              پیام‌ها
            </Link>
          </nav>

          {/* ── Right side ── */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginRight:'auto', flexShrink:0 }}>

            {/* Search pill */}
            <button style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.70)',
              borderRadius: '10px',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '12px', color: 'rgba(15,31,20,0.45)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 1px 4px rgba(0,30,12,0.06)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.80)'; (e.currentTarget as HTMLElement).style.color='rgba(15,31,20,0.65)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.55)'; (e.currentTarget as HTMLElement).style.color='rgba(15,31,20,0.45)';}}>
              <Search size={13}/> جستجو
            </button>

            {_hydrated && !user ? (
              /* Auth buttons */
              <>
                <Link href="/login" style={{
                  padding: '8px 16px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 600,
                  color: 'rgba(15,31,20,0.65)',
                  background: 'rgba(255,255,255,0.50)',
                  border: '1px solid rgba(255,255,255,0.65)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 1px 4px rgba(0,30,12,0.05)',
                }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.80)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.50)';}}>
                  ورود
                </Link>
                <Link href="/register" style={{
                  padding: '8px 18px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg,#16a34a,#15803d)',
                  border: 'none', textDecoration: 'none', transition: 'all 0.2s',
                  boxShadow: '0 3px 10px rgba(22,163,74,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}>
                  ثبت‌نام
                </Link>
              </>
            ) : _hydrated && user ? (
              /* User menu */
              <div style={{ position:'relative' }} ref={dropRef}>
                <button onClick={()=>setUserOpen(p=>!p)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px 5px 5px',
                  background: userOpen ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.60)',
                  border: '1px solid rgba(255,255,255,0.70)',
                  borderRadius: '12px', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 1px 6px rgba(0,30,12,0.06)',
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 900, color: '#fff',
                    boxShadow: '0 2px 6px rgba(22,163,74,0.30)',
                  }}>{user.firstName?.[0] ?? 'U'}</div>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'rgba(15,31,20,0.75)', maxWidth:'80px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {user.firstName}
                  </span>
                  <ChevronDown size={12} className={`nav-chevron ${userOpen?'open':''}`} style={{ color:'rgba(15,31,20,0.40)' }}/>
                </button>

                {userOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                    minWidth: '220px',
                    background: 'rgba(248,252,248,0.95)',
                    border: '1px solid rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: '18px', padding: '8px',
                    boxShadow: '0 12px 48px rgba(0,30,12,0.12), inset 0 1px 0 rgba(255,255,255,0.80)',
                    animation: 'navDropIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
                    zIndex: 200,
                  }}>
                    {/* User info */}
                    <div style={{ padding:'10px 14px 12px', marginBottom:'4px', borderBottom:'1px solid rgba(0,40,18,0.06)' }}>
                      <div style={{ fontSize:'14px', fontWeight:800, color:'#0f1f14' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize:'11px', color:'rgba(15,31,20,0.40)', marginTop:'2px' }}>{user.primaryRole==='admin'?'ادمین':user.primaryRole==='coach'?'مربی':'بازیکن'}</div>
                    </div>

                    {[
                      { href:'/dashboard', icon:<LayoutDashboard size={14}/>, label:'داشبورد' },
                      { href:'/messages',  icon:<MessageCircle size={14}/>,   label:'پیام‌ها'  },
                      { href:'/seller',    icon:<ShoppingBag size={14}/>,     label:'فروشگاه من' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} className="user-drop-item" onClick={()=>setUserOpen(false)}>
                        <span style={{ color:'rgba(15,31,20,0.45)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div style={{ height:'1px', background:'rgba(0,40,18,0.06)', margin:'6px 0' }}/>

                    <button className="user-drop-item danger" onClick={handleLogout}>
                      <LogOut size={14} style={{ color:'rgba(220,38,38,0.55)' }}/>
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Loading skeleton */
              <div style={{ width:'90px', height:'36px', borderRadius:'12px', background:'rgba(0,40,18,0.06)' }}/>
            )}

            {/* Mobile menu toggle */}
            <button onClick={()=>setMobileOpen(p=>!p)} style={{
              display: 'none',
              width: '38px', height: '38px', borderRadius: '11px',
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.68)',
              cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(15,31,20,0.65)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }} className="mobile-toggle">
              {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE DRAWER ══ */}
      {mobileOpen && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(6,13,9,0.35)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeInFast 0.2s ease both',
          }} onClick={() => setMobileOpen(false)}/>

          <div style={{
            position: 'fixed', top: '62px', right: 0, bottom: 0,
            width: 'min(320px,88vw)', zIndex: 999,
            background: 'rgba(242,248,242,0.97)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            borderLeft: '1px solid rgba(255,255,255,0.65)',
            boxShadow: '-8px 0 40px rgba(0,30,12,0.12)',
            overflowY: 'auto',
            animation: 'mobileIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
          }}>

            {/* Inner shimmer */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)' }}/>

            <div style={{ padding:'8px 0 24px' }}>
              {NAV_LINKS.map(item => (
                <div key={item.label}>
                  <div style={{ padding:'10px 20px 6px', fontSize:'10px', fontWeight:700, letterSpacing:'0.15em', color:'rgba(15,31,20,0.35)', textTransform:'uppercase' }}>
                    {item.label}
                  </div>
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href} className="mobile-link">
                      <span style={{ fontSize:'20px', flexShrink:0 }}>{child.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'14px' }}>{child.label}</div>
                        <div style={{ fontSize:'11px', color:'rgba(15,31,20,0.40)', marginTop:'1px' }}>{child.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}

              {/* Auth section */}
              <div style={{ padding:'16px 16px 0', borderTop:'1px solid rgba(0,40,18,0.06)', marginTop:'8px' }}>
                {user ? (
                  <div>
                    <Link href="/dashboard" className="mobile-link" style={{ borderRadius:'12px', marginBottom:'6px' }}>
                      <LayoutDashboard size={18} style={{ color:'#16a34a', flexShrink:0 }}/>
                      <div>
                        <div style={{ fontWeight:700 }}>داشبورد</div>
                        <div style={{ fontSize:'11px', color:'rgba(15,31,20,0.40)' }}>{user.firstName} {user.lastName}</div>
                      </div>
                    </Link>
                    <button onClick={handleLogout} style={{ width:'100%', padding:'13px 18px', borderRadius:'12px', background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.12)', color:'#dc2626', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'10px', marginTop:'8px' }}>
                      <LogOut size={15}/> خروج از حساب
                    </button>
                  </div>
                ) : (
                  <div style={{ display:'flex', gap:'8px' }}>
                    <Link href="/login" style={{ flex:1, padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.70)', border:'1px solid rgba(255,255,255,0.75)', color:'rgba(15,31,20,0.70)', fontSize:'13px', fontWeight:700, textAlign:'center', textDecoration:'none', backdropFilter:'blur(8px)' }}>
                      ورود
                    </Link>
                    <Link href="/register" style={{ flex:1, padding:'12px', borderRadius:'12px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontSize:'13px', fontWeight:700, textAlign:'center', textDecoration:'none', boxShadow:'0 4px 12px rgba(22,163,74,0.28)' }}>
                      ثبت‌نام
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={{ height: '62px' }}/>

      {/* CSS for responsive */}
      <style>{`
        @media(max-width:900px) {
          .hidden-mobile { display:none !important; }
          .mobile-toggle { display:flex !important; }
        }
      `}</style>
    </>
  );
}
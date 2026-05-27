'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, MapPin, Users, Clock, Ticket, Share2,
  ChevronRight, Check, Star, Award, Globe, Play,
  ChevronLeft, Heart, Bell, CheckCircle, X,
  Shield, Zap, Camera, MessageCircle,
} from 'lucide-react';

/* ══ data ══ */
const EVENTS: Record<string,any> = {
  e1: {
    id:'e1', title:'نمایشگاه بین‌المللی بیلیارد ایران', subtitle:'Iran Billiard Expo 2024',
    type:'expo', status:'upcoming',
    date:'۱۴۰۴/۰۴/۱۵', endDate:'۱۴۰۴/۰۴/۱۸', time:'۱۰:۰۰ - ۲۰:۰۰',
    city:'تهران', venue:'نمایشگاه بین‌المللی تهران، سالن ۳۸', address:'تهران، خیابان چمران، نمایشگاه بین‌المللی',
    coverImg:'/images/billiadr-club-1.jpg', accentColor:'#10b981',
    capacity:5000, registered:3840, price:0, isFree:true, isSoldOut:false,
    description:'بزرگترین رویداد سالانه صنعت بیلیارد ایران با حضور بیش از ۵۰ برند داخلی و خارجی. در این نمایشگاه می‌توانید جدیدترین تجهیزات، میزها، چوب‌ها، و لوازم جانبی را از نزدیک مشاهده کرده و با کارشناسان برندهای معتبر در تماس باشید.',
    highlights:['نمایش جدیدترین تجهیزات','دموی زنده برندها','مسابقات نمایشی','کارگاه آموزشی','شبکه‌سازی صنعتی'],
    agenda:[
      { day:'روز اول — ۱۵ تیر', sessions:[
        { time:'۱۰:۰۰', title:'افتتاحیه رسمی', desc:'با حضور رئیس فدراسیون',              duration:'۳۰ دقیقه' },
        { time:'۱۱:۰۰', title:'پنل برندهای خارجی', desc:'معرفی محصولات جدید ۲۰۲۴',      duration:'۹۰ دقیقه' },
        { time:'۱۴:۰۰', title:'کارگاه کلاث‌کشی', desc:'توسط مهدی کرمی',                  duration:'۲ ساعت'    },
        { time:'۱۷:۰۰', title:'مسابقه نمایشی', desc:'امیرحسین رضایی vs سعید موسوی',       duration:'۲ ساعت'    },
      ]},
      { day:'روز دوم — ۱۶ تیر', sessions:[
        { time:'۱۰:۰۰', title:'همایش مربیان', desc:'با سخنرانی کاوه نوری',                duration:'۳ ساعت'    },
        { time:'۱۴:۰۰', title:'نشست برندهای ایرانی', desc:'فرصت‌های صادراتی',            duration:'۹۰ دقیقه' },
        { time:'۱۸:۰۰', title:'شب گردهمایی', desc:'شبکه‌سازی و تبادل تجربه',             duration:'۲ ساعت'    },
      ]},
    ],
    speakers:[
      { name:'کاوه نوری',       title:'مربی ارشد ملی',          avatar:'ک', color:'#10b981' },
      { name:'مهدی کرمی',       title:'متخصص نصب و کلاث',       avatar:'م', color:'#f59e0b' },
      { name:'داوود حسینی',     title:'داور بین‌المللی',        avatar:'د', color:'#a78bfa' },
      { name:'سارا محمدی',      title:'مربی پاکت بیلیارد',      avatar:'س', color:'#06b6d4' },
    ],
    sponsors:[
      { name:'PREDATOR',   tier:'platinum', color:'#10b981' },
      { name:'ARAMITH',    tier:'platinum', color:'#06b6d4' },
      { name:'ویراکا',     tier:'gold',     color:'#f59e0b' },
      { name:'RILEY',      tier:'gold',     color:'#a78bfa' },
      { name:'فدراسیون بیلیارد', tier:'official', color:'#ef4444' },
    ],
    gallery:['/images/billiadr-club-1.jpg','/images/billiadr-club-3.jpg','/images/billiadr-club-1.jpg','/images/billiadr-club-3.jpg'],
    faqs:[
      { q:'آیا ورودی رایگان است؟', a:'بله، ورود به نمایشگاه برای عموم رایگان است و نیاز به ثبت‌نام آنلاین دارد.' },
      { q:'پارکینگ وجود دارد؟', a:'پارکینگ اختصاصی با ظرفیت ۵۰۰ خودرو در محل نمایشگاه موجود است.' },
      { q:'آیا کارگاه‌ها نیاز به ثبت‌نام جداگانه دارند؟', a:'بله، ظرفیت کارگاه‌ها محدود است و باید جداگانه ثبت‌نام کنید.' },
    ],
  },
  e2: {
    id:'e2', title:'کارگاه تخصصی کلاث‌کشی حرفه‌ای', subtitle:'Professional Cloth Fitting Workshop',
    type:'workshop', status:'upcoming',
    date:'۱۴۰۴/۰۳/۲۸', time:'۰۹:۰۰ - ۱۷:۰۰',
    city:'تهران', venue:'باشگاه سنچوری تهران', address:'تهران، خ ولیعصر، بالاتر از ونک',
    coverImg:'/images/billiadr-club-3.jpg', accentColor:'#f59e0b',
    capacity:30, registered:27, price:2500000, isFree:false, isSoldOut:false,
    description:'کارگاه یک‌روزه تخصصی آموزش کلاث‌کشی حرفه‌ای برای متخصصان و علاقه‌مندان. در این کارگاه تمام مراحل کلاث‌کشی از صفر تا صد به‌صورت عملی آموزش داده می‌شود.',
    highlights:['آموزش عملی روی میز واقعی','گواهی معتبر حضور','ابزار رایگان','مطالب آموزشی PDF'],
    agenda:[
      { day:'برنامه کارگاه', sessions:[
        { time:'۰۹:۰۰', title:'آشنایی با انواع کلاث', desc:'Strachan, Hainsworth, Predator',  duration:'۶۰ دقیقه' },
        { time:'۱۰:۰۰', title:'آماده‌سازی میز', desc:'برداشتن کلاث قدیمی و آماده‌سازی',   duration:'۶۰ دقیقه' },
        { time:'۱۲:۰۰', title:'ناهار',           desc:'',                                    duration:'۶۰ دقیقه' },
        { time:'۱۳:۰۰', title:'نصب عملی کلاث',  desc:'تکنیک‌های کشش و چسباندن',           duration:'۲ ساعت'    },
        { time:'۱۵:۰۰', title:'تراز و تنظیم',   desc:'تراز لیزری دقیق',                    duration:'۹۰ دقیقه' },
        { time:'۱۶:۳۰', title:'آزمون و گواهی',  desc:'اعطای گواهی حضور',                   duration:'۳۰ دقیقه' },
      ]},
    ],
    speakers:[
      { name:'مهدی کرمی',    title:'متخصص ارشد نصب و کلاث', avatar:'م', color:'#10b981' },
      { name:'علیرضا صادقی', title:'متخصص نورپردازی',        avatar:'ع', color:'#a78bfa' },
    ],
    sponsors:[
      { name:'Strachan',   tier:'platinum', color:'#10b981' },
      { name:'Hainsworth', tier:'gold',     color:'#f59e0b' },
      { name:'ویراکا',     tier:'partner',  color:'#06b6d4' },
    ],
    gallery:['/images/billiadr-club-3.jpg','/images/billiadr-club-1.jpg'],
    faqs:[
      { q:'چه چیزی باید بیاوریم؟', a:'لباس راحت و مناسب کار. تمام ابزار و مواد توسط برگزارکننده فراهم می‌شود.' },
      { q:'آیا مدرک معتبر صادر می‌شود؟', a:'بله، گواهی حضور از سوی برگزارکننده و حامیان صادر می‌شود.' },
    ],
  },
};

function toFa(v: string|number){ return String(v).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d))); }

const TIER_CFG: Record<string,{label:string;color:string;bg:string;border:string}> = {
  platinum: { label:'پلاتینیوم', color:'#e2e8f0', bg:'rgba(226,232,240,0.1)', border:'rgba(226,232,240,0.2)' },
  gold:     { label:'طلایی',     color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)'  },
  official: { label:'رسمی',      color:'#10b981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.2)'  },
  partner:  { label:'همکار',     color:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.2)' },
};

export default function ExpoDetailPage() {
  const params = useParams();
  const id     = String(params.id ?? 'e1');
  const ev     = EVENTS[id] ?? EVENTS['e1'];

  const [tab,       setTab]      = useState<'overview'|'agenda'|'speakers'|'gallery'>('overview');
  const [saved,     setSaved]    = useState(false);
  const [registered,setReg]      = useState(false);
  const [openFaq,   setFaq]      = useState<number|null>(null);
  const [scrollY,   setScrollY]  = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const fn = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(()=>setScrollY(window.scrollY)); };
    window.addEventListener('scroll', fn, { passive:true });
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafRef.current); };
  }, []);

  const heroOp = Math.max(0, 1-scrollY/600);
  const pct    = Math.round((ev.registered/ev.capacity)*100);

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;} }
        @keyframes pulse   { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        @keyframes ambient { 0%,100%{transform:translate(0,0);}50%{transform:translate(20px,-14px);} }
        .tab-b { padding:10px 20px; border-radius:10px; font-size:13px; font-weight:600; border:1px solid transparent; cursor:pointer; font-family:inherit; transition:all 0.3s; white-space:nowrap; }
        .tab-b.active { background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.3); color:#10b981; }
        .tab-b:not(.active) { background:rgba(255,255,255,0.03); color:rgba(240,250,245,0.4); }
        .tab-b:not(.active):hover { background:rgba(255,255,255,0.06); color:rgba(240,250,245,0.7); }
        .faq-item { padding:16px 18px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:14px; cursor:pointer; transition:all 0.25s; }
        .faq-item:hover { background:rgba(255,255,255,0.04); }
        @media(max-width:900px) { .ev-g{grid-template-columns:1fr !important;} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#020806,#060d0a)', paddingBottom:'80px' }}>

        {/* ══ HERO ══ */}
        <div style={{ position:'relative', height:'clamp(420px,56vh,600px)', overflow:'hidden' }}>
          <img src={ev.coverImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.14) saturate(0.4) contrast(1.2)' }} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 60% at 20% 70%,${ev.accentColor}12,transparent 100%)` }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(2,8,6,0.5) 0%,transparent 28%,rgba(2,8,6,0.97) 100%)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left,rgba(2,8,6,0.6) 0%,transparent 55%)' }}/>
          <div style={{ position:'absolute', top:'-15%', left:'-5%', width:'50vw', height:'50vw', maxWidth:'500px', borderRadius:'50%', background:`radial-gradient(${ev.accentColor}06,transparent 65%)`, filter:'blur(40px)', animation:'ambient 14s ease-in-out infinite', pointerEvents:'none' }}/>

          {/* Nav */}
          <div style={{ position:'absolute', top:'24px', left:0, right:0, padding:'0 clamp(16px,4vw,48px)', display:'flex', justifyContent:'space-between', zIndex:10 }}>
            <Link href="/expo" style={{ display:'flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.5)', fontSize:'12px', textDecoration:'none', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'7px 14px' }}>
              <ChevronRight size={13}/> رویدادها
            </Link>
            <div style={{ display:'flex', gap:'6px' }}>
              <button onClick={()=>setSaved(s=>!s)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'7px 14px', background: saved?'rgba(239,68,68,0.12)':'rgba(0,0,0,0.4)', backdropFilter:'blur(16px)', border:`1px solid ${saved?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.08)'}`, borderRadius:'10px', cursor:'pointer', color: saved?'#ef4444':'rgba(255,255,255,0.5)', fontSize:'12px', fontFamily:'inherit' }}>
                <Heart size={12} style={{ fill: saved?'#ef4444':'transparent' }}/>{saved?'ذخیره شد':'ذخیره'}
              </button>
              <button style={{ display:'flex', alignItems:'center', gap:'5px', padding:'7px 14px', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:'12px', fontFamily:'inherit' }}>
                <Share2 size={12}/> اشتراک
              </button>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'clamp(24px,4vw,52px)', zIndex:10, opacity:heroOp }}>
            <div style={{ maxWidth:'680px' }}>
              {/* Type + status */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:`${ev.accentColor}12`, border:`1px solid ${ev.accentColor}28`, borderRadius:'20px', padding:'5px 14px', backdropFilter:'blur(16px)' }}>
                  <span style={{ fontSize:'9px', color:ev.accentColor, fontWeight:700, letterSpacing:'0.12em' }}>
                    {ev.type==='expo'?'🏛️ نمایشگاه':ev.type==='workshop'?'🔧 کارگاه':ev.type==='seminar'?'🎤 همایش':'رویداد'}
                  </span>
                </div>
                {ev.status==='live' && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'20px', padding:'5px 14px' }}>
                    <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:'0 0 6px #ef4444' }}/>
                    <span style={{ fontSize:'9px', color:'#ef4444', fontWeight:700 }}>LIVE NOW</span>
                  </div>
                )}
              </div>

              <h1 style={{ fontSize:'clamp(26px,5.5vw,56px)', fontWeight:900, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.04em', lineHeight:1.0, textShadow:`0 0 60px ${ev.accentColor}18` }}>
                {ev.title}
              </h1>
              <div style={{ fontSize:'14px', color:`${ev.accentColor}90`, fontWeight:600, marginBottom:'14px' }}>{ev.subtitle}</div>

              <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'22px', fontSize:'13px', color:'rgba(255,255,255,0.6)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={12} style={{ color:ev.accentColor }}/>{ev.date}{ev.endDate?' — '+ev.endDate:''}</span>
                <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Clock size={12} style={{ color:ev.accentColor }}/>{ev.time}</span>
                <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={12} style={{ color:ev.accentColor }}/>{ev.city} — {ev.venue.split('،')[0]}</span>
              </div>

              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                <button onClick={()=>setReg(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 26px', background: registered?'rgba(16,185,129,0.2)':`linear-gradient(135deg,${ev.accentColor},${ev.accentColor}cc)`, border: registered?'1px solid rgba(16,185,129,0.3)':'none', borderRadius:'13px', color: registered?'#10b981':'#fff', fontSize:'14px', fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow: registered?'none':`0 8px 24px ${ev.accentColor}35`, transition:'all 0.3s' }}>
                  {registered ? <><Check size={16}/>ثبت‌نام شدید!</> : <><Ticket size={16}/>{ev.isFree?'ثبت‌نام رایگان':'خرید بلیت'}</>}
                </button>
                {!registered && (
                  <button onClick={()=>setSaved(s=>!s)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'12px 18px', borderRadius:'13px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.7)', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    <Bell size={14}/> یادآوری
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ STATS BAR ══ */}
        <div style={{ background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'0 clamp(16px,4vw,48px)' }}>
          <div style={{ maxWidth:'1280px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
            {[
              { v:toFa(ev.capacity),                 l:'ظرفیت کل',    c:ev.accentColor },
              { v:toFa(ev.registered),               l:'ثبت‌نام شده',  c:'#10b981' },
              { v:`${toFa(pct)}٪`,                   l:'اشغال ظرفیت', c:'#f59e0b' },
              { v:ev.isFree?'رایگان':toFa(ev.price.toLocaleString())+'ت', l:'قیمت بلیت', c:'#a78bfa' },
            ].map((s,i) => (
              <div key={i} style={{ padding:'18px 10px', textAlign:'center', borderLeft: i>0?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ fontSize:'clamp(16px,2.5vw,22px)', fontWeight:900, color:'#f0faf5', letterSpacing:'-0.02em', textShadow:`0 0 14px ${s.c}20` }}>{s.v}</div>
                <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'3px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ MAIN ══ */}
        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'clamp(24px,4vw,40px) clamp(16px,3vw,32px)' }}>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'32px', overflowX:'auto', padding:'2px' }}>
            {[{k:'overview',l:'خلاصه'},{k:'agenda',l:'برنامه'},{k:'speakers',l:`سخنرانان (${ev.speakers.length})`},{k:'gallery',l:'گالری'}].map(t => (
              <button key={t.k} className={`tab-b ${tab===t.k?'active':''}`} onClick={()=>setTab(t.k as any)}>{t.l}</button>
            ))}
          </div>

          <div className="ev-g" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'28px', alignItems:'start' }}>

            {/* ── LEFT ── */}
            <div>

              {/* ════ OVERVIEW ════ */}
              {tab==='overview' && (
                <div style={{ animation:'fadeUp 0.4s ease both', display:'flex', flexDirection:'column', gap:'20px' }}>

                  {/* Description */}
                  <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'26px' }}>
                    <h3 style={{ fontSize:'15px', fontWeight:800, color:'#f0faf5', margin:'0 0 14px', display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ width:'3px', height:'16px', background:`linear-gradient(180deg,${ev.accentColor},#06b6d4)`, borderRadius:'2px', display:'inline-block' }}/>
                      درباره رویداد
                    </h3>
                    <p style={{ fontSize:'14px', color:'rgba(240,250,245,0.55)', lineHeight:1.9, margin:'0 0 20px' }}>{ev.description}</p>

                    {/* Highlights */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px' }}>
                      {ev.highlights.map((h: string, i: number) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'11px 14px', background:`${ev.accentColor}06`, border:`1px solid ${ev.accentColor}14`, borderRadius:'12px' }}>
                          <Check size={13} style={{ color:ev.accentColor, flexShrink:0 }}/>
                          <span style={{ fontSize:'13px', color:'rgba(240,250,245,0.65)' }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sponsors */}
                  <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'26px' }}>
                    <h3 style={{ fontSize:'15px', fontWeight:800, color:'#f0faf5', margin:'0 0 20px', display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ width:'3px', height:'16px', background:'linear-gradient(180deg,#f59e0b,#a78bfa)', borderRadius:'2px', display:'inline-block' }}/>
                      حامیان رویداد
                    </h3>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
                      {ev.sponsors.map((s: any, i: number) => {
                        const tc = TIER_CFG[s.tier] ?? TIER_CFG['partner']!;
                        return (
                          <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:tc.bg, border:`1px solid ${tc.border}`, borderRadius:'14px' }}>
                            <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:`${s.color}12`, border:`1px solid ${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, color:s.color, flexShrink:0 }}>
                              {s.name[0]}
                            </div>
                            <div>
                              <div style={{ fontSize:'13px', fontWeight:700, color:'#f0faf5' }}>{s.name}</div>
                              <div style={{ fontSize:'9px', color:tc.color, fontWeight:700 }}>{tc.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'26px' }}>
                    <h3 style={{ fontSize:'15px', fontWeight:800, color:'#f0faf5', margin:'0 0 18px', display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ width:'3px', height:'16px', background:'linear-gradient(180deg,#06b6d4,transparent)', borderRadius:'2px', display:'inline-block' }}/>
                      سوالات متداول
                    </h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                      {ev.faqs.map((faq: any, i: number) => (
                        <div key={i} className="faq-item" onClick={()=>setFaq(openFaq===i?null:i)}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px' }}>
                            <span style={{ fontSize:'14px', fontWeight:600, color:'#f0faf5' }}>{faq.q}</span>
                            <span style={{ fontSize:'18px', color:'rgba(240,250,245,0.3)', flexShrink:0, transition:'transform 0.3s', transform: openFaq===i?'rotate(45deg)':'none' }}>+</span>
                          </div>
                          {openFaq===i && (
                            <div style={{ marginTop:'10px', fontSize:'13px', color:'rgba(240,250,245,0.5)', lineHeight:1.7, animation:'fadeUp 0.3s ease both' }}>
                              {faq.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ════ AGENDA ════ */}
              {tab==='agenda' && (
                <div style={{ animation:'fadeUp 0.4s ease both', display:'flex', flexDirection:'column', gap:'20px' }}>
                  {ev.agenda.map((day: any, di: number) => (
                    <div key={di} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', overflow:'hidden' }}>
                      <div style={{ padding:'16px 22px', background:`${ev.accentColor}08`, borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'14px', fontWeight:800, color:ev.accentColor }}>
                        {day.day}
                      </div>
                      <div style={{ padding:'16px 22px', display:'flex', flexDirection:'column', gap:'2px' }}>
                        {day.sessions.map((s: any, si: number) => (
                          <div key={si} style={{ display:'flex', gap:'16px', padding:'13px 0', borderBottom: si<day.sessions.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                            <div style={{ width:'64px', flexShrink:0, textAlign:'center' }}>
                              <div style={{ fontSize:'13px', fontWeight:800, color:ev.accentColor, fontVariantNumeric:'tabular-nums' }}>{s.time}</div>
                              {s.duration && <div style={{ fontSize:'9px', color:'rgba(240,250,245,0.3)', marginTop:'2px' }}>{s.duration}</div>}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:'14px', fontWeight:700, color:'#f0faf5', marginBottom: s.desc?'3px':'0' }}>{s.title}</div>
                              {s.desc && <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.45)' }}>{s.desc}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ════ SPEAKERS ════ */}
              {tab==='speakers' && (
                <div style={{ animation:'fadeUp 0.4s ease both', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px' }}>
                  {ev.speakers.map((s: any, i: number) => (
                    <div key={i} style={{ padding:'20px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'18px', display:'flex', alignItems:'center', gap:'14px', transition:'all 0.35s' }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.045)';(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.025)';(e.currentTarget as HTMLElement).style.transform='none';}}>
                      <div style={{ width:'52px', height:'52px', borderRadius:'15px', background:`linear-gradient(135deg,${s.color},${s.color}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:900, color:'#fff', flexShrink:0, boxShadow:`0 6px 16px ${s.color}35` }}>
                        {s.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize:'15px', fontWeight:800, color:'#f0faf5', marginBottom:'4px', letterSpacing:'-0.01em' }}>{s.name}</div>
                        <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.45)' }}>{s.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ════ GALLERY ════ */}
              {tab==='gallery' && (
                <div style={{ animation:'fadeUp 0.4s ease both', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
                  {ev.gallery.map((img: string, i: number) => (
                    <div key={i} style={{ borderRadius:'16px', overflow:'hidden', aspectRatio:'16/9', position:'relative', cursor:'pointer' }}>
                      <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.45)', transition:'all 0.5s' }}
                        onMouseEnter={e=>{(e.target as HTMLImageElement).style.filter='brightness(0.65)';(e.target as HTMLImageElement).style.transform='scale(1.04)';}}
                        onMouseLeave={e=>{(e.target as HTMLImageElement).style.filter='brightness(0.45)';(e.target as HTMLImageElement).style.transform='none';}}
                        onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                        <Camera size={20} style={{ color:'rgba(255,255,255,0.3)' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ position:'sticky', top:'80px', display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Register card */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${ev.accentColor}22`, borderRadius:'22px', padding:'22px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'-1px', left:'50%', transform:'translateX(-50%)', width:'120px', height:'1px', background:`linear-gradient(90deg,transparent,${ev.accentColor}55,transparent)`, boxShadow:`0 0 14px ${ev.accentColor}35` }}/>

                <div style={{ fontSize:'10px', color:`${ev.accentColor}70`, letterSpacing:'0.2em', fontWeight:700, marginBottom:'16px', textAlign:'center' }}>ثبت‌نام رویداد</div>

                {/* Price */}
                <div style={{ textAlign:'center', marginBottom:'16px' }}>
                  <div style={{ fontSize:'32px', fontWeight:900, color: ev.isFree?'#10b981':ev.accentColor, lineHeight:1, letterSpacing:'-0.03em', textShadow:`0 0 24px ${ev.isFree?'#10b981':ev.accentColor}40` }}>
                    {ev.isFree?'رایگان':toFa(ev.price.toLocaleString())}
                  </div>
                  {!ev.isFree && <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.35)', marginTop:'4px' }}>تومان / نفر</div>}
                </div>

                {/* Capacity progress */}
                <div style={{ marginBottom:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(240,250,245,0.4)', marginBottom:'6px' }}>
                    <span>{toFa(ev.registered)} ثبت‌نام شده</span>
                    <span>{toFa(ev.capacity-ev.registered)} جا باقی</span>
                  </div>
                  <div style={{ height:'5px', background:'rgba(255,255,255,0.06)', borderRadius:'3px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${ev.accentColor},${ev.accentColor}80)`, borderRadius:'3px', boxShadow:`0 0 8px ${ev.accentColor}40`, transition:'width 1s ease' }}/>
                  </div>
                </div>

                <button onClick={()=>setReg(r=>!r)} style={{ width:'100%', padding:'15px', borderRadius:'13px', border:'none', background: registered?'rgba(16,185,129,0.15)':`linear-gradient(135deg,${ev.accentColor},${ev.accentColor}cc)`, color: registered?'#10b981':'#fff', fontSize:'14px', fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'all 0.3s', boxShadow: registered?'none':`0 8px 24px ${ev.accentColor}30`, display:'flex', alignItems:'center', justifyContent:'center', gap:'9px', ...(registered?{border:'1px solid rgba(16,185,129,0.3)'}:{}) }}>
                  {registered ? <><Check size={16}/>ثبت‌نام شدید!</> : <><Ticket size={16}/>{ev.isFree?'ثبت‌نام رایگان':'خرید بلیت'}</>}
                </button>

                {!registered && (
                  <button onClick={()=>setSaved(s=>!s)} style={{ width:'100%', marginTop:'8px', padding:'11px', borderRadius:'12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(240,250,245,0.6)', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px' }}>
                    <Bell size={13}/> یادآوری بگذار
                  </button>
                )}
              </div>

              {/* Event info */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'rgba(240,250,245,0.3)', letterSpacing:'0.15em', fontWeight:700, marginBottom:'14px', textTransform:'uppercase' }}>اطلاعات رویداد</div>
                {[
                  { icon:<Calendar size={13}/>,  l:'تاریخ',    v: ev.date+(ev.endDate?' — '+ev.endDate:''), c:ev.accentColor },
                  { icon:<Clock size={13}/>,     l:'زمان',     v: ev.time,                                    c:'#06b6d4'      },
                  { icon:<MapPin size={13}/>,    l:'مکان',     v: ev.venue,                                   c:'#a78bfa'      },
                  { icon:<Globe size={13}/>,     l:'شهر',      v: ev.city,                                    c:'#f59e0b'      },
                  { icon:<Users size={13}/>,     l:'ظرفیت',    v: toFa(ev.capacity)+' نفر',                   c:'#10b981'      },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'9px 0', borderBottom: i<4?'1px solid rgba(255,255,255,0.04)':'none' }}>
                    <span style={{ color:r.c, flexShrink:0, marginTop:'1px' }}>{r.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginBottom:'2px' }}>{r.l}</div>
                      <div style={{ fontSize:'12px', fontWeight:600, color:'#f0faf5', lineHeight:1.4 }}>{r.v}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'18px' }}>
                <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(240,250,245,0.45)', marginBottom:'12px', textAlign:'center' }}>اشتراک‌گذاری</div>
                <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                  {['تلگرام','اینستاگرام','واتس‌اپ'].map((n,i) => (
                    <button key={i} style={{ flex:1, padding:'8px 6px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', color:'rgba(240,250,245,0.5)', fontSize:'10px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
                      onMouseEnter={e=>{(e.currentTarget).style.background='rgba(255,255,255,0.08)';(e.currentTarget).style.color='#f0faf5';}}
                      onMouseLeave={e=>{(e.currentTarget).style.background='rgba(255,255,255,0.04)';(e.currentTarget).style.color='rgba(240,250,245,0.5)';}}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, Calendar, Users, Star, Check,
  X, Zap, Clock, Award, ChevronRight, Ticket,
  Globe, TrendingUp, Camera, Play,
} from 'lucide-react';

/* ══ types ══ */
type EventType = 'expo'|'workshop'|'seminar'|'tournament'|'gathering'|'launch';
type EventStatus = 'upcoming'|'live'|'completed';

interface ExpoEvent {
  id: string; title: string; subtitle: string;
  type: EventType; status: EventStatus;
  date: string; endDate?: string; time: string;
  city: string; venue: string;
  coverImg: string; accentColor: string;
  capacity: number; registered: number;
  price: number; isFree: boolean;
  isFeautred: boolean; isSoldOut: boolean;
  speakers: string[]; sponsors: string[];
  tags: string[]; description: string;
  highlights: string[];
}

/* ══ data ══ */
const EVENTS: ExpoEvent[] = [
  {
    id:'e1', title:'نمایشگاه بین‌المللی بیلیارد ایران', subtitle:'Iran Billiard Expo 2024',
    type:'expo', status:'upcoming',
    date:'۱۴۰۴/۰۴/۱۵', endDate:'۱۴۰۴/۰۴/۱۸', time:'۱۰:۰۰ - ۲۰:۰۰',
    city:'تهران', venue:'نمایشگاه بین‌المللی تهران، سالن ۳۸',
    coverImg:'/images/billiadr-club-1.jpg', accentColor:'#10b981',
    capacity:5000, registered:3840, price:0, isFree:true,
    isFeautred:true, isSoldOut:false,
    speakers:['مهدی کریمی','سارا احمدی','کاوه نوری'],
    sponsors:['PREDATOR','ARAMITH','ویراکا','RILEY'],
    tags:['نمایشگاه','اسنوکر','پاکت','تجهیزات'],
    description:'بزرگترین رویداد سالانه صنعت بیلیارد ایران با حضور بیش از ۵۰ برند داخلی و خارجی.',
    highlights:['نمایش جدیدترین تجهیزات','دموی زنده برندها','مسابقات نمایشی','کارگاه آموزشی'],
  },
  {
    id:'e2', title:'کارگاه تخصصی کلاث‌کشی حرفه‌ای', subtitle:'Professional Cloth Fitting Workshop',
    type:'workshop', status:'upcoming',
    date:'۱۴۰۴/۰۳/۲۸', time:'۰۹:۰۰ - ۱۷:۰۰',
    city:'تهران', venue:'باشگاه سنچوری تهران',
    coverImg:'/images/billiadr-club-3.jpg', accentColor:'#f59e0b',
    capacity:30, registered:27, price:2500000, isFree:false,
    isFeautred:true, isSoldOut:false,
    speakers:['مهدی کرمی','علیرضا صادقی'],
    sponsors:['Strachan','Hainsworth','ویراکا'],
    tags:['کارگاه','کلاث','آموزش','تخصصی'],
    description:'کارگاه یک‌روزه تخصصی آموزش کلاث‌کشی حرفه‌ای برای متخصصان و علاقه‌مندان.',
    highlights:['آموزش عملی','گواهی حضور','ابزار رایگان','پشتیبانی پس از کارگاه'],
  },
  {
    id:'e3', title:'همایش مربیان بیلیارد ایران', subtitle:'Iran Billiard Coaches Summit',
    type:'seminar', status:'upcoming',
    date:'۱۴۰۴/۰۴/۰۵', time:'۱۴:۰۰ - ۲۰:۰۰',
    city:'مشهد', venue:'هتل درویشی مشهد',
    coverImg:'/images/billiadr-club-1.jpg', accentColor:'#a78bfa',
    capacity:200, registered:168, price:1500000, isFree:false,
    isFeautred:true, isSoldOut:false,
    speakers:['کاوه نوری','سارا محمدی','امیر رضایی','نیلوفر کریمی'],
    sponsors:['فدراسیون بیلیارد','WPBSA'],
    tags:['همایش','مربیان','آموزش','فدراسیون'],
    description:'همایش سالانه مربیان بیلیارد ایران با ارائه جدیدترین متدولوژی‌های تدریس.',
    highlights:['سخنرانی‌های تخصصی','کارگاه‌های گروهی','شبکه‌سازی','گواهی فدراسیون'],
  },
  {
    id:'e4', title:'گردهمایی جامعه بیلیارد تهران', subtitle:'Tehran Billiard Community Night',
    type:'gathering', status:'upcoming',
    date:'۱۴۰۴/۰۳/۲۲', time:'۱۸:۰۰ - ۲۳:۰۰',
    city:'تهران', venue:'باشگاه آریا، سالن VIP',
    coverImg:'/images/billiadr-club-3.jpg', accentColor:'#06b6d4',
    capacity:150, registered:89, price:500000, isFree:false,
    isFeautred:false, isSoldOut:false,
    speakers:[], sponsors:['باشگاه آریا'],
    tags:['جامعه','شبکه‌سازی','تهران','غیررسمی'],
    description:'شب غیررسمی جامعه بیلیارد تهران برای شبکه‌سازی و تبادل تجربه.',
    highlights:['بازی آزاد','شبکه‌سازی','معرفی اعضای جدید','مسابقه دوستانه'],
  },
  {
    id:'e5', title:'رونمایی از میز VIRAKA Pro 2024', subtitle:'VIRAKA Pro 2024 Launch Event',
    type:'launch', status:'live',
    date:'۱۴۰۴/۰۳/۱۸', time:'۱۶:۰۰ - ۲۰:۰۰',
    city:'تهران', venue:'دفتر مرکزی ویراکا',
    coverImg:'/images/billiadr-club-1.jpg', accentColor:'#ef4444',
    capacity:100, registered:100, price:0, isFree:true,
    isFeautred:false, isSoldOut:true,
    speakers:['مدیرعامل ویراکا'],
    sponsors:['ویراکا'],
    tags:['رونمایی','ویراکا','میز جدید'],
    description:'رونمایی رسمی از جدیدترین میز اسنوکر حرفه‌ای ویراکا.',
    highlights:['دموی زنده','تخفیف پیش‌خرید','قرعه‌کشی'],
  },
  {
    id:'e6', title:'نمایشگاه عکس بیلیارد ایران', subtitle:'Iran Billiard Photography Expo',
    type:'expo', status:'completed',
    date:'۱۴۰۴/۰۲/۱۰', endDate:'۱۴۰۴/۰۲/۱۵', time:'۱۰:۰۰ - ۲۰:۰۰',
    city:'اصفهان', venue:'گالری عکس فرهنگسرای اصفهان',
    coverImg:'/images/billiadr-club-3.jpg', accentColor:'#a78bfa',
    capacity:2000, registered:2000, price:0, isFree:true,
    isFeautred:false, isSoldOut:true,
    speakers:[], sponsors:['فرهنگسرای اصفهان'],
    tags:['عکاسی','هنر','فرهنگ','اصفهان'],
    description:'نمایشگاه عکس تخصصی با موضوع بیلیارد از عکاسان برتر ایران.',
    highlights:['۱۵۰ عکس برتر','رقابت عکاسی','جوایز نقدی'],
  },
];

const TYPE_CFG: Record<EventType,{label:string;icon:string;color:string}> = {
  expo:       { label:'نمایشگاه',  icon:'🏛️', color:'#10b981' },
  workshop:   { label:'کارگاه',    icon:'🔧', color:'#f59e0b' },
  seminar:    { label:'همایش',     icon:'🎤', color:'#a78bfa' },
  tournament: { label:'مسابقه',    icon:'🏆', color:'#ef4444' },
  gathering:  { label:'گردهمایی', icon:'👥', color:'#06b6d4' },
  launch:     { label:'رونمایی',   icon:'🚀', color:'#f59e0b' },
};

const CITIES = ['همه شهرها','تهران','مشهد','اصفهان','شیراز','تبریز'];

function toFa(v: string|number){ return String(v).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d))); }

/* ══ Event Card ══ */
function EventCard({ ev, featured=false }: { ev: ExpoEvent; featured?: boolean }) {
  const [hov, setHov] = useState(false);
  const typeCfg = TYPE_CFG[ev.type];
  const pct = Math.round((ev.registered/ev.capacity)*100);
  const statusCfg = { upcoming:{c:'#10b981',l:'پیش رو'}, live:{c:'#ef4444',l:'در حال برگزاری'}, completed:{c:'rgba(240,250,245,0.3)',l:'برگزار شده'} }[ev.status];

  if (featured) return (
    <Link href={`/expo/${ev.id}`} style={{ textDecoration:'none', display:'block' }}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{ position:'relative', borderRadius:'24px', overflow:'hidden', background: hov?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.025)', border:`1px solid ${hov?`${ev.accentColor}35`:'rgba(255,255,255,0.07)'}`, transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)', transform: hov?'translateY(-8px)':'none', boxShadow: hov?`0 28px 64px rgba(0,0,0,0.5),0 0 0 1px ${ev.accentColor}12`:'0 4px 20px rgba(0,0,0,0.25)', height:'100%', display:'flex', flexDirection:'column' }}>

        {/* Cover */}
        <div style={{ height:'200px', position:'relative', overflow:'hidden', flexShrink:0 }}>
          <img src={ev.coverImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.2) saturate(0.45)', transition:'transform 0.7s', transform: hov?'scale(1.07)':'scale(1)' }} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${ev.accentColor}18,transparent 55%)` }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 35%,rgba(6,13,10,0.9) 100%)' }}/>

          {/* Status */}
          <div style={{ position:'absolute', top:'12px', right:'12px', display:'flex', alignItems:'center', gap:'5px', background: ev.status==='live'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)', border:`1px solid ${ev.status==='live'?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.1)'}`, borderRadius:'20px', padding:'4px 11px' }}>
            {ev.status==='live' && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:'0 0 6px #ef4444' }}/>}
            <span style={{ fontSize:'9px', color:statusCfg.c, fontWeight:700, letterSpacing:'0.08em' }}>{statusCfg.l}</span>
          </div>

          {/* Type */}
          <div style={{ position:'absolute', top:'12px', left:'12px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', borderRadius:'20px', padding:'4px 11px', fontSize:'10px', color:typeCfg.color, fontWeight:700, display:'flex', alignItems:'center', gap:'4px' }}>
            {typeCfg.icon} {typeCfg.label}
          </div>

          {/* Date badge */}
          <div style={{ position:'absolute', bottom:'12px', left:'12px', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', borderRadius:'12px', padding:'8px 12px', textAlign:'center' }}>
            <div style={{ fontSize:'18px', fontWeight:900, color:ev.accentColor, lineHeight:1 }}>{toFa(ev.date.split('/')[2]??'')}</div>
            <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.5)', marginTop:'2px' }}>{ev.date.split('/')[1] ? ['','فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'][Number(ev.date.split('/')[1])]?.slice(0,3) : ''}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'18px 20px', flex:1, display:'flex', flexDirection:'column' }}>
          <h3 style={{ fontSize:'16px', fontWeight:900, color:'#f0faf5', margin:'0 0 5px', letterSpacing:'-0.015em', lineHeight:1.25 }}>{ev.title}</h3>
          <div style={{ fontSize:'11px', color:ev.accentColor, fontWeight:600, marginBottom:'10px', opacity:0.8 }}>{ev.subtitle}</div>

          <div style={{ display:'flex', gap:'12px', marginBottom:'12px', fontSize:'11px', color:'rgba(240,250,245,0.4)', flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><MapPin size={9} style={{ color:ev.accentColor }}/>{ev.venue}</span>
            <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Clock size={9}/>{ev.time}</span>
          </div>

          {/* Tags */}
          <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'14px' }}>
            {ev.tags.slice(0,3).map(t => (
              <span key={t} style={{ fontSize:'9px', color:'rgba(240,250,245,0.4)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'2px 8px' }}>{t}</span>
            ))}
          </div>

          {/* Sponsors */}
          {ev.sponsors.length > 0 && (
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
              {ev.sponsors.slice(0,3).map(s => (
                <span key={s} style={{ fontSize:'9px', color:ev.accentColor, background:`${ev.accentColor}10`, border:`1px solid ${ev.accentColor}20`, borderRadius:'20px', padding:'2px 9px', fontWeight:700 }}>{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'0 20px 18px', marginTop:'auto' }}>
          {/* Capacity bar */}
          <div style={{ marginBottom:'12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'rgba(240,250,245,0.35)', marginBottom:'5px' }}>
              <span>{toFa(ev.registered)} نفر ثبت‌نام</span>
              <span>{toFa(pct)}٪ ظرفیت</span>
            </div>
            <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${ev.accentColor},${ev.accentColor}80)`, borderRadius:'2px', boxShadow:`0 0 8px ${ev.accentColor}40` }}/>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:'14px', fontWeight:900, color: ev.isFree?'#10b981':ev.accentColor, letterSpacing:'-0.01em' }}>
                {ev.isFree ? 'رایگان' : toFa(ev.price.toLocaleString())+' ت'}
              </div>
            </div>
            <div style={{ fontSize:'11px', color: ev.isSoldOut?'#ef4444':ev.accentColor, background: ev.isSoldOut?'rgba(239,68,68,0.1)':`${ev.accentColor}10`, border:`1px solid ${ev.isSoldOut?'rgba(239,68,68,0.2)':`${ev.accentColor}22`}`, borderRadius:'20px', padding:'5px 12px', fontWeight:700 }}>
              {ev.isSoldOut ? 'ظرفیت تکمیل' : 'ثبت‌نام'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  /* List card */
  return (
    <Link href={`/expo/${ev.id}`} style={{ textDecoration:'none' }}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{ display:'flex', gap:'0', background: hov?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.025)', border:`1px solid ${hov?`${ev.accentColor}25`:'rgba(255,255,255,0.07)'}`, borderRadius:'18px', overflow:'hidden', transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)', transform: hov?'translateX(-4px)':'none' }}>

        {/* Color strip */}
        <div style={{ width:'4px', background:`linear-gradient(180deg,${ev.accentColor},${ev.accentColor}40)`, flexShrink:0 }}/>

        {/* Date col */}
        <div style={{ width:'72px', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'16px 8px', borderLeft:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize:'22px', fontWeight:900, color:ev.accentColor, lineHeight:1 }}>{toFa(ev.date.split('/')[2]??'')}</div>
          <div style={{ fontSize:'9px', color:'rgba(240,250,245,0.3)', marginTop:'3px' }}>
            {ev.date.split('/')[1] ? ['','فرو','ارد','خرد','تیر','مرد','شهر','مهر','آبان','آذر','دی','بهمن','اسف'][Number(ev.date.split('/')[1])] : ''}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:'14px 16px', minWidth:0 }}>
          <div style={{ display:'flex', gap:'6px', marginBottom:'5px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'9px', color:typeCfg.color, background:`${typeCfg.color}10`, border:`1px solid ${typeCfg.color}20`, borderRadius:'20px', padding:'2px 8px', fontWeight:700 }}>
              {typeCfg.icon} {typeCfg.label}
            </span>
            {ev.status==='live' && <span style={{ fontSize:'9px', color:'#ef4444', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'20px', padding:'2px 8px', fontWeight:700, display:'flex', alignItems:'center', gap:'3px' }}><span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite' }}/>LIVE</span>}
          </div>
          <div style={{ fontSize:'14px', fontWeight:800, color:'#f0faf5', marginBottom:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>{ev.title}</div>
          <div style={{ display:'flex', gap:'12px', fontSize:'11px', color:'rgba(240,250,245,0.4)', flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><MapPin size={9} style={{ color:ev.accentColor }}/>{ev.city} · {ev.venue.split('،')[0]}</span>
            <span>{ev.time}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'center', gap:'6px', flexShrink:0 }}>
          <div style={{ fontSize:'13px', fontWeight:800, color: ev.isFree?'#10b981':ev.accentColor }}>
            {ev.isFree?'رایگان':toFa(ev.price.toLocaleString())+' ت'}
          </div>
          <div style={{ fontSize:'10px', color: ev.isSoldOut?'#ef4444':'rgba(240,250,245,0.4)' }}>{ev.isSoldOut?'تکمیل':toFa(ev.registered)+'/'+toFa(ev.capacity)}</div>
        </div>
      </div>
    </Link>
  );
}

/* ══ MAIN ══ */
export default function ExpoPage() {
  const [search,  setSearch]  = useState('');
  const [type,    setType]    = useState('all');
  const [city,    setCity]    = useState('همه شهرها');
  const [status,  setStatus]  = useState('all');
  const [view,    setView]    = useState<'grid'|'list'>('grid');
  const [sfocus,  setSfocus]  = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(()=>setHeroIdx(i=>(i+1)%EVENTS.filter(e=>e.isFeautred).length), 5000);
    return () => clearInterval(t);
  }, []);

  const featured = EVENTS.filter(e=>e.isFeautred);
  const filtered = EVENTS.filter(e => {
    if (search && !e.title.includes(search) && !e.city.includes(search)) return false;
    if (type !== 'all' && e.type !== type) return false;
    if (city !== 'همه شهرها' && e.city !== city) return false;
    if (status !== 'all' && e.status !== status) return false;
    return true;
  });

  const heroEv = featured[heroIdx] ?? featured[0];

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;} }
        @keyframes pulse   { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        @keyframes ambient { 0%,100%{transform:translate(0,0);}50%{transform:translate(20px,-14px);} }
        @keyframes heroIn  { from{opacity:0;transform:scale(1.03);}to{opacity:1;transform:none;} }
        .s-bar { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.08); border-radius:14px; padding:0 16px; height:50px; transition:all 0.3s; }
        .s-bar.focus { border-color:rgba(16,185,129,0.4); box-shadow:0 0 0 3px rgba(16,185,129,0.08); }
        .s-inp { flex:1; background:transparent; border:none; outline:none; color:#f0faf5; font-size:14px; font-family:inherit; }
        .s-inp::placeholder { color:rgba(240,250,245,0.22); }
        .pill { padding:7px 14px; border-radius:20px; font-size:12px; font-weight:600; border:1px solid; cursor:pointer; font-family:inherit; white-space:nowrap; transition:all 0.2s; }
        .pill.active { background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.35); color:#10b981; }
        .pill:not(.active) { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.07); color:rgba(240,250,245,0.45); }
        .sort-sel { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:9px 14px; color:rgba(240,250,245,0.7); font-size:12px; font-family:inherit; outline:none; cursor:pointer; }
        .view-btn { width:36px; height:36px; border-radius:9px; border:1px solid; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .view-btn.active { background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.3); color:#10b981; }
        .view-btn:not(.active) { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.08); color:rgba(240,250,245,0.4); }
        @media(max-width:900px) { .expo-grid{grid-template-columns:repeat(2,1fr)!important;} .hero-stats{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:560px) { .expo-grid{grid-template-columns:1fr!important;} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#020806,#060d0a)', paddingBottom:'80px' }}>

        {/* ══ CINEMATIC HERO ══ */}
        {heroEv && (
          <div style={{ position:'relative', height:'clamp(420px,58vh,600px)', overflow:'hidden' }} key={heroEv.id}>
            <img src={heroEv.coverImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.15) saturate(0.4) contrast(1.2)', animation:'heroIn 1.2s ease both' }} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
            <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 60% at 20% 70%,${heroEv.accentColor}12,transparent 100%)` }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(2,8,6,0.5) 0%,transparent 25%,rgba(2,8,6,0.97) 100%)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left,rgba(2,8,6,0.6) 0%,transparent 55%)' }}/>
            <div style={{ position:'absolute', top:'-15%', right:'-5%', width:'50vw', height:'50vw', maxWidth:'500px', borderRadius:'50%', background:`radial-gradient(${heroEv.accentColor}07,transparent 65%)`, filter:'blur(40px)', animation:'ambient 14s ease-in-out infinite', pointerEvents:'none' }}/>

            {/* Nav */}
            <div style={{ position:'absolute', top:'24px', left:0, right:0, padding:'0 clamp(16px,4vw,48px)', display:'flex', justifyContent:'space-between', zIndex:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ fontSize:'9px', color:`${heroEv.accentColor}80`, letterSpacing:'0.22em', fontWeight:700, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(12px)', border:`1px solid ${heroEv.accentColor}20`, borderRadius:'20px', padding:'6px 14px' }}>
                  EVENTS & EXPO
                </div>
              </div>
              <div style={{ display:'flex', gap:'6px' }}>
                {featured.map((_,i) => (
                  <button key={i} onClick={()=>setHeroIdx(i)} style={{ height:'2px', width: i===heroIdx?'28px':'8px', borderRadius:'1px', border:'none', cursor:'pointer', padding:0, background: i===heroIdx?heroEv.accentColor:'rgba(255,255,255,0.2)', transition:'all 0.4s', boxShadow: i===heroIdx?`0 0 10px ${heroEv.accentColor}`:' none' }}/>
                ))}
              </div>
            </div>

            {/* Hero content */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'clamp(24px,4vw,52px)', zIndex:10 }}>
              <div style={{ maxWidth:'640px' }}>
                <div style={{ display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:`${heroEv.accentColor}12`, border:`1px solid ${heroEv.accentColor}28`, borderRadius:'20px', padding:'5px 14px', backdropFilter:'blur(16px)' }}>
                    <span style={{ fontSize:'12px' }}>{TYPE_CFG[heroEv.type].icon}</span>
                    <span style={{ fontSize:'9px', color:heroEv.accentColor, fontWeight:700, letterSpacing:'0.12em' }}>{TYPE_CFG[heroEv.type].label.toUpperCase()}</span>
                  </div>
                  {heroEv.status==='live' && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'20px', padding:'5px 14px', backdropFilter:'blur(16px)' }}>
                      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite', boxShadow:'0 0 6px #ef4444' }}/>
                      <span style={{ fontSize:'9px', color:'#ef4444', fontWeight:700, letterSpacing:'0.12em' }}>LIVE NOW</span>
                    </div>
                  )}
                </div>

                <h1 style={{ fontSize:'clamp(26px,5vw,52px)', fontWeight:900, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.035em', lineHeight:1.05, textShadow:`0 0 60px ${heroEv.accentColor}20` }}>
                  {heroEv.title}
                </h1>
                <div style={{ fontSize:'14px', color:`${heroEv.accentColor}90`, fontWeight:600, marginBottom:'14px' }}>{heroEv.subtitle}</div>

                <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'22px', fontSize:'13px', color:'rgba(255,255,255,0.6)' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={12} style={{ color:heroEv.accentColor }}/>{heroEv.date}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={12} style={{ color:heroEv.accentColor }}/>{heroEv.city} · {heroEv.venue.split('،')[0]}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Users size={12} style={{ color:heroEv.accentColor }}/>{toFa(heroEv.registered)}/{toFa(heroEv.capacity)}</span>
                </div>

                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                  <Link href={`/expo/${heroEv.id}`} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 26px', background:`linear-gradient(135deg,${heroEv.accentColor},${heroEv.accentColor}cc)`, borderRadius:'13px', color:'#fff', fontSize:'14px', fontWeight:800, textDecoration:'none', boxShadow:`0 8px 24px ${heroEv.accentColor}35` }}>
                    <Ticket size={16}/>{heroEv.isFree?'ثبت‌نام رایگان':'خرید بلیت'}
                  </Link>
                  <Link href={`/expo/${heroEv.id}`} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 20px', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'13px', color:'rgba(255,255,255,0.8)', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>
                    اطلاعات بیشتر
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TOOLBAR ══ */}
        <div style={{ background:'rgba(2,8,6,0.97)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'12px clamp(16px,4vw,48px)', position:'sticky', top:'62px', zIndex:90, backdropFilter:'blur(24px)' }}>
          <div style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
            <div className={`s-bar ${sfocus?'focus':''}`} style={{ flex:1, minWidth:'200px', maxWidth:'340px' }}>
              <Search size={15} style={{ color:'rgba(240,250,245,0.25)', flexShrink:0 }}/>
              <input className="s-inp" value={search} onChange={e=>setSearch(e.target.value)}
                onFocus={()=>setSfocus(true)} onBlur={()=>setSfocus(false)}
                placeholder="جستجو رویداد، شهر..."/>
              {search && <button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(240,250,245,0.3)', padding:0, display:'flex' }}><X size={13}/></button>}
            </div>

            {/* Type filter */}
            <div style={{ display:'flex', gap:'6px', overflowX:'auto' }}>
              {[{k:'all',l:'همه'},...Object.entries(TYPE_CFG).map(([k,v])=>({k,l:v.icon+' '+v.label}))].map(t => (
                <button key={t.k} className={`pill ${type===t.k?'active':''}`} onClick={()=>setType(t.k)}>{t.l}</button>
              ))}
            </div>

            {/* Status */}
            <select className="sort-sel" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="all">همه وضعیت‌ها</option>
              <option value="upcoming">پیش رو</option>
              <option value="live">در حال برگزاری</option>
              <option value="completed">برگزار شده</option>
            </select>

            {/* View */}
            <div style={{ display:'flex', gap:'4px' }}>
              {[{k:'grid',icon:'⊞'},{k:'list',icon:'☰'}].map(v => (
                <button key={v.k} className={`view-btn ${view===v.k?'active':''}`} onClick={()=>setView(v.k as any)} style={{ fontSize:'14px' }}>{v.icon}</button>
              ))}
            </div>

            <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.3)', whiteSpace:'nowrap' }}>{toFa(filtered.length)} رویداد</div>
          </div>
        </div>

        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'clamp(24px,4vw,40px) clamp(16px,3vw,32px)' }}>

          {/* Stats */}
          <div style={{ display:'flex', gap:'28px', marginBottom:'36px', flexWrap:'wrap' }}>
            {[
              { v:toFa(EVENTS.filter(e=>e.status==='upcoming').length), l:'رویداد پیش رو',      c:'#10b981' },
              { v:toFa(EVENTS.filter(e=>e.status==='live').length),     l:'در حال برگزاری',     c:'#ef4444' },
              { v:toFa(EVENTS.reduce((a,e)=>a+e.registered,0)),         l:'ثبت‌نام کل',         c:'#a78bfa' },
              { v:toFa(new Set(EVENTS.map(e=>e.city)).size),             l:'شهر برگزارکننده',   c:'#f59e0b' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900, color:s.c, letterSpacing:'-0.03em', textShadow:`0 0 20px ${s.c}30` }}>{s.v}</div>
                <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'2px' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Featured grid */}
          {type==='all' && status==='all' && !search && (
            <section style={{ marginBottom:'48px' }}>
              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'9px', color:'rgba(16,185,129,0.6)', letterSpacing:'0.25em', fontWeight:700, marginBottom:'7px' }}>FEATURED EVENTS</div>
                <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:900, color:'#f0faf5', margin:0, letterSpacing:'-0.025em' }}>رویدادهای ویژه</h2>
                <div style={{ height:'1px', width:'52px', marginTop:'10px', background:'linear-gradient(90deg,#10b981,transparent)', boxShadow:'0 0 10px rgba(16,185,129,0.4)' }}/>
              </div>
              <div className="expo-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
                {featured.map((e,i) => (
                  <div key={e.id} style={{ animation:`fadeUp 0.5s ease ${i*0.08}s both` }}>
                    <EventCard ev={e} featured/>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* City filter row */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'24px', overflowX:'auto', padding:'2px' }}>
            {CITIES.map(c => (
              <button key={c} className={`pill ${city===c?'active':''}`} onClick={()=>setCity(c)}>{c}</button>
            ))}
          </div>

          {/* All events */}
          <section>
            <div style={{ marginBottom:'20px' }}>
              <div style={{ fontSize:'9px', color:'rgba(167,139,250,0.6)', letterSpacing:'0.25em', fontWeight:700, marginBottom:'7px' }}>ALL EVENTS</div>
              <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:900, color:'#f0faf5', margin:0, letterSpacing:'-0.025em' }}>
                همه رویدادها <span style={{ fontSize:'14px', fontWeight:500, color:'rgba(240,250,245,0.35)', marginRight:'8px' }}>({toFa(filtered.length)})</span>
              </h2>
              <div style={{ height:'1px', width:'52px', marginTop:'10px', background:'linear-gradient(90deg,#a78bfa,transparent)', boxShadow:'0 0 10px rgba(167,139,250,0.4)' }}/>
            </div>

            {filtered.length===0 ? (
              <div style={{ textAlign:'center', padding:'80px 24px' }}>
                <div style={{ fontSize:'48px', opacity:0.1, marginBottom:'14px' }}>📅</div>
                <h3 style={{ fontSize:'18px', fontWeight:800, color:'#f0faf5', margin:'0 0 8px' }}>رویدادی یافت نشد</h3>
                <button onClick={()=>{setSearch('');setType('all');setCity('همه شهرها');setStatus('all');}} style={{ padding:'11px 24px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:'14px' }}>
                  پاک کردن فیلترها
                </button>
              </div>
            ) : view==='grid' ? (
              <div className="expo-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
                {filtered.map((e,i) => (
                  <div key={e.id} style={{ animation:`fadeUp 0.5s ease ${i*0.06}s both` }}>
                    <EventCard ev={e} featured/>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {filtered.map((e,i) => (
                  <div key={e.id} style={{ animation:`fadeUp 0.4s ease ${i*0.05}s both` }}>
                    <EventCard ev={e}/>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit event CTA */}
          <div style={{ marginTop:'60px', padding:'44px 40px', background:'rgba(167,139,250,0.03)', border:'1px dashed rgba(167,139,250,0.18)', borderRadius:'28px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', color:'rgba(167,139,250,0.5)', letterSpacing:'0.22em', fontWeight:700, marginBottom:'12px' }}>ORGANIZE AN EVENT</div>
            <h3 style={{ fontSize:'clamp(18px,3vw,26px)', fontWeight:900, color:'#f0faf5', margin:'0 0 10px', letterSpacing:'-0.025em' }}>رویداد برگزار کنید</h3>
            <p style={{ fontSize:'14px', color:'rgba(240,250,245,0.35)', margin:'0 0 22px', maxWidth:'400px', marginLeft:'auto', marginRight:'auto' }}>
              کارگاه، همایش، نمایشگاه یا گردهمایی خود را در پلتفرم بیلیارد پلاس ثبت کنید
            </p>
            <Link href="/expo/new" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 28px', background:'linear-gradient(135deg,#a78bfa,#7c3aed)', borderRadius:'13px', color:'#fff', fontSize:'14px', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 22px rgba(167,139,250,0.25)' }}>
              ثبت رویداد جدید ←
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield, Star, MapPin, Check, Award, Users,
  Search, X, Clock, Activity, Target, Zap,
} from 'lucide-react';

interface Referee {
  id: string; name: string; title: string; city: string;
  level: 'international'|'national'|'provincial';
  rating: number; reviewCount: number; matches: number;
  experience: number; speciality: string[];
  avatar: string; avatarColor: string;
  isVerified: boolean; isFederation: boolean; isActive: boolean;
  certifications: string[]; languages: string[];
  bio: string; tournaments: number;
}

const REFS: Referee[] = [
  {
    id:'r1', name:'داوود حسینی', title:'داور بین‌المللی اسنوکر', city:'تهران',
    level:'international', rating:4.9, reviewCount:124, matches:580, experience:18,
    speciality:['اسنوکر','پاکت بیلیارد'],
    avatar:'د', avatarColor:'#10b981',
    isVerified:true, isFederation:true, isActive:true,
    certifications:['WPBSA Referee Level 4','داور بین‌المللی فدراسیون','داور WPA'],
    languages:['فارسی','انگلیسی'],
    bio:'با ۱۸ سال سابقه داوری در بالاترین سطح مسابقات بیلیارد ایران و بین‌المللی.',
    tournaments:48,
  },
  {
    id:'r2', name:'فریده موسوی', title:'داور ملی اسنوکر', city:'مشهد',
    level:'national', rating:4.7, reviewCount:87, matches:340, experience:11,
    speciality:['اسنوکر'],
    avatar:'ف', avatarColor:'#a78bfa',
    isVerified:true, isFederation:true, isActive:true,
    certifications:['WPBSA Referee Level 3','داور ملی فدراسیون'],
    languages:['فارسی'],
    bio:'داور ارشد لیگ برتر اسنوکر با تخصص در مدیریت مسابقات رسمی فدراسیون.',
    tournaments:31,
  },
  {
    id:'r3', name:'کامران صادقی', title:'داور ارشد پاکت بیلیارد', city:'اصفهان',
    level:'national', rating:4.8, reviewCount:96, matches:420, experience:14,
    speciality:['پاکت بیلیارد','هی‌بال'],
    avatar:'ک', avatarColor:'#06b6d4',
    isVerified:true, isFederation:true, isActive:true,
    certifications:['BCA Referee Level 3','داور ملی فدراسیون','داور هی‌بال'],
    languages:['فارسی','عربی'],
    bio:'متخصص داوری پاکت بیلیارد و هی‌بال با بیش از ۴۰۰ مسابقه رسمی.',
    tournaments:29,
  },
  {
    id:'r4', name:'مهران نوری', title:'داور استانی اسنوکر', city:'شیراز',
    level:'provincial', rating:4.5, reviewCount:52, matches:180, experience:7,
    speciality:['اسنوکر'],
    avatar:'م', avatarColor:'#f59e0b',
    isVerified:true, isFederation:false, isActive:true,
    certifications:['WPBSA Referee Level 2','داور استانی فدراسیون'],
    languages:['فارسی'],
    bio:'داور فعال استان فارس با تجربه در مسابقات منطقه‌ای و استانی.',
    tournaments:14,
  },
];

const LEVEL_CFG = {
  international: { label:'بین‌المللی', color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)'  },
  national:      { label:'ملی',         color:'#10b981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)'  },
  provincial:    { label:'استانی',      color:'#06b6d4', bg:'rgba(6,182,212,0.1)',   border:'rgba(6,182,212,0.25)'   },
};

function toFa(v: string|number){ return String(v).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d))); }

function RefCard({ ref: r }: { ref: Referee }) {
  const [hov, setHov] = useState(false);
  const lvl = LEVEL_CFG[r.level];
  return (
    <Link href={`/referees/${r.id}`} style={{ textDecoration:'none' }}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{ background: hov?'rgba(255,255,255,0.055)':'rgba(255,255,255,0.028)', border:`1px solid ${hov?`${r.avatarColor}28`:'rgba(255,255,255,0.07)'}`, borderRadius:'20px', overflow:'hidden', transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)', transform: hov?'translateY(-6px)':'none', boxShadow: hov?`0 22px 56px rgba(0,0,0,0.5),0 0 0 1px ${r.avatarColor}08`:'0 4px 18px rgba(0,0,0,0.25)', display:'flex', flexDirection:'column' }}>

        {/* Top band */}
        <div style={{ height:'6px', background:`linear-gradient(90deg,${r.avatarColor},${r.avatarColor}40)`, boxShadow:`0 0 12px ${r.avatarColor}40` }}/>

        <div style={{ padding:'20px' }}>
          {/* Avatar + level */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:`linear-gradient(135deg,${r.avatarColor},${r.avatarColor}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:900, color:'#fff', boxShadow:`0 8px 20px ${r.avatarColor}35` }}>
                {r.avatar}
              </div>
              {r.isActive && <div style={{ position:'absolute', bottom:'2px', right:'2px', width:'12px', height:'12px', borderRadius:'50%', background:'#10b981', border:'2px solid rgba(6,13,10,0.98)', boxShadow:'0 0 6px #10b981' }}/>}
            </div>
            <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', justifyContent:'flex-end' }}>
              <div style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'9px', fontWeight:700, background:lvl.bg, border:`1px solid ${lvl.border}`, color:lvl.color }}>
                {lvl.label}
              </div>
              {r.isFederation && <div style={{ display:'flex', alignItems:'center', gap:'3px', padding:'3px 9px', borderRadius:'20px', fontSize:'9px', fontWeight:700, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', color:'#f59e0b' }}><Shield size={8}/>فدراسیون</div>}
            </div>
          </div>

          {/* Name */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
            <h3 style={{ fontSize:'16px', fontWeight:900, color:'#f0faf5', margin:0, letterSpacing:'-0.015em' }}>{r.name}</h3>
            {r.isVerified && <Check size={13} style={{ color:r.avatarColor, flexShrink:0 }}/>}
          </div>
          <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.45)', marginBottom:'12px' }}>{r.title}</div>

          {/* Speciality tags */}
          <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'14px' }}>
            {r.speciality.map(s => (
              <span key={s} style={{ fontSize:'9px', color:r.avatarColor, background:`${r.avatarColor}10`, border:`1px solid ${r.avatarColor}22`, borderRadius:'20px', padding:'2px 8px', fontWeight:700 }}>{s}</span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'14px' }}>
            {[
              { v:toFa(r.experience), l:'سال تجربه' },
              { v:toFa(r.matches),    l:'مسابقه'    },
              { v:toFa(r.tournaments),l:'تورنومنت'   },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center', borderLeft: i>0?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ fontSize:'17px', fontWeight:900, color:'#f0faf5', letterSpacing:'-0.02em' }}>{s.v}</div>
                <div style={{ fontSize:'9px', color:'rgba(240,250,245,0.3)', marginTop:'2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function RefereesPage() {
  const [search, setSearch]   = useState('');
  const [level,  setLevel]    = useState('all');
  const [sfocus, setSfocus]   = useState(false);

  const filtered = REFS.filter(r => {
    if (search && !r.name.includes(search) && !r.city.includes(search)) return false;
    if (level !== 'all' && r.level !== level) return false;
    return true;
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;} }
        @keyframes ambient { 0%,100%{transform:translate(0,0);}50%{transform:translate(20px,-14px);} }
        .s-bar { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.08); border-radius:14px; padding:0 16px; height:50px; transition:all 0.3s; }
        .s-bar.focus { border-color:rgba(16,185,129,0.4); box-shadow:0 0 0 3px rgba(16,185,129,0.08); }
        .s-inp { flex:1; background:transparent; border:none; outline:none; color:#f0faf5; font-size:14px; font-family:inherit; }
        .s-inp::placeholder { color:rgba(240,250,245,0.22); }
        .lv-btn { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:600; border:1px solid; cursor:pointer; font-family:inherit; white-space:nowrap; transition:all 0.2s; }
        .lv-btn.active { background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.35); color:#10b981; }
        .lv-btn:not(.active) { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.07); color:rgba(240,250,245,0.45); }
        @media(max-width:900px) { .ref-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:560px) { .ref-grid{grid-template-columns:1fr!important;} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#020806,#060d0a)', paddingBottom:'80px' }}>

        {/* Hero */}
        <div style={{ position:'relative', background:'rgba(2,8,6,0.98)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'clamp(32px,5vw,56px) clamp(16px,4vw,48px) 0', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-20%', right:'-5%', width:'45vw', height:'45vw', maxWidth:'500px', borderRadius:'50%', background:'radial-gradient(rgba(16,185,129,0.06),transparent 65%)', filter:'blur(40px)', animation:'ambient 14s ease-in-out infinite', pointerEvents:'none' }}/>
          <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(16,185,129,0.35)' }}>
                <Shield size={22} style={{ color:'#fff' }}/>
              </div>
              <div>
                <div style={{ fontSize:'9px', color:'rgba(16,185,129,0.65)', letterSpacing:'0.25em', fontWeight:700 }}>OFFICIAL REFEREES</div>
                <h1 style={{ fontSize:'clamp(24px,4.5vw,44px)', fontWeight:900, color:'#f0faf5', margin:0, letterSpacing:'-0.03em', lineHeight:1.1 }}>داوران رسمی</h1>
              </div>
            </div>
            <p style={{ fontSize:'15px', color:'rgba(240,250,245,0.4)', margin:'0 0 28px', maxWidth:'460px' }}>
              داوران تأیید‌شده فدراسیون بیلیارد ایران برای مسابقات رسمی
            </p>
            {/* Level filter */}
            <div style={{ display:'flex', gap:'8px', paddingBottom:'20px', overflowX:'auto' }}>
              {[{k:'all',l:'همه سطوح'},{k:'international',l:'بین‌المللی'},{k:'national',l:'ملی'},{k:'provincial',l:'استانی'}].map(t => (
                <button key={t.k} className={`lv-btn ${level===t.k?'active':''}`} onClick={()=>setLevel(t.k)}>{t.l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ background:'rgba(2,8,6,0.97)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'12px clamp(16px,4vw,48px)', position:'sticky', top:'62px', zIndex:90, backdropFilter:'blur(24px)' }}>
          <div style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', gap:'10px', alignItems:'center' }}>
            <div className={`s-bar ${sfocus?'focus':''}`} style={{ flex:1, maxWidth:'360px' }}>
              <Search size={15} style={{ color:'rgba(240,250,245,0.25)', flexShrink:0 }}/>
              <input className="s-inp" value={search} onChange={e=>setSearch(e.target.value)}
                onFocus={()=>setSfocus(true)} onBlur={()=>setSfocus(false)}
                placeholder="جستجو داور، شهر..."/>
              {search && <button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(240,250,245,0.3)', padding:0, display:'flex' }}><X size={13}/></button>}
            </div>
            <div style={{ fontSize:'12px', color:'rgba(240,250,245,0.35)', marginRight:'auto' }}>{toFa(filtered.length)} داور</div>
            <Link href="/referees/dashboard" style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 18px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'11px', color:'#fff', fontSize:'12px', fontWeight:700, textDecoration:'none', boxShadow:'0 6px 18px rgba(16,185,129,0.28)' }}>
              <Activity size={14}/> پنل داور
            </Link>
          </div>
        </div>

        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'clamp(24px,4vw,40px) clamp(16px,3vw,32px)' }}>

          {/* Stats */}
          <div style={{ display:'flex', gap:'32px', marginBottom:'36px', flexWrap:'wrap' }}>
            {[
              { v:toFa(REFS.filter(r=>r.level==='international').length), l:'بین‌المللی', c:'#f59e0b' },
              { v:toFa(REFS.filter(r=>r.level==='national').length),      l:'ملی',        c:'#10b981' },
              { v:toFa(REFS.reduce((a,r)=>a+r.matches,0)),                l:'مسابقه کل',  c:'#a78bfa' },
              { v:toFa(REFS.reduce((a,r)=>a+r.tournaments,0)),            l:'تورنومنت',    c:'#06b6d4' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900, color:s.c, letterSpacing:'-0.03em' }}>{s.v}</div>
                <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'2px' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="ref-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'18px' }}>
            {filtered.map((r,i) => (
              <div key={r.id} style={{ animation:`fadeUp 0.5s ease ${i*0.07}s both` }}>
                <RefCard ref={r}/>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop:'56px', padding:'40px 36px', background:'rgba(16,185,129,0.03)', border:'1px dashed rgba(16,185,129,0.18)', borderRadius:'24px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', color:'rgba(16,185,129,0.5)', letterSpacing:'0.22em', fontWeight:700, marginBottom:'12px' }}>BECOME A REFEREE</div>
            <h3 style={{ fontSize:'clamp(18px,3vw,26px)', fontWeight:900, color:'#f0faf5', margin:'0 0 10px', letterSpacing:'-0.025em' }}>داور رسمی شوید</h3>
            <p style={{ fontSize:'14px', color:'rgba(240,250,245,0.35)', margin:'0 0 22px', maxWidth:'380px', marginLeft:'auto', marginRight:'auto' }}>
              با کسب گواهی‌های معتبر فدراسیون در مسابقات رسمی شرکت کنید
            </p>
            <Link href="/referees/register" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 28px', background:'linear-gradient(135deg,#10b981,#059669)', borderRadius:'13px', color:'#fff', fontSize:'14px', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 22px rgba(16,185,129,0.28)' }}>
              ثبت‌نام داور ←
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Activity, Clock, Trophy, ChevronRight, Zap,
  TrendingUp, Users, Target, Star, ChevronUp,
  ChevronDown, Play, Circle, CheckCircle,
} from 'lucide-react';

/* ══ types ══ */
type MatchStatus = 'live' | 'upcoming' | 'completed';
interface Player { name: string; rank: number; city: string; avatar: string; color: string; }
interface Match {
  id: string; status: MatchStatus; round: string;
  tournament: string; tournamentId: string;
  player1: Player; player2: Player;
  score1: number; score2: number;
  frame: number; totalFrames: number;
  table: string; startTime: string;
  venue: string; viewers?: number;
  breaks?: { player: 1|2; value: number }[];
}

/* ══ data ══ */
const mkP = (name: string, rank: number, city: string, avatar: string, color: string): Player =>
  ({ name, rank, city, avatar, color });

const MATCHES: Match[] = [
  {
    id:'m1', status:'live', round:'نیمه‌نهایی', tournament:'لیگ برتر اسنوکر ۱۴۰۴', tournamentId:'1',
    player1: mkP('امیرحسین رضایی', 3,  'تهران',   'ا', '#10b981'),
    player2: mkP('سعید موسوی',     1,  'مشهد',    'س', '#06b6d4'),
    score1:4, score2:3, frame:8, totalFrames:11,
    table:'میز ۱', startTime:'۱۴:۰۰', venue:'سالن المپیک تهران', viewers:1240,
    breaks:[{player:1,value:143},{player:2,value:121},{player:1,value:98},{player:2,value:87}],
  },
  {
    id:'m2', status:'live', round:'نیمه‌نهایی', tournament:'لیگ برتر اسنوکر ۱۴۰۴', tournamentId:'1',
    player1: mkP('محمد حسینی',  2,  'اصفهان', 'م', '#a78bfa'),
    player2: mkP('رضا کریمی',   4,  'تهران',  'ر', '#f59e0b'),
    score1:2, score2:2, frame:5, totalFrames:11,
    table:'میز ۲', startTime:'۱۴:۰۰', venue:'سالن المپیک تهران', viewers:890,
    breaks:[{player:2,value:112},{player:1,value:95}],
  },
  {
    id:'m3', status:'upcoming', round:'فینال', tournament:'لیگ برتر اسنوکر ۱۴۰۴', tournamentId:'1',
    player1: mkP('؟',            0,  '—',      '؟', '#10b981'),
    player2: mkP('؟',            0,  '—',      '؟', '#06b6d4'),
    score1:0, score2:0, frame:0, totalFrames:19,
    table:'میز اصلی', startTime:'فردا ۱۶:۰۰', venue:'سالن المپیک تهران',
  },
  {
    id:'m4', status:'upcoming', round:'یک‌چهارم‌نهایی', tournament:'جام استعدادهای جوان', tournamentId:'2',
    player1: mkP('نیما نوری',    5,  'شیراز',  'ن', '#10b981'),
    player2: mkP('کاوه رستمی',   6,  'تبریز',  'ک', '#ef4444'),
    score1:0, score2:0, frame:0, totalFrames:9,
    table:'میز ۳', startTime:'امروز ۱۸:۰۰', venue:'باشگاه سنچوری',
  },
  {
    id:'m5', status:'completed', round:'ربع‌نهایی', tournament:'لیگ برتر اسنوکر ۱۴۰۴', tournamentId:'1',
    player1: mkP('امیرحسین رضایی', 3, 'تهران',  'ا', '#10b981'),
    player2: mkP('کاوه رستمی',     6, 'تبریز',  'ک', '#ef4444'),
    score1:6, score2:2, frame:8, totalFrames:11,
    table:'میز ۱', startTime:'دیروز ۱۴:۰۰', venue:'سالن المپیک تهران',
    breaks:[{player:1,value:143},{player:1,value:112},{player:2,value:87}],
  },
  {
    id:'m6', status:'completed', round:'ربع‌نهایی', tournament:'لیگ برتر اسنوکر ۱۴۰۴', tournamentId:'1',
    player1: mkP('سعید موسوی',  1, 'مشهد',    'س', '#06b6d4'),
    player2: mkP('علی صادقی',   7, 'کرج',     'ع', '#a78bfa'),
    score1:6, score2:3, frame:9, totalFrames:11,
    table:'میز ۲', startTime:'دیروز ۱۶:۰۰', venue:'سالن المپیک تهران',
    breaks:[{player:1,value:134},{player:2,value:99}],
  },
];

const TOURNAMENTS = [
  { id:'1', name:'لیگ برتر اسنوکر ۱۴۰۴', status:'live',     prize:'۵۰ میلیون', participants:32, progress:68 },
  { id:'2', name:'جام استعدادهای جوان',   status:'upcoming', prize:'۱۵ میلیون', participants:16, progress:0  },
  { id:'3', name:'جام تهران ۱۴۰۳',        status:'done',     prize:'۲۰ میلیون', participants:24, progress:100},
];

function toFa(v: string|number) {
  return String(v).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'.charAt(Number(d)));
}

/* ══ Live Match Card ══ */
function LiveCard({ match, featured=false }: { match: Match; featured?: boolean }) {
  const [score1, setScore1] = useState(match.score1);
  const [score2, setScore2] = useState(match.score2);
  const [pulse,  setPulse]  = useState(false);
  const isLive   = match.status === 'live';
  const isDone   = match.status === 'completed';
  const winner   = isDone ? (match.score1 > match.score2 ? 1 : 2) : 0;

  /* simulate score changes */
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      if (Math.random() > 0.85) {
        setPulse(true);
        setTimeout(() => setPulse(false), 800);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [isLive]);

  const pct = match.totalFrames > 0 ? ((score1 + score2) / match.totalFrames) * 100 : 0;

  return (
    <div style={{
      background: isLive ? 'rgba(239,68,68,0.04)' : isDone ? 'rgba(255,255,255,0.02)' : 'rgba(16,185,129,0.03)',
      border: `1px solid ${isLive ? 'rgba(239,68,68,0.18)' : isDone ? 'rgba(255,255,255,0.06)' : 'rgba(16,185,129,0.15)'}`,
      borderRadius: featured ? '22px' : '18px',
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.35s',
      boxShadow: pulse ? '0 0 30px rgba(239,68,68,0.2)' : 'none',
    }}>
      {/* Top glow line */}
      {isLive && <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(239,68,68,0.6),transparent)', boxShadow:'0 0 12px rgba(239,68,68,0.4)' }} />}

      {/* Header */}
      <div style={{ padding: featured ? '16px 20px 12px' : '12px 16px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {isLive && (
            <div style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'20px', padding:'3px 10px' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#ef4444', display:'inline-block', boxShadow:'0 0 8px #ef4444', animation:'livePulse 1.5s infinite' }} />
              <span style={{ fontSize:'9px', color:'#ef4444', fontWeight:700, letterSpacing:'0.1em' }}>LIVE</span>
            </div>
          )}
          {match.status === 'upcoming' && (
            <div style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'20px', padding:'3px 10px' }}>
              <Clock size={9} style={{ color:'#10b981' }} />
              <span style={{ fontSize:'9px', color:'#10b981', fontWeight:700 }}>UPCOMING</span>
            </div>
          )}
          {isDone && <span style={{ fontSize:'9px', color:'rgba(240,250,245,0.3)', fontWeight:700, letterSpacing:'0.1em' }}>FINAL</span>}
          <span style={{ fontSize:'11px', color:'rgba(240,250,245,0.35)', fontWeight:500 }}>{match.round}</span>
        </div>
        <div style={{ display:'flex', gap:'10px', fontSize:'10px', color:'rgba(240,250,245,0.25)' }}>
          <span>{match.table}</span>
          <span>·</span>
          <span>{match.startTime}</span>
          {isLive && match.viewers && (
            <><span>·</span><span style={{ display:'flex', alignItems:'center', gap:'3px', color:'rgba(239,68,68,0.6)' }}><Users size={9} />{toFa(match.viewers)}</span></>
          )}
        </div>
      </div>

      {/* Players + Score */}
      <div style={{ padding: featured ? '20px' : '14px 16px', display:'flex', alignItems:'center', gap:'12px' }}>
        {/* P1 */}
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:'10px', opacity: isDone && winner===2 ? 0.4 : 1 }}>
          <div style={{ width: featured?'48px':'38px', height: featured?'48px':'38px', borderRadius:'12px', background:`linear-gradient(135deg,${match.player1.color},${match.player1.color}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: featured?'20px':'15px', fontWeight:900, color:'#fff', flexShrink:0, boxShadow: isDone&&winner===1 ? `0 0 18px ${match.player1.color}60` : 'none' }}>
            {match.player1.avatar}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize: featured?'15px':'13px', fontWeight: isDone&&winner===1?900:700, color: isDone&&winner===1?'#f0faf5':'rgba(240,250,245,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>
              {match.player1.name.split(' ').pop()}
            </div>
            <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'2px', display:'flex', alignItems:'center', gap:'4px' }}>
              {match.player1.rank > 0 && <><span style={{ color:match.player1.color }}>#{toFa(match.player1.rank)}</span><span>·</span></>}
              <span>{match.player1.city}</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
          <div style={{ fontSize: featured?'32px':'24px', fontWeight:900, color: isDone&&winner===1?match.player1.color : isLive?'#f0faf5':'rgba(240,250,245,0.5)', letterSpacing:'-0.04em', minWidth: featured?'32px':'24px', textAlign:'center', textShadow: isDone&&winner===1 ? `0 0 20px ${match.player1.color}60` : 'none', transition:'all 0.3s' }}>
            {match.status==='upcoming' ? '—' : toFa(score1)}
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
            <div style={{ fontSize:'12px', fontWeight:700, color:'rgba(240,250,245,0.2)' }}>:</div>
            {isLive && <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#ef4444', animation:'livePulse 1s infinite' }} />}
          </div>
          <div style={{ fontSize: featured?'32px':'24px', fontWeight:900, color: isDone&&winner===2?match.player2.color : isLive?'#f0faf5':'rgba(240,250,245,0.5)', letterSpacing:'-0.04em', minWidth: featured?'32px':'24px', textAlign:'center', textShadow: isDone&&winner===2 ? `0 0 20px ${match.player2.color}60` : 'none', transition:'all 0.3s' }}>
            {match.status==='upcoming' ? '—' : toFa(score2)}
          </div>
        </div>

        {/* P2 */}
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:'10px', justifyContent:'flex-end', opacity: isDone&&winner===1?0.4:1 }}>
          <div style={{ minWidth:0, textAlign:'right' }}>
            <div style={{ fontSize: featured?'15px':'13px', fontWeight: isDone&&winner===2?900:700, color: isDone&&winner===2?'#f0faf5':'rgba(240,250,245,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>
              {match.player2.name.split(' ').pop()}
            </div>
            <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'2px', display:'flex', alignItems:'center', gap:'4px', justifyContent:'flex-end' }}>
              {match.player2.rank > 0 && <><span>·</span><span style={{ color:match.player2.color }}>#{toFa(match.player2.rank)}</span></>}
              <span>{match.player2.city}</span>
            </div>
          </div>
          <div style={{ width: featured?'48px':'38px', height: featured?'48px':'38px', borderRadius:'12px', background:`linear-gradient(135deg,${match.player2.color},${match.player2.color}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: featured?'20px':'15px', fontWeight:900, color:'#fff', flexShrink:0, boxShadow: isDone&&winner===2 ? `0 0 18px ${match.player2.color}60` : 'none' }}>
            {match.player2.avatar}
          </div>
        </div>
      </div>

      {/* Frame progress */}
      {isLive && (
        <div style={{ padding:'0 16px 14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'10px', color:'rgba(240,250,245,0.3)' }}>
            <span>فریم {toFa(score1+score2)} از {toFa(match.totalFrames)}</span>
            <span>بهترین از {toFa(match.totalFrames)}</span>
          </div>
          <div style={{ display:'flex', gap:'3px' }}>
            {Array.from({length:match.totalFrames}).map((_,i) => {
              const isP1 = i < score1;
              const isP2 = i >= match.totalFrames - score2;
              return (
                <div key={i} style={{ flex:1, height:'4px', borderRadius:'2px', background: isP1 ? match.player1.color : isP2 ? match.player2.color : 'rgba(255,255,255,0.08)', boxShadow: isP1 ? `0 0 6px ${match.player1.color}60` : isP2 ? `0 0 6px ${match.player2.color}60` : 'none', transition:'all 0.4s' }} />
              );
            })}
          </div>
        </div>
      )}

      {/* Best breaks */}
      {featured && match.breaks && match.breaks.length > 0 && (
        <div style={{ padding:'0 20px 16px', display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {match.breaks.slice(0,3).map((b,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', background: b.player===1 ? `${match.player1.color}10` : `${match.player2.color}10`, border:`1px solid ${b.player===1 ? match.player1.color : match.player2.color}25`, borderRadius:'20px' }}>
              <Target size={10} style={{ color: b.player===1 ? match.player1.color : match.player2.color }} />
              <span style={{ fontSize:'11px', fontWeight:700, color: b.player===1 ? match.player1.color : match.player2.color }}>{toFa(b.value)}</span>
              <span style={{ fontSize:'9px', color:'rgba(240,250,245,0.3)' }}>بریک</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
export default function LivePage() {
  const [tab,      setTab]      = useState<'all'|'live'|'upcoming'|'completed'>('all');
  const [tick,     setTick]     = useState(0);
  const [scrollY,  setScrollY]  = useState(0);
  const rafRef = useRef<number>(0);

  /* tick for live feeling */
  useEffect(() => {
    const t = setInterval(() => setTick(n => n+1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', fn, { passive:true });
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafRef.current); };
  }, []);

  const live      = MATCHES.filter(m => m.status === 'live');
  const upcoming  = MATCHES.filter(m => m.status === 'upcoming');
  const completed = MATCHES.filter(m => m.status === 'completed');
  const filtered  = tab==='all' ? MATCHES : tab==='live' ? live : tab==='upcoming' ? upcoming : completed;

  const now = new Date();
  const timeStr = toFa(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`);

  return (
    <>
      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.8);} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;} }
        @keyframes scan      { 0%{top:-2px;}100%{top:100%;} }
        @keyframes ambient   { 0%,100%{transform:translate(0,0);}50%{transform:translate(20px,-15px);} }

        .tab-pill { padding:9px 18px; border-radius:20px; font-size:12px; font-weight:700; border:1px solid; cursor:pointer; font-family:inherit; transition:all 0.25s; white-space:nowrap; }
        .tab-pill.active   { background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.3); color:#10b981; }
        .tab-pill:not(.active) { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.07); color:rgba(240,250,245,0.4); }
        .tab-pill:not(.active):hover { background:rgba(255,255,255,0.06); color:rgba(240,250,245,0.7); }

        .t-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:16px 18px; transition:all 0.3s; cursor:pointer; }
        .t-card:hover { background:rgba(255,255,255,0.04); border-color:rgba(16,185,129,0.2); transform:translateX(-3px); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#020806,#060d0a)', paddingBottom:'80px' }}>

        {/* ══ HERO ══ */}
        <div style={{ position:'relative', background:'rgba(2,8,6,0.98)', borderBottom:'1px solid rgba(239,68,68,0.12)', padding:'clamp(32px,5vw,52px) clamp(16px,4vw,48px) 0', overflow:'hidden' }}>
          {/* Scan line */}
          <div style={{ position:'absolute', left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(239,68,68,0.2),transparent)', animation:'scan 4s linear infinite', pointerEvents:'none' }} />
          {/* Ambient */}
          <div style={{ position:'absolute', top:'-20%', right:'-5%', width:'40vw', height:'40vw', maxWidth:'400px', borderRadius:'50%', background:'radial-gradient(rgba(239,68,68,0.06),transparent 65%)', filter:'blur(40px)', animation:'ambient 12s ease-in-out infinite', pointerEvents:'none' }} />

          <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'18px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#ef4444,#dc2626)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(239,68,68,0.4)' }}>
                <Activity size={22} style={{ color:'#fff' }} />
              </div>
              <div>
                <div style={{ fontSize:'9px', color:'rgba(239,68,68,0.7)', letterSpacing:'0.25em', fontWeight:700 }}>LIVE MATCH CENTER</div>
                <h1 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:900, color:'#f0faf5', margin:0, letterSpacing:'-0.03em', lineHeight:1.1 }}>مرکز زنده مسابقات</h1>
              </div>
              {/* Live clock */}
              <div style={{ marginRight:'auto', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'8px 16px', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#ef4444', display:'inline-block', boxShadow:'0 0 8px #ef4444', animation:'livePulse 1.5s infinite' }} />
                <span style={{ fontSize:'14px', fontWeight:900, color:'#ef4444', letterSpacing:'0.05em', fontVariantNumeric:'tabular-nums' }}>{timeStr}</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:'28px', marginBottom:'24px', flexWrap:'wrap' }}>
              {[
                { v: toFa(live.length),      l:'زنده',      c:'#ef4444' },
                { v: toFa(upcoming.length),  l:'پیش رو',    c:'#10b981' },
                { v: toFa(completed.length), l:'پایان‌یافته',c:'rgba(240,250,245,0.4)' },
                { v: toFa(MATCHES.reduce((a,m)=>a+(m.viewers??0),0).toLocaleString()), l:'بیننده', c:'#a78bfa' },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:900, color:s.c, letterSpacing:'-0.03em', textShadow:`0 0 20px ${s.c}40` }}>{s.v}</div>
                  <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)', marginTop:'2px' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ display:'flex', gap:'8px', paddingBottom:'20px', overflowX:'auto' }}>
              {[
                {k:'all',      l:`همه (${MATCHES.length})`},
                {k:'live',     l:`زنده (${live.length})`},
                {k:'upcoming', l:`پیش رو (${upcoming.length})`},
                {k:'completed',l:`نتایج (${completed.length})`},
              ].map(t => (
                <button key={t.k} className={`tab-pill ${tab===t.k?'active':''}`} onClick={()=>setTab(t.k as any)}>
                  {t.k==='live' && tab!=='live' && live.length>0 && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', display:'inline-block', marginLeft:'5px', animation:'livePulse 1.5s infinite' }} />}
                  {t.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'clamp(24px,4vw,40px) clamp(16px,3vw,32px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start' }} className="live-grid">
            <style>{`@media(max-width:900px){.live-grid{grid-template-columns:1fr!important;}}`}</style>

            {/* ── LEFT ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Featured live matches */}
              {(tab==='all'||tab==='live') && live.length > 0 && (
                <div style={{ animation:'fadeUp 0.4s ease both' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#ef4444', display:'inline-block', boxShadow:'0 0 10px #ef4444', animation:'livePulse 1.5s infinite' }} />
                    <span style={{ fontSize:'13px', fontWeight:700, color:'#ef4444', letterSpacing:'0.08em' }}>در حال بازی</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {live.map(m => <LiveCard key={m.id} match={m} featured />)}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {(tab==='all'||tab==='upcoming') && upcoming.length > 0 && (
                <div style={{ animation:'fadeUp 0.4s ease 0.1s both' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                    <Clock size={13} style={{ color:'#10b981' }} />
                    <span style={{ fontSize:'13px', fontWeight:700, color:'#10b981', letterSpacing:'0.05em' }}>مسابقات پیش رو</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {upcoming.map(m => <LiveCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}

              {/* Completed */}
              {(tab==='all'||tab==='completed') && completed.length > 0 && (
                <div style={{ animation:'fadeUp 0.4s ease 0.15s both' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                    <CheckCircle size={13} style={{ color:'rgba(240,250,245,0.3)' }} />
                    <span style={{ fontSize:'13px', fontWeight:700, color:'rgba(240,250,245,0.4)', letterSpacing:'0.05em' }}>نتایج اخیر</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {completed.map(m => <LiveCard key={m.id} match={m} />)}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{ position:'sticky', top:'80px', display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Active tournaments */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'rgba(245,158,11,0.6)', letterSpacing:'0.18em', fontWeight:700, marginBottom:'14px' }}>TOURNAMENTS</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {TOURNAMENTS.map(t => (
                    <Link key={t.id} href={`/events/${t.id}`} style={{ textDecoration:'none' }}>
                      <div className="t-card">
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'8px' }}>
                          <div style={{ fontSize:'13px', fontWeight:700, color:'#f0faf5', lineHeight:1.4, flex:1, marginLeft:'8px' }}>{t.name}</div>
                          <div style={{ fontSize:'9px', fontWeight:700, flexShrink:0, padding:'2px 8px', borderRadius:'20px', background: t.status==='live'?'rgba(239,68,68,0.1)':t.status==='upcoming'?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.05)', color: t.status==='live'?'#ef4444':t.status==='upcoming'?'#10b981':'rgba(240,250,245,0.3)', border:`1px solid ${t.status==='live'?'rgba(239,68,68,0.2)':t.status==='upcoming'?'rgba(16,185,129,0.2)':'rgba(255,255,255,0.06)'}` }}>
                            {t.status==='live'?'LIVE':t.status==='upcoming'?'پیش رو':'پایان'}
                          </div>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(240,250,245,0.35)', marginBottom: t.status==='live'?'8px':'0' }}>
                          <span>جایزه: {t.prize}</span>
                          <span>{toFa(t.participants)} نفر</span>
                        </div>
                        {t.status==='live' && (
                          <div style={{ height:'3px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${t.progress}%`, background:'linear-gradient(90deg,#ef4444,#dc2626)', borderRadius:'2px', boxShadow:'0 0 8px rgba(239,68,68,0.4)' }} />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top breaks */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'rgba(167,139,250,0.6)', letterSpacing:'0.18em', fontWeight:700, marginBottom:'14px' }}>TOP BREAKS</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {[
                    { name:'امیرحسین رضایی', v:143, color:'#10b981', match:'نیمه‌نهایی' },
                    { name:'سعید موسوی',     v:134, color:'#06b6d4', match:'ربع‌نهایی' },
                    { name:'محمد حسینی',     v:121, color:'#a78bfa', match:'نیمه‌نهایی' },
                    { name:'رضا کریمی',      v:112, color:'#f59e0b', match:'ربع‌نهایی' },
                  ].map((b,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ fontSize:'12px', fontWeight:800, color:'rgba(240,250,245,0.2)', width:'16px', flexShrink:0 }}>{toFa(i+1)}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'12px', fontWeight:600, color:'#f0faf5', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.name.split(' ').pop()}</div>
                        <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)' }}>{b.match}</div>
                      </div>
                      <div style={{ fontSize:'18px', fontWeight:900, color:b.color, textShadow:`0 0 14px ${b.color}50`, flexShrink:0 }}>{toFa(b.v)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming today */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'20px' }}>
                <div style={{ fontSize:'11px', color:'rgba(16,185,129,0.6)', letterSpacing:'0.18em', fontWeight:700, marginBottom:'14px' }}>امروز</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {[
                    { time:'۱۸:۰۰', match:'نوری — رستمی', round:'ربع‌نهایی' },
                    { time:'۲۰:۰۰', match:'پیروزی — فینالیست', round:'فینال' },
                  ].map((s,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:'12px' }}>
                      <div style={{ fontSize:'12px', fontWeight:800, color:'#10b981', flexShrink:0, fontVariantNumeric:'tabular-nums' }}>{s.time}</div>
                      <div>
                        <div style={{ fontSize:'12px', color:'#f0faf5', fontWeight:600 }}>{s.match}</div>
                        <div style={{ fontSize:'10px', color:'rgba(240,250,245,0.3)' }}>{s.round}</div>
                      </div>
                    </div>
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
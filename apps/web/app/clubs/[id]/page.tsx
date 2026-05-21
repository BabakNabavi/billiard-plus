'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';
import { MapPin, Phone, Globe, Clock, Star, Navigation, ChevronLeft, Calendar, Wifi, Car, Coffee, Trophy, ChevronRight } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  managerName: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  snookerTables: number;
  pocketTables: number;
  highballTables: number;
  vipSnookerTables: number;
  vipPocketTables: number;
  airHockeyTables: number;
  dartBoards: number;
  playstations: number;
  hasCafe: boolean;
  hasParking: boolean;
  hasWifi: boolean;
  hasProfessionalCoach: boolean;
  specialFeatures: string;
  workingHours: any;
  images: string[];
  videos: string[];
}

const dayNames: Record<string, string> = {
  saturday: 'شنبه', sunday: 'یکشنبه', monday: 'دوشنبه',
  tuesday: 'سه‌شنبه', wednesday: 'چهارشنبه', thursday: 'پنجشنبه', friday: 'جمعه',
};

const sampleClub: Club = {
  id: '1', name: 'باشگاه ستاره تهران', managerName: 'محمد احمدی',
  description: 'یکی از مجهزترین باشگاه‌های بیلیارد تهران با بیش از ۱۵ سال سابقه. دارای میزهای حرفه‌ای اسنوکر و پاکت بیلیارد با استانداردهای بین‌المللی.',
  address: 'خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۰', city: 'تهران', country: 'ایران',
  latitude: 35.7219, longitude: 51.3347, phone: '021-88001234', website: 'https://stareclub.ir',
  snookerTables: 8, pocketTables: 4, highballTables: 2, vipSnookerTables: 2,
  vipPocketTables: 1, airHockeyTables: 1, dartBoards: 3, playstations: 4,
  hasCafe: true, hasParking: true, hasWifi: true, hasProfessionalCoach: true,
  specialFeatures: 'سالن VIP اختصاصی، امکان برگزاری مسابقات خصوصی، آموزش توسط مربیان فدراسیون',
  workingHours: {
    saturday: { isOpen: true, open: '۱۰:۰۰', close: '۲۳:۰۰' },
    sunday: { isOpen: true, open: '۱۰:۰۰', close: '۲۳:۰۰' },
    monday: { isOpen: true, open: '۱۰:۰۰', close: '۲۳:۰۰' },
    tuesday: { isOpen: true, open: '۱۰:۰۰', close: '۲۳:۰۰' },
    wednesday: { isOpen: true, open: '۱۰:۰۰', close: '۲۳:۰۰' },
    thursday: { isOpen: true, open: '۱۰:۰۰', close: '۰۰:۰۰' },
    friday: { isOpen: true, open: '۱۴:۰۰', close: '۰۰:۰۰' },
  },
  images: [], videos: [],
};

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return d < 1 ? `${Math.round(d * 1000)} متر` : `${d.toFixed(1)} کیلومتر`;
}

const tables = [
  { key: 'snookerTables', label: 'اسنوکر', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
  { key: 'pocketTables', label: 'پاکت بیلیارد', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.15)' },
  { key: 'highballTables', label: 'هی‌بال', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' },
  { key: 'vipSnookerTables', label: 'VIP اسنوکر', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
  { key: 'vipPocketTables', label: 'VIP پاکت', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
  { key: 'airHockeyTables', label: 'ایرهاکی', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
  { key: 'dartBoards', label: 'دارت', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)' },
  { key: 'playstations', label: 'پلی‌استیشن', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.15)' },
];

export default function ClubProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const [club, setClub] = useState<Club>(sampleClub);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/clubs/${id}`).then(res => {
      if (res.data) setClub(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setDistance(calcDistance(pos.coords.latitude, pos.coords.longitude, club.latitude, club.longitude));
      });
    }
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0faf5 0%, #e8f5ef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#10b981' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎱</div>
        <p style={{ fontSize: '14px', opacity: 0.6 }}>در حال بارگذاری...</p>
      </div>
    </div>
  );

  const mapsUrl = `https://www.google.com/maps?q=${club.latitude},${club.longitude}`;
  const activeTables = tables.filter(t => (club as any)[t.key] > 0);
  const todayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
  const todayHours = club.workingHours?.[todayKey];

  return (
    <>
      <style>{`
        .club-section {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(16,185,129,0.1);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
          padding: 24px;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 16px; font-weight: 800; color: #0f2318;
          margin: 0 0 20px; display: flex; align-items: center; gap: 8px;
        }
        .section-title::before {
          content: ''; width: 4px; height: 18px;
          background: linear-gradient(180deg, #10b981, #06b6d4);
          border-radius: 2px; display: inline-block;
        }
        .img-thumb {
          width: 72px; height: 56px; object-fit: cover; border-radius: 10px;
          cursor: pointer; transition: all 0.3s ease; flex-shrink: 0;
          border: 2px solid transparent;
        }
        .img-thumb.active { border-color: #10b981; box-shadow: 0 0 12px rgba(16,185,129,0.3); }
        .img-thumb:hover { transform: scale(1.05); }
        .info-row {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: rgba(26,46,36,0.55);
          padding: 8px 0; border-bottom: 1px solid rgba(16,185,129,0.06);
        }
        .info-row:last-child { border-bottom: none; }
        .day-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 12px; border-radius: 10px; font-size: 13px;
          transition: background 0.2s;
        }
        .day-row:hover { background: rgba(16,185,129,0.04); }
        .day-row.today { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .tables-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0faf5 0%, #e8f5ef 30%, #f4faf7 100%)', padding: '32px 24px 0', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 20%, rgba(16,185,129,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.04) 0%, transparent 50%)' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(26,46,36,0.4)', marginBottom: '24px' }}>
            <Link href="/clubs" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronRight size={14} /> باشگاه‌ها
            </Link>
            <span>›</span>
            <span>{club.name}</span>
          </div>

          {/* هدر */}
          <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)', borderRadius: '24px', padding: '32px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(rgba(255,255,255,0.06), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(rgba(16,185,129,0.15), transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '8px' }}>BILLIARD CLUB</div>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{club.name}</h1>
                {club.managerName && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 16px' }}>مدیر: {club.managerName}</p>}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    <MapPin size={12} /> {club.city}
                  </div>
                  {distance && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', color: '#6ee7b7' }}>
                      <Navigation size={12} /> {distance} تا شما
                    </div>
                  )}
                  {todayHours?.isOpen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                      <Clock size={12} /> امروز: {todayHours.open} تا {todayHours.close}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
                  <MapPin size={14} /> نقشه
                </a>
                <button onClick={() => user ? router.push(`/booking/${club.id}`) : router.push('/login')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px', padding: '10px 20px', color: '#000', fontSize: '13px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(16,185,129,0.4)', transition: 'all 0.3s' }}>
                  <Calendar size={14} /> رزرو میز
                </button>
              </div>
            </div>
          </div>

          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>

            {/* ستون اصلی */}
            <div>

              {/* گالری */}
              {club.images && club.images.length > 0 ? (
                <div className="club-section">
                  <h2 className="section-title">تصاویر باشگاه</h2>
                  <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '12px', height: '260px', background: 'linear-gradient(135deg, #064e3b, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={club.images[activeImage]} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {club.images.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {club.images.map((img, i) => (
                        <img key={i} src={img} alt="" onClick={() => setActiveImage(i)}
                          className={`img-thumb ${activeImage === i ? 'active' : ''}`} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="club-section">
                  <div style={{ height: '200px', background: 'linear-gradient(135deg, #064e3b, #065f46)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '64px', opacity: 0.2 }}>🎱</div>
                  </div>
                </div>
              )}

              {/* توضیحات */}
              {club.description && (
                <div className="club-section">
                  <h2 className="section-title">درباره باشگاه</h2>
                  <p style={{ fontSize: '14px', color: 'rgba(26,46,36,0.65)', lineHeight: 1.8, margin: 0 }}>{club.description}</p>
                  {club.specialFeatures && (
                    <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, marginBottom: '6px' }}>⭐ امکانات ویژه</div>
                      <p style={{ fontSize: '13px', color: 'rgba(26,46,36,0.6)', margin: 0, lineHeight: 1.7 }}>{club.specialFeatures}</p>
                    </div>
                  )}
                </div>
              )}

              {/* میزها */}
              <div className="club-section">
                <h2 className="section-title">میزها و تجهیزات</h2>
                <div className="tables-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {activeTables.map(t => (
                    <div key={t.key} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '14px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: t.color, marginBottom: '4px' }}>
                        {(club as any)[t.key].toLocaleString('fa-IR')}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(26,46,36,0.5)', fontWeight: 500 }}>{t.label}</div>
                    </div>
                  ))}
                </div>

                {/* امکانات */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {club.hasCafe && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706', fontWeight: 500 }}><Coffee size={12} /> کافه</span>}
                  {club.hasParking && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#0891b2', fontWeight: 500 }}><Car size={12} /> پارکینگ</span>}
                  {club.hasWifi && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#7c3aed', fontWeight: 500 }}><Wifi size={12} /> اینترنت رایگان</span>}
                  {club.hasProfessionalCoach && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669', fontWeight: 500 }}><Trophy size={12} /> مربی حرفه‌ای</span>}
                </div>
              </div>

              {/* ساعات کاری */}
              {club.workingHours && (
                <div className="club-section">
                  <h2 className="section-title">ساعات کاری</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Object.entries(club.workingHours).map(([day, hours]: any) => (
                      <div key={day} className={`day-row ${day === todayKey ? 'today' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: day === todayKey ? 700 : 500, color: day === todayKey ? '#059669' : 'rgba(26,46,36,0.7)', fontSize: '13px', width: '80px' }}>{dayNames[day]}</span>
                          {day === todayKey && <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>امروز</span>}
                        </div>
                        {hours.isOpen ? (
                          <span style={{ fontSize: '13px', color: 'rgba(26,46,36,0.55)', fontWeight: 500 }}>{hours.open} — {hours.close}</span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#dc2626', background: 'rgba(239,68,68,0.06)', padding: '2px 10px', borderRadius: '20px' }}>تعطیل</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ویدیو */}
              {club.videos && club.videos.length > 0 && (
                <div className="club-section">
                  <h2 className="section-title">ویدیوی باشگاه</h2>
                  <video controls style={{ width: '100%', borderRadius: '14px' }} src={club.videos[0]} />
                </div>
              )}
            </div>

            {/* ستون کنار */}
            <div style={{ position: 'sticky', top: '90px' }}>

              {/* اطلاعات تماس */}
              <div className="club-section">
                <h2 className="section-title">اطلاعات تماس</h2>
                <div>
                  <div className="info-row">
                    <MapPin size={14} style={{ color: '#10b981', marginTop: '1px', flexShrink: 0 }} />
                    <span>{club.address}، {club.city}، {club.country}</span>
                  </div>
                  {club.phone && (
                    <div className="info-row">
                      <Phone size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                      <a href={`tel:${club.phone}`} style={{ color: 'rgba(26,46,36,0.55)', textDecoration: 'none' }}>{club.phone}</a>
                    </div>
                  )}
                  {club.website && (
                    <div className="info-row">
                      <Globe size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                      <a href={club.website} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'none', fontSize: '13px' }}>
                        {club.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '12px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', color: '#0891b2', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s' }}>
                  <MapPin size={15} /> مشاهده در Google Maps
                </a>
              </div>

              {/* امتیاز */}
              <div className="club-section">
                <h2 className="section-title">امتیاز و نظرات</h2>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: '#0f2318', lineHeight: 1 }}>۴.۸</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '8px 0' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={18} style={{ color: '#f59e0b', fill: s <= 4 ? '#f59e0b' : 'transparent' }} />)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(26,46,36,0.4)' }}>بر اساس ۱۲۴ نظر</div>
                </div>
              </div>

              {/* رزرو */}
              <button onClick={() => user ? router.push(`/booking/${club.id}`) : router.push('/login')}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 30px rgba(16,185,129,0.3)', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(16,185,129,0.3)'; }}>
                <Calendar size={18} /> رزرو میز آنلاین
              </button>
            </div>
          </div>

          <div style={{ paddingBottom: '60px' }} />
        </div>
      </div>
    </>
  );
}
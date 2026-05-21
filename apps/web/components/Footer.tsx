'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease;
          display: block;
          padding: 4px 0;
        }
        .footer-link:hover { color: #10b981; }
        .footer-social {
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.3);
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .footer-social:hover {
          background: rgba(16,185,129,0.1);
          border-color: rgba(16,185,129,0.3);
          color: #10b981;
        }
      `}</style>

      <footer style={{
        backgroundColor: '#020806',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '60px 24px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* نور پس‌زمینه */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: '30%', width: '300px', height: '200px', background: 'radial-gradient(ellipse, rgba(16,185,129,0.03), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>

            {/* لوگو و توضیح */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', color: '#000', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>B</div>
                <span style={{ fontWeight: 900, fontSize: '18px', color: '#fff', letterSpacing: '-0.02em' }}>
                  بیلیارد{' '}
                  <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>پلاس</span>
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', lineHeight: 1.8, marginBottom: '20px', maxWidth: '260px' }}>
                اولین پلتفرم تخصصی بیلیارد ایران. رزرو میز، رنکینگ رسمی، فروشگاه تجهیزات و پخش زنده مسابقات.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['T', 'I', 'Y', 'T'].map((s, i) => (
                  <a key={i} className="footer-social">{s}</a>
                ))}
              </div>
            </div>

            {/* پلتفرم */}
            <div>
              <div style={{ fontSize: '11px', color: '#10b981', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '16px' }}>PLATFORM</div>
              {[
                { href: '/clubs', label: 'باشگاه‌ها' },
                { href: '/shop', label: 'فروشگاه' },
                { href: '/rankings', label: 'رنکینگ' },
                { href: '/live', label: 'پخش زنده' },
                { href: '/events', label: 'مسابقات' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="footer-link">{item.label}</Link>
              ))}
            </div>

            {/* اکتشاف */}
            <div>
              <div style={{ fontSize: '11px', color: '#06b6d4', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '16px' }}>EXPLORE</div>
              {[
                { href: '/players', label: 'بازیکنان' },
                { href: '/coaches', label: 'مربیان' },
                { href: '/referees', label: 'داوران' },
                { href: '/news', label: 'اخبار' },
                { href: '/education', label: 'آموزش' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="footer-link">{item.label}</Link>
              ))}
            </div>

            {/* حساب */}
            <div>
              <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '16px' }}>ACCOUNT</div>
              {[
                { href: '/register', label: 'ثبت‌نام رایگان' },
                { href: '/login', label: 'ورود' },
                { href: '/dashboard', label: 'داشبورد' },
                { href: '/profile', label: 'پروفایل' },
                { href: '/dashboard/shop', label: 'فروشگاه من' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="footer-link">{item.label}</Link>
              ))}
            </div>
          </div>

          {/* خط جدا */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', marginBottom: '24px' }} />

          {/* پایین فوتر */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
              © ۱۴۰۳ بیلیارد پلاس — تمام حقوق محفوظ است
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em' }}>
              BILLIARD PLUS · IRAN · 2024
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['حریم خصوصی', 'قوانین', 'تماس با ما'].map((item, i) => (
                <span key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = '#10b981'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.15)'; }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
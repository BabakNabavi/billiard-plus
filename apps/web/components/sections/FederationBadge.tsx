'use client';

import { Shield, CheckCircle } from 'lucide-react';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

const partners = [
  { name: 'فدراسیون بیلیارد',    role: 'شریک رسمی',         badge: 'OFFICIAL' },
  { name: 'ویراکا',              role: 'شریک تجهیزات',       badge: 'PARTNER'  },
  { name: 'زرین‌پال',            role: 'درگاه پرداخت',       badge: 'PAYMENT'  },
  { name: 'لیگ برتر اسنوکر',    role: 'حامی مسابقات',       badge: 'SPONSOR'  },
];

export function FederationBadge() {
  return (
    <ScrollReveal>
      <section style={{ marginBottom: '110px' }}>
        <div style={{
          position: 'relative', borderRadius: '28px', overflow: 'hidden',
          padding: '52px 48px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Top neon line */}
          <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', width: '160px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Left — trust badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={28} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(16,185,129,0.6)', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '6px' }}>VERIFIED PLATFORM</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#f0faf5', letterSpacing: '-0.02em', marginBottom: '4px' }}>پلتفرم تأیید شده</div>
                <div style={{ fontSize: '13px', color: 'rgba(240,250,245,0.4)', lineHeight: 1.5 }}>زیر نظر فدراسیون بیلیارد و اسنوکر ایران</div>
              </div>
            </div>

            {/* Right — partners */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {partners.map((p, i) => (
                <div key={i} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
                    <CheckCircle size={11} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 700, letterSpacing: '0.1em' }}>{p.badge}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0faf5', marginBottom: '3px' }}>{p.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,250,245,0.3)' }}>{p.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
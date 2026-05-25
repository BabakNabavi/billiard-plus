import { ReactNode } from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?:    string;
  title:    string;
  desc?:    string;
  action?:  { label: string; href?: string; onClick?: () => void; };
}

export function EmptyState({ icon = '🎱', title, desc, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Icon with glow */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <div style={{ fontSize: '52px', opacity: 0.18, filter: 'blur(20px)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          {icon}
        </div>
        <div style={{ fontSize: '48px', position: 'relative' }}>{icon}</div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f0faf5', margin: 0, letterSpacing: '-0.02em' }}>
        {title}
      </h3>

      {desc && (
        <p style={{ fontSize: '14px', color: 'rgba(240,250,245,0.35)', margin: 0, lineHeight: 1.7, maxWidth: '320px' }}>
          {desc}
        </p>
      )}

      {action && (
        action.href ? (
          <Link href={action.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            marginTop: '8px', padding: '11px 24px', borderRadius: '12px',
            background: 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff', fontSize: '13px', fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
          }}>
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} style={{
            marginTop: '8px', padding: '11px 24px', borderRadius: '12px',
            background: 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff', fontSize: '13px', fontWeight: 700,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
          }}>
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
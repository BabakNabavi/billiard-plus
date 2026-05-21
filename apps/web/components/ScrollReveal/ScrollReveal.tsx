'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function ScrollReveal({ children, delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'hidden' | 'visible' | 'exit'>('hidden');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setState('visible'), delay);
        } else {
          setState('hidden');
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (state === 'visible') return 'translate3d(0,0,0) scale(1)';
    switch (direction) {
      case 'up': return 'translate3d(0,60px,0) scale(0.97)';
      case 'down': return 'translate3d(0,-60px,0) scale(0.97)';
      case 'left': return 'translate3d(-60px,0,0) scale(0.97)';
      case 'right': return 'translate3d(60px,0,0) scale(0.97)';
      default: return 'translate3d(0,0,0) scale(0.97)';
    }
  };

  return (
    <div ref={ref} style={{
      opacity: state === 'visible' ? 1 : 0,
      transform: getTransform(),
      filter: state === 'visible' ? 'blur(0px)' : 'blur(4px)',
      transition: `opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1), filter 0.9s ease`,
      willChange: 'opacity, transform, filter',
    }}>
      {children}
    </div>
  );
}
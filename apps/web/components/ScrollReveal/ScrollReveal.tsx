'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  scale?: boolean;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  distance = 28,
  blur = true,
  scale = false,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const transform = visible
    ? 'translateY(0) scale(1)'
    : `translateY(${distance}px) scale(${scale ? 0.97 : 1})`;

  const filter = blur
    ? visible ? 'blur(0px)' : 'blur(6px)'
    : undefined;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform,
        filter,
        transition: [
          `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          `transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          blur ? `filter ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s` : '',
        ].filter(Boolean).join(', '),
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
import { ReactNode } from 'react';

interface Props {
  gradient?: string;
  photoUrl?: string;
  categoryColor?: string;
  categoryLabel?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  swipeHint?: boolean;
}

export function HeroPage({
  gradient,
  photoUrl,
  categoryColor = 'var(--terra)',
  categoryLabel,
  title,
  subtitle,
  children,
  swipeHint = false,
}: Props) {
  const bg = photoUrl
    ? `url(${photoUrl}) center/cover no-repeat`
    : (gradient ?? 'linear-gradient(162deg, hsl(19,34%,10%) 0%, hsl(10,68%,22%) 45%, hsl(23,55%,40%) 100%)');

  return (
    <div
      className="no-select"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: bg,
        overflow: 'hidden',
      }}
    >
      {/* Grain texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.07,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }} />

      {/* Top scrim — protects system indicators */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 28,
        background: 'linear-gradient(to bottom, rgba(79,56,38,0.45) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content block */}
      <div style={{
        position: 'absolute', bottom: 64, left: 20, right: 20,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Eyebrow: line + category label */}
        {categoryLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 1.5, background: categoryColor, flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: categoryColor,
            }}>
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(26px, 8vw, 34px)',
          lineHeight: 1.1,
          color: 'var(--avorio)',
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontWeight: 300,
            fontSize: 12,
            lineHeight: 1.5,
            color: 'rgba(237,229,213,0.55)',
            maxWidth: 240,
          }}>
            {subtitle}
          </p>
        )}

        {/* Slot: AudioPlayer or meta tiles */}
        {children}
      </div>

      {/* Swipe hint */}
      {swipeHint && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 4,
          opacity: 0.45, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'white',
          }}>
            Swipe
          </span>
          <div style={{
            width: 0, height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '6px solid white',
          }} />
        </div>
      )}
    </div>
  );
}

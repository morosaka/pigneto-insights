'use client';
import { useState } from 'react';

export const ONBOARDING_KEY = 'pigneto.onboarding.seen';
export const ONBOARDING_VERSION = 'v1';

const SCREENS = [
  {
    gradient: 'linear-gradient(162deg, hsl(19,34%,10%), hsl(10,68%,22%), hsl(23,55%,40%))',
    gesture: 'vertical' as const,
    line: 'Swipe up to flip through stories.',
  },
  {
    gradient: 'linear-gradient(155deg, hsl(111,41%,10%), hsl(19,34%,16%), hsl(19,28%,28%))',
    gesture: 'horizontal' as const,
    line: 'Swipe sideways to change category.',
  },
  {
    gradient: 'linear-gradient(148deg, hsl(206,47%,10%), hsl(206,44%,20%), hsl(19,34%,28%))',
    gesture: 'pull-up' as const,
    line: 'Pull up to see the full list.',
  },
] as const;

type Gesture = typeof SCREENS[number]['gesture'];

function GesturePictogram({ gesture }: { gesture: Gesture }) {
  if (gesture === 'vertical') {
    return (
      <svg width="40" height="60" viewBox="0 0 40 60" fill="none" aria-hidden="true">
        <circle cx="20" cy="44" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M20 34 L20 10" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3" />
        <path d="M13 17 L20 10 L27 17" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
    );
  }
  if (gesture === 'horizontal') {
    return (
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden="true">
        <circle cx="16" cy="20" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M26 20 L50 20" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3" />
        <path d="M43 13 L50 20 L43 27" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
    );
  }
  // pull-up
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" aria-hidden="true">
      <circle cx="20" cy="16" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M20 26 L20 50" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3" />
      <path d="M13 43 L20 50 L27 43" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

interface Props {
  onDone: () => void;
}

export function OnboardingFlow({ onDone }: Props) {
  const [screen, setScreen] = useState(0);

  const next = () => {
    if (screen < SCREENS.length - 1) setScreen(s => s + 1);
    else onDone();
  };

  const { gradient, gesture, line } = SCREENS[screen];
  const isLast = screen === SCREENS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: gradient,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 32,
    }}>
      {/* Progress dots */}
      <div style={{
        position: 'absolute', top: 52,
        display: 'flex', gap: 6,
      }}>
        {SCREENS.map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'white',
            opacity: i === screen ? 0.85 : 0.3,
            transition: 'opacity 300ms ease',
          }} />
        ))}
      </div>

      <GesturePictogram gesture={gesture} />

      <p style={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: 18, color: 'rgba(255,255,255,0.8)',
        textAlign: 'center', maxWidth: 260, lineHeight: 1.3,
        padding: '0 24px',
      }}>
        {line}
      </p>

      {isLast ? (
        <button
          onClick={next}
          style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--avorio)', background: 'var(--terra)',
            padding: '12px 32px', borderRadius: 20,
            border: 'none', cursor: 'pointer',
          }}
        >
          Begin
        </button>
      ) : (
        <button
          onClick={next}
          style={{
            position: 'absolute', bottom: 40, right: 24,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11, color: 'rgba(255,255,255,0.5)',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}

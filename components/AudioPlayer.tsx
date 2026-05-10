'use client';
import { useRef, useState, useCallback } from 'react';

function barHeights(title: string, count = 16): number[] {
  let seed = Array.from(title).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: count }, () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return 30 + (Math.abs(seed) % 56); // 30–85%
  });
}

interface Props {
  audioUrl?: string | null;
  durationMin?: number | null;
  title: string;
}

export function AudioPlayer({ audioUrl, durationMin, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1

  const heights = barHeights(title);
  const playedBars = Math.round(progress * heights.length);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  }, [playing, audioUrl]);

  const onTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress(el.currentTime / el.duration);
  }, []);

  const scrubTo = useCallback((barIndex: number) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    el.currentTime = (barIndex / heights.length) * el.duration;
  }, [heights.length]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Play/pause */}
      <button
        onClick={toggle}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'var(--terra)',
          boxShadow: 'var(--shadow-play)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <div style={{ display: 'flex', gap: 3 }}>
            <div style={{ width: 3, height: 12, background: 'white', borderRadius: 2 }} />
            <div style={{ width: 3, height: 12, background: 'white', borderRadius: 2 }} />
          </div>
        ) : (
          <div style={{
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '10px solid white',
            marginLeft: 2,
          }} />
        )}
      </button>

      {/* Waveform */}
      <div
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={heights.length}
        aria-valuenow={playedBars}
        style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24, flex: 1, cursor: 'pointer' }}
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const barIndex = Math.floor(((e.clientX - rect.left) / rect.width) * heights.length);
          scrubTo(barIndex);
        }}
      >
        {heights.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: 1,
              background: 'white',
              opacity: i < playedBars ? 0.55 : 0.18,
              transition: 'opacity 100ms ease',
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span style={{
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        fontSize: 10,
        color: 'rgba(255,255,255,0.38)',
        flexShrink: 0,
      }}>
        {durationMin != null ? `${durationMin} min` : '—'}
      </span>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => { setPlaying(false); setProgress(0); }}
        />
      )}
    </div>
  );
}

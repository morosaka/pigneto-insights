'use client';
import { useState } from 'react';
import type { WeeklyIssue, Story } from '@/lib/types';
import Link from 'next/link';

type View = 'issues' | 'stories';

function IssueRow({ issue }: { issue: WeeklyIssue }) {
  const date = new Date(issue.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Link href={`/this-week/${issue.slug}`}
      style={{
        display: 'block', textDecoration: 'none',
        padding: '14px 0', borderBottom: '1px solid var(--avorio-dim)',
      }}>
      <div style={{ fontSize: 11, color: 'var(--terra)', fontFamily: 'var(--font-sans)', marginBottom: 4, letterSpacing: '0.05em' }}>
        {date}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ciocco)', lineHeight: 1.2, marginBottom: 4 }}>
        {issue.lead_title}
      </div>
      {issue.lead_subtitle && (
        <div style={{ fontSize: 13, color: 'var(--terra)', fontFamily: 'var(--font-sans)' }}>
          {issue.lead_subtitle}
        </div>
      )}
    </Link>
  );
}

function StoryRow({ story }: { story: Story }) {
  const hasAudio = !!(story.narration_url || story.podcast_url);
  const timeMin = story.narration_time_min ?? story.reading_time_min;
  const href = story.slug ? `/story/${story.slug}` : null;

  const inner = (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--avorio-dim)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {hasAudio && <span style={{ fontSize: 13 }}>🎧</span>}
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ciocco)', lineHeight: 1.2 }}>
          {story.title}
        </div>
      </div>
      {story.summary && (
        <div style={{ fontSize: 13, color: 'var(--terra)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
          {story.summary.slice(0, 100)}…
        </div>
      )}
      {timeMin && (
        <div style={{ fontSize: 11, color: 'var(--terra)', fontFamily: 'var(--font-sans)', marginTop: 4, opacity: 0.7 }}>
          {timeMin} min {story.narration_url ? 'listen' : 'read'}
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link>;
  return <div>{inner}</div>;
}

interface Props {
  issues: WeeklyIssue[];
  stories: Story[];
}

export function LibraryPage({ issues, stories }: Props) {
  const [view, setView] = useState<View>('issues');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--avorio)' }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--ardesia) 0%, hsl(206,47%,28%) 100%)',
        padding: 'calc(env(safe-area-inset-top, 0px) + 54px) 20px 24px',
        position: 'relative',
      }}>
        <Link href="/" style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', left: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 18, textDecoration: 'none', zIndex: 10,
        }}>←</Link>

        <div className="t-eyebrow" style={{ marginBottom: 8 }}>The Archive</div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
          fontSize: 28, color: 'var(--avorio)', margin: 0, lineHeight: 1.2,
        }}>
          Past issues & deep reads
        </h1>
      </div>

      {/* ── Tab selector ─────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--avorio-dim)', background: 'white' }}>
        {(['issues', 'stories'] as View[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              flex: 1, padding: '12px 0', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-sans)', background: 'none', border: 'none',
              cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase',
              color: view === v ? 'var(--ciocco)' : 'var(--terra)',
              borderBottom: view === v ? '2px solid var(--ciocco)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {v === 'issues' ? 'Issues' : 'Stories'}
          </button>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div style={{ padding: '0 20px 48px' }}>
        {view === 'issues' && (
          issues.length > 0
            ? issues.map(i => <IssueRow key={i.id} issue={i} />)
            : <p style={{ padding: '24px 0', color: 'var(--terra)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>No past issues yet.</p>
        )}
        {view === 'stories' && (
          stories.length > 0
            ? stories.map(s => <StoryRow key={s.id} story={s} />)
            : <p style={{ padding: '24px 0', color: 'var(--terra)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>No stories yet.</p>
        )}
      </div>
    </div>
  );
}

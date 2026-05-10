'use client';

interface Props {
  onClose: () => void;
  onReplayOnboarding: () => void;
  lastUpdated?: string;
}

export function SettingsSheet({ onClose, onReplayOnboarding, lastUpdated }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        role="button"
        aria-label="Close settings"
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label="Settings"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 91,
          background: 'var(--avorio)',
          borderRadius: '20px 20px 0 0',
          padding: '12px 24px 48px',
          minHeight: '50vh',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'hsl(37,18%,74%)',
          margin: '0 auto 20px',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 22, color: 'var(--ciocco)',
          }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 20, lineHeight: 1,
              color: 'hsl(37,20%,55%)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Rows */}
        <button
          onClick={() => { onReplayOnboarding(); onClose(); }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '14px 0',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 14, color: 'var(--ciocco)',
            background: 'none', border: 'none',
            borderBottom: '1px solid hsl(37,18%,82%)',
            cursor: 'pointer',
          }}
        >
          Replay onboarding
        </button>

        <button
          onClick={() => {
            // About info shown inline — could be expanded later
            alert('Pigneto Insights\nA neighborhood guide curated by Mauro.\nPigneto, Rome.');
          }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '14px 0',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 14, color: 'var(--ciocco)',
            background: 'none', border: 'none',
            borderBottom: '1px solid hsl(37,18%,82%)',
            cursor: 'pointer',
          }}
        >
          About this app
        </button>

        {lastUpdated && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11, color: 'hsl(37,20%,55%)',
            padding: '14px 0',
            borderBottom: '1px solid hsl(37,18%,82%)',
          }}>
            Last update: {lastUpdated}
          </p>
        )}

        <p style={{
          marginTop: 24,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 9, color: 'hsl(37,20%,60%)', textAlign: 'center',
          letterSpacing: '0.06em',
        }}>
          Pigneto Insights · v1.0
        </p>
      </div>
    </>
  );
}

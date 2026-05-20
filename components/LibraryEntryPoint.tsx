import Link from 'next/link';

export function LibraryEntryPoint() {
  return (
    <Link href="/library" style={{ display: 'block', textDecoration: 'none', margin: '0 0 2px' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--ardesia) 0%, hsl(206,47%,28%) 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(232,218,198,0.5)', fontFamily: 'var(--font-sans)', marginBottom: 4,
          }}>
            The Archive
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 19, color: 'var(--avorio)', lineHeight: 1.2,
          }}>
            Past issues & deep reads
          </div>
        </div>
        <span style={{ fontSize: 20, color: 'rgba(232,218,198,0.4)' }}>→</span>
      </div>
    </Link>
  );
}

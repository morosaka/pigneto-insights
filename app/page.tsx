export default function Page() {
  return (
    <div style={{
      width: '100vw',
      height: '100svh',
      background: 'linear-gradient(162deg, hsl(19,34%,10%) 0%, hsl(10,68%,22%) 45%, hsl(23,55%,40%) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 28,
        color: 'hsl(37, 37%, 88%)',
      }}>
        Pigneto Insights
      </p>
    </div>
  );
}

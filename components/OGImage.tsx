interface OGImageProps {
  title?: string;
  subtitle?: string;
  caption?: string;
}

export function OGImage({
  title = 'SCARDUBU',
  subtitle = 'Staff Backend and Platform Engineer · AI & Fintech Systems',
  caption = 'Systems built with explicit failure boundaries, observable behavior, and deliberate recovery paths.',
}: Readonly<OGImageProps>) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#08090C',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: '#00D9FF',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.45,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '68px 72px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              border: '1px solid rgba(0,217,255,0.45)',
              background: '#0E0E10',
              fontSize: 16,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#00D9FF',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#00D9FF',
              }}
            />
            OSCAR NDUGBU · LAGOS, NG · REMOTE
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
            }}
          >
            WWW.SCARDUBU.DEV
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '88%' }}>
          <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: '0.2em', lineHeight: 1 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, color: '#00D9FF', fontWeight: 600 }}>{subtitle}</div>
          <div style={{ fontSize: 25, lineHeight: 1.45, color: '#d4d4d8' }}>{caption}</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: 24,
          }}
        >
          {['Backend & Platform', 'Quantitative ML', 'AI Infrastructure', 'Fintech Recovery'].map(
            (item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  padding: '10px 16px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: '#0E0E10',
                  color: '#e4e4e7',
                  fontSize: 16,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

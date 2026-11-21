import { ImageResponse } from '@vercel/og';

import { STATUS_TONE, WORK_CASE_META } from '@/lib/work-meta';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = WORK_CASE_META[slug];
  const title = record?.title ?? 'Engineering Case Study';
  const domain = record?.domain ?? 'ENGINEERING CASE STUDY';
  const tagline =
    record?.tagline ??
    'Architecture decisions, operating constraints, and explicit evidence boundaries.';
  const status = record?.status ?? 'PRIVATE CASE STUDY';
  const statusHex = STATUS_TONE[status].hex;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 72,
        background: '#08090C',
        color: '#ffffff',
        position: 'relative',
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: '#00D9FF',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {domain}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid rgba(255,255,255,0.16)',
            background: '#0E0E10',
            padding: '8px 16px',
            fontSize: 14,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: statusHex,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '999px',
              background: statusHex,
            }}
          />
          {status}
        </div>
      </div>

      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 24,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 24,
          color: '#d4d4d8',
          maxWidth: 880,
          lineHeight: 1.5,
        }}
      >
        {tagline}
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 16, letterSpacing: '0.22em', fontWeight: 700, color: '#ffffff' }}>
          SCARDUBU // OSCAR NDUGBU
        </span>
        <span style={{ fontSize: 16, color: '#a1a1aa' }}>www.scardubu.dev/work/{slug}</span>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}

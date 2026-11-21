import { ImageResponse } from '@vercel/og';

import { OGImage } from '@/components/OGImage';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(<OGImage />, { width: 1200, height: 630 });
}

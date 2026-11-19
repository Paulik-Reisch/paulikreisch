import type { NextRequest } from 'next/server';
import { readWikiGameCookies, serializeWikiGame } from '@/lib/wikiland-storage';

export function GET(request: NextRequest) {
  const cookies = new Map(request.cookies.getAll().map(({ name, value }) => [name, value]));
  const game = readWikiGameCookies(cookies);
  const headers = { 'Cache-Control': 'private, no-store' };
  return game
    ? new Response(serializeWikiGame(game), { headers })
    : new Response(null, { status: 204, headers });
}

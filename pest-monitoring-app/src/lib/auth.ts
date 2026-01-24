
import { parse, serialize } from 'cookie';

const COOKIE = process.env.AUTH_SESSION_COOKIE || 'pest_session';
const TTL = parseInt(process.env.AUTH_SESSION_TTL || '7200', 10);

export type Session = { username: string; role: 'admin'|'inspector' };

export function setSessionCookie(res: any, session: Session) {
  const value = Buffer.from(JSON.stringify(session)).toString('base64');
  res.setHeader('Set-Cookie', serialize(COOKIE, value, {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: TTL, secure: true
  }));
}

export function getSessionCookie(req: any): Session | null {
  const cookies = parse(req.headers.cookie || '');
  const raw = cookies[COOKIE];
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, 'base64').toString();
    return JSON.parse(json);
  } catch { return null; }
}

export function clearSessionCookie(res: any) {
  res.setHeader('Set-Cookie', serialize(COOKIE, '', { path: '/', maxAge: 0 }));
}

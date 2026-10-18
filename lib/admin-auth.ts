import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
const COOKIE = 'abertura_admin';
function signature(value: string) { const secret = process.env.ADMIN_SESSION_SECRET; if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET precisa ter pelo menos 32 caracteres.'); return createHmac('sha256', secret).update(value).digest('hex'); }
export function createAdminSession() { const value = `admin:${Date.now()}`; return `${value}.${signature(value)}`; }
export async function isAdmin() { try { const raw = (await cookies()).get(COOKIE)?.value; if (!raw) return false; const i = raw.lastIndexOf('.'); if (i < 1) return false; const value = raw.slice(0, i), sig = raw.slice(i + 1), expected = signature(value); const a = Buffer.from(sig), b = Buffer.from(expected); if (a.length !== b.length || !timingSafeEqual(a,b)) return false; const timestamp = Number(value.split(':').at(-1)); return value.startsWith('admin:') && Number.isFinite(timestamp) && Date.now()-timestamp < 8*60*60*1000; } catch { return false; } }
export const ADMIN_COOKIE = COOKIE;

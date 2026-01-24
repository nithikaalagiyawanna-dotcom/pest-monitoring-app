
import type { NextApiRequest, NextApiResponse } from 'next';
import { setSessionCookie } from '@/lib/auth';

// Minimal: look up users by PIN only.
// NOTE: This uses the service role on server only.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { pin } = req.body as { pin?: string };
  if (!pin || pin.length !== 4) return res.status(400).json({ error: 'Invalid PIN' });

  // server-side Supabase client with service role
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('users')
    .select('username, role')
    .eq('pin', pin)
    .limit(1)
    .single();

  if (error || !data) return res.status(401).json({ error: 'PIN not found' });

  setSessionCookie(res, { username: data.username, role: (data.role as any) || 'inspector' });
  return res.status(200).json({ ok: true, user: data });
}


import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionCookie } from '@/lib/auth';

// Returns a signed URL so the client can upload a single photo directly to the private bucket.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSessionCookie(req);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });
  if (req.method !== 'POST') return res.status(405).end();

  const { fileName } = req.body as { fileName?: string };
  if (!fileName) return res.status(400).json({ error: 'fileName required' });

  const bucket = process.env.PHOTOS_BUCKET || 'photos';

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // We use upload with signed URL: generate a URL valid for 10 minutes
  const path = `${session.username}/${Date.now()}-${fileName}`;

  const { data: signed, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !signed) return res.status(500).json({ error: error?.message || 'sign failed' });

  return res.status(200).json({ path, signedUrl: signed.signedUrl, token: signed.token });
}

import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { slot, passcode, filename } = req.query;
  const expected = process.env.ADMIN_PASSCODE || 'fatima2026';
  if (passcode !== expected) { res.status(401).json({ error: 'Неверный пароль' }); return; }

  const ALLOWED_SLOTS = ['hero', 'about', 'photo1', 'photo2', 'video1', 'video2', 'video3'];
  if (!slot || !ALLOWED_SLOTS.includes(slot)) { res.status(400).json({ error: 'Неизвестный слот' }); return; }

  const rawExt = (typeof filename === 'string' && filename.includes('.') ? filename.split('.').pop() : '') || '';
  const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const ext = cleanExt || (slot.startsWith('video') ? 'mp4' : 'jpg');
  const pathname = `media/${slot}.${ext}`;

  try {
    const token = process.env.MEDIA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    const clientToken = await generateClientTokenFromReadWriteToken({
      token,
      pathname,
      addRandomSuffix: false,
      maximumSizeInBytes: 500 * 1024 * 1024,
      validUntil: Date.now() + 60 * 60 * 1000,
    });
    res.status(200).json({ clientToken, pathname });
  } catch (error) {
    res.status(500).json({ error: (error && error.message) || 'Token failed' });
  }
}

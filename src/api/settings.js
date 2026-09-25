import { list, put } from '@vercel/blob';

const DEFAULTS = { instagram: '', telegram: '', whatsapp: '', email: '' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const token = process.env.MEDIA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'media/settings.json', token });
      if (!blobs.length) { res.status(200).json(DEFAULTS); return; }
      const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
      const data = await r.json();
      res.status(200).json({ ...DEFAULTS, ...data });
    } catch (error) {
      res.status(200).json(DEFAULTS);
    }
    return;
  }

  if (req.method === 'POST') {
    const { passcode } = req.query;
    const expected = process.env.ADMIN_PASSCODE || 'fatima2026';
    if (passcode !== expected) { res.status(401).json({ error: 'Неверный пароль' }); return; }
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    const safe = {
      instagram: String(body.instagram || ''),
      telegram: String(body.telegram || ''),
      whatsapp: String(body.whatsapp || ''),
      email: String(body.email || ''),
    };
    try {
      await put('media/settings.json', JSON.stringify(safe), {
        access: 'public', addRandomSuffix: false, contentType: 'application/json', token,
      });
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: (error && error.message) || 'Save failed' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}

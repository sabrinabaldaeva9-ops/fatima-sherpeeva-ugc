import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const token = process.env.MEDIA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    const { blobs } = await list({ prefix: 'media/', token });
    const media = {};
    const sorted = blobs.slice().sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
    for (const b of sorted) {
      const file = b.pathname.split('/').pop() || '';
      const slot = file.replace(/\.[^.]+$/, '');
      media[slot] = b.url + '?v=' + new Date(b.uploadedAt).getTime();
    }
    res.status(200).json({ media });
  } catch (error) {
    res.status(200).json({ media: {}, note: error.message });
  }
}

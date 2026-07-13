// 슈퍼차저 데이터 API (Vercel Serverless + Upstash Redis)
// GET  /api/chargers        → 현재 데이터 배열 반환 (없으면 null)
// PUT  /api/chargers        → 전체 배열 저장 (x-admin-token 필요)
//   body: JSON 배열

const KV_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'chargers';

async function kvGet() {
  if (!KV_URL || !KV_TOKEN) return { error: 'KV 미설정' };
  const r = await fetch(`${KV_URL}/get/${KEY}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
  const j = await r.json();
  if (j.result == null) return { data: null };
  try { return { data: JSON.parse(j.result) }; } catch { return { data: null }; }
}

async function kvSet(value) {
  const r = await fetch(`${KV_URL}/set/${KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'text/plain' },
    body: JSON.stringify(value),
  });
  return r.ok;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const { data, error } = await kvGet();
    if (error) return res.status(200).json({ configured: false, data: null });
    return res.status(200).json({ configured: true, data });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const admin = process.env.ADMIN_TOKEN;
    if (!admin) return res.status(500).json({ ok: false, error: 'ADMIN_TOKEN 환경변수가 설정되지 않았습니다.' });
    const token = req.headers['x-admin-token'];
    if (token !== admin) return res.status(401).json({ ok: false, error: '관리자 토큰이 올바르지 않습니다.' });
    if (!KV_URL || !KV_TOKEN) return res.status(500).json({ ok: false, error: 'KV(DB)가 연결되지 않았습니다.' });

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
    if (!Array.isArray(body)) return res.status(400).json({ ok: false, error: '배열 형식의 데이터가 필요합니다.' });

    const ok = await kvSet(body);
    return res.status(ok ? 200 : 500).json({ ok, count: body.length });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}

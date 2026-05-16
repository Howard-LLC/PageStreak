// Discover picks Edge Function — proxies DeepSeek to keep the API key off the browser bundle.
// Auth: Supabase verifies the JWT (--verify-jwt is on by default for deployed functions).

interface IntakePayload {
  genres?: string[];
  avoid?: string[];
  prompt?: string;
  finished?: { title: string; author: string; genre?: string; rating?: number | null }[];
  queued?: { title: string; author: string; genre?: string }[];
  skipped?: { title: string; author: string }[];
  current?: { title: string; author: string; genre?: string } | null;
}

interface BookPick {
  title: string;
  author: string;
  pages: number;
  genre: string;
  why: string;
}

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'https://pagestreak.howardresearch.dev',
]);

const corsHeaders = (origin: string | null) => {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://pagestreak.howardresearch.dev';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
};

const SYSTEM_PROMPT = `You are a thoughtful book recommendation engine for a reading-tracker app called Page Streak.

You will be given a user's reading history and preferences. Recommend exactly five books they'd likely love next.

Hard rules:
- Real books only — do not invent titles or authors.
- Do not recommend a book the user has already finished, is currently reading, or has in their queue.
- Do not recommend a book the user has previously skipped or rejected — these are listed explicitly under "Already rejected (do not recommend)". This is a hard constraint, not a soft preference.
- Do not recommend a book the user has asked to avoid (or anything stylistically very close to it).
- Estimate page count for the most common English-language edition; if unsure, give a sensible round number.
- The "why" must reference something concrete from the user's history (a finished book, a stated genre preference, the avoid list, or the free prompt). One sentence, warm but specific, no marketing fluff.
- Output STRICT JSON only — no prose before or after, no markdown fences.

Output shape:
{
  "picks": [
    { "title": "...", "author": "...", "pages": 320, "genre": "...", "why": "..." },
    ...exactly 5 items
  ]
}`;

const buildUserMessage = (p: IntakePayload): string => {
  const lines: string[] = [];
  if (p.current) {
    lines.push(`Currently reading: "${p.current.title}" by ${p.current.author}${p.current.genre ? ` (${p.current.genre})` : ''}.`);
  }
  if (p.finished && p.finished.length) {
    lines.push('Finished books:');
    for (const b of p.finished.slice(0, 30)) {
      const r = b.rating ? ` — rated ${b.rating}/5` : '';
      const g = b.genre ? ` [${b.genre}]` : '';
      lines.push(`  - "${b.title}" by ${b.author}${g}${r}`);
    }
  }
  if (p.queued && p.queued.length) {
    lines.push('In queue (do not re-recommend):');
    for (const b of p.queued.slice(0, 20)) {
      lines.push(`  - "${b.title}" by ${b.author}`);
    }
  }
  if (p.skipped && p.skipped.length) {
    lines.push('Already rejected (do not recommend):');
    for (const b of p.skipped.slice(0, 100)) {
      lines.push(`  - "${b.title}" by ${b.author}`);
    }
  }
  if (p.genres && p.genres.length) {
    lines.push(`Wants more of: ${p.genres.join(', ')}.`);
  }
  if (p.avoid && p.avoid.length) {
    lines.push(`Avoid books like: ${p.avoid.join(', ')}.`);
  }
  if (p.prompt && p.prompt.trim()) {
    lines.push(`Free prompt from the user: "${p.prompt.trim()}"`);
  }
  if (lines.length === 0) {
    lines.push('The user has no history yet. BookPick five well-regarded contemporary non-fiction and literary fiction titles that pair well with someone starting a reading habit.');
  }
  return lines.join('\n');
};

const parseBookPicks = (raw: string): BookPick[] => {
  // DeepSeek occasionally wraps in code fences despite instructions; strip them defensively.
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  const parsed = JSON.parse(cleaned);
  if (!parsed || !Array.isArray(parsed.picks)) {
    throw new Error('Model returned no picks array');
  }
  const picks: BookPick[] = [];
  for (const p of parsed.picks) {
    if (!p?.title || !p?.author || !p?.why || !p?.genre) continue;
    const pages = Number(p.pages);
    picks.push({
      title: String(p.title),
      author: String(p.author),
      pages: Number.isFinite(pages) && pages > 0 ? Math.round(pages) : 280,
      genre: String(p.genre),
      why: String(p.why),
    });
  }
  if (picks.length < 1) throw new Error('Model returned no usable picks');
  return picks.slice(0, 5);
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const cors = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors });
  }

  const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  let payload: IntakePayload;
  try {
    payload = (await req.json()) as IntakePayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const userMessage = buildUserMessage(payload);

  const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!deepseekRes.ok) {
    const text = await deepseekRes.text();
    return new Response(JSON.stringify({ error: 'DeepSeek call failed', status: deepseekRes.status, body: text.slice(0, 500) }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const json = (await deepseekRes.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    return new Response(JSON.stringify({ error: 'DeepSeek returned empty content' }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  let picks: BookPick[];
  try {
    picks = parseBookPicks(content);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to parse model output', detail: String(err), raw: content.slice(0, 800) }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ picks }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
});

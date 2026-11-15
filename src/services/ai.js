// AI access for the Diet Plan review.
// 1) Inside Claude (published artifact): uses the viewer's own Claude account, no API key needed.
// 2) On your own site: set window.AI_ENDPOINT (see index.html) to a small server that accepts { prompt }
//    and returns { json } or { text }. Keep any API key on that server, never in the browser.
export async function getAI() {
  try {
    if (window.claude && window.claude.use) {
      const sample = await window.claude.use('sample');
      if (sample) return { provider: 'Claude', json: (prompt) => sample.json(prompt, { modelTier: 'default' }) };
    }
  } catch (e) { /* fall through */ }
  const url = window.AI_ENDPOINT;
  if (url) {
    return {
      provider: 'AI',
      json: async (prompt) => {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
        if (!res.ok) throw new Error('AI service error');
        const data = await res.json();
        return data.json !== undefined ? data.json : JSON.parse(data.text);
      },
    };
  }
  return null;
}

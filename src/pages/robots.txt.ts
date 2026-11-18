import type { APIRoute } from 'astro';

// Paieškos ir AI robotams leidžiama skaityti visą viešą turinį.
// Atskirai išvardinti AI robotai – kad būtų aišku, jog jiems leidžiama
// (ChatGPT, Claude, Perplexity, Gemini, Copilot, Apple Intelligence).
const aiBots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',            // OpenAI / ChatGPT
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',      // Anthropic / Claude
  'PerplexityBot', 'Perplexity-User',                  // Perplexity
  'Google-Extended',                                   // Google Gemini
  'Bingbot',                                           // Bing / Microsoft Copilot
  'Applebot', 'Applebot-Extended',                     // Apple
  'DuckAssistBot', 'MistralAI-User', 'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const disallow = 'Disallow: /aciu/\nDisallow: /en/thank-you/\n';
  const blocks = ['User-agent: *', ...aiBots.map((b) => `User-agent: ${b}`)].join('\n');
  const body = `${blocks}\nAllow: /\n${disallow}\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

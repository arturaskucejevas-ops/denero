import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../i18n/llms';
export const GET: APIRoute = async ({ site }) =>
  new Response(await buildLlmsTxt(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

import type { APIRoute } from 'astro';
import { buildLlmsFull } from '../i18n/llms';
export const GET: APIRoute = async ({ site }) =>
  new Response(await buildLlmsFull(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

import { getCollection, getEntry } from 'astro:content';
import type { Lang } from './ui';

/** Įrašo id formatas: "lt/slug" */
export const slugOf = (id: string) => id.split('/').slice(1).join('/');

export async function getOfferings(kind: 'services' | 'solutions', lang: Lang) {
  const all = await getCollection(kind, (e) => e.id.startsWith(`${lang}/`) && !e.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPage(lang: Lang, name: 'about' | 'privacy') {
  const entry = await getEntry('pages', `${lang}/${name}`);
  if (!entry) throw new Error(`Missing page ${lang}/${name}`);
  return entry;
}

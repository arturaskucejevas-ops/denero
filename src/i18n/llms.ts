import settings from '../data/settings.json';
import home from '../data/home.json';
import { routes, detailPath, type Lang } from './ui';
import { getOfferings, getPage, slugOf } from './content';

/** Turinys AI asistentams pagal llms.txt standartą (https://llmstxt.org) */
const abs = (p: string, site: URL) => new URL(p, site).href;

function contacts(lang: Lang) {
  const lt = lang === 'lt';
  return [
    `- ${lt ? 'El. paštas' : 'Email'}: ${settings.email}`,
    `- ${lt ? 'Telefonas' : 'Phone'}: ${settings.phone}`,
    `- ${lt ? 'Adresas' : 'Address'}: ${settings.address}`,
    `- ${lt ? 'Įmonės kodas' : 'Company code'}: ${settings.company_code}`,
  ].join('\n');
}

export async function buildLlmsTxt(site: URL) {
  const out: string[] = [];
  out.push(`# ${settings.company_name}`, '');
  out.push(`> ${settings.seo.lt.default_description}`, '');
  out.push(`> ${settings.seo.en.default_description}`, '');
  out.push(`${home.en.hero_text} Based in Lithuania, serving clients in Lithuanian and English.`, '');
  out.push('## Kontaktai / Contact', '', contacts('lt'), `- Web: ${site.href}`, '');
  for (const lang of ['lt', 'en'] as Lang[]) {
    out.push(lang === 'lt' ? '## Paslaugos (LT)' : '## Services (EN)', '');
    for (const s of await getOfferings('services', lang)) {
      out.push(`- [${s.data.title}](${abs(detailPath('services', lang, slugOf(s.id)), site)}): ${s.data.summary.replace(/\s+/g, ' ')}`);
    }
    out.push('');
  }
  out.push('## Puslapiai / Pages', '');
  out.push(`- [Apie mus](${abs(routes.about.lt, site)})`, `- [About us](${abs(routes.about.en, site)})`);
  out.push(`- [Kontaktai](${abs(routes.contact.lt, site)})`, `- [Contact](${abs(routes.contact.en, site)})`);
  out.push(`- [Visas turinys / Full content](${abs('/llms-full.txt', site)})`, '');
  out.push('## Optional', '');
  for (const s of await getOfferings('solutions', 'lt')) {
    out.push(`- [${s.data.title}](${abs(detailPath('solutions', 'lt', slugOf(s.id)), site)}): ${s.data.summary}`);
  }
  return out.join('\n') + '\n';
}

export async function buildLlmsFull(site: URL) {
  const out: string[] = [`# ${settings.company_name} – visas turinys / full content`, ''];
  for (const lang of ['lt', 'en'] as Lang[]) {
    const lt = lang === 'lt';
    const about = await getPage(lang, 'about');
    out.push(`# ${lt ? 'Lietuvių kalba' : 'English'}`, '');
    out.push(`## ${about.data.title}`, `URL: ${abs(routes.about[lang], site)}`, '');
    if (about.data.lead) out.push(about.data.lead, '');
    out.push((about.body ?? '').trim(), '');
    out.push(`## ${lt ? 'Kontaktai' : 'Contact'}`, '', contacts(lang), '');
    for (const s of await getOfferings('services', lang)) {
      out.push(`## ${s.data.title}`, `URL: ${abs(detailPath('services', lang, slugOf(s.id)), site)}`, '');
      out.push(s.data.summary.replace(/\s+/g, ' '), '', (s.body ?? '').trim(), '');
      if (s.data.faq.length) {
        out.push(`### ${lt ? 'Dažniausiai užduodami klausimai' : 'FAQ'}`, '');
        for (const f of s.data.faq) out.push(`**${f.question}**`, '', f.answer.replace(/\s+/g, ' '), '');
      }
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

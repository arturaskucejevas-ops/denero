import settings from '../data/settings.json';
import ap from '../data/apskaita.json';
import testimonials from '../data/testimonials.json';
import { routes, detailPath, type Lang } from './ui';
import { getOfferings, getPage, slugOf } from './content';

/** Turinys AI asistentams pagal llms.txt standartą (https://llmstxt.org) */
const abs = (p: string, site: URL) => new URL(p, site).href;

function contacts(lang: Lang) {
  const lt = lang === 'lt';
  return [
    `- ${lt ? 'Įmonė' : 'Company'}: ${settings.company_name}`,
    `- ${lt ? 'El. paštas' : 'Email'}: ${settings.email}`,
    ...(settings.phone ? [`- ${lt ? 'Telefonas' : 'Phone'}: ${settings.phone}`] : []),
    `- ${lt ? 'Adresas' : 'Address'}: ${settings.address}`,
    `- ${lt ? 'Įmonės kodas' : 'Company code'}: ${settings.company_code}`,
  ].join('\n');
}

export async function buildLlmsTxt(site: URL) {
  const out: string[] = [];
  out.push(`# ${settings.short_name}`, "");
  out.push(`> ${settings.seo.lt.default_description}`, '');
  out.push(`> ${settings.seo.en.default_description}`, '');
  out.push(`DENERO Apskaita: ${ap.en.text} Login: ${ap.login_url}. Plans and pricing: ${abs('/#planai', site)}.`, '', 'Based in Lithuania, serving clients in Lithuanian and English.', '');
  out.push('## Kontaktai / Contact', '', contacts('lt'), `- Web: ${site.href}`, '');
  for (const lang of ['lt', 'en'] as Lang[]) {
    out.push(lang === 'lt' ? '## Paslaugos (LT)' : '## Services (EN)', '');
    for (const s of await getOfferings('services', lang)) {
      out.push(`- [${s.data.title}](${abs(detailPath('services', lang, slugOf(s.id)), site)}): ${s.data.summary.replace(/\s+/g, ' ')}`);
    }
    out.push('');
  }
  for (const lang of ['lt', 'en'] as Lang[]) {
    out.push(lang === 'lt' ? '## Sprendimai / produktai (LT)' : '## Solutions / products (EN)', '');
    for (const s of await getOfferings('solutions', lang)) {
      const extra = [s.data.price, s.data.coming_soon ? (lang === 'lt' ? 'informacija ruošiama' : 'information coming soon') : '']
        .filter(Boolean).join('; ');
      out.push(`- [${s.data.title}](${abs(detailPath('solutions', lang, slugOf(s.id)), site)}): ${(s.data.card_summary || s.data.summary).replace(/\s+/g, ' ')}${extra ? ` (${extra})` : ''}`);
    }
    out.push('');
  }
  out.push('## Puslapiai / Pages', '');
  out.push(`- [Apie mus](${abs(routes.about.lt, site)})`, `- [About us](${abs(routes.about.en, site)})`);
  out.push(`- [Kontaktai](${abs(routes.contact.lt, site)})`, `- [Contact](${abs(routes.contact.en, site)})`);
  out.push(`- [Visas turinys / Full content](${abs('/llms-full.txt', site)})`, '');
  return out.join('\n') + '\n';
}

export async function buildLlmsFull(site: URL) {
  const out: string[] = [`# ${settings.short_name} – visas turinys / full content`, ''];
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
    for (const s of await getOfferings('solutions', lang)) {
      const x = s.data;
      out.push(`## ${x.headline || x.title}`, `URL: ${abs(detailPath('solutions', lang, slugOf(s.id)), site)}`, '');
      if (x.price) out.push(`${lt ? 'Kaina' : 'Price'}: ${x.price}${x.price_note ? ` (${x.price_note})` : ''}`, '');
      if (x.coming_soon) { out.push(lt ? 'Informacija ruošiama. Užklausas priimame el. paštu ' + settings.email + '.' : 'Information coming soon. Enquiries: ' + settings.email + '.', ''); continue; }
      out.push(x.summary.replace(/\s+/g, ' '), '', (s.body ?? '').trim(), '');
      if (x.highlights.length) { out.push(`### ${x.highlights_title}`, ''); for (const h of x.highlights) out.push(`- **${h.title}** – ${h.text}`); out.push(''); }
      if (x.reports.length) { out.push(`### ${x.reports_title}`, ''); x.reports.forEach((r, i) => out.push(`${i + 1}. ${r}`)); out.push(''); }
      if (x.steps.length) { out.push(`### ${x.steps_title}`, ''); x.steps.forEach((st, i) => out.push(`${i + 1}. **${st.title}** ${st.text}`)); out.push(''); }
      if (x.faq.length) {
        out.push(`### ${lt ? 'Dažniausiai užduodami klausimai' : 'FAQ'}`, '');
        for (const f of x.faq) out.push(`**${f.question}**`, '', f.answer.replace(/\s+/g, ' '), '');
      }
    }
  }
  out.push('# Klientų atsiliepimai / Client testimonials', '');
  for (const i of testimonials.items) {
    out.push(`> ${i.quote_lt}`, '', `— ${i.role_lt}, ${i.company}`, '');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

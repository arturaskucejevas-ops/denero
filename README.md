# Įmonės svetainė (LT / EN) su turinio valdymu

**Technologijos:** [Astro](https://astro.build) (statinė svetainė) + [Decap CMS](https://decapcms.org) (turinio valdymas per `/admin/`).

## Kodėl toks sprendimas (saugumas)
- **Statinė svetainė** – serveryje nėra duomenų bazės, PHP ar administravimo sąsajos, kurią būtų galima nulaužti (nėra SQL injekcijų, įskiepių spragų ir pan.).
- **Administravimas per GitHub prisijungimą** – redaguoti gali tik saugyklos nariai; rekomenduojama privaloma 2FA.
- **Redakcinis procesas** – pakeitimai pirmiausia tampa juodraščiu, publikuojami tik patvirtinus. Visa pakeitimų istorija saugoma Git (galima bet kada atstatyti).
- **Griežta CSP** (Content-Security-Policy) – leidžiami tik pačios svetainės skriptai/stiliai, jokių inline skriptų, jokių trečiųjų šalių CDN (net šriftai ir CMS talpinami pačioje svetainėje).
- **Saugumo antraštės** (`public/_headers`): HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.
- **Kontaktų forma** – Netlify Forms su „honeypot“ apsauga nuo šlamšto, BDAR sutikimas, laukų ilgio apribojimai.
- Jokių sekimo slapukų → nereikia slapukų juostos.
- `/.well-known/security.txt`, `/admin/` uždarytas paieškos sistemoms.

## SEO
- Lokalizuoti URL: `/paslaugos/…` (LT, pagrindinė kalba) ir `/en/services/…` (EN).
- `hreflang` nuorodos tarp kalbų, `canonical`, Open Graph, `sitemap-index.xml`, `robots.txt`.
- Struktūrizuoti duomenys (JSON-LD): Organization, Service, BreadcrumbList, ItemList.
- Kiekvienam puslapiui CMS'e galima nurodyti SEO pavadinimą ir aprašymą; raktiniai žodžiai – **Nustatymai → Įmonės duomenys ir SEO**.
- Labai greitas įkėlimas (be JS karkaso) – teigiamai vertinama Google (Core Web Vitals).

## Struktūra
```
src/content/services/{lt,en}/*.md   – Paslaugos
src/content/solutions/{lt,en}/*.md  – Sprendimai
src/content/pages/{lt,en}/*.md      – Apie mus, Privatumo politika
src/data/settings.json              – Įmonės kontaktai, rekvizitai, SEO
src/data/home.json                  – Pradinio puslapio tekstai (LT/EN)
src/i18n/ui.ts                      – Sąsajos tekstai ir URL maršrutai
public/admin/config.yml             – CMS konfigūracija
public/_headers                     – Saugumo antraštės
```

## Paleidimas lokaliai
```bash
npm install
npm run dev          # svetainė: http://localhost:4321
npm run cms          # kitame terminale – leidžia redaguoti per http://localhost:4321/admin/ be prisijungimo
```

## Publikavimas (Netlify – rekomenduojama)
1. Įkelkite projektą į **privačią** GitHub saugyklą.
2. `public/admin/config.yml` → `repo: OWNER/REPO` pakeiskite į savo saugyklą.
3. `astro.config.mjs` → `SITE` ir `config.yml` → `site_url` pakeiskite į tikrąjį domeną; atnaujinkite `security.txt`.
4. Netlify: *Add new site → Import from Git* (build nustatymai paimami iš `netlify.toml`).
5. GitHub: *Settings → Developer settings → OAuth Apps → New* (callback: `https://api.netlify.com/auth/done`), tada Netlify: *Site configuration → Access & security → OAuth → GitHub* įveskite Client ID/Secret.
6. Netlify *Forms* → įjunkite el. pašto pranešimus apie naujas užklausas.
7. Prijunkite domeną, įjunkite HTTPS; pateikite `sitemap-index.xml` Google Search Console.

Galima talpinti ir Cloudflare Pages (antraštės veiks), tačiau kontaktų formai tada reikės kito apdorojimo (pvz. Cloudflare Worker / Turnstile).

## Prieš paleidžiant
- [ ] Įmonės pavadinimas, logotipas, kontaktai, rekvizitai (CMS → Nustatymai)
- [ ] Tikrasis paslaugų / sprendimų turinys LT ir EN
- [ ] Raktiniai žodžiai ir SEO aprašymai
- [ ] Privatumo politiką peržiūri teisininkas
- [ ] `og-image.png` (1200×630) su įmonės ženklu
- [ ] GitHub: 2FA visiems redaktoriams, `main` šakos apsauga

## Priežiūra
`npm audit --omit=dev` – produkcinės priklausomybės be žinomų pažeidžiamumų. `decap-cms` naudojamas tik administravimo sąsajoje (prieinama tik prisijungusiems redaktoriams); atnaujinkite reguliariai (`npm update`).

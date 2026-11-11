# Denero svetainė (LT / EN)

Statinė svetainė, sukurta su [Astro](https://astro.build). Talpinama Netlify: https://denero-web.netlify.app

## Saugumas
Svetainėje **nėra jokios serverio programos, duomenų bazės ar administravimo sąsajos** – tik iš anksto sugeneruoti HTML, CSS ir paveikslėlių failai. Todėl nėra ką „nulaužti“: nėra slaptažodžių, prisijungimo formų, SQL ar įskiepių.

Papildomos apsaugos priemonės:

| Priemonė | Ką apsaugo |
|---|---|
| HTTPS + HSTS (preload) | Ryšys visada šifruojamas, negalima perimti ar pakeisti turinio |
| Griežta CSP (Content-Security-Policy) | Vykdomi tik pačios svetainės skriptai; XSS, svetimų skriptų ar reklamų įterpimas neįmanomas |
| Trusted Types | Papildoma apsauga nuo DOM XSS |
| X-Frame-Options / frame-ancestors | Svetainės negalima įterpti į svetimą puslapį (clickjacking) |
| COOP / COEP / CORP | Izoliacija nuo kitų svetainių (Spectre tipo atakos, resursų vagystė) |
| Permissions-Policy | Išjungta kamera, mikrofonas, vieta, mokėjimai ir kt. naršyklės funkcijos |
| nosniff, Referrer-Policy | Failų tipo klastojimas, informacijos nutekėjimas per nuorodas |
| Visi resursai talpinami pačioje svetainėje | Jokių trečiųjų šalių CDN, šriftų ar sekimo skriptų |
| Kontaktų forma (Netlify Forms) | Šlamšto filtras + „honeypot“, laukų ilgio apribojimai, BDAR sutikimas |
| Be slapukų | Nereikia slapukų juostos, nerenkami asmens duomenys |
| Dependabot | GitHub automatiškai praneša apie pažeidžiamas priklausomybes |
| `/.well-known/security.txt` | Kontaktas saugumo spragoms pranešti |

Antraštės aprašytos `public/_headers`. Patikrinti galima: https://securityheaders.com ir https://observatory.mozilla.org

## Tekstų keitimas
Tekstai saugomi failuose:
```
src/content/services/{lt,en}/*.md   – Paslaugos
src/content/solutions/{lt,en}/*.md  – Sprendimai
src/content/pages/{lt,en}/*.md      – Apie mus, Privatumo politika
src/data/settings.json              – Kontaktai, rekvizitai, SEO
src/data/home.json                  – Pradinio puslapio tekstai
src/i18n/ui.ts                      – Meniu, mygtukai, formos tekstai
```
Mažą pataisymą galima atlikti tiesiai GitHub: atidarykite failą → ✏️ → pakeiskite → **Commit changes**. Po 1–2 min. Netlify atnaujins svetainę.

## Paleidimas lokaliai
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # sugeneruoja dist/
npm audit        # priklausomybių saugumo patikra
```

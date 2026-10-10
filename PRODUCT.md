# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the Meldina FC squad and its circle of friends and followers. They come back to check the next fixture and the table, read match news, look up players, and enjoy the club's lore and inside jokes. Wider Pro Clubs audiences are not the target; insider references do not need explaining.

Secondary: the club board (diretoria), who log into the admin panel to manage news, fixtures, squad, club info and sócios.

## Product Purpose

Official site of Meldina Futebol Clube, an EA FC Pro Clubs team (league: Pro Clubs, Série A; season 2026; founded 2024; stadium Lovebomb Arena). It gives the club the presence of a real professional club: news, fixtures and standings, squad profiles, club history, membership program (Clube Meldina), shop, and Meldina TV. Success means the squad and friends treat it as the club's home and keep returning for each match cycle.

## Positioning

A small Pro Clubs team presented with the full institutional weight of a real pro club. The players, their personalities, quotes and match stories are real; the format is that of a top-flight club site.

## Operating Context

- Content is in Brazilian Portuguese (`pt-BR`).
- Content follows the match cycle: fixtures, results, standings, post-match news.
- Social channels: Instagram @meldinafc (live feed via `api/instagram.js`), YouTube @MeldinaTV, Twitch live channel.
- Board members edit content through the admin panel (`frontend/src/pages/admin/`).

## Capabilities and Constraints

- Main product: React + Vite + TypeScript + Tailwind SPA in `frontend/`, with a Node/TypeScript Express API (Controller → Service → Repository, Zod, Prisma/PostgreSQL) in `backend/`.
- The static site in `Meldina site/` is a backup and must stay in parity with the React site.
- Hosting must cost R$ 0/month (Vercel frontend, Render backend, free-tier Postgres).
- Sections: Home, Clube, Elenco, Jogos (fixtures and table), Notícias and news detail, Loja, Sócio (Clube Meldina), TV, plus admin.
- Static-site newsletter, sócio sign-up, tickets and shop checkout are demonstrations only: they validate and show success but send or store nothing.

### The No-Money Rule (non-negotiable)

The site must never lead anyone to spend money. This overrides every other product or design goal.

- **Shop (Loja):** purely aesthetic, played for the joke. Products, prices and the cart must look like a real club store, and "add to cart" may work. Nothing is ever sold. No checkout may complete a purchase.
- **No payment data, ever:** no field, step, modal or integration may ask for a credit or debit card, Pix key or QR code, boleto, bank details, or any other payment method. No payment provider (Stripe, Mercado Pago, PagSeguro, Pix APIs or similar) may be added.
- **Tickets, sócio plans and any other priced item** follow the same rule: prices are part of the look, never a real charge.
- **Sócio-torcedor sign-up:** may collect a name and email, and these may be stored in the database. Nothing is done with them: no marketing emails, newsletters, notifications, sharing, export or any other contact or use. Collect only what the sign-up form needs.
- **Where a flow would normally end in payment**, it ends in an in-character confirmation instead (for example, an order or membership "registered" message). It never redirects to a payment step.

## Brand Commitments

- Name: Meldina Futebol Clube / Meldina FC. Membership program: Clube Meldina. Video channel: Meldina TV.
- Motto: "Muito além do jogo". Slogans: "Vamo Meldina", "Meldina pra sempre".
- Voice: play it straight. The site always speaks as a real professional club and never winks that it is a video-game team.
- Clube Meldina has an official logo (white, color and black SVGs in `assets/img/clube-meldina/`; source files in `Meldina reference/Clube Meldina/`).
- Existing assets: crest (`escudo.png`, `escudo-mono.png`), monogram (`monograma.png`, `monograma-outline.png`), Meldina TV marks (`mtv*.png`), nuFUT partner logo, uniform shirt photos, in `Meldina site/assets/img/`.

## Evidence on Hand

- Real squad with numbers, positions, stats and bios; real coach (Celso Roth) and president (André Almeida); real player quotes. Source: `Meldina site/assets/js/data.js`, `frontend/src/data/staticData.ts`, `backend/prisma/seed.ts`.
- Player photos in `Meldina site/assets/players/`; news images in `Meldina site/assets/news/`; shirt and product photos in `Meldina site/assets/img/`.
- No real testimonials, sponsors beyond nuFUT, attendance figures or sales data. Do not fabricate them.

## Product Principles

1. Institutional weight, real people: present like a top-flight club, but the substance is this squad's actual stories.
2. Insiders first: lore, nicknames and inside jokes are content, not noise.
3. Match cycle drives the page: the next game, last result and table are always close at hand.
4. Never break the fiction: no copy that frames the club as a game or a joke.
5. Free to run: no feature may require paid infrastructure.
6. Nobody pays, ever: the shop and sócio program look fully professional, but no one is ever charged, asked for payment details, or contacted using the email they gave (see The No-Money Rule).

# Meldina FC — site oficial

Official site for fictional association football club Meldina Futebol Clube.

## Opening the site

- **No feed:** open `index.html` directly. The Instagram section shows the posts listed in `INSTAGRAM_POSTS` (official embeds) or a card linking to @meldinafc.
- **With the live feed:** `IG_ACCESS_TOKEN=your_token npm start` and go to http://localhost:3000

All site content (squad, fixtures, table, news, videos, shop) lives in `assets/js/data.js`.

## Live Instagram feed (@meldinafc)

Instagram does not allow reading a profile's posts straight from the browser. The small function in `api/instagram.js` fetches them through the **official Instagram API** and caches them for 10 minutes. A new post appears on the site within 10 minutes. No static images are shown. If the API is not configured, the site uses, in order: the official embeds of the links in `INSTAGRAM_POSTS` (`assets/js/data.js`, no back-end, updated by hand) → a card linking to the profile.

### 1. Get a token (one time)
1. The @meldinafc account must be a **Business** or **Creator** account (Instagram → Settings → Account type).
2. At https://developers.facebook.com create an app of type **Business** and add the **Instagram** product → "API setup with Instagram login".
3. Under "Generate access tokens", add @meldinafc, sign in and copy the **token** (long-lived, 60 days).
   The function renews it automatically once a day while the site is getting traffic. If the site goes more than 60 days without visits, generate a new one.

### 2. Publish (Vercel)
```bash
vercel
vercel env add IG_ACCESS_TOKEN
vercel --prod
```
Vercel serves the static files and turns `api/instagram.js` into the `/api/instagram` endpoint.
On any other Node host (Render, Railway, VPS), run `npm start` with the `IG_ACCESS_TOKEN` variable set.

> The token lives only on the server. It is never sent to the browser.

## Forms
Newsletter, Sócio sign-up, tickets and shop checkout are **demonstrations only**: they validate the fields and show a success message, but nothing is sent or stored.

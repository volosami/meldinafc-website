---
name: Meldina FC
description: Official site of Meldina Futebol Clube. Muito além do jogo.
colors:
  grena: "#8f0010"
  grena-2: "#b0101f"
  grena-deep: "#5a000a"
  ouro: "#efaa19"
  ouro-2: "#ffc94a"
  marinho: "#001065"
  marinho-2: "#0a1f8f"
  noite: "#040720"
  noite-2: "#0a0f33"
  noite-3: "#121a4a"
  creme: "#f4efe2"
  creme-2: "#e9e1cc"
  tinta: "#0b0d1c"
  cinza: "#6b6f86"
  vitoria: "#1a7a43"
  ouro-clube: "#fecc00"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Anton, Oswald, Impact, sans-serif"
    fontSize: "clamp(3.4rem, 8vw, 7.4rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Anton, Oswald, Impact, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 0.92
  title:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "1.42rem"
    fontWeight: 400
    lineHeight: 1.18
  body:
    fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Cinzel, Trajan Pro, serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.28em"
  button:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  tag: "2px"
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(64px, 9vw, 120px)"
  section-tight: "clamp(48px, 6vw, 80px)"
  grid-gap: "24px"
  wrap: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.ouro}"
    textColor: "{colors.noite}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.ouro-2}"
    textColor: "{colors.noite}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-ghost-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.noite}"
  button-grena:
    backgroundColor: "{colors.grena}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-grena-hover:
    backgroundColor: "{colors.grena-2}"
  button-sm:
    padding: "10px 16px"
  tab-pill:
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  tab-pill-active:
    backgroundColor: "{colors.ouro}"
    textColor: "{colors.noite}"
  news-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "22px 24px 26px"
  news-tag:
    backgroundColor: "{colors.grena}"
    textColor: "{colors.white}"
    rounded: "{rounded.tag}"
  player-card:
    backgroundColor: "{colors.grena-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
  field-input:
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
  form-card:
    backgroundColor: "{colors.noite-2}"
    rounded: "{rounded.md}"
    padding: "clamp(24px, 4vw, 44px)"
  modal:
    backgroundColor: "{colors.noite-2}"
    rounded: "{rounded.md}"
  result-tag-win:
    backgroundColor: "{colors.vitoria}"
    textColor: "{colors.white}"
    rounded: "{rounded.tag}"
---

# Design System: Meldina FC

Source of truth: `frontend/src/index.css` (`:root` custom properties and component classes) and `frontend/tailwind.config.js`, which mirrors the same tokens as Tailwind utilities. The static backup site (`Meldina site/assets/css/style.css`) must stay in visual parity.

## Overview

**Creative North Star: "The Matchday Crest"**

Meldina presents itself the way a top-flight club presents its crest: with ceremony, but without clutter. The night field (deep navy, almost black) is the stage. Grená and gold are the club's colours and appear the way they would on a crest or a kit: in bands, edges, numbers and seals, never as wallpaper. Cinzel small caps carry the heraldic voice; condensed Anton carries the matchday shout. The two meet in every section heading: a gold Cinzel eyebrow with a short rule, then a huge uppercase Anton line.

The mood is sleek, modern and premium. It is a polished big-club site, so restraint wins over noise: dark bands alternate with a cream "paper" band for reading, photography of the actual players does the emotional work, and ornament is limited to things a club really owns (crest, monogram watermark, shirt numbers, the tricolour progress line under the header).

**Key Characteristics:**
- Dark-first: Noite is the default page; cream bands are the exception, used for reading-heavy sections like news.
- Players are the imagery: real photos with giant outlined shirt numbers behind them.
- Two-voice type: Cinzel for ceremony (eyebrows, labels), Anton for impact (headlines, scores, names, numbers).
- Sharp, near-square geometry (4px) with uppercase, tracked labels.
- Flat at rest; depth appears only as a response to hover.

## Colors

A three-colour club identity (grená, ouro, marinho) set on a night-navy field, with cream for paper.

### Primary
- **Grená Meldina** (`grena`): the club colour. Section bands, news category tags, the grená button, topbar background in its deep form, and player-card washes. Brighter **Grená Vivo** (`grena-2`) is its hover state and the loss marker; **Grená Profundo** (`grena-deep`) is the topbar, the home-kit band and the bottom of photo gradients.

### Secondary
- **Ouro da Coroa** (`ouro`): the accent and the only primary-action colour. Primary buttons, eyebrows, links with arrows, active tabs, the focus ring, `::selection`, the ticker band, countdown digits and highlighted table rows. **Ouro Claro** (`ouro-2`) is its hover state.

### Tertiary
- **Marinho Profundo** (`marinho`): the third crest colour. Goalkeeper cards, "clube" news tags, the marinho section band and the dark-button hover. **Marinho Vivo** (`marinho-2`) closes the tricolour progress line.

### Neutral
- **Noite de Jogo** (`noite`): the page background and the text colour on gold.
- **Noite 2 / Noite 3** (`noite-2`, `noite-3`): raised dark surfaces: matchbar, form cards, modals.
- **Creme** (`creme`, `creme-2`): the paper band for reading sections, cart drawer, product image wells.
- **Tinta** (`tinta`): text on cream and white, and the dark button.
- **Cinza** (`cinza`): metadata on light surfaces and the draw marker.
- **White** at reduced opacity is the text ramp on dark: 0.85 for links, 0.78 for lede copy, 0.6 for metadata, 0.55 for labels. Hairlines are `rgba(255,255,255,0.1)` on dark and `rgba(11,13,28,0.12)` on light.
- **Vitória** (`vitoria`): the win marker only (result tags and form dots). It is a status colour, not a brand colour.
- **Ouro Clube** (`ouro-clube`): the gold of the Clube Meldina mark and its tricolour stripe. Used only inside Clube Meldina branding, never as a site accent (that stays Ouro da Coroa).

### Named Rules
**The Crest Colours Rule.** Grená, ouro and marinho are used like crest and kit elements: bands, tags, rules, numbers and seals. Never as large decorative gradients or as body text colour on dark.

**The Single Gold Rule.** Ouro is the only colour for the primary action on any band. A section has one gold call to action; supporting actions are ghost or text links.

**The Tricolour Order Rule.** When the three club colours appear together, they run grená, ouro, marinho, in that order (as in the header progress line).

## Typography

**Display Font:** Anton (with Oswald, Impact). The stack is led by "Extenda 20 Max", which is not loaded, so Anton is what renders.
**Label Font:** Cinzel (with Trajan Pro)
**Editorial Font:** DM Serif Display (with Georgia)
**Body Font:** Poppins (with system-ui)

**Character:** Anton is the terrace shout, tall and condensed. Cinzel is the engraved crest lettering. DM Serif gives news headlines a printed, editorial calm, and Poppins keeps everything else plain and legible.

### Hierarchy
- **Display** (Anton 400, `clamp(3.4rem, 8vw, 7.4rem)`, line-height 0.96, uppercase): hero headlines. A key word may switch to ouro.
- **Headline** (Anton 400, `clamp(2.6rem, 6vw, 4.8rem)`, line-height 0.92, uppercase): section headings, set right after an eyebrow. Page heroes go larger, up to `9rem`.
- **Numerals** (Anton 400): scores (3.2rem), kick-off times (2.6rem), points, player names on cards (2.2rem) and the outlined shirt numbers (up to 24rem in the hero).
- **Title** (DM Serif Display 400, 1.42rem, line-height 1.18): news-card headlines, up to 3rem on the feature card.
- **Body** (Poppins 400, 16px, line-height 1.6): running text; lede copy at 1.08rem, max width about 520px.
- **Label** (Cinzel 700, 0.78rem, tracking 0.28em, uppercase, ouro): eyebrows, preceded by a 28px × 2px rule.
- **Micro labels** (Poppins 600–700, 0.66–0.8rem, tracking 0.1–0.18em, uppercase): buttons, nav, tags, metadata, table headers.

### Named Rules
**The Eyebrow-Then-Shout Rule.** Section headings pair a gold Cinzel eyebrow (with its short rule) and an Anton headline. Never use Cinzel for the headline, and never use Anton for an eyebrow.

**The Uppercase Is Short Rule.** Uppercase with tracking is for labels, buttons, names and headlines only. Running text is sentence case.

## Layout

- **Container:** centred, max width 1320px, side gutter `clamp(16px, 4vw, 40px)`.
- **Sections:** full-bleed colour bands with vertical padding `clamp(64px, 9vw, 120px)` (tight variant `clamp(48px, 6vw, 80px)`). Bands alternate between Noite and the cream, grená and marinho variants to pace the page.
- **Section head:** eyebrow and headline at left, a gold "ver todos" arrow link at right, aligned to the baseline, wrapping on narrow screens.
- **Grids:** the news grid is 12 columns with a 24px gap. The feature card spans 8 columns × 2 rows, regular cards span 4, and below 640px every card spans the full row. Products use `auto-fill, minmax(240px, 1fr)`. The matchbar is a 1.5fr / 1fr / 1fr strip separated by hairlines.
- **Header:** sticky at 84px with a 38px grená-deep topbar above it. Below 1120px the nav moves to an off-canvas panel behind a burger.
- **Breakpoints in use:** 1280, 1120, 1000, 900, 800, 640, 560 and 480px (max-width queries).

## Elevation & Depth

Surfaces are flat at rest. Depth comes from tone (Noite → Noite 2 → Noite 3), hairline borders, and gradients over photography that fade images into the night or into grená. Shadows exist only as a response to hover, plus one fixed exception: the sticky header, which uses a translucent night background with a 14px backdrop blur.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 24px 50px -24px rgba(11,13,28,0.45)`): news-card hover, together with `translateY(-6px)`.
- **Product lift** (`box-shadow: 0 20px 40px -24px rgba(0,0,0,0.5)`): product-card hover, together with `translateY(-4px)`.
- **Crest drop** (`filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4))`): the crest in the header, so it reads as an object.

### Named Rules
**The Flat-By-Default Rule.** No resting shadows on cards, buttons or panels. A shadow appears only together with a hover lift.

## Shapes

The geometry is sharp and decisive. The base radius is 4px for buttons, cards, kit panels, video thumbs and inputs. Containers that hold content groups (form cards, modals, plan cards, table wrappers) use 6px. Tags and result chips are almost square at 2px. Full pills (999px) appear only on filter tabs, the live indicator and circular controls (cart, modal close, play button). Hairline borders (1px, 10% white on dark) separate cells instead of boxes. The recurring signature shape is the outlined Anton shirt number: transparent fill with a 1.5px gold stroke at 35% opacity, which turns brighter on hover.

## Components

### Buttons
Sharp and decisive: near-square, uppercase and tracked, with a small lift.
- **Shape:** 4px corners, with a 2px border in the fill colour.
- **Primary (ouro):** ouro fill with noite text, 14px × 26px padding, Poppins 700 at 0.82rem with 0.14em tracking.
- **Hover / Focus:** lifts 2px and lightens to Ouro Claro over 0.25s using the club ease `cubic-bezier(0.2, 0.7, 0.1, 1)`. Focus is a 2px ouro outline with a 3px offset.
- **Ghost:** transparent with a 40% white border; on hover it fills white with noite text.
- **Grená / Dark:** grená (hover Grená Vivo) and tinta (hover marinho) variants for coloured or light bands.
- **Small:** 10px × 16px padding at 0.72rem.
- **Arrow link:** ouro uppercase text with an arrow that slides 5px right on hover. On cream bands it turns grená.

### Chips and Tags
- **News tag:** grená fill, white uppercase 0.66rem text, 2px corners. TV tags are ouro with noite text; club tags are marinho.
- **Result tag / form dots:** Vitória green for a win, cinza for a draw, Grená Vivo for a loss.
- **Filter tabs:** pill outline in hairline white; active is filled ouro with noite text.

### Cards / Containers
- **News card:** white with tinta text on cream bands, 4px corners, a 16:10 image, a DM Serif title and uppercase metadata. The image zooms to 1.06 on hover while the card lifts. The **feature** variant is full-bleed photo with a night gradient and white text.
- **Player card:** 3:4 photo on a grená radial wash (marinho for goalkeepers) with a night gradient at the bottom, the outlined number behind, the Anton name and an ouro position label. On hover a 4px gold bar sweeps in along the bottom.
- **Kit card:** a tall photo panel whose body fades up from cream (away kit) or grená-deep (home kit).
- **Form card / Modal:** Noite 2 surface, a hairline border and 6px corners. The modal sits over a 6px-blurred, 80% night backdrop and rises 30px into place.

### Inputs / Fields
- **Style:** uppercase 0.72rem labels at 70% white over translucent white fields with hairline borders and 4px corners.
- **Focus:** the border turns ouro and the background brightens slightly. There is no glow.
- **Error:** the border turns `#ff5a6a`, with a 0.74rem message in `#ff8c97` below.

### Navigation
- **Topbar:** 38px, grená-deep background, 0.74rem text, ouro emphasis and social links at right.
- **Header:** sticky translucent night with backdrop blur; crest plus an Anton wordmark with the Cinzel motto under it. Nav links are uppercase Poppins 600 at 0.8rem; an ouro underline scales in on hover and on the active link. A tricolour 3px progress line along the bottom edge tracks scroll.
- **Mobile:** below 1120px a burger opens an off-canvas panel that slides in from the right.

### Matchbar (signature)
A Noite 2 strip directly under the hero, split into hairline-separated cells: next match (crests either side of an Anton kick-off time, with date, venue and a countdown in ouro digits), last result (a large Anton score with a result tag) and a mini table. It is the club's matchday instrument panel.

### Shop, Cart and Sign-up Flows
These follow The No-Money Rule in PRODUCT.md: they must look like a real club store and membership program, and must never take money.
- **Product cards, prices and the cart drawer:** fully styled and working as a real store would, including "add to cart" and the cart count badge.
- **Checkout:** ends in an in-character confirmation using the form-success pattern (ouro circle icon, Anton headline, short line of copy). There is no payment step, and no card, Pix, boleto or bank field.
- **Sócio sign-up:** name and email fields only, using the standard field style. The confirmation never promises emails, newsletters or messages.
- **Button labels:** "Adicionar ao carrinho" and "Finalizar pedido" are fine. Never use "Pagar", "Pagar com Pix", "Pagar com cartão" or show payment-method logos.

### Clube Meldina Mark
The membership program has its own official logo (`/assets/img/clube-meldina/`, cropped SVGs): "clube" over "MELDINA", with the crowned M and a grená, marinho and gold stripe running through the L.
- **Versions:** `cm-white.svg` on dark backgrounds (the default on this site), `cm-color.svg` on cream or white, `cm-black.svg` for print only.
- **Where it appears:** the Sócio page heading, the Clube Meldina hero slide, the sócio band on Home, the footer partners row and the sign-up confirmation. Running text still says "Clube Meldina" in words.
- **Accessibility:** when the mark replaces a heading, it sits inside the heading element with `alt="Clube Meldina"`. When it is decorative next to text that already names the program, `alt=""`.
- **Never** recolour, stretch, outline or add effects to the mark, and never rebuild it with live type.
- **Tricolour stripe:** the program's stripe runs grená, marinho, gold (44 / 10 / 46), used as the 12px band under the Sócio page hero. It belongs to Clube Meldina only; the club-wide tricolour order (grená, ouro, marinho) is unchanged.

### Standings Table
Hairline-ruled rows on night, uppercase micro headers, Anton points. Meldina's row is highlighted with an ouro gradient wash and a 3px ouro inset bar on the left.

## Do's and Don'ts

### Do:
- **Do** open every section with a gold Cinzel eyebrow followed by an uppercase Anton headline.
- **Do** keep ouro for the primary action and for highlights, with one gold call to action per band.
- **Do** use real player photography with the outlined shirt number behind the subject.
- **Do** use the 4px radius for interactive and card elements and 6px for content containers.
- **Do** pair every hover lift with its shadow, and use the club ease `cubic-bezier(0.2, 0.7, 0.1, 1)` for transitions.
- **Do** keep the ouro `:focus-visible` outline (2px, 3px offset) on every interactive element.
- **Do** keep the static backup site in visual parity with these tokens.

### Don't:
- **Don't** add resting shadows to cards, buttons or panels.
- **Don't** use grená, ouro or marinho as large decorative gradients or as running-text colour on dark.
- **Don't** set running text in uppercase or in Cinzel.
- **Don't** round buttons or cards beyond 6px; pills are only for filter tabs and circular controls.
- **Don't** introduce colours outside the club palette except the win/draw/loss status markers.
- **Don't** design any payment UI: no card, Pix, boleto or bank fields, no payment-method logos or badges, no "Pagar" buttons. Store and sócio flows end in an in-character confirmation (The No-Money Rule, PRODUCT.md).
- **Don't** add copy promising emails, newsletters or messages to people who sign up.
- **Don't** spell "Clube Meldina" as a styled headline where the official mark belongs; use `cm-white.svg` on dark and `cm-color.svg` on light.

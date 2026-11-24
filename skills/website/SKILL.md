---
name: website
description: >
  Build or remodel a website for a business or a person, from a short interview to a page that is live-ready
  and proven: premium and simple, mobile first, fast, accessible, found by Google and by AI answers (ChatGPT,
  Perplexity, Claude), and built to turn visitors into calls, emails or form leads. Plans the pages, writes the
  copy with the owner, makes or sources the images with whatever image tool is at hand, and checks the result
  with Lighthouse on phone and desktop, a WCAG 2.1 audit, W3C validation, HTTPS and screenshots at phone,
  tablet and desktop sizes. Use for "build my website", "remodel my site", "new landing page", "make my site
  look premium", "my site is slow / not on Google", "redo my home page", "SEO for my site", "show up in
  ChatGPT", or a site that should feel like an experience (cinematic scroll mode).
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion, WebFetch
---

# website

Build a website the owner is proud to show, and prove it works before anyone sees it.

**What you deliver:** a short brief, a page plan, the site itself (on the owner's stack or as plain HTML),
the images, and a check report with screenshots at three screen sizes and Lighthouse scores. Nothing is
"done" until the check passes.

The work runs in eight steps. Read the guide named in each step when you reach it, not before.

| Step | What | Guide |
|---|---|---|
| 1 | Brief: one interview, all questions at once | below |
| 2 | Plan the pages and the menu | [marketing/site-architecture](marketing/site-architecture/GUIDE.md) |
| 3 | Design and build, mobile first | below; cinematic mode: [cinematic/GUIDE.md](cinematic/GUIDE.md) |
| 4 | Images | [references/images.md](references/images.md) |
| 5 | Copy that converts | [marketing/page-cro](marketing/page-cro/GUIDE.md) |
| 6 | Found by Google and by AI answers | [marketing/seo-audit](marketing/seo-audit/GUIDE.md), [marketing/ai-seo](marketing/ai-seo/GUIDE.md), [marketing/schema-markup](marketing/schema-markup/GUIDE.md) |
| 7 | Check, fix, check again | [references/checks.md](references/checks.md), `scripts/check.mjs` |
| 8 | Hand over | below |

The marketing guides come from another collection and sometimes mention skills that are not here (for
example `product-marketing-context`). Use the brief from step 1 in their place.

## Step 1: The brief

Ask everything at once, in one message, so the owner answers once. Reuse anything they already gave you
(their current site, a flyer, a LinkedIn page). Read the current site first if there is one.

1. **Who is it for?** The two or three kinds of visitors, in their words.
2. **The one action.** What should a visitor do: call, email, book, buy, fill a form, visit the shop?
3. **What you offer**, in plain words, and what makes you different from the others nearby.
4. **Proof.** Years, numbers, customers you may name, reviews, awards, photos of real work.
5. **Look and feel.** Three to five words, colours or a logo, and up to three sites or brands they like.
6. **Photos.** What they have (team, place, products, work). Can images be generated? (Step 4.)
7. **Must not say.** Legal limits, names that must stay out, promises they can't make.
8. **Where it lives.** Domain, current hosting or platform, who can publish.

Write the answers to `BRIEF.md` in the project, marking what is the owner's word and what you assumed.
If the owner says "use your judgment", write the brief yourself and say so at the top.

## Step 2: Plan

One page per job. A small business usually needs: Home, one page per main service or product, About,
Contact, and, if they write, a Blog. Plain URLs (`/services/roof-repair`, not `/page?id=7`). The menu has
five items or fewer, and one button on the right for the one action. Write the plan into `BRIEF.md`.

## Step 3: Design and build

**Use what exists.** If the site has a stack (WordPress, Next.js, Webflow export, plain HTML), build on it.
With nothing to start from, build plain HTML and CSS with no build step: it is the fastest site and the
easiest to host.

**The design floor** (every page, every size):

- **Mobile first.** Lay it out for a 390 px phone, then widen for tablet (768) and desktop (1440).
  Nothing scrolls sideways.
- **Calm and premium.** Lots of space, one idea per section, consistent spacing, a type scale of four or
  five sizes, one accent colour for the main button and links.
- **Readable.** Body text 16 px or more (17–18 px is better), line length about 65 characters,
  contrast 4.5:1 or better.
- **Easy to tap.** Buttons and links at least 44 px tall on a phone.
- **The hero:** who it's for, what you do, the one action button, and a real photo. A second, lighter
  button is fine.
- **Proof near the top:** a band with years, numbers, customer names or reviews.
- **Motion is optional and gentle.** Respect `prefers-reduced-motion`. Never leave content hidden until a
  script reveals it: if the script fails, visitors and Google see a blank page.
- **Fast by default.** Images in WebP or AVIF, sized for the screen (`srcset`), with `width` and `height`;
  the hero image loads first (`fetchpriority="high"`), the rest lazily. Fonts self-hosted or with
  `display=swap`. No tracking or chat widgets that block the first load.

**Cinematic mode.** When the owner wants a site that feels like an experience (scrolling plays a scene,
layered heroes), follow [cinematic/GUIDE.md](cinematic/GUIDE.md). Tell them the trade-off first: video
and scroll scenes make it hard to keep Lighthouse 90+ on a phone. A common middle ground is a cinematic
home page and plain, fast inner pages.

## Step 4: Images

Real photos of the owner's people, place and work beat anything generated. To make images, use whatever
the owner or you already have; [references/images.md](references/images.md) lists the options in order
and how to keep a real person's face true to life.

## Step 5: Copy that converts

Follow [marketing/page-cro](marketing/page-cro/GUIDE.md). In short: write for the visitor, not about the
business; plain words; one main action per page, repeated at the end; proof beside every claim. If there is
a form, it has as few fields as possible, every field has a label, and you **send a real test entry and see
it arrive** (email or CRM) before calling it done. Mark the main buttons with `data-track="..."` so clicks
can be counted in the owner's analytics, if they have one.

## Step 6: Found by Google and by AI answers

Every page gets: a unique `<title>` (under 65 characters) and meta description (70–160), one `<h1>`,
headings in order, a canonical link, Open Graph title, description and image (1200×630), and `lang`.
The site gets `robots.txt`, `sitemap.xml`, and structured data in JSON-LD: `LocalBusiness` (or the right
subtype) with name, address, phone, hours and area for a local business; `Person` for a personal site;
`Organization`, `Service`, `Product`, `FAQPage` or `BlogPosting` where they fit
([schema-markup](marketing/schema-markup/GUIDE.md)). For AI answers, add `/llms.txt` (a plain summary of
who, what, where and the key pages), lead each page with a direct answer to the question it serves, and use
the owner's real facts and numbers ([ai-seo](marketing/ai-seo/GUIDE.md)). Run the
[seo-audit](marketing/seo-audit/GUIDE.md) checklist once the pages exist.

## Step 7: Check, fix, check again

Run the site locally (or use the live address) and run:

```bash
node <skill>/scripts/check.mjs http://localhost:3000 --pages home,about,contact --out website-check
```

It checks phone, tablet and desktop (screenshots, no sideways scroll, text size, tap targets), WCAG 2.1 AA
with axe, titles, descriptions and structured data, W3C HTML validation, Lighthouse on phone and desktop,
and, on an `https://` address, HTTPS and the http-to-https redirect. It writes `website-check/report.md`
and exits non-zero while anything fails. **Look at every screenshot yourself**; a passing check does not
prove the page looks right. Fix and run again until it passes. Details and how to read each failure:
[references/checks.md](references/checks.md).

After it goes live, run the check on the live `https://` address and open
[PageSpeed Insights](https://pagespeed.web.dev/) for the real-visitor numbers (Core Web Vitals), which only
exist for live sites.

## Step 8: Hand over

Give the owner: the address to look at, the phone and desktop screenshots, the Lighthouse table from the
report, and the short list of anything they still have to do (a photo to take, a review to ask for, a DNS
change). Publish only when they say so.

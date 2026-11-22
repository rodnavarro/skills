# The checks

`scripts/check.mjs` runs every check on the pages you name and writes `report.md` with screenshots and the
Lighthouse reports. The first run installs its tools (Playwright with Chromium, axe-core, Lighthouse) into
`~/.cache/website-check`. It needs Node 18 or newer.

```bash
node <skill>/scripts/check.mjs <url> [--pages home,about,contact] [--out website-check] [--no-w3c] [--no-lighthouse]
```

| Check | Passes when | Usual fix |
|---|---|---|
| Answers 200 | every page loads | wrong path, server error |
| No sideways scroll (390, 768, 1440) | the page is no wider than the screen | a fixed width, a long word or URL, an image without `max-width: 100%` |
| Readable text (phone) | body text 16 px+, nothing under 14 px | raise the base size |
| Tap targets (phone) | links and buttons 24 px+ (aim for 44 px) | padding on footer and menu links |
| Content is painted | nothing stuck at opacity 0 | a fade-in that waits for a script: show content by default |
| WCAG 2.1 AA (axe) | no violations | contrast, missing `alt`, unlabeled fields, empty links, skipped heading levels |
| Title, description | 10–65 and 70–160 characters | write them per page |
| One h1, lang, canonical, Open Graph image | all present | page metadata |
| Structured data | at least one JSON-LD block | step 6 of the skill |
| Images | every `img` has `alt`, `width` and `height` | add them; sizes stop the layout jumping |
| W3C HTML | no errors (sends the HTML to validator.w3.org) | unclosed tags, bad attribute values, duplicate ids |
| robots.txt, sitemap.xml | both answer | add them |
| HTTPS (live `https://` only) | http redirects to https | hosting or proxy setting |
| Lighthouse phone and desktop | Performance, Accessibility, Best Practices and SEO all 90+ | read the Lighthouse HTML report: it names the slow image or script |

A page marked `noindex` on purpose (a test or ad landing page) is reported, and its Lighthouse SEO score is
not counted.

**Screenshots are part of the check.** Open each one. Look for: the hero cut off on a phone, text over a
busy photo, cramped or uneven spacing, a menu that covers the page, anything that looks unfinished.

**Lighthouse on a laptop is a lab test.** After launch, PageSpeed Insights (pagespeed.web.dev) adds what
real visitors experienced over the last 28 days, once the site has enough traffic.

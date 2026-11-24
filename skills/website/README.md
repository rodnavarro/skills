# website

A Claude Code skill that builds or remodels a website for a business or a person, and proves it works
before anyone sees it.

## What it does

- **Interviews the owner once**, with every question at once, and writes a short brief.
- **Plans the pages and the menu**: one page per job, plain URLs, one main button.
- **Designs mobile first**: premium and simple, checked on small, medium and big screens (phone 390,
  tablet 768, desktop 1440), with readable text and big enough buttons.
- **Builds on what you have** (WordPress, Next.js, plain HTML), or as plain HTML and CSS when starting fresh.
- **Images**: real photos first; otherwise it uses whatever image tool you already have: GPT image in
  ChatGPT or Codex, fal, or kie.ai. It keeps a real person's face true to life.
- **Copy that converts**: one main action per page, proof next to every claim, a form that really sends,
  and buttons marked for click tracking.
- **Found by Google and by AI answers** (ChatGPT, Perplexity, Claude): titles and descriptions, structured
  data (local business, person, services, FAQ), sitemap, robots, Open Graph sharing images and `llms.txt`.
- **Checks it like Google does**, with one command (`scripts/check.mjs`):
  - Lighthouse on phone and desktop (Performance, Accessibility, Best Practices, SEO), aiming for 90+.
  - An accessibility audit against WCAG 2.1 AA (axe).
  - W3C HTML validation.
  - HTTPS and the http-to-https redirect.
  - Screenshots at three sizes.
  - Then PageSpeed Insights once the site is live.
- **Cinematic mode** for a site that feels like an experience: scroll-driven scenes and layered heroes.

## Install

Copy the `website` folder into your Claude Code skills folder (`~/.claude/skills/website`), or clone this
repo and point to it. Then ask Claude Code: "Use the website skill to remodel my site."

Needs Node 18 or newer. The check installs its own tools the first time it runs. Image generation is
optional: put a key in your project's `.env` (see `.env.example`) only if you want it.

## Credits

This skill has elements from two open-source projects, both under the MIT License (full notices in
[NOTICE](NOTICE)):

- **[scroll-craft](https://github.com/nateherkai/scroll-craft)** by Nate Herk: the cinematic mode
  (`cinematic/`), kept as he wrote it.
- **[marketingskills](https://github.com/coreyhaines31/marketingskills)** by Corey Haines: the SEO, AI
  search, structured data, site architecture and page conversion guides (`marketing/`).

How it was put together and what changed: [ORIGIN.md](ORIGIN.md).

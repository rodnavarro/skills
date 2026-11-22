# Where this skill comes from

**website** is Rod Navarro's skill. It is built around two MIT-licensed projects (notices in [NOTICE](NOTICE)):

- **scroll-craft** by **Nate Herk**: https://github.com/nateherkai/scroll-craft. Copied on 2026-11-22 from
  commit `75d81f74e83692add18cd7a8a8e078b8a887a579` (`plugins/nateherk-design/skills/scroll-craft`), plus
  the repo's `.env.example`.
- **marketingskills** by **Corey Haines**: https://github.com/coreyhaines31/marketingskills. Copied on
  2026-11-22: `seo-audit`, `ai-seo`, `schema-markup`, `site-architecture` and `page-cro`.

**Why it's here:** the website project in Rod's book tells readers to install it from this repo.

## Changes from the originals

- scroll-craft became the **cinematic mode**: everything moved to `cinematic/` unchanged, except that
  `SKILL.md` is now `cinematic/GUIDE.md`, without its skill header and with a short note on top that ties
  it back to this skill.
- The five marketingskills skills are in `marketing/<name>/`, unchanged, except that each `SKILL.md` is
  now `GUIDE.md` so Claude Code doesn't load them as separate skills.
- New: `SKILL.md` (the eight-step flow: brief, plan, mobile-first design and build, images, copy,
  search and AI answers, checks, hand-over), `references/images.md` (use whatever image tool is at hand),
  `references/checks.md` and `scripts/check.mjs` (Lighthouse on phone and desktop, WCAG 2.1 AA with axe,
  W3C validation, HTTPS, screenshots at 390, 768 and 1440, search basics, one report).
- `.env.example` lists every optional image key, not only kie.ai.

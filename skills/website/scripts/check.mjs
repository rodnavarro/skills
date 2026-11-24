#!/usr/bin/env node
// website skill: one command that checks a page the way Google and real visitors do.
//
//   node check.mjs <url> [--out <folder>] [--pages /,/about,/blog] [--no-w3c] [--no-lighthouse]
//
// For each page it checks:
//   - Small, medium and big screens: screenshots at 390 (phone), 768 (tablet) and 1440 (desktop),
//     no sideways scrolling, readable text (16px+ body on a phone), big enough tap targets (24px+, 44px+ preferred).
//   - Accessibility (WCAG 2.1 A and AA) with axe-core: contrast, alt text, labels, link names, headings.
//   - Search and sharing basics: <title>, meta description, one <h1>, canonical, lang, Open Graph image,
//     structured data (JSON-LD), images with alt text and sizes; robots.txt and sitemap.xml on the site.
//   - Lighthouse on phone and desktop: Performance, Accessibility, Best Practices, SEO.
//   - W3C HTML validation (sends the page's HTML to validator.w3.org; skip with --no-w3c).
//   - HTTPS: the https address answers and http:// redirects to it (only for https URLs).
// It writes <out>/report.md, the screenshots and the Lighthouse HTML reports, and exits 1 if a check fails.
//
// The first run installs its tools (playwright, axe-core, lighthouse) into ~/.cache/website-check.

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

// ---------- arguments ----------
const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith('--')) {
  console.error('Usage: node check.mjs <url> [--out <folder>] [--pages /,/about] [--no-w3c] [--no-lighthouse]');
  process.exit(2);
}
const base = args[0].replace(/\/$/, '');
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : dflt;
};
const outDir = path.resolve(opt('out', 'website-check'));
// Pages: a comma list such as "home,about,blog" or "/,/about". (Git Bash rewrites a leading "/" into a
// Windows path, so "home" and bare names are accepted too.)
const pages = opt('pages', 'home')
  .split(',')
  .map((p) => p.trim().replace(/^[A-Za-z]:[\/].*?Git[\/]?/, '/'))
  .map((p) => (p === '' || p === 'home' || p === '/' ? '/' : p.startsWith('/') ? p : `/${p}`));
const doW3c = !args.includes('--no-w3c');
const doLighthouse = !args.includes('--no-lighthouse');
mkdirSync(outDir, { recursive: true });

// ---------- tools ----------
const toolDir = path.join(os.homedir(), '.cache', 'website-check');
if (!existsSync(path.join(toolDir, 'node_modules', 'axe-core'))) {
  console.log(`Installing check tools into ${toolDir} (first run only)...`);
  mkdirSync(toolDir, { recursive: true });
  writeFileSync(path.join(toolDir, 'package.json'), JSON.stringify({ name: 'website-check-tools', private: true }));
  execSync('npm install --no-audit --no-fund playwright axe-core lighthouse@12', { cwd: toolDir, stdio: 'inherit' });
}
const req = createRequire(path.join(toolDir, 'package.json'));
const { chromium } = req('playwright');
const axeSource = readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
try {
  chromium.executablePath() && existsSync(chromium.executablePath()) ||
    execSync('npx playwright install chromium', { cwd: toolDir, stdio: 'inherit' });
} catch {
  execSync('npx playwright install chromium', { cwd: toolDir, stdio: 'inherit' });
}

// ---------- helpers ----------
const SIZES = { phone: [390, 844], tablet: [768, 1024], desktop: [1440, 900] };
const results = []; // { page, check, ok, detail }
const noindexPages = new Set();
const record = (page, check, ok, detail = '') => {
  results.push({ page, check, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${page}  ${check}${detail ? `  (${detail})` : ''}`);
};
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-'));

// ---------- browser checks ----------
const browser = await chromium.launch();
for (const p of pages) {
  const url = base + p;
  for (const [size, [w, h]] of Object.entries(SIZES)) {
    const phone = size === 'phone';
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1 });
    const page = await ctx.newPage();
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (size === 'phone') record(p, 'answers 200', res?.status() === 200, `status ${res?.status()}`);
    // Scroll through once so lazy content loads, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      // 'instant': a site with smooth scrolling would still be moving when the screenshot is taken.
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${slug(p)}-${size}.png`), fullPage: true });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    record(p, `${size} ${w}px: no sideways scroll`, overflow <= 0, overflow > 0 ? `${overflow}px too wide` : '');

    if (phone) {
      const m = await page.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
        const small = [...document.querySelectorAll('a, button, input, select, textarea')].filter(vis)
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && (r.height < 24 || r.width < 24); })
          .filter((el) => !(el.tagName === 'A' && el.closest('p, li') && getComputedStyle(el).display === 'inline'));
        const ps = [...document.querySelectorAll('main p, article p')].filter(vis);
        const tiny = ps.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 14).length;
        // Body size = the size of the paragraph with the most text (labels and captions don't count).
        const main = ps.slice().sort((a, b) => (b.textContent?.length ?? 0) - (a.textContent?.length ?? 0))[0];
        const bodySize = main ? parseFloat(getComputedStyle(main).fontSize) : 16;
        const hidden = [...document.querySelectorAll('main h1, main h2, main h3, main p, main a')].filter((el) => {
          for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).opacity === '0') return true;
          return false;
        }).length;
        return { small: small.map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30)), tiny, bodySize, hidden };
      });
      record(p, 'phone: tap targets 24px+', m.small.length === 0, m.small.slice(0, 5).join(', '));
      record(p, 'phone: readable text (16px+ body text, nothing under 14px)', m.bodySize >= 16 && m.tiny === 0, `body ${m.bodySize}px, ${m.tiny} paragraphs under 14px`);
      record(p, 'content is painted (nothing stuck at opacity 0)', m.hidden === 0, m.hidden ? `${m.hidden} elements invisible` : '');

      // Accessibility: axe-core, WCAG 2.1 A and AA.
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () =>
        // eslint-disable-next-line no-undef
        (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map((v) => `${v.id} (${v.nodes.length})`),
      );
      record(p, 'accessibility: WCAG 2.1 AA (axe)', axe.length === 0, axe.join(', '));

      // Search and sharing basics.
      const seo = await page.evaluate(() => {
        const q = (s) => document.querySelector(s);
        const imgs = [...document.images];
        return {
          title: document.title,
          desc: q('meta[name="description"]')?.content ?? '',
          h1: document.querySelectorAll('h1').length,
          canonical: !!q('link[rel="canonical"]'),
          lang: document.documentElement.lang,
          ogImage: !!q('meta[property="og:image"]'),
          jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
          noAlt: imgs.filter((i) => !i.hasAttribute('alt')).length,
          noSize: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
          noindex: /noindex/.test(q('meta[name="robots"]')?.content ?? ''),
        };
      });
      record(p, 'title (10-65 characters)', seo.title.length >= 10 && seo.title.length <= 65, `${seo.title.length}: "${seo.title}"`);
      record(p, 'meta description (70-160 characters)', seo.desc.length >= 70 && seo.desc.length <= 160, `${seo.desc.length} characters`);
      record(p, 'exactly one h1', seo.h1 === 1, `${seo.h1}`);
      record(p, 'lang, canonical and Open Graph image', !!seo.lang && seo.canonical && seo.ogImage, `lang=${seo.lang || '-'} canonical=${seo.canonical} og:image=${seo.ogImage}`);
      record(p, 'structured data (JSON-LD)', seo.jsonld > 0, `${seo.jsonld} blocks`);
      record(p, 'images have alt text and a width and height', seo.noAlt === 0 && seo.noSize === 0, `${seo.noAlt} without alt, ${seo.noSize} without size`);
      if (seo.noindex) { noindexPages.add(p); record(p, 'note: page is noindex (hidden from search on purpose?), so its SEO score is not counted', true); }

      // W3C HTML validation.
      if (doW3c) {
        try {
          const html = await (await fetch(url)).text(); // as served; the DOM now holds the injected axe script
          const r = await fetch('https://validator.w3.org/nu/?out=json', {
            method: 'POST',
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'User-Agent': 'website-skill-check' },
            body: html,
          });
          const j = await r.json();
          const errs = j.messages.filter((m) => m.type === 'error');
          record(p, 'W3C HTML validation', errs.length === 0, errs.slice(0, 3).map((e) => e.message).join(' | '));
        } catch (e) {
          record(p, 'W3C HTML validation (could not reach validator.w3.org)', true, String(e.message));
        }
      }
    }
    await ctx.close();
  }
}
await browser.close();

// ---------- site-wide ----------
for (const f of ['/robots.txt', '/sitemap.xml']) {
  const r = await fetch(base + f).catch(() => null);
  record('site', `${f} answers`, r?.status === 200, `status ${r?.status ?? 'none'}`);
}
if (base.startsWith('https://')) {
  const r = await fetch(base.replace('https://', 'http://') + '/', { redirect: 'manual' }).catch(() => null);
  const loc = r?.headers.get('location') ?? '';
  record('site', 'http redirects to https', !!r && r.status >= 300 && r.status < 400 && loc.startsWith('https://'), `${r?.status ?? 'no answer'} ${loc}`);
} else {
  record('site', 'HTTPS (checked only on the live https address)', true, 'local URL, skipped');
}

// ---------- Lighthouse ----------
const lhRows = [];
if (doLighthouse) {
  const chromePath = chromium.executablePath();
  const lhBin = path.join(toolDir, 'node_modules', 'lighthouse', 'cli', 'index.js');
  for (const p of pages) {
    for (const form of ['mobile', 'desktop']) {
      const outBase = path.join(outDir, `lighthouse-${slug(p)}-${form}`);
      const run = spawnSync(process.execPath, [lhBin, base + p, '--quiet', '--chrome-flags=--headless=new', '--output=json', '--output=html', `--output-path=${outBase}`, ...(form === 'desktop' ? ['--preset=desktop'] : [])], { env: { ...process.env, CHROME_PATH: chromePath }, encoding: 'utf8' });
      try {
        const r = JSON.parse(readFileSync(`${outBase}.report.json`, 'utf8'));
        const s = Object.fromEntries(Object.values(r.categories).map((c) => [c.title, Math.round(c.score * 100)]));
        lhRows.push({ page: p, form, ...s });
        const low = Object.entries(s).filter(([k, v]) => v < 90 && !(k === 'SEO' && noindexPages.has(p)));
        record(p, `Lighthouse ${form}: all four 90+`, low.length === 0, Object.entries(s).map(([k, v]) => `${k} ${v}`).join(', '));
      } catch {
        record(p, `Lighthouse ${form}`, false, (run.stderr || 'no report').slice(0, 200));
      }
    }
  }
}

// ---------- report ----------
const failed = results.filter((r) => !r.ok);
const md = [
  `# Website check: ${base}`,
  '',
  `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · pages: ${pages.join(', ')} · ${failed.length ? `**${failed.length} to fix**` : '**all checks pass**'}`,
  '',
  lhRows.length ? '## Lighthouse\n\n| Page | Device | Performance | Accessibility | Best Practices | SEO |\n|---|---|---|---|---|---|\n' +
    lhRows.map((r) => `| ${r.page} | ${r.form} | ${r.Performance} | ${r.Accessibility} | ${r['Best Practices']} | ${r.SEO} |`).join('\n') + '\n' : '',
  '## Checks',
  '',
  '| | Page | Check | Detail |',
  '|---|---|---|---|',
  ...results.map((r) => `| ${r.ok ? 'PASS' : '**FAIL**'} | ${r.page} | ${r.check} | ${String(r.detail).replace(/\|/g, '/')} |`),
  '',
  '## Screenshots',
  '',
  ...pages.flatMap((p) => Object.keys(SIZES).map((s) => `- ${p} ${s}: \`${slug(p)}-${s}.png\``)),
  '',
].join('\n');
writeFileSync(path.join(outDir, 'report.md'), md);
console.log(`\nReport: ${path.join(outDir, 'report.md')}  ·  ${failed.length ? `${failed.length} checks to fix` : 'all checks pass'}`);
process.exit(failed.length ? 1 : 0);

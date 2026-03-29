#!/usr/bin/env node

/**
 * build-standalone-guide.mjs
 *
 * Converts the study guide markdown into a single self-contained HTML file
 * with all images inlined as base64 data URIs.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ---------- paths ----------
const MD_PATH = join(ROOT, 'docs', 'italian-drivers-license-study-guide.md');
const DOCS_DIR = join(ROOT, 'docs');
const OUT_PATHS = [
  join(ROOT, 'docs', 'italian-drivers-license-study-guide.html'),
  join(ROOT, 'public', 'docs', 'italian-drivers-license-study-guide.html'),
];

// ---------- read markdown ----------
let md = readFileSync(MD_PATH, 'utf-8');

// ---------- inline images ----------
let inlinedCount = 0;
let missingImages = [];

function getMimeType(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.gif')) {
    return 'image/gif';
  }
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  return null;
}

function resolveImagePath(relPath) {
  if (relPath.startsWith('assets/')) {
    return join(DOCS_DIR, relPath);
  }

  if (relPath.startsWith('../public/')) {
    return join(ROOT, relPath.slice('../'.length));
  }

  return null;
}

md = md.replace(
  /!\[([^\]]*)\]\(((?:assets\/|\.\.\/public\/)[^)]+\.(?:png|gif|jpe?g|webp))\)/g,
  (_match, alt, relPath) => {
    const absPath = resolveImagePath(relPath);
    const mimeType = getMimeType(relPath);

    if (absPath && mimeType && existsSync(absPath)) {
      const buf = readFileSync(absPath);
      const b64 = buf.toString('base64');
      inlinedCount++;
      return `![${alt}](data:${mimeType};base64,${b64})`;
    }

    missingImages.push(relPath);
    return `![${alt}](${relPath})`; // leave as-is
  }
);

// ---------- configure marked ----------
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Custom renderer for heading IDs (for TOC linking)
const renderer = new marked.Renderer();

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const headings = [];

renderer.heading = function ({ text, depth }) {
  const raw = text.replace(/<[^>]+>/g, '');
  const id = slugify(raw);
  headings.push({ depth, text: raw, id });
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

// Make images inside tables render at controlled size
renderer.image = function ({ href, title, text }) {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" />`;
};

const html = marked.parse(md, { renderer });

// ---------- build TOC ----------
function buildTOC(headings) {
  // Include h2 and h3 for TOC
  const tocItems = headings.filter((h) => h.depth === 2 || h.depth === 3);
  let tocHtml = '<nav id="toc" aria-label="Table of Contents">\n';
  tocHtml += '<div class="toc-header">\n';
  tocHtml += '  <h2>Contents</h2>\n';
  tocHtml += '  <button id="toc-toggle" aria-label="Toggle table of contents">&#9776;</button>\n';
  tocHtml += '</div>\n';
  tocHtml += '<ul class="toc-list">\n';

  for (const item of tocItems) {
    const indent = item.depth === 3 ? ' class="toc-sub"' : '';
    tocHtml += `  <li${indent}><a href="#${item.id}">${item.text}</a></li>\n`;
  }

  tocHtml += '</ul>\n</nav>\n';
  return tocHtml;
}

const toc = buildTOC(headings);

// ---------- HTML template ----------
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Italian Driver's License (Patente A &amp; B) Study Guide</title>
<style>
/* ===== Reset & Base ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --teal: #0d9488;
  --teal-light: #14b8a6;
  --teal-dark: #0f766e;
  --teal-bg: #f0fdfa;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
}

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.7;
  color: var(--gray-800);
  background: var(--gray-50);
}

/* ===== Layout ===== */
.page-wrapper {
  display: flex;
  min-height: 100vh;
}

/* ===== TOC Sidebar ===== */
#toc {
  position: sticky;
  top: 0;
  align-self: flex-start;
  width: 280px;
  min-width: 280px;
  max-height: 100vh;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid var(--gray-200);
  padding: 1.25rem 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem 0.75rem;
  border-bottom: 2px solid var(--teal);
  margin-bottom: 0.5rem;
}

.toc-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--teal-dark);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

#toc-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--teal);
  cursor: pointer;
  padding: 0.25rem;
}

.toc-list {
  list-style: none;
  padding: 0;
}

.toc-list li {
  border-left: 3px solid transparent;
}

.toc-list li a {
  display: block;
  padding: 0.3rem 1.25rem;
  font-size: 0.85rem;
  color: var(--gray-600);
  text-decoration: none;
  transition: all 0.15s;
}

.toc-list li a:hover {
  color: var(--teal);
  background: var(--teal-bg);
  border-left-color: var(--teal);
}

.toc-list li.toc-sub a {
  padding-left: 2.25rem;
  font-size: 0.8rem;
  color: var(--gray-400);
}

.toc-list li.toc-sub a:hover {
  color: var(--teal-light);
}

/* ===== Main Content ===== */
.content {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 2.5rem 4rem;
}

/* ===== Header ===== */
.guide-header {
  text-align: center;
  padding: 2.5rem 1.5rem 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--teal-dark), var(--teal-light));
  color: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.guide-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.guide-header p {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* ===== Typography ===== */
h1 { font-size: 2rem; font-weight: 800; color: var(--gray-900); margin: 2rem 0 1rem; }
h2 {
  font-size: 1.5rem; font-weight: 700; color: var(--teal-dark);
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid var(--gray-200);
}
h3 { font-size: 1.2rem; font-weight: 600; color: var(--gray-700); margin: 1.8rem 0 0.8rem; }
h4 { font-size: 1.05rem; font-weight: 600; color: var(--gray-600); margin: 1.4rem 0 0.6rem; }
h5, h6 { font-size: 0.95rem; font-weight: 600; color: var(--gray-500); margin: 1.2rem 0 0.5rem; }

p { margin: 0 0 1rem; }

a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

strong { font-weight: 600; color: var(--gray-900); }
em { font-style: italic; }

/* ===== Lists ===== */
ul, ol {
  margin: 0 0 1rem 1.5rem;
}

li {
  margin-bottom: 0.35rem;
}

li > ul, li > ol {
  margin-top: 0.35rem;
  margin-bottom: 0;
}

/* ===== Tables ===== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0 1.5rem;
  font-size: 0.9rem;
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

thead th {
  background: var(--teal);
  color: #fff;
  font-weight: 600;
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  text-transform: none;
}

tbody td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--gray-200);
  vertical-align: middle;
}

tbody tr:nth-child(even) { background: var(--gray-50); }
tbody tr:hover { background: var(--teal-bg); }

/* Sign image tables */
td img {
  width: 80px;
  height: auto;
  display: block;
  margin: 0.25rem auto;
  border-radius: 4px;
}

/* Empty cells in sign tables */
td:empty { background: transparent; }

/* ===== Blockquotes ===== */
blockquote {
  border-left: 4px solid var(--teal);
  background: var(--teal-bg);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--gray-700);
}

blockquote p:last-child { margin-bottom: 0; }

/* ===== Code ===== */
code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 0.88em;
  background: var(--gray-100);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  color: var(--teal-dark);
}

pre {
  background: var(--gray-800);
  color: var(--gray-100);
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 1rem 0;
  font-size: 0.85rem;
  line-height: 1.5;
}

pre code {
  background: none;
  padding: 0;
  color: inherit;
}

/* ===== Horizontal Rule ===== */
hr {
  border: none;
  border-top: 2px solid var(--gray-200);
  margin: 2rem 0;
}

/* ===== Mobile TOC ===== */
@media (max-width: 960px) {
  .page-wrapper {
    flex-direction: column;
  }

  #toc {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    min-width: unset;
    height: 100vh;
    transform: translateX(-100%);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
  }

  #toc.open {
    transform: translateX(0);
  }

  #toc-toggle {
    display: block;
  }

  .toc-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index: 999;
  }

  .toc-overlay.visible {
    display: block;
  }

  .mobile-toc-btn {
    display: flex !important;
  }

  .content {
    padding: 1rem 1.25rem 3rem;
  }

  .guide-header h1 { font-size: 1.5rem; }

  td img { width: 60px; }

  table { font-size: 0.82rem; }
}

/* Mobile TOC button (fixed) */
.mobile-toc-btn {
  display: none;
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: 998;
  align-items: center;
  justify-content: center;
}

.mobile-toc-btn:hover {
  background: var(--teal-dark);
}

/* ===== Print ===== */
@media print {
  #toc, .mobile-toc-btn, .toc-overlay { display: none !important; }

  .page-wrapper { display: block; }

  .content {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  .guide-header {
    background: none !important;
    color: #000 !important;
    box-shadow: none;
    border: 2px solid var(--gray-300);
  }

  .guide-header h1 { color: #000; }
  .guide-header p { color: var(--gray-600); }

  body { font-size: 11pt; line-height: 1.5; }

  h2 { page-break-after: avoid; }
  table { page-break-inside: avoid; }

  td img { width: 60px; }

  a { color: #000; text-decoration: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: var(--gray-400); }
}

/* Hide the first h1 in .content since we have the header */
.content > h1:first-child { display: none; }
</style>
</head>
<body>

<div class="toc-overlay" id="toc-overlay"></div>

<div class="page-wrapper">
${toc}
<main class="content">
<header class="guide-header">
  <h1>Patente A &amp; B Study Guide</h1>
  <p>A comprehensive English-language guide for the Italian driver's license theory exam &mdash; covering all 25 chapters, road signs, and exam strategies.</p>
</header>
${html}
</main>
</div>

<button class="mobile-toc-btn" id="mobile-toc-btn" aria-label="Open table of contents">&#9776;</button>

<script>
(function () {
  var toc = document.getElementById('toc');
  var overlay = document.getElementById('toc-overlay');
  var mobileBtn = document.getElementById('mobile-toc-btn');
  var tocToggle = document.getElementById('toc-toggle');

  function openToc() {
    toc.classList.add('open');
    overlay.classList.add('visible');
  }

  function closeToc() {
    toc.classList.remove('open');
    overlay.classList.remove('visible');
  }

  mobileBtn.addEventListener('click', openToc);
  tocToggle.addEventListener('click', function () {
    if (toc.classList.contains('open')) closeToc();
    else openToc();
  });
  overlay.addEventListener('click', closeToc);

  // Close TOC when a link is clicked (mobile)
  toc.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 960) closeToc();
    });
  });

  // Highlight active TOC item on scroll
  var tocLinks = toc.querySelectorAll('.toc-list a');
  var headingEls = [];
  tocLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) headingEls.push({ el: el, a: a });
  });

  function onScroll() {
    var scrollY = window.scrollY + 100;
    var current = null;
    for (var i = 0; i < headingEls.length; i++) {
      if (headingEls[i].el.offsetTop <= scrollY) current = headingEls[i];
    }
    tocLinks.forEach(function (a) {
      a.parentElement.style.borderLeftColor = 'transparent';
      a.style.color = '';
      a.style.fontWeight = '';
    });
    if (current) {
      current.a.parentElement.style.borderLeftColor = 'var(--teal)';
      current.a.style.color = 'var(--teal)';
      current.a.style.fontWeight = '600';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
</script>
</body>
</html>`;

// ---------- write output ----------
for (const outPath of OUT_PATHS) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, fullHtml, 'utf-8');
}

// ---------- report ----------
const sizeBytes = Buffer.byteLength(fullHtml, 'utf-8');
const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);

console.log(`\n  Study Guide Build Complete`);
console.log(`  -------------------------`);
console.log(`  Images inlined : ${inlinedCount}`);
if (missingImages.length > 0) {
  console.log(`  Missing images : ${missingImages.length}`);
  missingImages.forEach((p) => console.log(`    - ${p}`));
}
OUT_PATHS.forEach((outPath, index) => {
  const label = index === 0 ? '  Output file    ' : '  Output copy    ';
  console.log(`${label}: ${outPath}`);
});
console.log(`  File size      : ${sizeMB} MB (${sizeBytes.toLocaleString()} bytes)`);
console.log('');

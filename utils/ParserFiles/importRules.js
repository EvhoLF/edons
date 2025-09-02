/**
 * Все правила для извлечения импортов / ресурсов
 * Формат: { [type]: RegExp[] }
 */

export const importRegexes = {
  // --- JavaScript / TypeScript ---
  js: [
    /import\s+[^'"]*?from\s+['"`]([^'"`]+)['"`]/g,
    /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    /import\s+['"`]([^'"`]+)['"`]/g,
    /require\s*\(\s*['"`]([^'"`]+)['"`]\)/g,
    /export\s+[^'"]*?from\s+['"`]([^'"`]+)['"`]/g,
    /new\s+URL\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*import\.meta\.url\s*\)/g,
    /new\s+Worker\s*\(\s*['"`]([^'"`]+)['"`]\)/g,
    /__import__\(\s*['"]([^'"]+)['"]\s*\)/g, // dynamic import Python-like
  ],

  jsx: [], ts: [], tsx: [], mjs: [], cjs: [],
  get _fillJSLike() {
    ["jsx", "ts", "tsx", "mjs", "cjs"].forEach(k => (this[k] = this.js));
    return true;
  },

  // --- CSS / SCSS / SASS / LESS ---
  css: [
    /@import\s+['"]([^'"]+)['"]/g,
    /@import\s+url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
    /url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
  ],
  scss: [], sass: [], less: [],
  get _fillCSSLike() {
    ["scss", "sass", "less"].forEach(k => (this[k] = this.css));
    return true;
  },

  // --- HTML ---
  html: [
    /<script[^>]+src=['"]([^'"]+)['"]/gi,
    /<link[^>]+href=['"]([^'"]+)['"]/gi,
    /<img[^>]+src=['"]([^'"]+)['"]/gi,
    /<img[^>]+srcset=['"]([^'"]+)['"]/gi,
    /<img[^>]+data-src=['"]([^'"]+)['"]/gi,
    /<img[^>]+data-srcset=['"]([^'"]+)['"]/gi,
    /<source[^>]+src=['"]([^'"]+)['"]/gi,
    /<source[^>]+srcset=['"]([^'"]+)['"]/gi,
    /<(?:video|audio)[^>]+src=['"]([^'"]+)['"]/gi,
    /<track[^>]+src=['"]([^'"]+)['"]/gi,
    /<picture>[\s\S]*?<source[^>]+srcset=['"]([^'"]+)['"][\s\S]*?<\/picture>/gi,
    /<iframe[^>]+src=['"]([^'"]+)['"]/gi,
    /<image[^>]+(?:href|xlink:href)=['"]([^'"]+)['"]/gi,
    /style=['"][^'"]*url\(\s*['"]?([^'")]+)['"]?\s*\)[^'"]*['"]/gi,
    /<style[^>]*>[\s\S]*?url\(\s*['"]?([^'")]+)['"]?\s*\)[\s\S]*?<\/style>/gi,
    /<meta[^>]+content=['"]([^'"]+)['"]/gi,
    /<object[^>]+data=['"]([^'"]+)['"]/gi,
    /<embed[^>]+src=['"]([^'"]+)['"]/gi,
  ],
  htm: [],

  // --- Python ---
  python: [
    /from\s+([.\w]+)\s+import\s+[\w*, ]+/g,
    /import\s+([.\w]+)/g,
    /__import__\(\s*['"]([^'"]+)['"]\s*\)/g
  ],
  py: [],

  // --- PHP ---
  php: [
    /require(?:_once)?\s*\(?\s*['"]([^'"]+)['"]\s*\)?/g,
    /include(?:_once)?\s*\(?\s*['"]([^'"]+)['"]\s*\)?/g,
    /include_path\s*\(?\s*['"]([^'"]+)['"]\s*\)?/g
  ],

  // --- Shell ---
  sh: [
    /(?:^|\s)source\s+([^\s'"]+)/gm,
    /(?:^|\s)\.\s+([^\s'"]+)/gm,
    /(?:^|\s)source\s+\{([^\}]+)\}/gm
  ],
  bash: [], zsh: [],

  // --- Go ---
  go: [
    /import\s+["]([^"]+)["]/g,
    /import\s+\([\s\S]*?["]([^"]+)["][\s\S]*?\)/g
  ],

  // --- Rust ---
  rust: [
    /(?:^|\s)mod\s+([\w/.-]+)/gm,
    /(?:^|\s)use\s+((?:self|super|crate)(?:::[\w/.-]+)+)/gm
  ],
  rs: [],

  // --- Java / C# ---
  java: [],
  csharp: [],
  cs: [],

  // --- JSON/YAML/XML ---
  json: [
    /['"]([^'"]+\.(?:js|mjs|cjs|ts|tsx|jsx|json|css|scss|sass|less|png|jpg|jpeg|gif|svg|webp|ico|ttf|otf|woff2?|mp3|mp4|webm))['"]/g
  ],
  yml: [], yaml: [], xml: [],

  // --- Markdown ---
  markdown: [
    /!\[[^\]]*\]\(([^)]+)\)/g,
    /\[[^\]]*\]\(([^)]+)\)/g
  ],

  // --- Dockerfile ---
  dockerfile: [
    /COPY\s+([^\s]+)\s+[^\s]+/g,
    /ADD\s+([^\s]+)\s+[^\s]+/g
  ],

  // --- Makefile ---
  make: [
    /^include\s+(.+)$/gm
  ]
};

// прогреваем наследования
void importRegexes._fillJSLike;
void importRegexes._fillCSSLike;
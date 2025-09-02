// getFileData.js
import { data_fileExtensions } from "@/data/data_fileExtensions";
import { importRegexes } from './importRules';

const EXTERNAL_SCHEMES = ["http:", "https:", "//", "data:", "mailto:", "tel:"];

/** Удалить query/hash у пути (file.png?v=1#x) */
function stripQueryHash(p) {
  if (!p) return p;
  const i = p.search(/[?#]/);
  return i === -1 ? p : p.slice(0, i);
}

/** true, если путь внешний или со схемой */
function isExternalPath(p = "") {
  const s = p.trim();
  return EXTERNAL_SCHEMES.some(prefix => s.startsWith(prefix));
}

/** Нормализуем "@/..." в относительный к корню, а ведущий "/" -> корень (снимем слэш) */
function normalizeRootish(p = "") {
  if (p.startsWith("@/")) return p.slice(2);
  if (p.startsWith("/")) return p.slice(1);
  return p;
}

/** Разобрать и нормализовать относительный путь относительно baseDir (без ведущего /) */
function resolveRelative(baseDir, relPath) {
  // baseDir: 'a/b' или '' ; relPath без схем/URL
  const base = (baseDir || "").split("/").filter(Boolean);
  const rel = (relPath || "").split("/");

  const stack = [...base];
  for (const partRaw of rel) {
    const part = partRaw.trim();
    if (!part || part === ".") continue;
    if (part === "..") {
      if (stack.length) stack.pop();
      // если уже на корне — игнорируем лишние ..
      continue;
    }
    stack.push(part);
  }
  return stack.join("/");
}

/** Вернёт базовую директорию (папка файла) */
function getBaseDir(filePath = "") {
  const parts = filePath.split("/");
  parts.pop(); // убираем имя файла
  return parts.join("/");
}

/** Нормализуем импорт относительно файла */
function normalizeImportPath(rawImport = "", importerPath = "") {
  if (!rawImport) return null;

  // сохраним оригинал, чтобы понять поведение root-ish
  const rawTrim = rawImport.trim();

  // 1) убрать query/hash
  let p = stripQueryHash(rawTrim);

  // 2) игнорируем внешние URL/схемы
  if (isExternalPath(p)) return null;

  // 3) нормализуем "@/.." и ведущий "/"
  const wasRootish = rawTrim.startsWith("@/") || rawTrim.startsWith("/");
  p = normalizeRootish(p);

  const baseDir = getBaseDir(importerPath);

  // 4) python относительные импорты вида ".utils" / "..pkg.module"
  if (p.startsWith(".")) {
    // превращаем точки в ../, затем точки между именами в /
    // считаем количество начальных точек
    const m = p.match(/^(\.+)(.*)$/);
    const dots = m ? m[1].length : 0;
    const rest = m ? m[2] : "";
    const restClean = rest.replace(/^\./, ""); // убрать точку-переход
    const upParts = Array(dots).fill("..").join("/");
    const after = (upParts ? upParts + "/" : "") + restClean.replace(/\./g, "/").replace(/^\/+/, "");
    return resolveRelative(baseDir, after);
  }

  // 5) shell: относительные пути без ./ могут встречаться -> считаем относительными к baseDir
  // 6) html/css/js: 'images/x.png' или 'style.css' тоже относительные
  if (p.startsWith("./") || p.startsWith("../")) {
    return resolveRelative(baseDir, p);
  }

  // 7) специально: если импорт начинался с '/' или '@/' — считаем его относительным к корню проекта
  if (wasRootish) {
    // уже убрали ведущий слэш в normalizeRootish
    return p.replace(/^\/+/, "");
  }

  // 8) если путь содержит слеш (каталог) или точка-расширение — тоже относительный к baseDir
  if (p.includes("/") || /\.[a-z0-9]+$/i.test(p)) {
    return resolveRelative(baseDir, p);
  }

  // 9) голые пакетные импорты (react, lodash и т.п.) — игнорируем (не локальные файлы)
  return null;
}

/**
 * ============================
 *       ПУБЛИЧНЫЕ API
 * ============================
 */

/**
 * Извлекает импорты/ресурсы и приводит их к нормализованным путям
 * относительно файла `path` (тот же контракт, что был).
 *
 * @param {string} type - расширение файла (например "js","ts","html","css"...)
 * @param {string} data - содержимое файла
 * @param {string} path - путь файла внутри загруженной папки (от корня этой папки)
 * @returns {string[]|undefined}
 */
export const getImports = (type, data, path) => {
  const t = (type || "").toLowerCase();
  const regexList =
    importRegexes[t] ||
    importRegexes[getExtensionAlias(t)] ||
    null;

  if (!regexList) return;

  const imports = new Set();
  const innerUrlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;

  for (const regex of regexList) {
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(data)) !== null) {
      const captured = m[1];
      if (!captured) continue;

      const candidates = [];

      // извлекаем все url(...) внутри capture
      innerUrlRegex.lastIndex = 0;
      let um;
      let foundUrl = false;
      while ((um = innerUrlRegex.exec(captured)) !== null) {
        if (um[1]) {
          candidates.push(um[1]);
          foundUrl = true;
        }
      }

      if (!foundUrl) {
        // если это список (srcset) — разбиваем по запятой и берём URL до пробела
        if (captured.includes(",")) {
          captured.split(",").forEach(seg => {
            const token = seg.trim().split(/\s+/)[0];
            if (token) candidates.push(token);
          });
        } else {
          candidates.push(captured);
        }
      }

      for (let cand of candidates) {
        if (!cand) continue;

        // очистка: убрать кавычки, пробелы, backslashes
        cand = String(cand).trim().replace(/^['"]|['"]$/g, "").replace(/\\/g, "/");

        // фильтруем очевидный мусор (например meta content "initial-scale=1.0")
        if (cand.includes("=") && !cand.includes("/")) continue;
        if (cand.startsWith("#")) continue;
        if (cand === "") continue;

        // игнорируем внешние схемы
        if (isExternalPath(cand)) continue;

        // Особая коррекция: если путь получился как 'images/intro/png' или 'font/mymogoico/woff'
        // — преобразуем последний сегмент '/png' -> '.png' и т.п.
        cand = cand.replace(
          /\/(png|jpe?g|gif|svg|webp|ico|ttf|otf|woff2?|woff|eot|mp3|mp4|webm|json|css|js)$/i,
          ".$1"
        );

        const norm = normalizeImportPath(cand, path);
        if (norm) imports.add(norm);
      }
    }
  }

  return Array.from(imports);
};


/** Хелпер: мэп алиасов расширений к известным ключам */
function getExtensionAlias(ext) {
  // подстрахуемся: py -> python, rs -> rust, htm -> html и т.д.
  switch (ext) {
    case "py": return "python";
    case "rs": return "rust";
    case "htm": return "html";
    case "mjs":
    case "cjs":
    case "jsx":
    case "tsx":
    case "ts":
    case "js": return ext; // уже поддержаны напрямую
    case "scss":
    case "sass":
    case "less":
    case "css": return ext; // уже поддержаны напрямую
    default: return ext; // попытаемся напрямую
  }
}

/** Вернёт расширение файла в нижнем регистре (или пустую строку) */
export const getFileExtension = (filename) => {
  const regex = /(?:\.([^.]+))?$/;
  const extension = regex.exec(filename)?.[1];
  return extension ? extension.toLowerCase() : '';
};

/** Мэпит расширение к id-шаблону из data_fileExtensions */
export const getExtensionId = (extension) => {
  const fileExtensions = Object.values(data_fileExtensions);
  return fileExtensions.filter(obj => obj.types.includes(extension))[0]?.id || "default";
};

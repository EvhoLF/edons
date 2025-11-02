'use client';
import { readFileAsText } from "./readFileAsText";
import { getExtensionId, getFileExtension, getImports } from "./getFileData";
import { tNodeCode } from "@/data/NodeTemplates/tNodeCode";

const IGNORE_DIRS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  "__pycache__",
  "venv",
  "vendor",
  "bin",
  "obj",
  "target"
];

const isIgnored = (path) => {
  return IGNORE_DIRS.some(dir => path.split("/").includes(dir));
};

function normalizeRelPath(p = '') {
  if (!p) return p;
  return p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '').replace(/\/{2,}/g, '/');
}

function createEdges(files = []) {
  const connections = [];
  const file_ids = [];
  const stripExt = (p) => (p || '').replace(/\.[^/.]+$/, '');
  const replaceSlashExt = (p) => (p || '').replace(/\/(png|jpe?g|gif|svg|webp|ico|ttf|otf|woff2?|woff|eot|mp3|mp4|webm|json|css|js)$/i, '.$1');
  const normalizeKey = (p) => normalizeRelPath(p || '');

  // Собираем карту ключей -> id
  files.forEach((file, id) => {
    const p = normalizeKey(file.path);
    file_ids.push([p, id]);
    file_ids.push([stripExt(p), id]);
    file_ids.push([replaceSlashExt(p), id]);

    if (p.startsWith('public/')) {
      const wout = p.replace(/^public\//, '');
      file_ids.push([wout, id], [stripExt(wout), id], [replaceSlashExt(wout), id]);
    } else {
      file_ids.push([`public/${p}`, id], [`public/${stripExt(p)}`, id], [`public/${replaceSlashExt(p)}`, id]);
    }

    file_ids.push([`/${p}`, id], [`/${stripExt(p)}`, id], [`/${replaceSlashExt(p)}`, id]);
  });

  const fileMap = new Map(file_ids);

  function findTargetId(importedFilePath) {
    if (!importedFilePath) return undefined;
    const key = normalizeKey(importedFilePath);
    const candidates = [
      key,
      key.replace(/^\//, ''),
      replaceSlashExt(key),
      stripExt(key),
      `public/${key}`,
      `public/${stripExt(key)}`,
      `/${key}`,
      `/${stripExt(key)}`
    ];

    for (const c of candidates) {
      const v = fileMap.get(c);
      if (typeof v !== 'undefined') return v;
    }

    // fallback: поиск по basename
    const base = key.split('/').pop();
    if (!base) return undefined;
    for (const [k, v] of fileMap.entries()) {
      const kb = k.split('/').pop();
      if (!kb) continue;
      if (kb === base || stripExt(kb) === stripExt(base)) return v;
    }

    return undefined;
  }

  files.forEach(file => {
    if (file.imports) {
      file.imports.forEach(importedFilePath => {
        const targetId = findTargetId(importedFilePath);
        if (typeof targetId !== 'undefined') {
          const importedFile = files[targetId];
          if (importedFile && importedFile.id !== file.id) { // 👈 не создаём self-loop
            connections.push({
              id: `p(${file.id}-${importedFile.id})`,
              source: file.id,
              target: importedFile.id,
            });
          }
        }
      });
    }
  });

  // удаляем дубликаты по id
  return Array.from(new Map(connections.map(e => [e.id, e])).values());
}



export const ParseFileInNode = async (files) => {
  // убираем ненужные директории
  const filteredFiles = files.filter(file => !isIgnored(file.webkitRelativePath));
  if (filteredFiles.length === 0) return { newNodes: [], newEdges: [], newCodeData: [] };

  // Берём общую директорию (папку)
  const rootDir = filteredFiles[0].webkitRelativePath.split("/").slice(0, -1).join("/");

  const promises = filteredFiles.map(async (file, i) => {
    const id = Date.now() + "" + i;
    try {
      const data = await readFileAsText(file);
      const extension = getFileExtension(file.name);
      const template = tNodeCode[getExtensionId(extension)];

      // строим путь относительно rootDir
      const relativePath = file.webkitRelativePath.replace(rootDir + "/", "");

      const imports = await getImports(extension, data, relativePath);

      const node = {
        id,
        imports,
        fileName: file.name,
        path: relativePath,
        position: { x: i * 400, y: 0 },
        type: "code",
        data: {
          label: file.name ?? 'file',
          color: template.data.color,
          icon: template.data.icon,
          codeType: template.data.codeType,
          isClose: true
        },
      };

      return { node, codeData: { id, data } };
    } catch (error) {
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter(result => result !== null);

  const newNodes = validResults.map(result => result.node);
  const newCodeData = validResults.map(result => result.codeData);

  const newEdges = createEdges(newNodes);
  return { newNodes, newEdges, newCodeData };
};

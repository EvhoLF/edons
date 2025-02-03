import { data_fileExtensions } from "@/data/data_fileExtensions";

const importRegexes = {
  js: /(?:import\s[^'"]*['"]([^'"]*)['"]|require\(['"]([^'"]*)['"]\))/g,
  jsx: /(?:import\s[^'"]*['"]([^'"]*)['"]|require\(['"]([^'"]*)['"]\))/g,
  html: /<link\s[^>]*href=['"]([^'"]*)['"][^>]*>|<script\s[^>]*src=['"]([^'"]*)['"][^>]*>/g,
  css: /@import\s+(?:url\(['"]?(.*?)['"]?\)|['"](.*?)['"]?);/g,
  php: /(?:include|require)(?:_once)?\s*\(?\s*[\'"]([^\'"]+)[\'"]\s*\)?;/g,
  python: /(?:import\s+(\w+)|from\s+(\w+)\s+import\s+(\w+))/g,
  csharp: /using\s+(\w+(\.\w+)*);/g,
  java: /import\s+(\w+(\.\w+)*);/g,
};

const updateImports = (basePath, importPaths) => {
  const baseDir = basePath.substring(0, basePath.lastIndexOf('/')); // Извлекаем директорию из basePath

  return importPaths.map(importPath => {
    // Обработка путей на основе их префиксов
    if (importPath.startsWith('@/')) {
      return importPath.replace('@/', ''); // Убираем '@/'
    }

    // Убираем './' и добавляем базовую директорию
    if (importPath.startsWith('./')) {
      return `${baseDir}/${importPath.slice(2)}`; // Убираем './'
    }

    // Обрабатываем пути с '../'
    if (importPath.startsWith('../')) {
      let currentDir = baseDir;
      let relativePath = importPath;

      while (relativePath.startsWith('../')) {
        currentDir = currentDir.substring(0, currentDir.lastIndexOf('/')); // Поднимаемся вверх
        relativePath = relativePath.slice(3); // Убираем '../'
      }

      return `${currentDir}/${relativePath}`; // Возвращаем обновленный путь
    }

    return importPath; // Если путь абсолютный, возвращаем его как есть
  });
};

const convertImportsToAbsolute = (filePath, impotPaths) => {
  // Определяем основную директорию (где находится файл)
  const baseDirectory = filePath.split('/').slice(0, -1).join('/'); // Убираем файл, оставляя только папки

  // Преобразуем относительные импорты в абсолютные
  const absoluteImports = impotPaths.map(path => {
    // Проверяем, является ли путь относительным
    if (path.startsWith('../')) {
      // Получаем количество уровней вверх по директории
      const levelsUp = path.split('../').length - 1;
      // Находим абсолютный путь
      return baseDirectory.split('/').slice(0, -levelsUp).join('/') + '/' + path.replace(/\.\.\//g, '');
    }
    else if (path.startsWith('./')) {
      // Для путей с ./ добавляем имя файла к базовой директории
      return baseDirectory + '/' + path.replace('./', '');
    }
    else if (path.startsWith('@/')) {
      // Заменяем импорт с @ на абсолютный путь
      return path.slice(2); // Убираем @ и оставляем остальную часть
    }
    return path; // Возвращаем оригинальный путь, если он не относительный
  });

  // Возвращаем новый объект с обновленными импортами
  // console.log(absoluteImports);

  return absoluteImports
}


export const getImports = (type, data, path) => {
  const regex = importRegexes[type];
  if (!regex) return;

  let match;
  const imports = [];
  while ((match = regex.exec(data)) !== null) { imports.push(match[1] || match[2]); }

  return convertImportsToAbsolute(path, imports);
};

export const getFileExtension = (filename) => {
  const regex = /(?:\.([^.]+))?$/;
  const extension = regex.exec(filename)[1];
  return extension ? extension.toLowerCase() : '';
}

export const getExtensionId = (extension) => {
  const fileExtensions = Object.values(data_fileExtensions);
  return fileExtensions.filter(obj => obj.types.includes(extension))[0]?.id || "default";
}
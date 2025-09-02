import JSZip from 'jszip';
import { IGNORE_DIRS } from './consts';

export interface ProcessFilesOptions {
  acceptedFileTypes?: string | null;
  maxFileSize?: number | null;
  maxFiles?: number | null;
  ignoredDirs?: string[]; // дополнительные папки для исключения
}

export interface ProcessFilesResult {
  validFiles: File[];
  errors: string[];
}

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const extractZip = async (file: File): Promise<File[]> => {
  const zip = await JSZip.loadAsync(file);
  const extracted: File[] = [];
  for (const [path, entry] of Object.entries(zip.files)) {
    if (!entry.dir) {
      const content = await entry.async('blob');
      const extractedFile = new File([content], path, { type: content.type });
      extracted.push(extractedFile);
    }
  }
  return extracted;
};

export const isIgnored = (file: File, extraIgnoreDirs: string[] = []): boolean => {
  const fullPath = (file as any).webkitRelativePath || file.name;
  const dirs = [...IGNORE_DIRS, ...extraIgnoreDirs];
  return dirs.some(dir => fullPath.split("/").includes(dir));
};

export const processFiles = async (
  files: File[],
  selectedFiles: File[],
  options: ProcessFilesOptions = {}
): Promise<ProcessFilesResult> => {
  const { acceptedFileTypes, maxFileSize, maxFiles, ignoredDirs = [] } = options;
  const errors: string[] = [];
  let allFiles: File[] = [];

  // Распаковываем ZIP
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      try {
        const extracted = await extractZip(file);
        allFiles.push(...extracted);
      } catch (err) {
        errors.push(`Ошибка распаковки ${file.name}`);
      }
    } else {
      allFiles.push(file);
    }
  }

  // Фильтр по игнорируемым папкам
  allFiles = allFiles.filter(file => !isIgnored(file, ignoredDirs));

  if (maxFiles && (selectedFiles.length + allFiles.length) > maxFiles) {
    errors.push(`Максимальное количество файлов: ${maxFiles}`);
  }

  const validFiles: File[] = [];

  for (const file of allFiles) {
    // Проверка формата
    if (acceptedFileTypes) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedTypes = acceptedFileTypes.split(',').map(t => t.trim().toLowerCase());
      if (!acceptedTypes.some(type => fileExtension === type || type === '.*')) {
        errors.push(`${file.name}: неподдерживаемый формат`);
        continue;
      }
    }

    // Проверка размера
    if (maxFileSize && file.size > maxFileSize) {
      errors.push(`${file.name}: слишком большой (${formatFileSize(file.size)})`);
      continue;
    }

    // Проверка дубликатов
    if (selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
      errors.push(`${file.name}: файл уже добавлен`);
      continue;
    }

    validFiles.push(file);
  }

  return { validFiles, errors };
};

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Input,
  IconButton,
  Checkbox,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Icon } from '../UI/Icon/Icon';
import Frame from '../UI/Frame/Frame';
import { processFiles, formatFileSize } from '@/utils/ParserFiles/modalUtils';
import { IGNORE_DIRS } from '@/utils/ParserFiles/consts';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface FileImportProps {
  onConfirm: (files: File[], clearMode: boolean) => void;
  acceptedFileTypes?: string | null;
  maxFileSize?: number | null;
  maxFiles?: number | null;
  visibleFilesCount?: number;
  isLoading?: boolean;
  title?: string;
  description?: string;
  closeModal: () => void;
  extraIgnoredDirs?: string[];
}

type FileNode = {
  __file?: File;
  __children?: Record<string, FileNode>;
};

const ModalImportFiles: React.FC<FileImportProps> = ({
  onConfirm,
  acceptedFileTypes = null,
  maxFileSize = null,
  maxFiles = null,
  visibleFilesCount = 2,
  isLoading = false,
  title = 'Импорт файлов',
  description = 'Перетащите файлы/папку сюда или выберите',
  closeModal,
  extraIgnoredDirs = [],
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [ignoredDirs, setIgnoredDirs] = useState<string[]>([
    ...IGNORE_DIRS,
    ...extraIgnoredDirs,
  ]);
  const [newIgnoredDir, setNewIgnoredDir] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [clearMode, setClearMode] = useState(true);

  // --- Build tree ---
  const buildFolderTree = (files: File[]) => {
    const tree: Record<string, any> = {};

    files.forEach((file) => {
      const path = (file as any).webkitRelativePath || file.name;
      const parts = path.split('/');
      let current = tree;

      parts.forEach((part, idx) => {
        const isFile = idx === parts.length - 1;
        if (!current[part]) {
          current[part] = isFile
            ? { __file: file } // файл
            : { __children: {} }; // папка
        }
        if (!isFile) current = current[part].__children;
      });
    });

    return tree;
  };

  const getNodeByPath = (tree: Record<string, FileNode>, folderPath: string): FileNode | null => {
    if (!folderPath) return null;
    const parts = folderPath.split('/').filter(Boolean);

    let node: FileNode | undefined = { __children: tree };
    for (const part of parts) {
      node = node?.__children?.[part];
      if (!node) return null;
    }
    return node;
  };

  const collectAffectedPaths = (node: FileNode, basePath: string): string[] => {
    if (!node) return [];
    const acc: string[] = [basePath];

    if (node.__file) return acc;

    const children = node.__children ?? {};
    for (const [key, child] of Object.entries(children) as [string, FileNode][]) {
      const childPath = `${basePath}/${key}`;
      if (child.__children) {
        acc.push(...collectAffectedPaths(child, childPath));
      } else if (child.__file) {
        acc.push(childPath);
      }
    }
    return acc;
  };


  // ✅ Правильное переключение состояния для папки (включая саму себя)
  const toggleFolder = (folderPath: string, checked: boolean) => {
    const node = getNodeByPath(folderTree, folderPath);
    if (!node || !node.__children) return; // защита: не папка / не найдено

    const affected = collectAffectedPaths(node, folderPath);

    setIgnoredDirs(prev => {
      const s = new Set(prev);
      if (checked) {
        // включить → удалить из ignored
        affected.forEach(p => s.delete(p));
      } else {
        // выключить → добавить в ignored
        affected.forEach(p => s.add(p));
      }
      return Array.from(s);
    });
  };



  const renderTree = (tree: Record<string, any>, parentPath = '') => {
    // Сначала сортируем: папки → файлы, внутри по алфавиту
    const sortedEntries = Object.entries(tree).sort(([aKey, aVal], [bKey, bVal]) => {
      const aIsFolder = !!aVal.__children;
      const bIsFolder = !!bVal.__children;

      if (aIsFolder && !bIsFolder) return -1; // папка выше файла
      if (!aIsFolder && bIsFolder) return 1;  // файл ниже папки
      return aKey.localeCompare(bKey, 'ru');  // алфавитная сортировка
    });

    return sortedEntries.map(([key, value]) => {
      const path = parentPath ? `${parentPath}/${key}` : key;

      // --- Если это файл ---
      if (value.__file) {
        const file: File = value.__file;
        const checked = !ignoredDirs.includes(path);

        return (
          <TreeItem
            key={path}
            itemId={path}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={(e) => {
                    e.stopPropagation()
                    setIgnoredDirs((prev) =>
                      e.target.checked
                        ? prev.filter((d) => d !== path)
                        : [...prev, path],
                    )
                  }}
                />
                <Typography noWrap title={file.name}>
                  {file.name} ({formatFileSize(file.size)})
                </Typography>
              </Box>
            }
          />
        );
      }

      // --- Если это папка ---
      const checked = !ignoredDirs.includes(path);
      return (
        <TreeItem
          key={path}
          itemId={path}
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                size="small"
                checked={checked}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleFolder(path, e.target.checked);
                }}
              />
              <Typography variant="body2">{key}</Typography>
            </Box>
          }
        >
          {renderTree(value.__children, path)}
        </TreeItem>
      );
    });
  };



  // --- File handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const result = await processFiles(files, selectedFiles, {
      acceptedFileTypes,
      maxFileSize,
      maxFiles,
      ignoredDirs,
    });
    setSelectedFiles((prev) => [...prev, ...result.validFiles]);
    setError(
      result.errors.slice(0, 3).join(', ') +
      (result.errors.length > 3
        ? `... и еще ${result.errors.length - 3}`
        : ''),
    );
  };

  const handleFileInput = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const result = await processFiles(files, selectedFiles, {
      acceptedFileTypes,
      maxFileSize,
      maxFiles,
      ignoredDirs,
    });
    setSelectedFiles((prev) => [...prev, ...result.validFiles]);
    setError(
      result.errors.slice(0, 3).join(', ') +
      (result.errors.length > 3
        ? `... и еще ${result.errors.length - 3}`
        : ''),
    );
    e.target.value = '';
  };

  const handleRemoveAllFiles = () => setSelectedFiles([]);

  const handleConfirm = () => {
    if (selectedFiles.length) {
      const filteredFiles = selectedFiles.filter((file) => {
        const path = (file as any).webkitRelativePath || file.name;
        return !ignoredDirs.some((dir) => path.startsWith(dir));
      });
      onConfirm(filteredFiles, clearMode);
      closeModal();
    }
  };

  const addIgnoredDir = () => {
    const trimmed = newIgnoredDir.trim();
    if (trimmed && !ignoredDirs.includes(trimmed)) {
      setIgnoredDirs((prev) => [...prev, trimmed]);
      setNewIgnoredDir('');
    }
  };

  const folderTree = buildFolderTree(selectedFiles);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Stack direction="column" gap={2}>
      <Stack width="100%" maxHeight="500px" direction="row" gap={2}>
        {/* Левая панель */}
        <Frame width={400} height="500px">
          <Stack spacing={3} p={1} height="100%">
            <Typography variant="h4">{title}</Typography>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                p: 3,
                border: dragOver
                  ? '2px dashed #1976d2'
                  : '2px dashed #e0e0e0',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() =>
                document.getElementById('file-input')?.click()
              }
            >
              <Input
                id="file-input"
                type="file"
                inputProps={{
                  multiple: true,
                  webkitdirectory: 'true' as any,
                  directory: 'true' as any,
                  accept: acceptedFileTypes || undefined,
                }}
                onChange={handleFileInput}
                sx={{ display: 'none' }}
              />
              <Icon icon="upload" sx={{ fontSize: 40, mb: 1 }} />
              <Typography>{description}</Typography>
              <Typography variant="caption" color="text.secondary">
                {acceptedFileTypes
                  ? `Поддерживаемые форматы: ${acceptedFileTypes}`
                  : 'Поддерживаются все форматы'}
              </Typography>
            </Box>

            <Box mt={1}>
              <Typography variant="subtitle2">
                Папки, которые не будут загружаться:
              </Typography>
              <Box
                sx={{
                  maxHeight: 120,
                  overflowY: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  mt: 1,
                }}
              >
                <Stack spacing={1} gap={0.5}>
                  {ignoredDirs.map((dir, idx) => (
                    <Box
                      key={idx}
                      p={0}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">{dir}</Typography>
                      <IconButton size="small">
                        <Icon
                          icon="cross_alt"
                          onClick={() =>
                            setIgnoredDirs((prev) =>
                              prev.filter((d) => d !== dir),
                            )
                          }
                        />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} mt={1}>
                <Input
                  placeholder="Добавить папку"
                  value={newIgnoredDir}
                  onChange={(e) => setNewIgnoredDir(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={addIgnoredDir}
                >
                  Добавить
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Frame>

        {/* Правая панель: дерево файлов */}
        <Frame
          width={400}
          height="500px"
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={1}
          >
            <Typography variant="subtitle2">
              Выбрано файлов: {selectedFiles.length}
            </Typography>
            <Button
              size="small"
              onClick={handleRemoveAllFiles}
              disabled={isLoading}
              color="error"
            >
              Очистить все
            </Button>
          </Stack>

          <Input
            placeholder="Поиск файлов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <Box
            height="100%"
            maxHeight="95%"
            sx={{ flex: 1, overflowY: 'auto' }}
          >
            {isSearching ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                mt={2}
              >
                Загрузка...
              </Typography>
            ) : Object.keys(folderTree).length ? (
              <SimpleTreeView>
                {renderTree(folderTree)}
              </SimpleTreeView>
            ) : (
              <Typography
                textAlign="center"
                color="text.secondary"
                mt={2}
              >
                Нет совпадений
              </Typography>
            )}
          </Box>
        </Frame>
      </Stack>

      <Frame>
        <Stack>
          {error && <Typography color="error">{error}</Typography>}
          <Stack gap={1}>
            <Box sx={{ width: 'max-content' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={clearMode}
                    onChange={(e) =>
                      setClearMode(e.target.checked)
                    }
                  />
                }
                label={'Очистить перед импортом'}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={isLoading || !selectedFiles.length}
            >
              Подтвердить
            </Button>
          </Stack>
        </Stack>
      </Frame>
    </Stack>
  );
};

export default ModalImportFiles;

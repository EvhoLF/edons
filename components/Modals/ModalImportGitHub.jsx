'use client'
import React, { useState } from 'react';
import {
    Stack,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    Link
} from '@mui/material';
import { Icon } from '@/components/UI/Icon/Icon';
import Frame from '@/components/UI/Frame/Frame';

const ModalImportGitHub = ({ onRepoSelect, closeModal }) => {
    const [repoUrl, setRepoUrl] = useState('');
    const [branch, setBranch] = useState('main');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Парсим URL репозитория
    const parseRepoUrl = (url) => {
        if (!url.trim()) return null;

        // Если уже в формате owner/repo (например, из примеров)
        if (!url.includes('://') && url.includes('/')) {
            const parts = url.split('/').filter(part => part.trim());
            if (parts.length >= 2) {
                return { owner: parts[0], repo: parts[1] };
            }
        }

        // Если введен полный URL
        try {
            // Добавляем https:// если нет протокола
            const urlWithProtocol = url.includes('://') ? url : `https://${url}`;
            const urlObj = new URL(urlWithProtocol);

            if (urlObj.hostname === 'github.com') {
                const pathParts = urlObj.pathname.split('/').filter(part => part.trim());
                if (pathParts.length >= 2) {
                    return {
                        owner: pathParts[0],
                        repo: pathParts[1].replace('.git', '')
                    };
                }
            }
        } catch {
            // Если URL некорректный, пробуем парсить как owner/repo
            const parts = url.split('/').filter(part => part.trim());
            if (parts.length >= 2) {
                return { owner: parts[0], repo: parts[1] };
            }
        }

        return null;
    };

    const handleImport = async () => {
        setError('');
        setLoading(true);

        try {
            const repoInfo = parseRepoUrl(repoUrl);

            if (!repoInfo) {
                setError('Неверный формат URL репозитория. Используйте: owner/repo или https://github.com/owner/repo');
                return;
            }
            // Проверяем доступность репозитория БЕЗ авторизации
            const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Репозиторий не найден или не существует');
                } else if (response.status === 403) {
                    setError('Достигнут лимит запросов. Попробуйте позже или авторизуйтесь в GitHub');
                } else {
                    setError(`Ошибка: ${response.status} ${response.statusText}`);
                }
                return;
            }

            const repoData = await response.json();

            // Проверяем, что репозиторий публичный
            if (repoData.private) {
                setError('Это приватный репозиторий. Доступ только к публичным репозиториям');
                return;
            }

            // Получаем информацию о ветке БЕЗ авторизации
            let actualBranch = branch;
            try {
                const branchResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/branches/${branch}`);
                if (!branchResponse.ok) {
                    // Если ветка не найдена, используем основную ветку
                    const defaultBranch = repoData.default_branch || 'main';
                    const defaultBranchResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/branches/${defaultBranch}`);
                    if (defaultBranchResponse.ok) {
                        actualBranch = defaultBranch;
                        setBranch(defaultBranch);
                    } else {
                        throw new Error('Не удалось получить информацию о ветках');
                    }
                }
            } catch (branchError) {
                setError('Не удалось получить информацию о ветке. Убедитесь, что ветка существует');
                return;
            }

            // Передаем минимальные данные, необходимые для загрузки
            onRepoSelect({
                owner: repoInfo.owner,
                name: repoInfo.repo,
                full_name: repoData.full_name,
                default_branch: actualBranch
            });

            closeModal();

        } catch (err) {
            setError('Произошла ошибка при загрузке репозитория: ' + err.message);
            console.error('GitHub import error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleImport();
        }
    };

    const examples = [
        'vercel/next.js',
        'facebook/react',
        'microsoft/vscode'
    ];

    const handleExampleClick = (example) => {
        setRepoUrl(example);
        setBranch('main');
    };

    return (
        <Frame sx={{ width: '400px', maxWidth: '90vw' }} p={2}>
            <Stack spacing={2}>
                <Typography variant="h6" textAlign="center">
                    Импорт из GitHub
                </Typography>

                <TextField
                    fullWidth
                    label="URL репозитория или owner/repo"
                    value={repoUrl}
                    onInput={(e) => setRepoUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="company/project или https://github.com/company/project"
                    helperText="Пример: company/project"
                />

                <TextField
                    fullWidth
                    label="Ветка"
                    value={branch}
                    onInput={(e) => setBranch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="main"
                    helperText="Оставьте main для большинства репозиториев"
                />

                {error && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleImport}
                    disabled={loading || !repoUrl.trim()}
                    startIcon={loading ? <Icon icon="loader" /> : <Icon icon="github" />}
                >
                    {loading ? 'Загрузка...' : 'Импортировать'}
                </Button>

                <Typography variant="caption" textAlign="center" color="text.secondary">
                    ⚠️ Работает с публичными репозиториями
                </Typography>
            </Stack>
        </Frame>
    );
};

export default ModalImportGitHub;
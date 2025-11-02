import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'

const useGithub = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);

  async function fetchGitHub(endpoint, headers = {}, params = {}) {
    const url_params = new URLSearchParams(params);
    
    try {
      const requestHeaders = session?.github_access_token 
        ? { Authorization: `token ${session.github_access_token}`, ...headers }
        : headers;
      
      const response = await fetch(`https://api.github.com/${endpoint}?${url_params}`, {
        headers: requestHeaders,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }
    catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  // Для пользовательских репозиториев (старая версия)
  async function RepoTree(repoOwner, branch = 'main') {
    const branchData = await fetchGitHub(`repos/${repoOwner}/branches/${branch}`);
    const commitSHA = branchData.commit.sha;
    const treeData = await fetchGitHub(`repos/${repoOwner}/git/trees/${commitSHA}`, {}, { recursive: '1' });
    return treeData.tree;
  }

  // Для любых репозиториев (новая версия)
  async function RepoTreeAny(repoOwner, repoName, branch = 'main') {
    const branchData = await fetchGitHub(`repos/${repoOwner}/${repoName}/branches/${branch}`);
    const commitSHA = branchData.commit.sha;
    const treeData = await fetchGitHub(`repos/${repoOwner}/${repoName}/git/trees/${commitSHA}`, {}, { recursive: '1' });
    return treeData.tree;
  }

  async function FileContent(repoOwner, repoName, filePath, branch = 'main') {
    const fileData = await fetchGitHub(`repos/${repoOwner}/${repoName}/contents/${filePath}`, {}, { ref: branch });
    return new TextDecoder("utf-8").decode(Uint8Array.from(atob(fileData.content), c => c.charCodeAt(0)));
  }

  // Для пользовательских репозиториев
  async function RepoTreeContent(repoOwner, branch = 'main') {
    const data = await RepoTree(repoOwner, branch);
    const filePromises = data.map(async (file) => {
      if (file.type !== 'blob') return { ...file, data: null };
      const fileData = await FileContent(repoOwner, null, file.path, branch);
      return { ...file, data: fileData, fileName: file.path.split('/').pop() };
    });
    return await Promise.all(filePromises);
  }

  // Для любых репозиториев
  async function RepoTreeContentAny(repoOwner, repoName, branch = 'main') {
    const data = await RepoTreeAny(repoOwner, repoName, branch);
    const filePromises = data.map(async (file) => {
      if (file.type !== 'blob') return { ...file, data: null };
      const fileData = await FileContent(repoOwner, repoName, file.path, branch);
      return { ...file, data: fileData, fileName: file.path.split('/').pop() };
    });
    return await Promise.all(filePromises);
  }

  useEffect(() => {
    if (session?.github_access_token) {
      const fetchRepos = async () => {
        const get_repos = await fetchGitHub(`user/repos`);
        setRepos(get_repos);
      };
      fetchRepos();
    }
  }, [session]);

  return { 
    repos, 
    GitFetchs: { 
      fetchGitHub, 
      RepoTree, 
      RepoTreeAny,
      FileContent, 
      RepoTreeContent,
      RepoTreeContentAny
    } 
  }
}

export default useGithub;
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'

const useGithub = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);

  async function fetchGitHub(endpoint, headers = {}, params = {}) {
    const url_params = new URLSearchParams(params);
    try {
      const response = await fetch(`https://api.github.com/${endpoint}?${url_params}`, {
        headers: { Authorization: `token ${session.github_access_token}`, ...headers },
      });
      return await response.json();
    }
    catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  async function RepoTree(repoOwner, branch = 'main') {
    const branchData = await fetchGitHub(`repos/${repoOwner}/branches/${branch}`);
    const commitSHA = branchData.commit.sha;
    const treeData = await fetchGitHub(`repos/${repoOwner}/git/trees/${commitSHA}?recursive=1`);
    return treeData.tree;
  }

  async function FileContent(repoOwner, filePath, branch = 'main') {
    const fileData = await fetchGitHub(`repos/${repoOwner}/contents/${filePath}`, {}, { ref: branch });
    return new TextDecoder("utf-8").decode(Uint8Array.from(atob(fileData.content), c => c.charCodeAt(0)));
  }

  async function RepoTreeContent(repoOwner, branch = 'main') {
    const data = await RepoTree(repoOwner, branch);
    const filePromises = data.map(async (file) => {
      if (file.type !== 'blob') return { ...file, data: null };
      const fileData = await FileContent(repoOwner, file.path, branch);
      return { ...file, data: fileData, fileName: file.path.split('/').pop() };
    });
    return await Promise.all(filePromises);
  }

  useEffect(() => {
    if (session) {
      const fetchRepos = async () => {
        const get_repos = await fetchGitHub(`user/repos`);
        setRepos(get_repos);
        // console.log(get_repos);
      };
      fetchRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return { repos, GitFetchs: { fetchGitHub, RepoTree, FileContent, RepoTreeContent } }
}

export default useGithub
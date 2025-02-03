import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'

const useGithub = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);

  const auth = {
    signOut: () => signOut(),
    signIn: () => signIn('github'),
  }

  async function fetchGitHub(endpoint, headers = {}, params = {}) {
    const url_params = new URLSearchParams(params);
    try {
      const response = await fetch(`https://api.github.com/${endpoint}?${url_params}`, {
        headers: { Authorization: `token ${session.user.access_token}`, ...headers },
      });
      return await response.json();
    }
    catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  async function RepoTree(repoOwner, repoName, branch = 'main') {
    const branchData = await fetchGitHub(`repos/${repoOwner}/${repoName}/branches/${branch}`);
    const commitSHA = branchData.commit.sha;
    const treeData = await fetchGitHub(`repos/${repoOwner}/${repoName}/git/trees/${commitSHA}?recursive=1`);
    return treeData.tree;
  }

  async function FileContent(repoOwner, repoName, filePath, branch = 'main') {
    const fileData = await fetchGitHub(`repos/${repoOwner}/${repoName}/contents/${filePath}`, {}, { ref: branch });
    return new TextDecoder("utf-8").decode(Uint8Array.from(atob(fileData.content), c => c.charCodeAt(0)));
  }

  async function RepoTreeContent(repoOwner, repoName, branch = 'main') {
    const data = await RepoTree(repoOwner, repoName, branch);
    console.log(data);

    const filePromises = data.map(async (file) => {
      if (file.type !== 'blob') return { ...file, data: null };
      const fileData = await FileContent(repoOwner, repoName, file.path, branch);
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

  return { session, auth, repos, fetchGitHub: { fetch: fetchGitHub, RepoTree, FileContent, RepoTreeContent } }
}

export default useGithub
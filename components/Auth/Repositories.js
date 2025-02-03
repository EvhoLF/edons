'use client'
import useGithub from '@/hooks/useGithub';
import Button from '../UI/Button/Button';
import { ParseGitInNode } from '@/utils/Nodes/ParseGitInNode';

export default function Repositories() {
  const { session, repos, fetchRepoTree, fetchFileContent } = useGithub();

  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Repositories</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>

      <Button onClick={async () => {
        const data = await fetchRepoTree(session.user.username, repos[2].name, 'main');
        const filePromises = data.map(async (file) => {
          if (file.type !== 'blob') return { ...file, data: null };
          const fileData = await fetchFileContent(session.user.username, repos[2].name, file.path);
          return { ...file, data: fileData, fileName: path.split('/').pop() };
        });
        const updatedData = await Promise.all(filePromises);
        const nodes = await ParseGitInNode(updatedData);
        console.log(updatedData);
        console.log(nodes);

      }}>
        Get Rep
      </Button>
    </div >
  );
}

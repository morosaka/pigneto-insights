import { getPastIssues, getAllStories } from '@/lib/api';
import { LibraryPage } from '@/components/LibraryPage';

export default async function Library() {
  const [issues, stories] = await Promise.all([
    getPastIssues(30).catch(() => []),
    getAllStories().catch(() => []),
  ]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--avorio)' }}>
      <LibraryPage issues={issues} stories={stories} />
    </main>
  );
}

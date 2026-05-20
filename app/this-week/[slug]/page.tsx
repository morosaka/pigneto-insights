import { notFound } from 'next/navigation';
import {
  getIssueBySlug,
  getIssueShorts,
  getIssueDiscoveryPlaces,
  getIssueDiscoveryEvergreen,
  getCurrentDeepRead,
} from '@/lib/api';
import { IssueView } from '@/components/IssueView';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;

  const issue = await getIssueBySlug(slug).catch(() => null);
  if (!issue) notFound();

  const [shorts, discoveryPlaces, discoveryEvergreen, deepRead] = await Promise.all([
    getIssueShorts(issue.id).catch(() => []),
    getIssueDiscoveryPlaces(issue.id).catch(() => []),
    getIssueDiscoveryEvergreen(issue.id).catch(() => []),
    getCurrentDeepRead().catch(() => null),
  ]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--avorio)' }}>
      <IssueView
        issue={issue}
        shorts={shorts}
        deepRead={deepRead}
        discoveryPlaces={discoveryPlaces}
        discoveryEvergreen={discoveryEvergreen}
        standalone
      />
    </main>
  );
}

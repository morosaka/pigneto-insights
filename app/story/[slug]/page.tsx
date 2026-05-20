import { notFound } from 'next/navigation';
import { getStoryBySlug } from '@/lib/api';
import { StoryDetailPage } from '@/components/StoryDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug).catch(() => null);
  if (!story) notFound();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--avorio)' }}>
      <StoryDetailPage story={story} />
    </main>
  );
}

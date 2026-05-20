'use client';
import type { WeeklyIssue, IssueShort, Story, Place, EvergreenItem } from '@/lib/types';
import { IssueView } from '@/components/IssueView';

interface Props {
  currentIssue: WeeklyIssue | null;
  shorts: IssueShort[];
  deepRead: Story | null;
  discoveryPlaces: Place[];
  discoveryEvergreen: EvergreenItem[];
}

export function HomeTab({ currentIssue, shorts, deepRead, discoveryPlaces, discoveryEvergreen }: Props) {
  if (!currentIssue) {
    return (
      <div style={{
        minHeight: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--avorio)', padding: '0 32px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 26, color: 'var(--ciocco)', textAlign: 'center', lineHeight: 1.3, marginBottom: 14,
        }}>
          Pigneto Insights
        </div>
        <p style={{ fontSize: 14, color: 'var(--terra)', fontFamily: 'var(--font-sans)', textAlign: 'center', lineHeight: 1.5 }}>
          The weekly editorial is on its way. Explore the neighbourhood in the meantime.
        </p>
      </div>
    );
  }

  return (
    <IssueView
      issue={currentIssue}
      shorts={shorts}
      deepRead={deepRead}
      discoveryPlaces={discoveryPlaces}
      discoveryEvergreen={discoveryEvergreen}
    />
  );
}

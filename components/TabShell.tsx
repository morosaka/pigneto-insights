'use client';
import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

const NAV_H = 'calc(66px + env(safe-area-inset-bottom, 0px))';

interface Props {
  tabs: ReactNode[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabShell({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Each tab is stacked absolutely — no transform on any ancestor,
          so position:fixed overlays (EvergreenDetail, PlaceDetail, etc.)
          always position relative to the real viewport. */}
      {tabs.map((tab, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            bottom: NAV_H,
            overflowY: 'auto',
            overflowX: 'hidden',
            visibility: i === activeTab ? 'visible' : 'hidden',
            pointerEvents: i === activeTab ? 'auto' : 'none',
          }}
        >
          {tab}
        </div>
      ))}

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

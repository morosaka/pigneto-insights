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
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          bottom: NAV_H,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: `${tabs.length * 100}%`,
            height: '100%',
            transform: `translateX(-${(activeTab / tabs.length) * 100}%)`,
            transition: 'transform 0.3s ease',
          }}
        >
          {tabs.map((tab, i) => (
            <div
              key={i}
              style={{
                width: `${100 / tabs.length}%`,
                flexShrink: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

'use client';

// ︎ (VS15) forces text presentation on iOS Safari, preventing emoji color override
const TABS = [
  { glyph: '⚜︎', label: 'Home' },
  { glyph: '♨︎', label: 'Eat & Drink' },
  { glyph: '✛︎', label: 'Essentials' },
  { glyph: '✶︎', label: 'Discover' },
];

interface Props {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="bottom-nav">
      {TABS.map((tab, i) => (
        <button
          key={i}
          onClick={() => onTabChange(i)}
          className={`nav-btn${i === activeTab ? ' active' : ''}`}
        >
          <span className="nav-glyph">{tab.glyph}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

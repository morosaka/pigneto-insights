'use client';

// ︎ (VS15) forces text presentation on iOS Safari, preventing emoji color override
const TABS = [
  { glyph: '⚜︎', label: 'Home',       glyphSize: 33 },
  { glyph: '♨︎', label: 'Eat & Drink', glyphSize: 24 },
  { glyph: '✛︎', label: 'Essentials',  glyphSize: 27 },
  { glyph: '✶︎', label: 'Discover',    glyphSize: 30 },
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
          <span className="nav-glyph" style={{ fontSize: tab.glyphSize, transform: 'translateY(-3px)' }}>{tab.glyph}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

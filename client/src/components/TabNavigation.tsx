import { TabType } from '@/types/game';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'adventure', label: 'ADVENTURE' },
  { id: 'character', label: 'CHARACTER' },
  { id: 'inventory', label: 'INVENTORY' },
  { id: 'equipment', label: 'EQUIPMENT' },
  { id: 'spells', label: 'SPELLS' },
  { id: 'settings', label: 'SETTINGS' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-700 mb-4 overflow-x-auto custom-scrollbar-x">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`main-tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

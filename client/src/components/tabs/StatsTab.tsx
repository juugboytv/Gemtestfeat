import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GameState } from '@/../../shared/schema';

interface StatsTabProps {
  gameState: GameState;
}

export default function StatsTab({ gameState }: StatsTabProps) {
  const [openSection, setOpenSection] = useState<string>('attributes');

  const sections = [
    {
      id: 'attributes',
      title: 'Attributes',
      stats: [
        { icon: '💪', name: 'Strength', value: 10 },
        { icon: '🏃', name: 'Dexterity', value: 10 },
        { icon: '🧠', name: 'Intelligence', value: 10 },
        { icon: '❤️', name: 'Vitality', value: 10 },
        { icon: '🔮', name: 'Wisdom', value: 10 },
      ]
    },
    {
      id: 'combat',
      title: 'Combat Stats',
      stats: [
        { icon: '⚔️', name: 'Weapon Class', value: 0 },
        { icon: '🛡️', name: 'Armor Class', value: 0 },
        { icon: '📚', name: 'Spell Class', value: 0 },
        { icon: '🎯', name: 'Hit Chance', value: '100%' },
        { icon: '💥', name: 'Critical Chance', value: '5%' },
        { icon: '🌪️', name: 'Dodge Chance', value: '10%' },
      ]
    },
    {
      id: 'character',
      title: 'Character Info',
      stats: [
        { icon: '📊', name: 'Level', value: gameState.player.level },
        { icon: '⭐', name: 'Experience', value: gameState.player.experience.toLocaleString() },
        { icon: '🏆', name: 'Next Level', value: '1000' },
        { icon: '💰', name: 'Gold', value: gameState.player.gold.toLocaleString() },
        { icon: '🗺️', name: 'Current Zone', value: gameState.player.currentZone },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? '' : sectionId);
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Character Stats</h2>
      
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="stat-accordion-item">
            <button
              onClick={() => toggleSection(section.id)}
              className="stat-accordion-header w-full text-left"
            >
              <h3 className="font-orbitron">{section.title}</h3>
              <ChevronRight 
                className={`accordion-arrow w-5 h-5 transition-transform ${
                  openSection === section.id ? 'rotate-90' : ''
                }`} 
              />
            </button>
            <div 
              className={`stat-accordion-content ${
                openSection === section.id ? 'max-h-[500px] p-4' : 'max-h-0 p-0'
              }`}
            >
              <div className="space-y-3">
                {section.stats.map((stat, index) => (
                  <div key={index} className="stat-line">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-name text-gray-300">{stat.name}</span>
                    <span className="stat-value">{stat.value}</span>
                    {section.id === 'attributes' && (
                      <button className="attr-btn">+</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Available Points</h3>
        <div className="text-center">
          <div className="text-2xl font-orbitron text-white">0</div>
          <div className="text-sm text-gray-400">Attribute Points</div>
        </div>
      </div>
    </div>
  );
}
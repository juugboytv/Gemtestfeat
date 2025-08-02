interface SpellsTabProps {
  knownSpells: string[];
}

export function SpellsTab({ knownSpells }: SpellsTabProps) {
  const availableSpells = [
    { id: 'fireball', name: 'Fireball', description: 'Deals fire damage', levelReq: 5, locked: true },
    { id: 'heal', name: 'Heal', description: 'Restores health', levelReq: 1, locked: false },
    { id: 'lightning', name: 'Lightning', description: 'Deals lightning damage', levelReq: 10, locked: true }
  ];

  return (
    <div className="glass-panel p-4 rounded-lg h-full">
      <h2 className="font-orbitron text-lg mb-4">Spells & Abilities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Known Spells */}
        <div>
          <h3 className="font-orbitron text-base mb-3">Known Spells</h3>
          <div className="space-y-2">
            {knownSpells.map(spellId => {
              const spell = availableSpells.find(s => s.id === spellId);
              if (!spell) return null;
              
              return (
                <div key={spellId} className="p-3 bg-black bg-opacity-30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>{spell.name}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-exp)' }}>
                      MP: 5
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {spell.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Spells */}
        <div>
          <h3 className="font-orbitron text-base mb-3">Available Spells</h3>
          <div className="space-y-2">
            {availableSpells
              .filter(spell => !knownSpells.includes(spell.id))
              .map(spell => (
                <div 
                  key={spell.id} 
                  className={`p-3 bg-black bg-opacity-20 rounded-lg ${
                    spell.locked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{spell.name}</span>
                    <span className="text-xs text-gray-500">
                      {spell.locked ? 'Locked' : 'Available'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {spell.locked ? `Requires Level ${spell.levelReq}` : spell.description}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

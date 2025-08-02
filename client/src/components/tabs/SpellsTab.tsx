import { GameState } from '@/../../shared/schema';

interface SpellsTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function SpellsTab({ gameState, updateGameState }: SpellsTabProps) {
  const spells = [
    {
      id: 'fireball',
      name: 'Fireball',
      damage: '25-35',
      manaCost: 15,
      cooldown: 3,
      description: 'Launch a fiery projectile at your enemy',
      unlocked: true,
      icon: '🔥'
    },
    {
      id: 'heal',
      name: 'Heal',
      healing: '30-50',
      manaCost: 20,
      cooldown: 5,
      description: 'Restore health to yourself',
      unlocked: true,
      icon: '💚'
    },
    {
      id: 'lightning',
      name: 'Lightning Bolt',
      damage: '40-60',
      manaCost: 25,
      cooldown: 4,
      description: 'Strike with electric fury',
      unlocked: gameState.player.level >= 5,
      icon: '⚡'
    },
    {
      id: 'freeze',
      name: 'Ice Shard',
      damage: '20-30',
      manaCost: 18,
      cooldown: 3,
      description: 'Slow and damage your enemy',
      unlocked: gameState.player.level >= 8,
      icon: '❄️'
    }
  ];

  const handleCastSpell = (spellId: string) => {
    const spell = spells.find(s => s.id === spellId);
    if (!spell || !spell.unlocked) return;

    // Check if player has enough mana (using health as placeholder for mana)
    const currentMana = gameState.player.health; // Using health for now
    if (currentMana < spell.manaCost) {
      console.log('Not enough mana!');
      return;
    }

    // Cast spell logic - temporarily using health for mana system
    console.log(`Casting ${spell.name} for ${spell.manaCost} mana`);
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Spells & Magic</h2>
      
      {/* Player Mana */}
      <div className="glass-panel p-3 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Mana</span>
          <span className="text-sm text-blue-400">{gameState.player.health} / {gameState.player.maxHealth}</span>
        </div>
        <div className="progress-bar-track h-2">
          <div 
            className="progress-bar-fill bg-blue-500" 
            style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
          />
        </div>
      </div>

      {/* Spell Grid */}
      <div className="grid grid-cols-2 gap-3">
        {spells.map((spell) => (
          <div 
            key={spell.id}
            className={`glass-panel p-4 rounded-lg cursor-pointer transition-all ${
              spell.unlocked 
                ? 'hover:border-orange-500/50 hover:bg-orange-500/5' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handleCastSpell(spell.id)}
          >
            <div className="text-center mb-2">
              <div className="text-2xl mb-1">{spell.icon}</div>
              <h3 className="font-orbitron text-sm text-orange-400">{spell.name}</h3>
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              {spell.damage && (
                <div>Damage: <span className="text-red-400">{spell.damage}</span></div>
              )}
              {spell.healing && (
                <div>Healing: <span className="text-green-400">{spell.healing}</span></div>
              )}
              <div>Mana: <span className="text-blue-400">{spell.manaCost}</span></div>
              <div>Cooldown: <span className="text-yellow-400">{spell.cooldown}s</span></div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {spell.description}
            </div>
            
            {!spell.unlocked && (
              <div className="text-xs text-red-400 mt-2">
                Requires Level {spell.id === 'lightning' ? '5' : '8'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Spell Book Info */}
      <div className="mt-4 glass-panel p-3 rounded-lg">
        <h3 className="font-orbitron text-sm mb-2 text-orange-400">Spell Knowledge</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div>• Higher levels unlock more powerful spells</div>
          <div>• Mana regenerates slowly over time</div>
          <div>• Spell damage scales with Intelligence</div>
          <div>• Some spells have special effects</div>
        </div>
      </div>
    </div>
  );
}
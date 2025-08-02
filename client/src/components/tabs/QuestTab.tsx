import { GameState } from '@/../../shared/schema';

interface QuestTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function QuestTab({ gameState, updateGameState }: QuestTabProps) {
  const dailyQuests = [
    {
      id: 'kill_goblins',
      title: 'Daily: Goblin Slayer',
      objective: 'Defeat 10 Goblins',
      progress: 5,
      required: 10,
      rewards: { xp: 100, gold: 50 },
      completed: false
    },
    {
      id: 'collect_ore',
      title: 'Daily: Mineral Collector',
      objective: 'Collect 5 Iron Ore',
      progress: 2,
      required: 5,
      rewards: { xp: 75, gold: 30 },
      completed: false
    },
    {
      id: 'cast_spells',
      title: 'Daily: Spellcaster',
      objective: 'Cast 15 Spells',
      progress: 15,
      required: 15,
      rewards: { xp: 125, gold: 75 },
      completed: true
    }
  ];

  const weeklyQuests = [
    {
      id: 'boss_weekly',
      title: 'Weekly: Dragon Slayer',
      objective: 'Defeat the Ancient Dragon',
      progress: 0,
      required: 1,
      rewards: { xp: 1000, gold: 500, item: 'Dragon Scale Armor' },
      completed: false
    }
  ];

  const questStreak = 7;

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Quest Log</h2>
      
      {/* Daily Quests */}
      <div className="mb-6">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Daily Quests</h3>
        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <div key={quest.id} className="quest-item">
              <div className="quest-title">
                {quest.title}
                {quest.completed && <span className="ml-2 text-green-400">✓</span>}
              </div>
              <div className="quest-objective">{quest.objective}</div>
              <div className="text-sm text-gray-400 mb-2">
                Progress: {quest.progress}/{quest.required}
              </div>
              <div className="progress-bar-track h-2 mb-2">
                <div 
                  className="progress-bar-fill bg-orange-500" 
                  style={{ width: `${(quest.progress / quest.required) * 100}%` }}
                />
              </div>
              <div className="quest-rewards">
                Rewards: 
                <span className="quest-reward-xp ml-1">+{quest.rewards.xp} XP</span>
                <span className="quest-reward-gold ml-2">+{quest.rewards.gold}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div className="mb-6">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Weekly Quests</h3>
        <div className="space-y-3">
          {weeklyQuests.map((quest) => (
            <div key={quest.id} className="quest-item">
              <div className="quest-title">
                {quest.title}
                {quest.completed && <span className="ml-2 text-green-400">✓</span>}
              </div>
              <div className="quest-objective">{quest.objective}</div>
              <div className="text-sm text-gray-400 mb-2">
                Progress: {quest.progress}/{quest.required}
              </div>
              <div className="progress-bar-track h-2 mb-2">
                <div 
                  className="progress-bar-fill bg-red-500" 
                  style={{ width: `${(quest.progress / quest.required) * 100}%` }}
                />
              </div>
              <div className="quest-rewards">
                Rewards: 
                <span className="quest-reward-xp ml-1">+{quest.rewards.xp} XP</span>
                <span className="quest-reward-gold ml-2">+{quest.rewards.gold}g</span>
                {quest.rewards.item && (
                  <span className="ml-2 text-purple-400">{quest.rewards.item}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Streak */}
      <div className="quest-streak-panel">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Quest Streak</h3>
        <div className="quest-streak-value">{questStreak}</div>
        <div className="text-sm text-gray-400">Days Completed</div>
        <div className="mt-3 text-xs text-gray-500">
          Bonus: +{questStreak * 5}% XP from all sources
        </div>
      </div>

      {/* Quest Pool Info */}
      <div className="mt-4 glass-panel p-3 rounded-lg">
        <h4 className="font-orbitron text-sm mb-2 text-orange-400">Available Quest Pool</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <div className="quest-pool-item">• Monster Hunting (Daily)</div>
          <div className="quest-pool-item">• Resource Gathering (Daily)</div>
          <div className="quest-pool-item">• Spell Casting (Daily)</div>
          <div className="quest-pool-item">• Boss Challenges (Weekly)</div>
        </div>
      </div>
    </div>
  );
}
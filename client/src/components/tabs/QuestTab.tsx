import { GameState } from '@/../../shared/schema';

interface QuestTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function QuestTab({ gameState, updateGameState }: QuestTabProps) {
  const handleClaimRewards = () => {
    // Update player with quest rewards
    updateGameState({
      player: {
        ...gameState.player,
        questStreak: 0,
        questPool: { xp: 0, gold: 0, items: [] }
      }
    });
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Quest Log</h2>
      
      {/* Active Quests */}
      <div className="mb-6">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Active Quests</h3>
        {gameState.player.activeQuests.length === 0 ? (
          <div className="glass-panel p-4 rounded-lg text-center text-gray-500">
            No active quests. Level up to find new adventures!
          </div>
        ) : (
          <div className="space-y-3">
            {gameState.player.activeQuests.map((quest: any, index: number) => (
              <div key={index} className="quest-item">
                <h4 className="quest-title">{quest.name}</h4>
                <p className="quest-objective">
                  Objective: {quest.objective?.type} a {quest.objective?.monster} in {quest.objective?.zone}
                </p>
                <div className="quest-rewards">
                  Rewards: 
                  <span className="quest-reward-xp ml-2">{quest.rewards?.xp?.toLocaleString()} XP</span>, 
                  <span className="quest-reward-gold ml-1">{quest.rewards?.gold?.toLocaleString()} Gold</span>
                  {quest.rewards?.item && <span>, and a special item!</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quest Streak */}
      <div className="quest-streak-panel">
        <h3 className="font-orbitron text-lg">Quest Streak</h3>
        <div className="quest-streak-value text-center my-4">
          {gameState.player.questStreak} (+{gameState.player.questStreak * 10}%)
        </div>
        
        <div className="mt-4">
          <h4 className="font-bold text-gray-300 mb-2">Reward Pool</h4>
          <div className="space-y-1 text-sm">
            <p className="quest-pool-item">
              <span className="quest-reward-xp">
                {Math.floor(gameState.player.questPool.xp * (1 + gameState.player.questStreak * 0.1)).toLocaleString()} XP
              </span>
            </p>
            <p className="quest-pool-item">
              <span className="quest-reward-gold">
                {Math.floor(gameState.player.questPool.gold * (1 + gameState.player.questStreak * 0.1)).toLocaleString()} Gold
              </span>
            </p>
            <p className="quest-pool-item text-gray-400">
              {gameState.player.questPool.items.length} items
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleClaimRewards}
          className={`glass-button w-full py-2 mt-4 rounded-md font-orbitron ${
            gameState.player.questStreak === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={gameState.player.questStreak === 0}
        >
          Claim Rewards
        </button>
      </div>

      {/* Quest Guide */}
      <div className="mt-6 glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Quest Guide</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p>• Complete quests to build your streak</p>
          <p>• Higher streaks give better reward multipliers</p>
          <p>• Claim rewards to reset your streak</p>
          <p>• New quests unlock as you level up</p>
        </div>
      </div>
    </div>
  );
}
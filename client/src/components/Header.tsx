import { Player } from '@shared/schema';

interface HeaderProps {
  player: Player;
  currentZone: string;
  onTeleportClick: () => void;
}

export function Header({ player, currentZone, onTeleportClick }: HeaderProps) {
  const healthPercent = (player.health / player.maxHealth) * 100;

  return (
    <div className="glass-panel p-3 m-2 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Level</div>
            <div className="font-orbitron text-lg" style={{ color: 'var(--text-primary)' }}>
              {player.level}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-orbitron text-xl" style={{ color: 'var(--highlight-orange)' }}>
              {player.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="progress-bar-track h-2 flex-1">
                <div 
                  className="progress-bar-fill h-full"
                  style={{ 
                    width: `${healthPercent}%`,
                    backgroundColor: 'var(--hp-color)'
                  }}
                />
              </div>
              <span 
                className="text-xs text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                {player.health}/{player.maxHealth}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-gold)' }}>Gold</div>
            <div className="font-orbitron">{player.gold}</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-exp)' }}>EXP</div>
            <div className="font-orbitron">{player.experience}</div>
          </div>
          <button 
            className="teleport-trigger-btn" 
            onClick={onTeleportClick}
            title="Teleport"
          >
            🌀
          </button>
        </div>
      </div>
    </div>
  );
}

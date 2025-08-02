import { StatInfo } from '@/types/game';

interface StatInfoModalProps {
  isOpen: boolean;
  statInfo: StatInfo | null;
  onClose: () => void;
}

export function StatInfoModal({ isOpen, statInfo, onClose }: StatInfoModalProps) {
  if (!isOpen || !statInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="glass-panel border border-orange-500 p-6 rounded-lg max-w-xs text-center">
        <h3 className="font-orbitron text-lg mb-2">{statInfo.title}</h3>
        <p className="mb-4">{statInfo.description}</p>
        <button className="glass-button px-4 py-2 rounded-lg" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

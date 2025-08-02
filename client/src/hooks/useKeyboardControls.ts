import { useEffect } from 'react';
import { Direction } from '@/types/game';

interface UseKeyboardControlsProps {
  onMove: (direction: Direction) => void;
  onInteract: () => void;
}

export function useKeyboardControls({ onMove, onInteract }: UseKeyboardControlsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          onMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          onMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          onMove('right');
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          onInteract();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onMove, onInteract]);
}

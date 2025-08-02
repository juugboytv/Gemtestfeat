import { useEffect, useState } from 'react';
import { ToastMessage } from '@/types/game';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  useEffect(() => {
    toasts.forEach(toast => {
      if (!visibleToasts.includes(toast.id)) {
        setVisibleToasts(prev => [...prev, toast.id]);
        
        setTimeout(() => {
          setVisibleToasts(prev => prev.filter(id => id !== toast.id));
          setTimeout(() => onRemove(toast.id), 500);
        }, 3000);
      }
    });
  }, [toasts, visibleToasts, onRemove]);

  return (
    <>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-notification toast-${toast.type} ${
            visibleToasts.includes(toast.id) ? 'show' : ''
          }`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </>
  );
}

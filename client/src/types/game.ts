export type TabType = 'adventure' | 'character' | 'inventory' | 'equipment' | 'spells' | 'settings';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
  id: string;
}

export type AttributeType = 'strength' | 'agility' | 'intelligence' | 'vitality';

export interface StatInfo {
  title: string;
  description: string;
}

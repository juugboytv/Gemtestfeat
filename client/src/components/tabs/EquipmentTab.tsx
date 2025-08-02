interface EquipmentTabProps {
  equipment: Record<string, any>;
  gems: Record<string, any>;
}

export function EquipmentTab({ equipment, gems }: EquipmentTabProps) {
  const equipmentSlots = [
    { id: 'weapon', icon: '⚔️', name: 'Weapon' },
    { id: 'armor', icon: '🛡️', name: 'Armor' },
    { id: 'helmet', icon: '⛑️', name: 'Helmet' },
    { id: 'accessory', icon: '💍', name: 'Accessory' }
  ];

  const gemSlots = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="glass-panel p-4 rounded-lg h-full">
      <h2 className="font-orbitron text-lg mb-4">Equipment</h2>
      
      <div className="equipment-grid">
        {equipmentSlots.map(slot => (
          <div key={slot.id} className="equipment-slot-wrapper">
            <div className="equipment-slot-title">
              <span>{slot.icon}</span>
              <span>{slot.name}</span>
            </div>
            <div className="equipment-slot-content" data-slot={slot.id}>
              {equipment[slot.id] ? (
                <div className="flex items-center gap-2">
                  <img 
                    src={equipment[slot.id].image} 
                    alt={equipment[slot.id].name}
                    className="w-8 h-8"
                  />
                  <span className="text-sm">{equipment[slot.id].name}</span>
                </div>
              ) : (
                <span className="text-gray-500">No {slot.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gem Pouch */}
      <div className="mt-6">
        <h3 className="font-orbitron text-base mb-3">Gem Pouch</h3>
        <div className="gem-pouch-grid">
          {gemSlots.map(slot => (
            <div key={slot} className="gem-item" data-gem={slot}>
              {gems[slot] && (
                <img 
                  src={gems[slot].image} 
                  alt={gems[slot].name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InventoryTabProps {
  inventory: Record<string, any>;
}

export function InventoryTab({ inventory }: InventoryTabProps) {
  const inventorySlots = Array.from({ length: 20 }, (_, index) => index);

  return (
    <div className="glass-panel p-4 rounded-lg h-full">
      <h2 className="font-orbitron text-lg mb-4">Inventory</h2>
      
      {/* Inventory Grid */}
      <div className="inventory-grid">
        {inventorySlots.map(slot => (
          <div key={slot} className="inventory-slot" data-slot={slot}>
            {inventory[slot] && (
              <>
                <img 
                  src={inventory[slot].image} 
                  alt={inventory[slot].name}
                />
                <div className="item-label">
                  {inventory[slot].quantity}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

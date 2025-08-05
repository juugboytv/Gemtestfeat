// ===== INVENTORY & EQUIPMENT SYSTEM =====

const InventorySystem = {
    maxSlots: 20,
    selectedSlot: null,
    
    addItem(item, quantity = 1) {
        // Check for existing stackable item
        const existingSlot = gameState.inventory.findIndex(slot => 
            slot && slot.id === item.id && slot.stackable
        );
        
        if (existingSlot !== -1) {
            gameState.inventory[existingSlot].quantity = 
                (gameState.inventory[existingSlot].quantity || 1) + quantity;
        } else {
            // Find empty slot
            const emptySlot = gameState.inventory.findIndex(slot => !slot);
            if (emptySlot !== -1) {
                gameState.inventory[emptySlot] = { ...item, quantity };
            } else {
                showToast("Inventory is full!", true);
                return false;
            }
        }
        
        this.updateInventoryUI();
        return true;
    },
    
    removeItem(slotIndex, quantity = 1) {
        const slot = gameState.inventory[slotIndex];
        if (!slot) return false;
        
        if (slot.quantity > quantity) {
            slot.quantity -= quantity;
        } else {
            gameState.inventory[slotIndex] = null;
        }
        
        this.updateInventoryUI();
        return true;
    },
    
    equipItem(slotIndex) {
        const item = gameState.inventory[slotIndex];
        if (!item || !item.equipSlot) return false;
        
        // Unequip current item in that slot
        const currentEquipped = gameState.equipment[item.equipSlot];
        if (currentEquipped) {
            this.addItem(currentEquipped);
        }
        
        // Equip new item
        gameState.equipment[item.equipSlot] = { ...item };
        this.removeItem(slotIndex, 1);
        
        showToast(`Equipped ${item.name}!`);
        EquipmentManager.renderEquipment();
        return true;
    },
    
    unequipItem(equipSlot) {
        const item = gameState.equipment[equipSlot];
        if (!item) return false;
        
        if (this.addItem(item)) {
            gameState.equipment[equipSlot] = null;
            showToast(`Unequipped ${item.name}!`);
            EquipmentManager.renderEquipment();
            return true;
        }
        
        return false;
    },
    
    updateInventoryUI() {
        InventoryManager.renderInventory();
    },
    
    getItemInfo(item) {
        let info = `<div class="font-bold text-white">${item.name}</div>`;
        info += `<div class="text-gray-400">Tier ${item.tier || 1}</div>`;
        
        if (item.damage) info += `<div class="text-red-400">Damage: ${item.damage}</div>`;
        if (item.defense) info += `<div class="text-blue-400">Defense: ${item.defense}</div>`;
        if (item.description) info += `<div class="text-gray-300 mt-2">${item.description}</div>`;
        
        return info;
    }
};

// Stats system
const StatsManager = {
    renderStats() {
        const container = document.getElementById('tab-content-stats');
        if (!container) return;
        
        container.innerHTML = `
            <div class="space-y-4">
                <div class="text-center">
                    <h3 class="text-lg font-orbitron text-white">Character Statistics</h3>
                    <div class="text-sm text-gray-400">Level ${gameState.player.level} ${gameState.player.name}</div>
                </div>
                
                ${this.renderCoreStats()}
                ${this.renderAttributes()}
                ${this.renderCombatStats()}
            </div>
        `;
    },
    
    renderCoreStats() {
        return `
            <div class="stat-accordion-item">
                <button class="stat-accordion-header w-full">
                    <h3>Core Statistics</h3>
                    <span class="accordion-arrow">▶</span>
                </button>
                <div class="stat-accordion-content">
                    <div class="stat-line">
                        <span class="stat-icon">💗</span>
                        <span class="stat-name">Health</span>
                        <span class="stat-value">${gameState.player.health} / ${gameState.player.maxHealth}</span>
                    </div>
                    <div class="stat-line">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-name">Experience</span>
                        <span class="stat-value">${gameState.player.experience}</span>
                    </div>
                    <div class="stat-line">
                        <span class="stat-icon">🪙</span>
                        <span class="stat-name">Gold (Carried)</span>
                        <span class="stat-value">${gameState.player.gold}</span>
                    </div>
                    <div class="stat-line">
                        <span class="stat-icon">🏛️</span>
                        <span class="stat-name">Gold (Banked)</span>
                        <span class="stat-value">${gameState.player.bankedGold || 0}</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderAttributes() {
        const attrs = gameState.player.attributes;
        return `
            <div class="stat-accordion-item open">
                <button class="stat-accordion-header w-full">
                    <h3>Attributes</h3>
                    <span class="accordion-arrow">▼</span>
                </button>
                <div class="stat-accordion-content">
                    ${Object.entries(attrs).map(([attr, value]) => `
                        <div class="stat-line">
                            <span class="stat-icon">${this.getAttributeIcon(attr)}</span>
                            <span class="stat-name">${this.capitalizeFirst(attr)}</span>
                            <span class="stat-value">${value}</span>
                            <button class="attr-btn" onclick="StatsManager.increaseAttribute('${attr}')"
                                    ${gameState.player.attributePoints <= 0 ? 'disabled' : ''}>+</button>
                        </div>
                    `).join('')}
                    
                    <div class="mt-4 text-center">
                        <div class="text-white">Available Points: ${gameState.player.attributePoints}</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderCombatStats() {
        const totalDamage = this.calculateTotalDamage();
        const totalDefense = this.calculateTotalDefense();
        
        return `
            <div class="stat-accordion-item">
                <button class="stat-accordion-header w-full">
                    <h3>Combat Statistics</h3>
                    <span class="accordion-arrow">▶</span>
                </button>
                <div class="stat-accordion-content">
                    <div class="stat-line">
                        <span class="stat-icon">⚔️</span>
                        <span class="stat-name">Total Damage</span>
                        <span class="stat-value">${totalDamage}</span>
                    </div>
                    <div class="stat-line">
                        <span class="stat-icon">🛡️</span>
                        <span class="stat-name">Total Defense</span>
                        <span class="stat-value">${totalDefense}</span>
                    </div>
                    <div class="stat-line">
                        <span class="stat-icon">💥</span>
                        <span class="stat-name">Critical Hit Chance</span>
                        <span class="stat-value">10%</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    getAttributeIcon(attr) {
        const icons = {
            strength: '💪',
            dexterity: '🏹',
            intelligence: '🧠',
            constitution: '❤️',
            wisdom: '🦉',
            charisma: '🌟'
        };
        return icons[attr] || '📊';
    },
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    increaseAttribute(attr) {
        if (gameState.player.attributePoints > 0) {
            gameState.player.attributes[attr]++;
            gameState.player.attributePoints--;
            this.renderStats();
            showToast(`${this.capitalizeFirst(attr)} increased!`);
        }
    },
    
    calculateTotalDamage() {
        let damage = gameState.player.attributes.strength;
        
        // Add weapon damage
        ['weapon1', 'weapon2'].forEach(slot => {
            const weapon = gameState.equipment[slot];
            if (weapon && weapon.damage) {
                damage += weapon.damage;
            }
        });
        
        return damage;
    },
    
    calculateTotalDefense() {
        let defense = Math.floor(gameState.player.attributes.constitution / 2);
        
        // Add armor defense
        const armor = gameState.equipment.armor;
        if (armor && armor.defense) {
            defense += armor.defense;
        }
        
        return defense;
    }
};

// Item creation and management
const CreationManager = {
    itemTemplates: {
        weapons: [
            { name: 'Iron Sword', damage: 10, tier: 1, equipSlot: 'weapon1' },
            { name: 'Steel Dagger', damage: 8, tier: 1, equipSlot: 'weapon1' },
            { name: 'Magic Staff', damage: 12, tier: 2, equipSlot: 'weapon1' }
        ],
        armor: [
            { name: 'Leather Armor', defense: 5, tier: 1, equipSlot: 'armor' },
            { name: 'Chain Mail', defense: 8, tier: 2, equipSlot: 'armor' },
            { name: 'Plate Armor', defense: 12, tier: 3, equipSlot: 'armor' }
        ],
        consumables: [
            { name: 'Health Potion', description: 'Restores 50 HP', stackable: true },
            { name: 'Mana Potion', description: 'Restores 30 MP', stackable: true }
        ]
    },
    
    init() {
        // Initialize with some starter items
        if (gameState.inventory.length === 0) {
            gameState.inventory = new Array(InventorySystem.maxSlots).fill(null);
            
            // Give starter equipment
            const starterSword = { ...this.itemTemplates.weapons[0], id: 'starter_sword' };
            const starterArmor = { ...this.itemTemplates.armor[0], id: 'starter_armor' };
            
            InventorySystem.addItem(starterSword);
            InventorySystem.addItem(starterArmor);
            InventorySystem.addItem({ ...this.itemTemplates.consumables[0], id: 'health_pot', quantity: 3 });
        }
    },
    
    generateRandomItem(tier = 1) {
        const categories = Object.keys(this.itemTemplates);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const items = this.itemTemplates[category].filter(item => item.tier <= tier);
        
        if (items.length === 0) return null;
        
        const template = items[Math.floor(Math.random() * items.length)];
        return {
            ...template,
            id: `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }
};
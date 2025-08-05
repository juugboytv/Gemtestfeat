// ===== UI MANAGEMENT SYSTEM =====

// Tab system manager
const TabManager = {
    init() {
        const tabButtons = document.querySelectorAll('.main-tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    },
    
    switchTab(tabName) {
        // Hide all panels
        document.querySelectorAll('.main-tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Remove active from all buttons
        document.querySelectorAll('.main-tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected panel
        const targetPanel = document.getElementById(`tab-content-${tabName}`);
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetPanel) targetPanel.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
        
        // Initialize tab-specific content
        this.initTabContent(tabName);
    },
    
    initTabContent(tabName) {
        switch (tabName) {
            case 'equipment':
                EquipmentManager.renderEquipment();
                break;
            case 'inventory':
                InventoryManager.renderInventory();
                break;
            case 'stats':
                StatsManager.renderStats();
                break;
            case 'combat':
                CombatManager.renderCombat();
                break;
            case 'settings':
                SettingsManager.renderSettings();
                break;
        }
    }
};

// Toast notification system
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification') || createToastElement();
    toast.textContent = message;
    toast.className = isError ? 'toast-error' : 'toast-success';
    toast.style.bottom = '20px';
    
    setTimeout(() => {
        toast.style.bottom = '-100px';
    }, 3000);
}

function createToastElement() {
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.position = 'fixed';
    toast.style.bottom = '-100px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '600';
    toast.style.transition = 'bottom 0.5s ease-in-out';
    toast.style.zIndex = '100';
    toast.style.border = '1px solid';
    document.body.appendChild(toast);
    return toast;
}

// Modal system
const ModalManager = {
    create(id, title, content) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.id = id;
        
        const modal = document.createElement('div');
        modal.className = 'glass-panel rounded-lg p-6 max-w-md w-full';
        modal.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-orbitron text-white">${title}</h3>
                <button class="text-gray-400 hover:text-white" onclick="ModalManager.close('${id}')">×</button>
            </div>
            <div class="modal-content">${content}</div>
        `;
        
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        
        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) this.close(id);
        });
        
        return backdrop;
    },
    
    close(id) {
        const modal = document.getElementById(id);
        if (modal) modal.remove();
    }
};

// Equipment manager
const EquipmentManager = {
    renderEquipment() {
        const container = document.getElementById('tab-content-equipment');
        if (!container) return;
        
        container.innerHTML = `
            <div class="equipment-grid">
                <div class="equipment-slot-wrapper">
                    <div class="equipment-slot-title">
                        ⚔️ <span>Primary Weapon</span>
                    </div>
                    <div class="equipment-slot-content" data-slot="weapon1">
                        ${this.renderEquipmentSlot('weapon1')}
                    </div>
                </div>
                
                <div class="equipment-slot-wrapper">
                    <div class="equipment-slot-title">
                        🗡️ <span>Secondary Weapon</span>
                    </div>
                    <div class="equipment-slot-content" data-slot="weapon2">
                        ${this.renderEquipmentSlot('weapon2')}
                    </div>
                </div>
                
                <div class="equipment-slot-wrapper">
                    <div class="equipment-slot-title">
                        🛡️ <span>Armor</span>
                    </div>
                    <div class="equipment-slot-content" data-slot="armor">
                        ${this.renderEquipmentSlot('armor')}
                    </div>
                </div>
                
                <div class="equipment-slot-wrapper">
                    <div class="equipment-slot-title">
                        💍 <span>Accessory</span>
                    </div>
                    <div class="equipment-slot-content" data-slot="accessory">
                        ${this.renderEquipmentSlot('accessory')}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderEquipmentSlot(slotName) {
        const item = gameState.equipment[slotName];
        if (item) {
            return `
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain">
                <div class="text-xs text-center">
                    <div class="text-white">${item.name}</div>
                    <div class="text-gray-400">Tier ${item.tier}</div>
                </div>
            `;
        }
        return '<div class="text-gray-500 text-xs">Empty</div>';
    }
};

// Inventory manager
const InventoryManager = {
    renderInventory() {
        const container = document.getElementById('tab-content-inventory');
        if (!container) return;
        
        container.innerHTML = `
            <div class="mb-4">
                <h3 class="text-lg font-orbitron text-white mb-2">Inventory</h3>
                <div class="inventory-grid">
                    ${this.renderInventorySlots()}
                </div>
            </div>
        `;
    },
    
    renderInventorySlots() {
        let html = '';
        const maxSlots = 20;
        
        for (let i = 0; i < maxSlots; i++) {
            const item = gameState.inventory[i];
            html += `
                <div class="inventory-slot" data-slot="${i}">
                    ${item ? `
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                        <div class="item-label">${item.quantity || 1}</div>
                    ` : ''}
                </div>
            `;
        }
        
        return html;
    }
};

// Settings manager
const SettingsManager = {
    renderSettings() {
        const container = document.getElementById('tab-content-settings');
        if (!container) return;
        
        container.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-orbitron text-white">Game Settings</h3>
                
                <div class="glass-panel p-4 rounded">
                    <h4 class="font-orbitron text-white mb-3">Theme Selection</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${this.renderThemeButtons()}
                    </div>
                </div>
                
                <div class="glass-panel p-4 rounded">
                    <h4 class="font-orbitron text-white mb-3">Audio Settings</h4>
                    <div class="space-y-2">
                        <label class="flex items-center text-white">
                            <input type="checkbox" ${gameState.settings.sfxEnabled ? 'checked' : ''}
                                   onchange="SettingsManager.toggleSFX(this.checked)">
                            <span class="ml-2">Sound Effects</span>
                        </label>
                        <label class="flex items-center text-white">
                            <input type="checkbox" ${gameState.settings.bgmEnabled ? 'checked' : ''}
                                   onchange="SettingsManager.toggleBGM(this.checked)">
                            <span class="ml-2">Background Music</span>
                        </label>
                    </div>
                </div>
                
                <div class="glass-panel p-4 rounded">
                    <h4 class="font-orbitron text-white mb-3">Save Management</h4>
                    <div class="space-y-2">
                        <button class="glass-button w-full p-2 rounded" onclick="SaveManager.save()">
                            Save Game
                        </button>
                        <button class="glass-button w-full p-2 rounded" onclick="SaveManager.load()">
                            Load Game
                        </button>
                        <button class="glass-button w-full p-2 rounded" onclick="SaveManager.reset()">
                            Reset Game
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderThemeButtons() {
        const themes = [
            { name: 'molten', label: 'Molten Core', color: '#f97316' },
            { name: 'frost', label: 'Frost', color: '#0ea5e9' },
            { name: 'nature', label: 'Nature', color: '#10b981' },
            { name: 'shadow', label: 'Shadow', color: '#8b5cf6' },
            { name: 'gold', label: 'Gold', color: '#eab308' }
        ];
        
        return themes.map(theme => `
            <button class="theme-btn ${gameState.settings.theme === theme.name ? 'active' : ''}"
                    style="background-color: ${theme.color}20; border-color: ${theme.color};"
                    onclick="SettingsManager.changeTheme('${theme.name}')">
                ${theme.label}
            </button>
        `).join('');
    },
    
    changeTheme(themeName) {
        gameState.settings.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        this.renderSettings();
    },
    
    toggleSFX(enabled) {
        gameState.settings.sfxEnabled = enabled;
    },
    
    toggleBGM(enabled) {
        gameState.settings.bgmEnabled = enabled;
    }
};

// Initialize UI systems
const UIManager = {
    init() {
        TabManager.init();
        this.initEventListeners();
    },
    
    initEventListeners() {
        // Focus mode toggle
        const focusBtn = document.getElementById('focus-mode-btn');
        if (focusBtn) {
            focusBtn.addEventListener('click', this.toggleFocusMode);
        }
        
        // Load saved settings
        if (gameState.settings.theme) {
            document.documentElement.setAttribute('data-theme', gameState.settings.theme);
        }
    },
    
    toggleFocusMode() {
        const mainContent = document.getElementById('main-content');
        const expandIcon = document.getElementById('focus-icon-expand');
        const collapseIcon = document.getElementById('focus-icon-collapse');
        
        if (mainContent.classList.contains('focused')) {
            mainContent.classList.remove('focused');
            expandIcon.classList.remove('hidden');
            collapseIcon.classList.add('hidden');
        } else {
            mainContent.classList.add('focused');
            expandIcon.classList.add('hidden');
            collapseIcon.classList.remove('hidden');
        }
    }
};
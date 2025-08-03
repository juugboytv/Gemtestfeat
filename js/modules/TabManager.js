/**
 * TabManager.js - Handles tab navigation and UI management
 * Manages the main game interface tabs and their interactions
 */

class TabManager {
    constructor() {
        this.currentTab = 'equipment';
        this.tabs = new Map();
        this.tabOrder = [];
        this.tabElements = {};
    }

    init() {
        this.setupTabs();
        this.setupEventListeners();
        this.loadTabPreferences();
        this.showTab(this.currentTab);
    }

    setupTabs() {
        // Register all main tabs
        const tabConfigs = [
            { id: 'equipment', name: 'Equipment', icon: '⚔️' },
            { id: 'infusion', name: 'Infusion', icon: '💎' },
            { id: 'inventory', name: 'Inventory', icon: '🎒' },
            { id: 'stats', name: 'Stats', icon: '📊' },
            { id: 'combat', name: 'Combat', icon: '⚔️' },
            { id: 'quest', name: 'Quest', icon: '📜' },
            { id: 'settings', name: 'Settings', icon: '⚙️' }
        ];

        tabConfigs.forEach(config => {
            this.registerTab(config);
        });

        // Set default tab order
        this.tabOrder = tabConfigs.map(t => t.id);
        this.refreshTabUI();
    }

    setupEventListeners() {
        // Tab click handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('main-tab')) {
                e.preventDefault();
                const tabId = e.target.dataset.tab;
                this.showTab(tabId);
            }
        });

        // Drag and drop for tab reordering (if implemented)
        this.setupDragAndDrop();
    }

    registerTab(config) {
        this.tabs.set(config.id, {
            ...config,
            element: document.getElementById(`${config.id}-tab`),
            content: document.getElementById(`${config.id}-content`),
            initialized: false
        });
    }

    showTab(tabId) {
        if (!this.tabs.has(tabId)) {
            console.warn(`Tab ${tabId} not found`);
            return;
        }

        // Hide all tabs
        this.tabs.forEach((tab, id) => {
            if (tab.element) {
                tab.element.classList.remove('active-main-tab');
            }
            if (tab.content) {
                tab.content.style.display = 'none';
            }
        });

        // Show selected tab
        const selectedTab = this.tabs.get(tabId);
        if (selectedTab.element) {
            selectedTab.element.classList.add('active-main-tab');
        }
        if (selectedTab.content) {
            selectedTab.content.style.display = 'block';
        }

        this.currentTab = tabId;
        this.saveTabPreferences();

        // Initialize tab if needed
        if (!selectedTab.initialized) {
            this.initializeTabContent(tabId);
            selectedTab.initialized = true;
        }

        // Trigger tab-specific updates
        this.updateTabContent(tabId);
    }

    initializeTabContent(tabId) {
        // Initialize specific tab content based on tabId
        switch (tabId) {
            case 'equipment':
                this.initEquipmentTab();
                break;
            case 'infusion':
                this.initInfusionTab();
                break;
            case 'inventory':
                this.initInventoryTab();
                break;
            case 'stats':
                this.initStatsTab();
                break;
            case 'combat':
                this.initCombatTab();
                break;
            case 'quest':
                this.initQuestTab();
                break;
            case 'settings':
                this.initSettingsTab();
                break;
        }
    }

    updateTabContent(tabId) {
        // Update tab content when switching
        const event = new CustomEvent('tabChanged', { 
            detail: { tabId, previousTab: this.currentTab } 
        });
        document.dispatchEvent(event);
    }

    // Tab initialization methods (to be connected with existing managers)
    initEquipmentTab() {
        if (window.EquipmentManager) {
            window.EquipmentManager.init();
        }
    }

    initInfusionTab() {
        if (window.InfusionManager) {
            window.InfusionManager.init();
        }
    }

    initInventoryTab() {
        if (window.InventoryManager) {
            window.InventoryManager.init();
        }
    }

    initStatsTab() {
        if (window.ProfileManager) {
            window.ProfileManager.updateUI();
        }
    }

    initCombatTab() {
        if (window.CombatManager) {
            window.CombatManager.init();
        }
    }

    initQuestTab() {
        if (window.QuestManager) {
            window.QuestManager.init();
        }
    }

    initSettingsTab() {
        if (window.SettingsManager) {
            window.SettingsManager.init();
        }
    }

    // Drag and drop functionality for tab reordering
    setupDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('main-tab')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.tab);
                e.target.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('main-tab')) {
                e.target.style.opacity = '1';
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('main-tab')) {
                e.preventDefault();
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.classList.contains('main-tab')) {
                e.preventDefault();
                const draggedTabId = e.dataTransfer.getData('text/plain');
                const targetTabId = e.target.dataset.tab;
                this.reorderTabs(draggedTabId, targetTabId);
            }
        });
    }

    reorderTabs(draggedTabId, targetTabId) {
        const draggedIndex = this.tabOrder.indexOf(draggedTabId);
        const targetIndex = this.tabOrder.indexOf(targetTabId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Remove dragged tab from its current position
            this.tabOrder.splice(draggedIndex, 1);
            // Insert it at the target position
            this.tabOrder.splice(targetIndex, 0, draggedTabId);
            
            this.refreshTabUI();
            this.saveTabPreferences();
        }
    }

    refreshTabUI() {
        const tabContainer = document.querySelector('.main-tabs');
        if (!tabContainer) return;

        // Reorder tab elements based on tabOrder
        this.tabOrder.forEach((tabId, index) => {
            const tab = this.tabs.get(tabId);
            if (tab && tab.element) {
                tab.element.style.order = index;
            }
        });
    }

    // Preferences management
    saveTabPreferences() {
        const preferences = {
            currentTab: this.currentTab,
            tabOrder: this.tabOrder
        };
        localStorage.setItem('geminus_tab_preferences', JSON.stringify(preferences));
    }

    loadTabPreferences() {
        try {
            const saved = localStorage.getItem('geminus_tab_preferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                if (preferences.currentTab) {
                    this.currentTab = preferences.currentTab;
                }
                if (preferences.tabOrder) {
                    this.tabOrder = preferences.tabOrder;
                }
            }
        } catch (error) {
            console.error('Failed to load tab preferences:', error);
        }
    }

    // Utility methods
    getCurrentTab() {
        return this.currentTab;
    }

    getTabOrder() {
        return [...this.tabOrder];
    }

    isTabActive(tabId) {
        return this.currentTab === tabId;
    }
}

// Export singleton instance
window.tabManager = new TabManager();
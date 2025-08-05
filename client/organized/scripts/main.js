// ===== MAIN GAME INITIALIZATION =====

console.log('Geminus: Organized structure loading...');

// Main game initialization function
async function main() {
    // Initialize server-side game API first
    await window.gameAPI.init();
    
    await loadGameData(); // Ensure data is loaded before the game starts
    CreationManager.init();
    
    // Initialize systems after a short delay for DOM elements
    setTimeout(() => {
        if (typeof UIManager !== 'undefined') UIManager.init();
        
        // Initialize game systems
        ZoneManager.loadZone(gameState.player.currentZone);
        
        // Set up movement controls
        initMovementControls();
        
        // Load saved game if available
        SaveManager.load();
        
        // Initialize UI content
        TabManager.initTabContent('equipment');
        
        console.log('Geminus: All systems initialized successfully!');
    }, 100);
}

// Movement controls initialization
function initMovementControls() {
    // D-pad controls
    const moveKeys = document.querySelectorAll('.move-key');
    moveKeys.forEach(key => {
        key.addEventListener('click', () => {
            const direction = key.dataset.key;
            ZoneManager.movePlayer(direction);
        });
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down', 
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };
        
        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            ZoneManager.movePlayer(direction);
            
            // Visual feedback
            const keyElement = document.getElementById(`key-${direction}`);
            if (keyElement) {
                keyElement.classList.add('pressed');
                setTimeout(() => keyElement.classList.remove('pressed'), 150);
            }
        }
    });
    
    // Teleport trigger
    const teleportBtn = document.getElementById('zone-teleport-trigger');
    if (teleportBtn) {
        teleportBtn.addEventListener('click', () => {
            TeleportManager.showTeleportModal();
        });
    }
    
    // Interact key
    const interactKey = document.getElementById('key-interact');
    if (interactKey) {
        interactKey.addEventListener('click', () => {
            ZoneManager.checkForFeatureInteraction();
        });
    }
}

// Accordion functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.stat-accordion-header')) {
        const header = e.target.closest('.stat-accordion-header');
        const item = header.parentElement;
        const content = item.querySelector('.stat-accordion-content');
        
        if (item.classList.contains('open')) {
            item.classList.remove('open');
            content.style.maxHeight = '0';
        } else {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', main);
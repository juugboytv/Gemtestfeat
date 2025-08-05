// ===== COMBAT SYSTEM =====

const CombatManager = {
    currentTarget: null,
    isInCombat: false,
    combatLog: [],
    
    renderCombat() {
        const container = document.getElementById('tab-content-combat');
        if (!container) return;
        
        container.innerHTML = `
            <div class="space-y-4">
                <div class="location-info">
                    <h3 class="text-lg font-orbitron text-white">Combat Zone</h3>
                    <p class="text-gray-400">Current Zone: ${AllZones[gameState.player.currentZone]?.name || 'Unknown'}</p>
                </div>
                
                <div class="stats-grid">
                    <div class="glass-panel p-4 rounded">
                        <h4 class="font-orbitron text-white mb-2">Player Stats</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>Health:</span>
                                <span class="text-red-400">${gameState.player.health}/${gameState.player.maxHealth}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Level:</span>
                                <span class="text-blue-400">${gameState.player.level}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Gold:</span>
                                <span class="text-yellow-400">${gameState.player.gold}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass-panel p-4 rounded">
                        <h4 class="font-orbitron text-white mb-2">Combat Actions</h4>
                        <div class="space-y-2">
                            <button class="glass-button w-full p-2 rounded" onclick="CombatManager.findTarget()" 
                                    ${this.isInCombat ? 'disabled' : ''}>
                                Find Monster
                            </button>
                            <button class="glass-button w-full p-2 rounded" onclick="CombatManager.attack()" 
                                    ${!this.isInCombat ? 'disabled' : ''}>
                                Attack
                            </button>
                            <button class="glass-button w-full p-2 rounded" onclick="CombatManager.flee()" 
                                    ${!this.isInCombat ? 'disabled' : ''}>
                                Flee
                            </button>
                        </div>
                    </div>
                </div>
                
                ${this.currentTarget ? this.renderTarget() : ''}
                
                <div class="glass-panel p-4 rounded">
                    <h4 class="font-orbitron text-white mb-2">Combat Log</h4>
                    <div class="combat-log h-40 overflow-y-auto custom-scrollbar space-y-1">
                        ${this.renderCombatLog()}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderTarget() {
        if (!this.currentTarget) return '';
        
        return `
            <div class="glass-panel p-4 rounded">
                <h4 class="font-orbitron text-white mb-2">Current Target</h4>
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-gray-700 rounded border">
                        <!-- Monster image would go here -->
                    </div>
                    <div class="flex-1">
                        <div class="text-white font-bold">${this.currentTarget.name}</div>
                        <div class="progress-bar-track h-2 mb-1">
                            <div class="progress-bar-fill bg-red-500" 
                                 style="width: ${(this.currentTarget.health / this.currentTarget.maxHealth) * 100}%"></div>
                        </div>
                        <div class="text-sm text-gray-400">${this.currentTarget.health}/${this.currentTarget.maxHealth} HP</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderCombatLog() {
        if (this.combatLog.length === 0) {
            return '<div class="text-gray-500 text-sm">No combat activity yet.</div>';
        }
        
        return this.combatLog.slice(-20).map(entry => `
            <div class="text-sm ${entry.type === 'damage' ? 'text-red-400' : 'text-gray-300'}">
                ${entry.message}
            </div>
        `).join('');
    },
    
    findTarget() {
        if (this.isInCombat) return;
        
        // Generate a random monster
        const monsters = [
            { name: 'Goblin Scout', health: 30, maxHealth: 30, damage: 5 },
            { name: 'Shadow Wolf', health: 45, maxHealth: 45, damage: 7 },
            { name: 'Cave Spider', health: 25, maxHealth: 25, damage: 4 },
            { name: 'Skeletal Warrior', health: 60, maxHealth: 60, damage: 9 }
        ];
        
        this.currentTarget = monsters[Math.floor(Math.random() * monsters.length)];
        this.isInCombat = true;
        this.logMessage(`You encounter a ${this.currentTarget.name}!`);
        this.renderCombat();
    },
    
    attack() {
        if (!this.isInCombat || !this.currentTarget) return;
        
        // Player attacks
        const playerDamage = Math.floor(Math.random() * 15) + 5;
        const isCritical = Math.random() < 0.1; // 10% crit chance
        const finalDamage = isCritical ? playerDamage * 2 : playerDamage;
        
        this.currentTarget.health = Math.max(0, this.currentTarget.health - finalDamage);
        
        if (isCritical) {
            this.logMessage(`Critical hit! You deal ${finalDamage} damage to ${this.currentTarget.name}!`, 'damage');
        } else {
            this.logMessage(`You deal ${finalDamage} damage to ${this.currentTarget.name}.`, 'damage');
        }
        
        // Check if monster is defeated
        if (this.currentTarget.health <= 0) {
            this.defeatMonster();
            return;
        }
        
        // Monster counter-attacks
        const monsterDamage = Math.floor(Math.random() * this.currentTarget.damage) + 1;
        gameState.player.health = Math.max(0, gameState.player.health - monsterDamage);
        
        this.logMessage(`${this.currentTarget.name} deals ${monsterDamage} damage to you!`);
        
        // Check if player is defeated
        if (gameState.player.health <= 0) {
            this.playerDefeated();
            return;
        }
        
        PlayerManager.updateUI();
        this.renderCombat();
    },
    
    defeatMonster() {
        const expGain = Math.floor(Math.random() * 20) + 10;
        const goldGain = Math.floor(Math.random() * 15) + 5;
        
        this.logMessage(`You defeated ${this.currentTarget.name}! Gained ${expGain} XP and ${goldGain} gold.`);
        
        gameState.player.experience += expGain;
        gameState.player.gold += goldGain;
        
        this.endCombat();
        PlayerManager.updateUI();
    },
    
    playerDefeated() {
        this.logMessage(`You have been defeated! You lose all carried gold.`);
        gameState.player.gold = 0;
        gameState.player.health = 1; // Prevent full death
        gameState.player.isDefeated = true;
        
        this.endCombat();
        PlayerManager.updateUI();
        showToast("You have been defeated! Visit a Revive Station.", true);
    },
    
    flee() {
        if (!this.isInCombat) return;
        
        this.logMessage(`You fled from ${this.currentTarget.name}.`);
        this.endCombat();
    },
    
    endCombat() {
        this.isInCombat = false;
        this.currentTarget = null;
        this.renderCombat();
    },
    
    logMessage(message, type = 'normal') {
        this.combatLog.push({
            message,
            type,
            timestamp: Date.now()
        });
        
        // Keep only last 50 entries
        if (this.combatLog.length > 50) {
            this.combatLog = this.combatLog.slice(-50);
        }
    }
};

// Combat animations and effects
const CombatAnimations = {
    showDamageNumber(damage, isCritical = false, element) {
        const damageEl = document.createElement('div');
        damageEl.className = isCritical ? 'crit-damage-number' : 'damage-number';
        damageEl.textContent = damage;
        damageEl.style.position = 'absolute';
        damageEl.style.left = Math.random() * 50 + 25 + '%';
        damageEl.style.top = '50%';
        
        element.style.position = 'relative';
        element.appendChild(damageEl);
        
        setTimeout(() => damageEl.remove(), 2000);
    },
    
    screenShake() {
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 500);
    },
    
    healthBarPulse() {
        const hpBar = document.getElementById('hp-bar');
        if (hpBar) {
            hpBar.classList.add('health-pulse');
            setTimeout(() => hpBar.classList.remove('health-pulse'), 800);
        }
    }
};
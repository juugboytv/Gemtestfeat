// ===== ZONE SYSTEM & HEXAGONAL GRID =====

// Hexagonal grid mathematics
const HexMath = {
    // Convert axial coordinates to screen position
    axialToPixel(q, r, size) {
        const x = size * (3/2 * q);
        const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return { x, y };
    },
    
    // Get neighbors of a hex
    getNeighbors(q, r) {
        const directions = [
            [+1, 0], [+1, -1], [0, -1],
            [-1, 0], [-1, +1], [0, +1]
        ];
        return directions.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
    },
    
    // Check if coordinate is within grid bounds
    isInBounds(q, r, gridSize) {
        const maxCoord = Math.floor(gridSize / 2);
        const minCoord = -maxCoord;
        return q >= minCoord && q <= maxCoord && r >= minCoord && r <= maxCoord && (q + r) >= minCoord && (q + r) <= maxCoord;
    },
    
    // Generate ring of hexes at distance
    ring(center, radius) {
        const results = [];
        if (radius === 0) return [center];
        
        let hex = { q: center.q + radius, r: center.r - radius };
        const directions = [
            [-1, +1], [-1, 0], [0, -1],
            [+1, -1], [+1, 0], [0, +1]
        ];
        
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                results.push({ ...hex });
                hex.q += directions[i][0];
                hex.r += directions[i][1];
            }
        }
        return results;
    }
};

// Zone management system
const ZoneManager = {
    currentZone: null,
    zoneFeatures: new Map(),
    
    async loadZone(zoneId) {
        try {
            let zoneData = null;
            if (window.gameAPI && window.gameAPI.isServerMode) {
                zoneData = await window.gameAPI.getCurrentZone();
                console.log('Using server zone data for map generation:', zoneData);
            }
            
            if (!zoneData) {
                // Fallback to client-side generation
                zoneData = this.generateZoneLayout(zoneId);
            }
            
            this.currentZone = zoneData;
            this.generateMiniMap();
            this.updateLocationUI();
            
            return zoneData;
        } catch (error) {
            console.error('Failed to load zone:', error);
            return null;
        }
    },
    
    generateZoneLayout(zoneId) {
        const zoneInfo = AllZones[zoneId];
        if (!zoneInfo) return null;
        
        // Determine grid size based on zone pattern
        const patternIndex = (zoneId - 1) % 5;
        const gridSizes = [4, 5, 6, 7, 8]; // red, blue, green, yellow, purple
        const gridSize = gridSizes[patternIndex];
        
        const features = this.generateFeatures(gridSize);
        
        return {
            id: zoneId,
            name: zoneInfo.name,
            gridSize,
            features,
            monsters: []
        };
    },
    
    generateFeatures(gridSize) {
        const features = [
            { type: "Bank", q: 0, r: -2 },
            { type: "Revive Station", q: 0, r: 2 },
            { type: "Armory", q: 2, r: 0 },
            { type: "Arcanum", q: -2, r: 0 },
            { type: "Teleporter", q: -1, r: 1 }
        ];
        
        // Filter features that fit within grid bounds
        return features.filter(feature => 
            HexMath.isInBounds(feature.q, feature.r, gridSize)
        );
    },
    
    generateMiniMap() {
        const canvas = document.getElementById('mini-map-canvas');
        if (!canvas || !this.currentZone) return;
        
        const ctx = canvas.getContext('2d');
        const size = canvas.width = canvas.height = 96;
        ctx.clearRect(0, 0, size, size);
        
        const hexSize = size / (this.currentZone.gridSize + 2);
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Draw grid hexes
        for (let q = -Math.floor(this.currentZone.gridSize/2); q <= Math.floor(this.currentZone.gridSize/2); q++) {
            for (let r = -Math.floor(this.currentZone.gridSize/2); r <= Math.floor(this.currentZone.gridSize/2); r++) {
                if (Math.abs(q + r) <= Math.floor(this.currentZone.gridSize/2)) {
                    const pixel = HexMath.axialToPixel(q, r, hexSize);
                    this.drawHex(ctx, centerX + pixel.x, centerY + pixel.y, hexSize * 0.8, 'rgba(249, 115, 22, 0.2)');
                }
            }
        }
        
        // Draw features
        this.currentZone.features.forEach(feature => {
            const pixel = HexMath.axialToPixel(feature.q, feature.r, hexSize);
            const x = centerX + pixel.x;
            const y = centerY + pixel.y;
            
            // Feature colors
            const featureColors = {
                'Bank': '#FFD700',
                'Revive Station': '#FF6B6B',
                'Armory': '#4ECDC4',
                'Arcanum': '#9B59B6',
                'Teleporter': '#3498DB',
                'Sanctuary': '#2ECC71'
            };
            
            this.drawHex(ctx, x, y, hexSize * 0.6, featureColors[feature.type] || '#FFF');
        });
        
        // Draw player position
        const playerPixel = HexMath.axialToPixel(gameState.player.position.q, gameState.player.position.r, hexSize);
        const playerX = centerX + playerPixel.x;
        const playerY = centerY + playerPixel.y;
        
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(playerX, playerY, hexSize * 0.3, 0, 2 * Math.PI);
        ctx.fill();
    },
    
    drawHex(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = 2 * Math.PI / 6 * i;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    
    updateLocationUI() {
        if (!this.currentZone) return;
        
        const locationElements = document.querySelectorAll('.location-info');
        locationElements.forEach(el => {
            if (el.querySelector('p')) {
                el.querySelector('p').textContent = `Current Zone: ${this.currentZone.name}`;
            }
        });
    },
    
    movePlayer(direction) {
        const directions = {
            'up': { q: 0, r: -1 },
            'down': { q: 0, r: 1 },
            'left': { q: -1, r: 0 },
            'right': { q: 1, r: 0 }
        };
        
        const delta = directions[direction];
        if (!delta) return false;
        
        const newPos = {
            q: gameState.player.position.q + delta.q,
            r: gameState.player.position.r + delta.r
        };
        
        // Check bounds
        if (this.currentZone && HexMath.isInBounds(newPos.q, newPos.r, this.currentZone.gridSize)) {
            gameState.player.position = newPos;
            this.generateMiniMap();
            this.checkForFeatureInteraction();
            return true;
        }
        
        return false;
    },
    
    checkForFeatureInteraction() {
        if (!this.currentZone) return;
        
        const playerPos = gameState.player.position;
        const feature = this.currentZone.features.find(f => f.q === playerPos.q && f.r === playerPos.r);
        
        if (feature) {
            showToast(`You are at: ${feature.type}`);
            this.handleFeatureInteraction(feature);
        }
    },
    
    handleFeatureInteraction(feature) {
        switch (feature.type) {
            case 'Bank':
                this.openBankModal();
                break;
            case 'Revive Station':
                this.revivePlayer();
                break;
            case 'Armory':
                showToast("Armory: Equipment upgrades available!");
                break;
            case 'Arcanum':
                showToast("Arcanum: Magical knowledge awaits!");
                break;
            case 'Teleporter':
                TeleportManager.showTeleportModal();
                break;
        }
    },
    
    openBankModal() {
        const content = `
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-lg">💰 The Grand Vault</div>
                    <div class="text-sm text-gray-400">Secure your gold here</div>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Carried Gold:</span>
                        <span class="text-yellow-400">${gameState.player.gold}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Banked Gold:</span>
                        <span class="text-green-400">${gameState.player.bankedGold || 0}</span>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <input type="number" id="bank-amount" placeholder="Amount" 
                           class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white">
                    <div class="flex gap-2">
                        <button class="glass-button flex-1 p-2 rounded" onclick="ZoneManager.bankGold()">
                            Deposit
                        </button>
                        <button class="glass-button flex-1 p-2 rounded" onclick="ZoneManager.withdrawGold()">
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        ModalManager.create('bank-modal', 'Bank Services', content);
    },
    
    bankGold() {
        const amount = parseInt(document.getElementById('bank-amount').value) || 0;
        if (amount > 0 && amount <= gameState.player.gold) {
            gameState.player.gold -= amount;
            gameState.player.bankedGold = (gameState.player.bankedGold || 0) + amount;
            PlayerManager.updateUI();
            ModalManager.close('bank-modal');
            showToast(`Deposited ${amount} gold to the vault.`);
        } else {
            showToast("Invalid amount or insufficient gold.", true);
        }
    },
    
    withdrawGold() {
        const amount = parseInt(document.getElementById('bank-amount').value) || 0;
        const banked = gameState.player.bankedGold || 0;
        
        if (amount > 0 && amount <= banked) {
            gameState.player.gold += amount;
            gameState.player.bankedGold = banked - amount;
            PlayerManager.updateUI();
            ModalManager.close('bank-modal');
            showToast(`Withdrew ${amount} gold from the vault.`);
        } else {
            showToast("Invalid amount or insufficient banked gold.", true);
        }
    },
    
    revivePlayer() {
        if (gameState.player.isDefeated) {
            gameState.player.health = gameState.player.maxHealth;
            gameState.player.isDefeated = false;
            PlayerManager.updateUI();
            showToast("You have been revived! Full health restored.");
        } else {
            showToast("You don't need revival.");
        }
    }
};

// Teleportation system
const TeleportManager = {
    showTeleportModal() {
        this.populateZoneList();
    },
    
    async populateZoneList() {
        try {
            let zones;
            if (window.gameAPI && window.gameAPI.isServerMode) {
                const serverZones = await window.gameAPI.getAvailableZones();
                if (serverZones) {
                    zones = serverZones;
                } else {
                    zones = AllZones;
                }
            } else {
                zones = AllZones;
            }
            
            const zoneList = Object.entries(zones)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([id, zone]) => {
                    const canAccess = gameState.player.level >= (zone.levelReq || 1);
                    return `
                        <li class="${!canAccess ? 'disabled' : ''}" 
                            ${canAccess ? `onclick="TeleportManager.teleportToZone(${id})"` : ''}>
                            <div class="flex justify-between items-center">
                                <span>${zone.name}</span>
                                <span class="text-xs text-gray-400">Lv.${zone.levelReq || 1}</span>
                            </div>
                        </li>
                    `;
                }).join('');
            
            const content = `
                <div class="space-y-4">
                    <div class="text-center">
                        <div class="text-lg">🌀 Zone Teleporter</div>
                        <div class="text-sm text-gray-400">Choose your destination</div>
                    </div>
                    
                    <div class="max-h-60 overflow-y-auto custom-scrollbar">
                        <ul class="space-y-2" id="zone-list-container">
                            ${zoneList}
                        </ul>
                    </div>
                </div>
            `;
            
            ModalManager.create('zone-popup-modal', 'Teleporter', content);
        } catch (error) {
            console.error('Failed to load zones for teleportation:', error);
            showToast("Failed to load available zones.", true);
        }
    },
    
    async teleportToZone(zoneId) {
        try {
            // Try server-side teleportation first
            if (window.gameAPI && window.gameAPI.isServerMode) {
                const result = await window.gameAPI.teleportToZone(parseInt(zoneId));
                if (result && result.success) {
                    gameState.player.currentZone = parseInt(zoneId);
                    gameState.player.position = { q: 0, r: 0 };
                    await ZoneManager.loadZone(zoneId);
                    ModalManager.close('zone-popup-modal');
                    showToast(`Teleported to ${result.zoneName || AllZones[zoneId]?.name}!`);
                    return;
                }
            }
            
            // Fallback to client-side teleportation
            const zone = AllZones[zoneId];
            if (zone && gameState.player.level >= (zone.levelReq || 1)) {
                gameState.player.currentZone = parseInt(zoneId);
                gameState.player.position = { q: 0, r: 0 };
                await ZoneManager.loadZone(zoneId);
                ModalManager.close('zone-popup-modal');
                showToast(`Teleported to ${zone.name}!`);
            } else {
                showToast("You don't meet the level requirement for this zone.", true);
            }
        } catch (error) {
            console.error('Teleportation failed:', error);
            showToast("Teleportation failed. Please try again.", true);
        }
    }
};
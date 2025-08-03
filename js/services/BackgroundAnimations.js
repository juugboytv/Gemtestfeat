/**
 * BackgroundAnimations.js - Handles smoke particle background animations
 * Manages the ambient visual effects for the game
 */

class BackgroundAnimations {
    constructor() {
        this.smokeCanvas = null;
        this.smokeCtx = null;
        this.smokeParticles = [];
        this.animationId = null;
    }

    init() {
        this.smokeCanvas = document.getElementById('smoke-canvas');
        if (!this.smokeCanvas) return;

        this.smokeCtx = this.smokeCanvas.getContext('2d');
        this.setupEventListeners();
        this.resizeSmokeCanvas();
        this.startAnimation();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeSmokeCanvas());
    }

    resizeSmokeCanvas() {
        if (!this.smokeCanvas) return;

        this.smokeCanvas.width = window.innerWidth;
        this.smokeCanvas.height = window.innerHeight;
        
        this.smokeParticles = Array.from({ length: 75 }, () => ({
            x: Math.random() * this.smokeCanvas.width, 
            y: Math.random() * this.smokeCanvas.height,
            size: Math.random() * 150 + 50,
            speedX: Math.random() * 0.4 - 0.2, 
            speedY: Math.random() * 0.4 - 0.2,
            color: `rgba(249, 115, 22, ${Math.random() * 0.07})`
        }));
    }

    animateSmoke() {
        if (!this.smokeCtx || !this.smokeCanvas) return;

        this.smokeCtx.clearRect(0, 0, this.smokeCanvas.width, this.smokeCanvas.height);
        
        this.smokeParticles.forEach(p => {
            p.x += p.speedX; 
            p.y += p.speedY;
            
            // Wrap around screen edges
            if (p.x < -p.size) p.x = this.smokeCanvas.width + p.size; 
            if (p.x > this.smokeCanvas.width + p.size) p.x = -p.size;
            if (p.y < -p.size) p.y = this.smokeCanvas.height + p.size; 
            if (p.y > this.smokeCanvas.height + p.size) p.y = -p.size;
            
            // Draw particle
            this.smokeCtx.fillStyle = p.color; 
            this.smokeCtx.beginPath(); 
            this.smokeCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.smokeCtx.filter = 'blur(60px)'; 
            this.smokeCtx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animateSmoke());
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animateSmoke();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stopAnimation();
        window.removeEventListener('resize', () => this.resizeSmokeCanvas());
    }
}

// Export singleton instance
window.backgroundAnimations = new BackgroundAnimations();
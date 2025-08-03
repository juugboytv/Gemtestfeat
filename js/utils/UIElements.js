/**
 * UIElements.js - Centralized UI element management
 * Handles DOM element references and common UI operations
 */

class UIElements {
    constructor() {
        this.ui = {};
        this.initialize();
    }

    initialize() {
        // Auto-populate UI elements from DOM
        document.querySelectorAll('[id]').forEach(el => {
            const camelCaseId = el.id.replace(/-(\w)/g, (m, g) => g.toUpperCase());
            this.ui[camelCaseId] = el;
        });
    }

    // Get element by ID (with camelCase conversion)
    get(elementId) {
        return this.ui[elementId];
    }

    // Common UI operations
    show(elementId) {
        const el = this.get(elementId);
        if (el) el.style.display = 'block';
    }

    hide(elementId) {
        const el = this.get(elementId);
        if (el) el.style.display = 'none';
    }

    toggle(elementId) {
        const el = this.get(elementId);
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    }

    setText(elementId, text) {
        const el = this.get(elementId);
        if (el) el.textContent = text;
    }

    setHTML(elementId, html) {
        const el = this.get(elementId);
        if (el) el.innerHTML = html;
    }

    addClass(elementId, className) {
        const el = this.get(elementId);
        if (el) el.classList.add(className);
    }

    removeClass(elementId, className) {
        const el = this.get(elementId);
        if (el) el.classList.remove(className);
    }

    toggleClass(elementId, className) {
        const el = this.get(elementId);
        if (el) el.classList.toggle(className);
    }

    // Toast notification system
    showToast(message, isError = false) {
        const toastElement = this.get('toastNotification');
        if (!toastElement) return;

        toastElement.textContent = message;
        toastElement.className = `glass-panel fixed left-1/2 -translate-x-1/2 z-[210] transition-all duration-500 ease-in-out px-6 py-3 rounded-lg font-semibold ${isError ? 'toast-error' : 'toast-success'}`;
        toastElement.style.bottom = '5rem';
        
        setTimeout(() => { 
            toastElement.style.bottom = '-100px'; 
        }, 3000);
    }

    // Combat log system
    logToGame(message, type = 'system') {
        const combatLogContainer = document.getElementById('scrolling-combat-log-container');
        if (!combatLogContainer) return;

        const newLogEntry = document.createElement('p');
        newLogEntry.className = 'log-entry';
        
        let typeClass = 'log-system';
        if (type === 'player') typeClass = 'log-player';
        else if (type === 'enemy') typeClass = 'log-enemy';
        newLogEntry.classList.add(typeClass);

        newLogEntry.innerHTML = message;
        combatLogContainer.appendChild(newLogEntry);

        // Keep the log from getting too long
        while (combatLogContainer.children.length > 20) {
            combatLogContainer.removeChild(combatLogContainer.firstChild);
        }

        // Automatically scroll to the bottom
        combatLogContainer.scrollTop = combatLogContainer.scrollHeight;
        console.log(`Game Log: ${message}`);
    }

    // Refresh UI elements (call when DOM changes)
    refresh() {
        this.initialize();
    }
}

// Export singleton instance
window.uiElements = new UIElements();

// Create backward compatibility aliases
window.ui = window.uiElements.ui;
window.showToast = (message, isError) => window.uiElements.showToast(message, isError);
window.logToGame = (message, type) => window.uiElements.logToGame(message, type);
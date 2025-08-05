# Overview
Geminus is a browser-based dark fantasy RPG featuring a complete original codebase. It includes sophisticated tabbed interfaces (Equipment, Infusion, Inventory, Stats, Combat, Quest, Settings), hexagonal world map navigation, and enhanced real-time combat animations. Players can explore zones, engage in dynamic combat with visual effects, level up characters, and customize gameplay with particle effects and animated feedback systems. The business vision is to provide a rich, engaging RPG experience directly in the browser, leveraging a unique code migration from Google Gemini Canvas.

# User Preferences
Preferred communication style: Simple, everyday language.
Project organization: Clean, modern structure with legacy files preserved in dedicated folders.

# System Architecture

## Frontend
The client serves the React-based game through Vite from `client/src/components/GeminusGame.tsx`. The game features a dark fantasy molten core theme with orange/red glow effects and sophisticated visual systems including a complete tab system, hexagonal world map with zone navigation and teleportation, real-time combat animations (CSS keyframe animations, particle effects, damage numbers, screen shake), modal systems (zone teleportation, item actions, bank, shop), advanced combat mechanics (critical hits, animated health bars), and toast notifications for user feedback. UI customization is available via five professional themes, drag-and-drop tab reordering, and persistent settings. The original Google Gemini Canvas single-block HTML/CSS/JS code is preserved in `legacy/exact_original.html` for reference.

## Backend
The server uses Express.js with Vite integration to serve the original HTML game file, focusing on static file serving and development integration with hot module replacement and live reloading. The architecture preserves the exact functionality from the Google Gemini Canvas migration. A server-side architecture for dynamic zone layouts and features has been implemented using an axial coordinate system for unique zone layouts and supporting API integration for zone data and teleportation.

## Data Storage
The application uses a dual-storage approach: in-memory storage for development and PostgreSQL with Drizzle ORM for production, ensuring type-safe database queries. Browser localStorage is used for game save states and user preferences. The database schema is defined in shared TypeScript files using Zod for validation, including comprehensive schemas for user, character, item, and combat logging systems.

## Game State Management
Game state is managed through React hooks and context in `GeminusGame.tsx`, enhanced with modular JavaScript utilities in the `js/` folder. This includes centralized state for player data, equipment, inventory, combat status, and zone navigation. Persistence is handled via browser localStorage for saves and preferences, with server synchronization. The combat system features real-time animations with particle effects, damage numbers, and critical hits. An animation engine utilizes CSS keyframes, particle systems, screen shake, and health bar animations, providing visual feedback for various game events. A modular JavaScript architecture has been implemented for better code organization, with dedicated modules in `js/` for game state, UI elements, hexagonal grid mathematics, background animations, and API communication.

## Game Systems & Features
- **Zone System**: Complete 101-zone system with dynamic generation and proper level requirements. All zones 1-24 are starter zones (Level 1), zones 25-101 have escalating requirements (Level 100 to 400,000). Fixed teleportation system to display all zones with authentic zone names and level-based progression. Fully operational structured zone system with 5-zone repeating pattern (red 4x4, blue 5x5, green 6x6, yellow 7x7, purple 8x8) and server-side zone data properly integrated with frontend minimap display. Features include Sanctuary, Armory, Arcanum, Bank, Revive Station, Gem Crucible, Teleporter with proper emoji display (⚔️🔮🌀💰🏥💎) and interaction handlers. Recent fixes (Aug 2025): Resolved emoji display issues by updating coordinates and using widely supported emojis - Bank shows money bag (💰) and Revive Station shows hospital (🏥). Fixed coordinate mismatch between blueprint and server-generated layouts for all features: Bank (0,-2), Revive Station (0,2), Armory (2,0), Arcanum (-2,0), Teleporter (-1,1). All 101 zones now properly generate with 5 core features.
- **Gilded Vault Network (Banking)**: Complete banking system with The Grand Vault as the main hub. Features include secure gold storage separate from carried gold, deposit/withdraw functionality, Vault Sigil (debit) system, and Merchant's Writ (credit) system with interest and consequences. Banked gold is protected during death, while carried gold is lost.
- **Death & Revival System**: Comprehensive defeat system where players lose 100% carried gold and experience progress (but not levels) upon death. Players enter "Defeated" state with visual effects and cannot interact with world objects until revived at a Sanctuary. Includes ghost mode with grayscale visual effects and revival mechanics.
- **Item System**: Three-tier item system (Dropper, Shadow, Echo items) with 20 gear tiers, a Gem System, dual-weapon support, smart drop logic, and mathematical balancing based on GDD exponential formulas. Integrated with GitHub for image assets.
- **Combat System**: Real-time combat animations with CSS keyframes, particle effects, floating damage numbers, enhanced health bars, and screen shake. Includes a 10% critical hit chance with 2x damage.
- **Dev Suite**: A comprehensive Dev Suite Module 1: Dashboard, acting as a central hub for server stats, navigation, and change logs, with admin password protection and database-driven tools for live content management.

# External Dependencies
- **Tailwind CSS**: Loaded via CDN for styling consistency.
- **Google Fonts**: Inter and Orbitron fonts for typography.
- **Express.js**: Backend server for development environment and API.
- **Vite**: Development server integration with hot module replacement.
- **React**: Frontend framework for component-based UI.
- **TypeScript**: Type-safe development environment.
- **PostgreSQL**: Production database for persistent data storage.
- **Drizzle ORM**: ORM for type-safe database queries with PostgreSQL.

# Project Organization (Updated August 2025)
The project now offers two approaches:

## Single-File Approach (Default)
- **Main game**: `client/index.html` (6,000-line working file)
- **Benefits**: Everything in one place, no file dependencies, easy to edit
- **Best for**: Quick development, simple deployment

## Organized Structure (Alternative)
- **Organized game**: `client/organized/` folder with modular structure
- **CSS split**: `styles/main.css`, `styles/themes.css`, `styles/animations.css`, `styles/components.css`
- **JavaScript split**: Prepared for `scripts/gameState.js`, `scripts/ui.js`, `scripts/combat.js`, etc.
- **Benefits**: Easy navigation, better debugging, team development
- **Best for**: Complex features, multiple developers

## Other Files
- **Legacy code**: `legacy/exact_original.html` (original Google Gemini Canvas)
- **Modular utilities**: `js/` folder with organized game modules
- **Assets**: `legacy/original_assets/` for all uploaded game assets
- **Configuration**: Root-level config files (vite, tailwind, drizzle)
- **Documentation**: `PROJECT_STRUCTURE.md` for detailed organization guide
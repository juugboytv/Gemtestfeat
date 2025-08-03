# Overview
Geminus is a browser-based dark fantasy RPG featuring a complete original codebase. It includes sophisticated tabbed interfaces (Equipment, Infusion, Inventory, Stats, Combat, Quest, Settings), hexagonal world map navigation, and enhanced real-time combat animations. Players can explore zones, engage in dynamic combat with visual effects, level up characters, and customize gameplay with particle effects and animated feedback systems. The business vision is to provide a rich, engaging RPG experience directly in the browser, leveraging a unique code migration from Google Gemini Canvas.

# User Preferences
Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
The client serves the original HTML/JavaScript game file through Vite. The game features a dark fantasy molten core theme with orange/red glow effects and sophisticated visual systems including a complete tab system, hexagonal world map with zone navigation and teleportation, real-time combat animations (CSS keyframe animations, particle effects, damage numbers, screen shake), modal systems (zone teleportation, item actions, bank, shop), advanced combat mechanics (critical hits, animated health bars), and toast notifications for user feedback. UI customization is available via five professional themes, drag-and-drop tab reordering, and persistent settings.

## Backend
The server uses Express.js with Vite integration to serve the original HTML game file, focusing on static file serving and development integration with hot module replacement and live reloading. The architecture preserves the exact functionality from the Google Gemini Canvas migration. A server-side architecture for dynamic zone layouts and features has been implemented using an axial coordinate system for unique zone layouts and supporting API integration for zone data and teleportation.

## Data Storage
The application uses a dual-storage approach: in-memory storage for development and PostgreSQL with Drizzle ORM for production, ensuring type-safe database queries. Browser localStorage is used for game save states and user preferences. The database schema is defined in shared TypeScript files using Zod for validation, including comprehensive schemas for user, character, item, and combat logging systems.

## Game State Management
Game state is managed through the original JavaScript architecture, enhanced with advanced state management systems. This includes centralized state for player data, equipment, inventory, combat status, and zone navigation. Persistence is handled via browser localStorage for saves and preferences, with server synchronization. The combat system features real-time animations with particle effects, damage numbers, and critical hits. An animation engine utilizes CSS keyframes, particle systems, screen shake, and health bar animations, providing visual feedback for various game events. A modular JavaScript architecture has been implemented for better code organization, with dedicated modules for game state, UI elements, hexagonal grid mathematics, background animations, and API communication.

## Game Systems & Features
- **Zone System**: Complete 101-zone system with dynamic generation and proper level requirements. All zones 1-24 are starter zones (Level 1), zones 25-101 have escalating requirements (Level 100 to 400,000). Fixed teleportation system to display all zones with authentic zone names and level-based progression. Fully operational structured zone system with 5-zone repeating pattern (red 4x4, blue 5x5, green 6x6, yellow 7x7, purple 8x8) and server-side zone data properly integrated with frontend minimap display. Features include Sanctuary, Armory, Arcanum, Bank, Revive Station, Gem Crucible, Teleporter with proper emoji display (⚔️🔮🌀🏧🆘💎) and interaction handlers. Recent fix (Aug 2025): Resolved emoji display issues where Bank (🏧) and Revive Station (🆘) were showing as question marks and were non-interactive.
- **Item System**: Three-tier item system (Dropper, Shadow, Echo items) with 20 gear tiers, a Gem System, dual-weapon support, smart drop logic, and mathematical balancing based on GDD exponential formulas. Integrated with GitHub for image assets.
- **Combat System**: Real-time combat animations with CSS keyframes, particle effects, floating damage numbers, enhanced health bars, and screen shake. Includes a 10% critical hit chance with 2x damage.
- **Dev Suite**: A comprehensive Dev Suite Module 1: Dashboard, acting as a central hub for server stats, navigation, and change logs, with admin password protection and database-driven tools for live content management.

# External Dependencies
- **Tailwind CSS**: Loaded via CDN for styling consistency.
- **Google Fonts**: Inter and Orbitron fonts for typography.
- **Express.js**: Backend server for development environment and API.
- **Vite**: Development server integration with hot module replacement.
- **PostgreSQL**: Production database for persistent data storage.
- **Drizzle ORM**: ORM for type-safe database queries with PostgreSQL.
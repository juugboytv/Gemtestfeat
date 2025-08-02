# Overview

Geminus is a browser-based dark fantasy RPG featuring a complete 3,861-line original codebase migrated from Google Gemini Canvas. The game includes sophisticated tabbed interfaces (Equipment, Infusion, Inventory, Stats, Combat, Quest, Settings), hexagonal world map navigation, and enhanced real-time combat animations. Players can explore zones, engage in dynamic combat with visual effects, level up their characters, and customize their gameplay experience with particle effects and animated feedback systems.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client serves the original HTML/JavaScript game file through Vite for development integration. The game features a dark fantasy molten core theme with orange/red glow effects and sophisticated visual systems:

- **Complete Tab System**: Equipment, Infusion, Inventory, Stats, Combat, Quest, Settings tabs
- **Hexagonal World Map**: Player movement with zone navigation and teleportation
- **Real-Time Combat Animations**: CSS keyframe animations, particle effects, damage numbers, screen shake
- **Modal Systems**: Zone teleportation, item actions, bank interface, shop systems
- **Advanced Combat**: Critical hits (10% chance, 2x damage), animated health bars, visual feedback
- **Toast Notifications**: User feedback system with success/error states

## Backend Architecture
The server uses Express.js with Vite integration to serve the original HTML game file. The architecture includes:

- **Static File Serving**: Serves the complete original 3,861-line game through Vite
- **Development Integration**: Hot module replacement and live reloading during development
- **Original Game Preservation**: Maintains exact functionality from Google Gemini Canvas migration

## Data Storage Solutions
The application uses a dual-storage approach:

- **Development**: In-memory storage with a simple interface for CRUD operations
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database queries
- **Local Storage**: Browser localStorage for game save states and user preferences
- **Database Schema**: Defined in shared TypeScript files using Zod for validation

## Game State Management
Game state is managed through the original JavaScript architecture with enhanced animations:

- **Centralized State**: Player data, equipment, inventory, combat status, zone navigation
- **Local Persistence**: Browser localStorage for game saves and user preferences
- **Combat System**: Real-time animations with particle effects, damage numbers, critical hits
- **Animation Engine**: CSS keyframes, particle systems, screen shake, health bar animations
- **Visual Feedback**: Attack flashes, damage shakes, enemy defeat sequences, spell casting effects

## External Dependencies

The game uses minimal external dependencies to maintain the original architecture:

- **Tailwind CSS**: Loaded via CDN for styling consistency with original design
- **Google Fonts**: Inter and Orbitron fonts for typography
- **Express.js**: Backend server for development environment
- **Vite**: Development server integration with hot module replacement

## Recent Changes

**January 2025 - Real-Time Combat Animations Implementation**
- Added comprehensive CSS keyframe animations for combat actions
- Implemented particle effects system (fire, magic, blood particles)
- Created floating damage number animations with color coding
- Enhanced health bar animations with critical health warnings
- Added screen shake effects for critical hits and dramatic moments
- Integrated 10% critical hit chance with 2x damage multiplier
- Upgraded combat interface with animation containers and visual feedback
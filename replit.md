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

**January 2025 - Echo Items GitHub Integration & Dynamic Text Overlay System**
- Updated all Echo Items to use GitHub image URLs instead of object storage paths
- Integrated complete set of Echo item images: weapons, armor, spells, jewelry, shields
- Added new Echo armor pieces: helmet, leggings, chest armor to complete the equipment set
- Implemented dynamic text overlay system for all item types:
  - **Dropper Items**: T1-T20 tier labels using same base images
  - **Shadow Items**: T1-T20 tier labels using same base images  
  - **Echo Items**: T1-T20 tier labels using same base images (10 actual tiers map to T1-T10)
  - **Gem System**: Abbreviation + grade labels (WST1, WST2, etc.) using same base images
- Created unified `getItemTierText()` function for consistent tier/grade display across all game interfaces
- Enhanced Echo Items system with proper GitHub asset management for consistent visual presentation
- Updated Arrow item in starting inventory to use correct dropper item image URL

**January 2025 - UI Customization System Implementation**
- Implemented complete UI customization system with five professional themes
- Added drag-and-drop tab reordering functionality using HTML5 Drag and Drop API
- Created persistent settings system using browser localStorage for theme and tab preferences
- Built comprehensive theme system: Molten Core (default), Aetherial Shard (crystalline cyan), Frostbite (ice blue), Arcane Violet (magical purple), Verdant Growth (forest green)
- Enhanced Settings tab interface with visual theme descriptions and tab layout controls
- Integrated automatic settings persistence and restoration on game load
- Added visual feedback for tab dragging with opacity and rotation effects
- Implemented CSS custom properties dynamic updating for instant theme switching

**January 2025 - Inventory Management UI Fixes**
- Fixed focus button disappearing issue by implementing fixed CSS positioning in bottom-right corner
- Added "Gem Pouch" category to both EquipmentManager and InfusionManager inventory dropdowns
- Resolved architecture confusion between root index.html and client/index.html serving
- Updated inventory naming from "Bag of Gear" to "Armory" for consistency
- Enhanced inventory filtering system with proper category support for all item types

**January 2025 - Canvas Error Resolution & Modern React Architecture Implementation (COMPLETED)**
- ✅ **Phase 1**: Eliminated canvas errors by hiding problematic canvas and implementing working navigation buttons
- ✅ **Phase 2**: Built complete modern React/TypeScript hex map system with SVG-based visualization
- ✅ **Database Integration**: Connected React components to PostgreSQL database with all 101 zones
- ✅ **Game APIs**: Implemented RESTful endpoints for game state, movement, teleportation, zone data
- ✅ **Hybrid Architecture**: Original game functionality preserved while providing modern development foundation
- ✅ **Error-Free Navigation**: Working directional movement buttons replace canvas-based navigation
- ✅ **Future-Ready**: Modern React components ready for banks, shops, quests implementation
- ✅ **Visual Consistency**: Maintained exact dark fantasy molten core theme throughout transition

**January 2025 - Complete Zone System & Database Integration Implementation (COMPLETED)**
- ✅ Completed dynamic zone layouts for all 101 zones using axial coordinate system
- ✅ Zone Blueprint data structure with gridSize, features array, and (Q,R) coordinates  
- ✅ WorldMapManager refactor to load unique layouts per zone dynamically
- ✅ Server-side zone management with PostgreSQL database integration and RESTful API endpoints
- ✅ **Complete 6-building sets: Every zone has Sanctuary, Armory, Arcanum, AetheriumConduit, Teleporter, GemCrucible**
- ✅ **Fixed zone level requirements: All 24 starter zones (1-24) set to level 1 until player reaches level 100**
- ✅ Zone-specific visual themes with different hex colors per zone (4x4 to 10x10 grids)
- ✅ Monster zones fill all remaining hexes for combat availability
- ✅ Replacement of static world map with procedural zone generation from database
- ✅ Foundation for terrain system and strategic zone design
- ✅ Error handling and JavaScript safety checks implemented
- ✅ All 101 zones verified complete with required 6-building sets and correct level requirements
- ✅ PostgreSQL database with complete monster progression (1,100+ monsters across all zones)
- ✅ Database verification confirms every zone has all 6 buildings (sanctuary=1, armory=1, arcanum=1, conduit=1, teleporter=1, gemcrucible=1)
- ✅ **Database seeding completely resolved** - All duplicate key errors fixed, clean zone insertion process
- ✅ **Canvas context safety implemented** - Multiple layers of null reference protection
- ✅ **Server restart and cache management** - Proper application state management
- ✅ Ready for Gilded Vault and Death Penalty system integration

**January 2025 - Geminus Dev Suite Implementation (Module 1: Dashboard)**
- Completed comprehensive Dev Suite with Module 1: Dashboard
- Module 1: Dashboard - Central hub with server stats, quick navigation, and change logs
- Admin password protection with visual interface design following core game aesthetics
- Database-driven tools for live game content management
- Error prevention with strict validation systems and event delegation
- Foundation for 8 modules: Dashboard, Item Editor, Gem Editor, Monster Editor, Zone Editor, Quest Editor, Loot Table Editor, Player Management

**January 2025 - Complete Three-Tier Item System Implementation**
- Implemented comprehensive PostgreSQL database schema with separate tables for all three item types
- Created complete **Dropper Items** system: 20 gear tiers (Crude to Ascended) for store-bought equipment including Steel Arrow weapon
- Built **Shadow Items** system: T1-T20 tiers with GitHub image integration and equipment-based drop logic
- Developed **Echo Items** system: Unique resonance-based progression with 10 tiers and GitHub image integration
- Added **Gem System**: T1-T9 grades with Fighter/Caster/Utility/Farming categories and zone-based drops
- Implemented **Dual-Weapon Support**: Bow+Arrow system with weapon1/weapon2 slots
- Created **Smart Drop Logic**: Shadow items drop based on equipped gear tiers, Echo items require resonance
- Integrated **Mathematical Balance**: All progression follows GDD exponential formulas with perfect scaling
- Established **Visual Asset System**: GitHub URLs for Shadow items, object storage for Echo items
- Built **Equipment Requirements**: Level, stat, and resonance requirements for all item types

**January 2025 - Database Integration and GDD Mathematical Balancing Implementation**
- Implemented complete PostgreSQL database schema with user, character, item, and combat logging systems
- Created comprehensive GDD mathematical balancing system with 400,000 level cap support
- Added 20 gear tiers (Crude to Ascended) with exponential stat scaling and rarity progression
- Integrated zone-based monster scaling with proper level ranges and unlock requirements
- Built game state management system bridging original HTML game with new backend architecture
- Implemented experience requirements with exponential growth and logarithmic dampening for high levels
- Added equipment stat calculation system based on gear tier, level, and equipment type
- Created combat damage calculation with critical hit system and variance mechanics
- Established zone unlock requirements and travel restrictions based on player level

**January 2025 - Real-Time Combat Animations Implementation**
- Added comprehensive CSS keyframe animations for combat actions
- Implemented particle effects system (fire, magic, blood particles)
- Created floating damage number animations with color coding
- Enhanced health bar animations with critical health warnings
- Added screen shake effects for critical hits and dramatic moments
- Integrated 10% critical hit chance with 2x damage multiplier
- Upgraded combat interface with animation containers and visual feedback
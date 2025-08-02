# Overview

Geminus is a browser-based dark fantasy RPG built with React and Express. The game features a tabbed interface for managing character progression, inventory, equipment, spells, and settings. Players can explore zones, engage in combat, level up their characters, and customize their gameplay experience. The application uses a modern tech stack with TypeScript, shadcn/ui components, and a PostgreSQL database for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses React with TypeScript and is built with Vite for fast development and bundling. The UI is constructed using shadcn/ui components with Tailwind CSS for styling, featuring a dark fantasy theme with custom CSS variables and animations. The application follows a component-based architecture with:

- **Main Game Component**: Central game state management and tab navigation
- **Tab System**: Modular tabs for different game aspects (Adventure, Character, Inventory, Equipment, Spells, Settings)
- **Modal System**: Reusable modals for zone teleportation and stat information
- **Custom Hooks**: Game state management, keyboard controls, and mobile detection
- **Toast Notifications**: User feedback system for game actions

## Backend Architecture
The server uses Express.js with TypeScript running on Node.js. The architecture includes:

- **Route Registration**: Centralized route management system
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Middleware**: Request logging, JSON parsing, and error handling
- **Development Integration**: Vite integration for hot module replacement during development

## Data Storage Solutions
The application uses a dual-storage approach:

- **Development**: In-memory storage with a simple interface for CRUD operations
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database queries
- **Local Storage**: Browser localStorage for game save states and user preferences
- **Database Schema**: Defined in shared TypeScript files using Zod for validation

## Game State Management
Game state is managed through custom React hooks with:

- **Centralized State**: Single source of truth for player data, game settings, and current zone
- **Local Persistence**: Automatic save/load functionality using localStorage
- **Validation**: Zod schemas ensure data integrity across client and server
- **Real-time Updates**: State changes immediately reflect in the UI

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@radix-ui/***: Accessible UI component primitives for modals, forms, and interactions
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework with custom theming
- **react-hook-form**: Form state management with validation
- **date-fns**: Date manipulation and formatting utilities
- **lucide-react**: Icon library for UI elements
- **class-variance-authority**: Component variant management
- **embla-carousel-react**: Carousel/slider functionality
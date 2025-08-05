# 📁 GEMINUS PROJECT STRUCTURE

## ✅ ORGANIZED & CLEAN ARCHITECTURE

```
📦 root/
├── 🎮 MAIN GAME (Active)
│   ├── client/
│   │   ├── index.html              # React app entry point
│   │   ├── gameAPI.js              # Client API integration
│   │   └── src/
│   │       ├── App.tsx             # Main app component
│   │       ├── components/
│   │       │   └── GeminusGame.tsx # 🎯 MAIN GAME COMPONENT
│   │       ├── assets/             # Images, fonts, static files
│   │       └── styles/
│   │           └── style.css       # Game CSS themes
│   │
│   ├── server/
│   │   ├── index.ts                # Express server
│   │   ├── vite.ts                 # Vite integration
│   │   ├── routes.ts               # API routes
│   │   ├── gameRoutes.ts           # Game-specific routes
│   │   ├── gameLogic.ts            # Game logic
│   │   ├── storage.ts              # Storage interface
│   │   └── db.ts                   # Database connection
│   │
│   └── js/                         # 🔧 MODULAR UTILITIES (Active)
│       ├── ModuleLoader.js         # Module system
│       ├── data/                   # Zone & monster data
│       ├── modules/                # Game modules
│       ├── services/               # Background animations, APIs
│       ├── templates/              # Development templates
│       ├── tools/                  # Zone generators, processors
│       └── utils/                  # Game state, hex utils, UI
│
├── 📜 PRESERVED ORIGINALS
│   └── legacy/
│       ├── exact_original.html     # 🎯 ORIGINAL GEMINI CANVAS GAME
│       ├── index.html              # Previous main file
│       ├── old_game_backup.html    # Backup version
│       ├── debug_minimap.html      # Debug tools
│       ├── script.js               # Original game script
│       ├── temp_script.js          # Development script
│       ├── temp_zones_35_to_101.txt # Development notes
│       └── original_assets/        # All uploaded assets & attachments
│
├── 🔧 CONFIG & SHARED
│   ├── shared/                     # TypeScript interfaces
│   ├── package.json                # Dependencies
│   ├── vite.config.ts              # Vite configuration
│   ├── tailwind.config.ts          # Tailwind CSS
│   ├── drizzle.config.ts           # Database ORM
│   ├── postcss.config.js           # PostCSS
│   └── replit.md                   # Project documentation
│
└── 📋 DOCUMENTATION
    └── PROJECT_STRUCTURE.md       # This file
```

## 🎯 ACTIVE GAME ENTRY POINTS

1. **Main Game**: `client/src/components/GeminusGame.tsx`
2. **Server**: `server/index.ts`
3. **Original Gemini Code**: `legacy/exact_original.html`

## ✅ MIGRATION STATUS

- [x] Original Google Gemini Canvas game preserved in `legacy/`
- [x] React/Vite modern architecture running the game
- [x] All assets organized in proper folders
- [x] Legacy files safely moved to avoid conflicts
- [x] Modular JavaScript utilities maintained in `js/`
- [x] Clean project structure established

## 🚀 DEVELOPMENT WORKFLOW

To work with the game:
1. Edit React components in `client/src/components/`
2. Add assets to `client/src/assets/`
3. Use utilities from `js/` folder for game logic
4. Reference original code in `legacy/exact_original.html`
5. Server automatically restarts via Vite HMR

The project now has a clean, production-ready structure while preserving all original functionality.
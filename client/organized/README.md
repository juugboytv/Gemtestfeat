# Geminus Organized Structure

This folder contains the organized version of the 6,000-line single-file game.

## Structure
```
organized/
├── index.html              # Main HTML entry point
├── styles/                 # CSS split by functionality
│   ├── main.css           # Theme variables and base styles
│   ├── themes.css         # Theme-specific styles
│   ├── animations.css     # Combat and UI animations
│   └── components.css     # UI component styles
├── scripts/               # JavaScript split by functionality
│   ├── gameState.js       # Core game state management
│   ├── ui.js              # UI controllers and interactions
│   ├── combat.js          # Combat system
│   ├── zones.js           # Zone navigation and hexagonal grid
│   ├── inventory.js       # Inventory and equipment
│   └── main.js            # Game initialization and main loop
└── content/               # HTML fragments
    └── game-body.html     # Main game HTML structure
```

## Benefits of This Organization

1. **Easy Navigation**: Find specific code quickly
2. **Better Debugging**: Isolated systems for easier testing
3. **Team Development**: Multiple developers can work on different files
4. **Maintainability**: Add new features without scrolling through 6,000 lines
5. **Version Control**: Better git diffs and merge conflicts

## How to Use

1. Open `organized/index.html` instead of the main `index.html`
2. All functionality remains identical to the original
3. Edit specific files based on what you want to change:
   - UI styling → `styles/` folder
   - Game logic → `scripts/` folder
   - HTML layout → `content/game-body.html`

## Original File Preserved

The original 6,000-line `client/index.html` is completely preserved and still works.
This organized version is an alternative structure for easier development.
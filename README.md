# LG Caribbean Platformer

A complete modular 2D platformer built with HTML5 Canvas and vanilla JavaScript ES modules. It runs directly from `index.html` in a browser or from any simple static server. The lightweight custom engine is exposed under the `LG` namespace for extensibility.

## Features
- Modular lightweight engine in `src/engine/`
- Caribbean-themed placeholder art rendered procedurally on canvas
- Player FSM: idle, walk, run, jump, fall, crouch, hurt, die
- Enemy FSM: patrol, search, chase, attack, hurt, die
- Green soldiers shoot projectiles; blue soldiers throw arcing grenades with AOE explosions
- JSON-driven levels, registry-based entity factory, parallax backgrounds, checkpoints, doors, switches, chests, keys, coins, health packs
- HUD, main menu, pause menu, options, victory, and defeat screens
- LocalStorage save/resume with checkpoint and level progress
- Graceful audio fallback using synthesized Web Audio tones

## Run
### Option 1: Open directly
Open `index.html` in a modern browser.

### Option 2: Simple static server
```bash
python3 -m http.server
```
Then open `http://localhost:8000`.

You can also use:
```bash
npx serve .
```

## Controls
- `A/D` or `←/→`: move
- `Shift`: run
- `Space` or `Z`: jump
- `S` or `↓`: crouch
- `E`: interact (doors, switches, chests)
- `Esc`: pause/resume

## Architecture
```text
index.html
src/
  engine/
  entities/
    enemies/
    collectibles/
    interactive/
  states/
    player/
    enemy/
  level/
  ui/
assets/
  levels/
  sprites/
  audio/
```

### Engine modules
- `Engine.js`: wires core systems together
- `GameLoop.js`: delta-time RAF loop
- `EventBus.js`: pub/sub messaging
- `ResourceManager.js`: async JSON/image loader with caching
- `ObjectPool.js`: reusable pool utility
- `InputManager.js`: action-based keyboard input
- `SaveManager.js`: LocalStorage persistence
- `SceneManager.js`: scene lifecycle management
- `Physics.js`: gravity and integration
- `Collision.js`: AABB collision/resolution
- `Camera.js`: smoothed follow camera with bounds clamp
- `Animator.js`: configurable frame timing
- `ParticleSystem.js`: explosions/dust/hit particles
- `AudioManager.js`: safe synthesized music/SFX fallback
- `SpriteAtlas.js`: future sprite sheet bridge

## Level JSON schema
Each level file in `assets/levels/` follows this shape:

```json
{
  "id": "level1",
  "name": "Level Name",
  "size": { "width": 3200, "height": 1200 },
  "playerSpawn": { "x": 100, "y": 900 },
  "music": "beach",
  "timer": 180,
  "goal": { "x": 3000, "y": 760, "width": 60, "height": 140 },
  "background": {
    "layers": [
      {
        "speed": 0.3,
        "verticalSpeed": 0.08,
        "color": "rgba(46,132,89,0.55)",
        "shapes": [
          { "type": "hill", "x": 920, "y": 390, "width": 340, "height": 140 }
        ]
      }
    ]
  },
  "platforms": [
    { "x": 0, "y": 940, "width": 580, "height": 180, "themeColor": "#d4b06f", "decor": "sand" }
  ],
  "enemies": [
    { "type": "GreenSoldier", "x": 780, "y": 860, "patrolRange": 90 }
  ],
  "collectibles": [
    { "type": "Coin", "id": "coin_1", "x": 260, "y": 870 }
  ],
  "interactives": [
    { "type": "Checkpoint", "id": "checkpoint_1", "x": 1030, "y": 786 }
  ]
}
```

## Extending the game
### Add a new level
1. Create a new JSON file in `assets/levels/` using the schema above.
2. Add its id/path to `levelOrder` and `levelPaths` in `src/Game.js`.
3. No engine code changes are required.

### Add a new enemy/item type
1. Create a class extending `EnemyBase` or `Entity`.
2. Implement full behavior and rendering in its own file.
3. Register it once with the factory via:
   ```js
   window.LG.registerEntityType('MyNewEnemy', MyNewEnemy);
   ```
   or by adding one registration in your game bootstrap.
4. Reference it by `type` in level JSON.

Because `LevelLoader` instantiates entities through `EntityFactory`, new entity types can be added without modifying loader logic.

### Replace placeholder art/audio later
- Keep the animation/state structure and swap rendering to use `ResourceManager` + `SpriteAtlas`.
- Replace synthesized tones in `AudioManager` with real audio assets while preserving the same `playSfx` and `playMusic` interface.

## Notes
- Save data includes current level, collected item ids, player stats, checkpoint, options, and high score.
- Missing media files do not break the game.

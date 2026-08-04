import { Collision } from './engine/Collision.js';
import { Player } from './entities/Player.js';
import { GreenSoldier } from './entities/enemies/GreenSoldier.js';
import { BlueSoldier } from './entities/enemies/BlueSoldier.js';
import { Coin } from './entities/collectibles/Coin.js';
import { HealthPack } from './entities/collectibles/HealthPack.js';
import { Key } from './entities/collectibles/Key.js';
import { Chest } from './entities/collectibles/Chest.js';
import { Door } from './entities/interactive/Door.js';
import { Switch } from './entities/interactive/Switch.js';
import { Checkpoint } from './entities/interactive/Checkpoint.js';
import { EntityFactory } from './level/EntityFactory.js';
import { LevelLoader } from './level/LevelLoader.js';
import { HUD } from './ui/HUD.js';
import { UIManager } from './ui/UIManager.js';

export class Game {
  constructor(engine) {
    this.engine = engine;
    this.eventBus = engine.eventBus;
    this.ui = new UIManager(document.getElementById('ui-root'), this);
    this.hud = new HUD();
    this.factory = new EntityFactory();
    this.loader = new LevelLoader(engine.resources, this.factory);
    this.levelOrder = ['level1', 'level2'];
    this.levelPaths = {
      level1: './assets/levels/level1.json',
      level2: './assets/levels/level2.json'
    };
    this.options = { musicVolume: 0.5, sfxVolume: 0.7, muted: false };
    this.collectedIds = new Set();
    this.projectiles = [];
    this.enemies = [];
    this.collectibles = [];
    this.interactives = [];
    this.platforms = [];
    this.parallax = [];
    this.currentLevel = 'level1';
    this.currentLevelData = null;
    this.player = null;
    this.goal = null;
    this.timer = 180;
    this.paused = true;
    this.state = 'menu';
    this.pendingRespawn = 0;
    this.bindFactory();
    this.bindEvents();
  }

  bindFactory() {
    this.factory.register('GreenSoldier', GreenSoldier);
    this.factory.register('BlueSoldier', BlueSoldier);
    this.factory.register('Coin', Coin);
    this.factory.register('HealthPack', HealthPack);
    this.factory.register('Key', Key);
    this.factory.register('Chest', Chest);
    this.factory.register('Door', Door);
    this.factory.register('Switch', Switch);
    this.factory.register('Checkpoint', Checkpoint);
  }

  bindEvents() {
    this.eventBus.on('player:died', () => {
      if (this.player.lives < 0) {
        this.state = 'defeat';
        this.paused = true;
        this.ui.showDefeat();
      } else {
        this.pendingRespawn = 0.55;
      }
    });
  }

  async boot() {
    this.applySaveOptions();
    this.ui.showMain();
  }

  applySaveOptions() {
    const save = this.engine.save.load();
    if (save?.options) {
      this.options = { ...this.options, ...save.options };
      this.engine.audio.setVolumes(this.options);
    }
  }

  persist() {
    const existing = this.engine.save.load() || {};
    this.engine.save.save({
      currentLevel: this.currentLevel,
      player: this.player ? {
        health: this.player.health,
        lives: this.player.lives,
        score: this.player.score,
        coins: this.player.coins,
        keys: this.player.keys,
        checkpointId: this.player.checkpointId
      } : null,
      collectedIds: [...this.collectedIds],
      highScore: Math.max(this.player?.score || 0, existing.highScore || 0),
      options: this.options
    });
  }

  async startNewGame() {
    this.collectedIds.clear();
    await this.loadLevel('level1', true);
  }

  async continueGame() {
    const save = this.engine.save.load();
    if (!save) {
      await this.startNewGame();
      return;
    }
    this.collectedIds = new Set(save.collectedIds || []);
    await this.loadLevel(save.currentLevel || 'level1', false, save.player);
  }

  async loadLevel(levelId, resetStats = false, savedPlayer = null) {
    const path = this.levelPaths[levelId];
    const { level, entities } = await this.loader.load(path, this);
    this.currentLevel = levelId;
    this.currentLevelData = level;
    this.level = level;
    this.platforms = level.platforms;
    this.parallax = level.background.layers;
    this.goal = level.goal;
    this.enemies = entities.enemies;
    this.collectibles = entities.collectibles.filter((item) => !this.collectedIds.has(item.id));
    this.interactives = entities.interactives;
    const playerStats = resetStats ? null : savedPlayer;
    this.player = new Player(this, {
      x: level.playerSpawn.x,
      y: level.playerSpawn.y,
      health: playerStats?.health,
      lives: playerStats?.lives ?? 3,
      score: playerStats?.score ?? 0,
      coins: playerStats?.coins ?? 0,
      keys: playerStats?.keys ?? 0,
      checkpointId: playerStats?.checkpointId || null
    });
    const checkpoint = this.interactives.find((item) => item.id === playerStats?.checkpointId);
    if (checkpoint) {
      checkpoint.activeCheckpoint = true;
      this.setCheckpoint(checkpoint, false);
      this.player.position.x = checkpoint.position.x;
      this.player.position.y = checkpoint.position.y - 8;
    }
    this.timer = level.timer;
    this.projectiles = [];
    this.pendingRespawn = 0;
    this.engine.camera.setBounds(level.width, level.height);
    this.engine.audio.playMusic(level.music);
    this.ui.clear();
    this.paused = false;
    this.state = 'playing';
    this.persist();
  }

  markCollected(id) {
    if (!id) return;
    this.collectedIds.add(id);
    this.persist();
  }

  setCheckpoint(checkpoint, save = true) {
    this.player.spawn = { x: checkpoint.position.x, y: checkpoint.position.y - 8 };
    this.player.checkpointId = checkpoint.id;
    if (save) this.persist();
  }

  resolveCollisions(entity) {
    Collision.resolveEntityVsPlatforms(entity, this.platforms);
    const solidDoors = this.interactives.filter((item) => item instanceof Door && !item.open)
      .map((door) => ({ x: door.position.x, y: door.position.y, width: door.width, height: door.height }));
    if (solidDoors.length > 0) {
      Collision.resolveEntityVsPlatforms(entity, solidDoors);
    }
  }

  update(dt) {
    if (this.engine.input.wasPressed('pause')) {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'pause') this.resume();
    }
    if (this.pendingRespawn > 0) {
      this.pendingRespawn -= dt;
      if (this.pendingRespawn <= 0 && this.player.lives >= 0) {
        this.player.respawn();
        this.paused = false;
        this.state = 'playing';
        this.ui.clear();
      }
    }
    if (this.paused || this.state !== 'playing') return;

    this.timer -= dt;
    if (this.timer <= 0) {
      this.player.takeDamage(this.player.maxHealth);
      this.timer = 0;
    }

    this.player.update(dt);
    this.enemies.forEach((enemy) => enemy.update(dt));
    this.collectibles.forEach((item) => item.update(dt));
    this.interactives.forEach((item) => item.update(dt));
    this.projectiles.forEach((item) => item.update(dt));
    this.handleProjectileHits();
    this.cleanup();
    this.engine.camera.follow(this.player);
    if (Collision.aabb(this.player.bounds, this.goal)) {
      this.completeLevel();
    }
  }

  handleProjectileHits() {
    for (const projectile of this.projectiles) {
      if (projectile.remove) continue;
      if (projectile.damage && projectile.owner instanceof GreenSoldier && Collision.aabb(projectile.bounds, this.player.bounds)) {
        this.player.takeDamage(projectile.damage, { knockbackX: projectile.facing * 250, knockbackY: -200 });
        projectile.remove = true;
      }
      for (const platform of this.platforms) {
        if (Collision.aabb(projectile.bounds, platform)) {
          if (typeof projectile.explode === 'function') projectile.explode();
          else projectile.remove = true;
          break;
        }
      }
    }
    for (const enemy of this.enemies) {
      if (!enemy.dead && Collision.aabb(enemy.bounds, this.player.bounds) && this.player.invulnerableTimer <= 0) {
        this.player.takeDamage(enemy.damage, { knockbackX: (this.player.position.x < enemy.position.x ? -240 : 240), knockbackY: -220 });
      }
    }
  }

  cleanup() {
    this.enemies = this.enemies.filter((item) => !item.remove);
    this.collectibles = this.collectibles.filter((item) => !item.remove);
    this.projectiles = this.projectiles.filter((item) => !item.remove);
  }

  render(ctx) {
    this.renderBackground(ctx);
    ctx.save();
    this.renderWorld(ctx);
    this.engine.particles.render(ctx, this.engine.camera);
    ctx.restore();
    if (this.player && ['playing', 'pause'].includes(this.state)) {
      this.hud.render(ctx, this);
    }
  }

  renderBackground(ctx) {
    const camera = this.engine.camera;
    const { width, height } = this.engine.canvas;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, this.currentLevel === 'level2' ? '#5d7ea5' : '#79d8ff');
    gradient.addColorStop(1, this.currentLevel === 'level2' ? '#162c45' : '#1d6b6d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.parallax.forEach((layer) => {
      const offsetX = -camera.x * layer.speed;
      ctx.fillStyle = layer.color;
      layer.shapes.forEach((shape) => {
        const x = shape.x + offsetX;
        const y = shape.y - camera.y * layer.verticalSpeed;
        if (shape.type === 'hill') {
          ctx.beginPath();
          ctx.ellipse(x, y, shape.width, shape.height, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (shape.type === 'rect') {
          ctx.fillRect(x, y, shape.width, shape.height);
        } else if (shape.type === 'waterfall') {
          ctx.fillRect(x, y, shape.width, shape.height);
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(x + shape.width * 0.35, y, shape.width * 0.15, shape.height);
          ctx.fillStyle = layer.color;
        }
      });
    });
  }

  renderWorld(ctx) {
    const camera = this.engine.camera;
    for (const platform of this.platforms) {
      const x = platform.x - camera.x;
      const y = platform.y - camera.y;
      ctx.fillStyle = platform.themeColor || '#7b5a3f';
      ctx.fillRect(x, y, platform.width, platform.height);
      if (platform.decor === 'grass') {
        ctx.fillStyle = '#49a55d';
        ctx.fillRect(x, y, platform.width, 8);
      } else if (platform.decor === 'sand') {
        ctx.fillStyle = '#f0d28a';
        ctx.fillRect(x, y, platform.width, 8);
      } else if (platform.decor === 'stone') {
        ctx.fillStyle = '#8d95a1';
        ctx.fillRect(x, y, platform.width, 8);
      } else if (platform.decor === 'wood') {
        ctx.fillStyle = '#a36f43';
        ctx.fillRect(x, y, platform.width, 8);
      }
    }

    const allEntities = [...this.collectibles, ...this.interactives, ...this.enemies, ...this.projectiles, this.player];
    allEntities.forEach((entity) => entity?.render?.(ctx, camera));

    ctx.strokeStyle = '#ffd166';
    ctx.strokeRect(this.goal.x - camera.x, this.goal.y - camera.y, this.goal.width, this.goal.height);
    ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
    ctx.fillRect(this.goal.x - camera.x, this.goal.y - camera.y, this.goal.width, this.goal.height);
  }

  pause() {
    this.paused = true;
    this.state = 'pause';
    this.ui.showPause();
  }

  resume() {
    this.paused = false;
    this.state = 'playing';
    this.ui.clear();
  }

  showOptions(source) {
    this.paused = true;
    this.state = source === 'pause' ? 'pause' : 'menu';
    this.ui.showOptions(source);
  }

  setOption(key, value) {
    this.options[key] = value;
    this.engine.audio.setVolumes(this.options);
    this.persist();
  }

  async restartLevel(resetLives = false) {
    const playerState = resetLives ? { lives: 3, score: 0, coins: 0, keys: 0, health: 5, checkpointId: null } : {
      lives: this.player.lives,
      score: this.player.score,
      coins: this.player.coins,
      keys: 0,
      health: this.player.maxHealth,
      checkpointId: this.player.checkpointId
    };
    await this.loadLevel(this.currentLevel, false, playerState);
  }

  backToMenu(clearVictory = false) {
    if (clearVictory) {
      this.engine.audio.playSfx('victory');
    }
    this.paused = true;
    this.state = 'menu';
    this.ui.showMain();
  }

  completeLevel() {
    this.paused = true;
    this.state = 'victory';
    this.persist();
    const hasNext = this.levelOrder.indexOf(this.currentLevel) < this.levelOrder.length - 1;
    this.ui.showVictory({ score: this.player.score, coins: this.player.coins, time: this.timer, hasNext });
  }

  async loadNextLevel() {
    const index = this.levelOrder.indexOf(this.currentLevel);
    const next = this.levelOrder[index + 1];
    if (!next) {
      this.backToMenu(true);
      return;
    }
    await this.loadLevel(next, false, {
      lives: this.player.lives,
      score: this.player.score,
      coins: this.player.coins,
      keys: this.player.keys,
      health: this.player.health,
      checkpointId: null
    });
  }
}

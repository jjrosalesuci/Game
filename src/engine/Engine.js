import { EventBus } from './EventBus.js';
import { ResourceManager } from './ResourceManager.js';
import { ObjectPool } from './ObjectPool.js';
import { InputManager } from './InputManager.js';
import { SaveManager } from './SaveManager.js';
import { SceneManager } from './SceneManager.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AudioManager } from './AudioManager.js';
import { SpriteAtlas } from './SpriteAtlas.js';
import { GameLoop } from './GameLoop.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.eventBus = new EventBus();
    this.resources = new ResourceManager();
    this.projectilePool = new ObjectPool(() => ({ active: false }), (item) => {
      Object.assign(item, { active: false });
    }, 24);
    this.input = new InputManager(window);
    this.save = new SaveManager();
    this.scenes = new SceneManager();
    this.physics = new Physics();
    this.camera = new Camera(canvas.width, canvas.height);
    this.particles = new ParticleSystem();
    this.audio = new AudioManager();
    this.atlas = new SpriteAtlas();
    this.loop = new GameLoop((dt) => this.update(dt), () => this.render());
  }

  async start(sceneFactory) {
    this.input.attach();
    await sceneFactory();
    this.loop.start();
  }

  update(dt) {
    this.scenes.update(dt);
    this.particles.update(dt);
    this.input.update();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.scenes.render(this.ctx);
  }
}

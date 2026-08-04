import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Door extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: config.width || 42, height: config.height || 76, color: '#5f3a1f', affectedByGravity: false });
    this.id = config.id;
    this.locked = config.locked ?? true;
    this.requiresKey = config.requiresKey ?? this.locked;
    this.open = !this.locked;
  }

  unlock() {
    this.locked = false;
    this.open = true;
  }

  update(dt) {
    super.update(dt);
    const player = this.game.player;
    if (!Collision.aabb(this.bounds, player.bounds)) return;
    if (this.locked && this.requiresKey && player.keys > 0 && this.game.engine.input.wasPressed('interact')) {
      player.keys -= 1;
      this.unlock();
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = this.open ? '#8fbc8f' : '#5f3a1f';
    ctx.fillRect(x, y, this.width, this.height);
    ctx.fillStyle = this.open ? '#223c22' : '#f1d27a';
    ctx.fillRect(x + this.width - 10, y + this.height / 2, 5, 5);
  }
}

import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class HealthPack extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 22, height: 22, color: '#ff6b6b', affectedByGravity: false });
    this.amount = config.amount || 2;
    this.id = config.id;
  }

  update(dt) {
    super.update(dt);
    if (Collision.aabb(this.bounds, this.game.player.bounds)) {
      this.game.player.heal(this.amount);
      this.game.markCollected(this.id);
      this.remove = true;
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = '#fff2f2';
    ctx.fillRect(x, y + 4, 22, 14);
    ctx.fillStyle = '#ff4d4d';
    ctx.fillRect(x + 8, y, 6, 22);
    ctx.fillRect(x, y + 8, 22, 6);
  }
}

import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Chest extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 34, height: 24, color: '#7d4b27', affectedByGravity: false });
    this.reward = config.reward || { score: 300, coins: 3 };
    this.id = config.id;
    this.opened = false;
  }

  update(dt) {
    super.update(dt);
    if (this.opened) return;
    if (Collision.aabb(this.bounds, this.game.player.bounds) && this.game.engine.input.wasPressed('interact')) {
      this.opened = true;
      this.game.player.addScore(this.reward.score || 0);
      this.game.player.addCoin(this.reward.coins || 0);
      this.game.markCollected(this.id);
      this.game.particles.emit({ x: this.position.x + 14, y: this.position.y, color: '#ffe08a', count: 14, life: 0.6, spreadY: 180 });
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = this.opened ? '#9d7a4a' : '#7d4b27';
    ctx.fillRect(x, y + 8, 34, 16);
    ctx.fillStyle = '#b57a30';
    ctx.fillRect(x, y, 34, 10);
    ctx.fillStyle = '#f1d27a';
    ctx.fillRect(x + 14, y + 6, 6, 10);
  }
}

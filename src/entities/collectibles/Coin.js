import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Coin extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 18, height: 18, color: '#f5c542', affectedByGravity: false });
    this.value = config.value || 1;
    this.id = config.id;
  }

  update(dt) {
    super.update(dt);
    if (Collision.aabb(this.bounds, this.game.player.bounds)) {
      this.game.player.addCoin(this.value);
      this.game.audio.playSfx('coin');
      this.game.eventBus.emit('coin:collected', { coin: this });
      this.game.markCollected(this.id);
      this.remove = true;
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = '#f5c542';
    ctx.beginPath();
    ctx.arc(x + 9, y + 9, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffef9a';
    ctx.stroke();
  }
}

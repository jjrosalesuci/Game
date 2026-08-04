import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Key extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 24, height: 14, color: '#ffd166', affectedByGravity: false });
    this.id = config.id;
  }

  update(dt) {
    super.update(dt);
    if (Collision.aabb(this.bounds, this.game.player.bounds)) {
      this.game.player.addKey(1);
      this.game.markCollected(this.id);
      this.remove = true;
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 6, y + 7, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 11, y + 7);
    ctx.lineTo(x + 22, y + 7);
    ctx.lineTo(x + 19, y + 11);
    ctx.moveTo(x + 17, y + 7);
    ctx.lineTo(x + 17, y + 11);
    ctx.stroke();
  }
}

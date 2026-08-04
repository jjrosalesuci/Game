import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Checkpoint extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 18, height: 64, color: '#ffffff', affectedByGravity: false });
    this.id = config.id;
    this.activeCheckpoint = false;
  }

  update(dt) {
    super.update(dt);
    if (Collision.aabb(this.bounds, this.game.player.bounds) && !this.activeCheckpoint) {
      this.activeCheckpoint = true;
      this.game.setCheckpoint(this);
      this.game.audio.playSfx('checkpoint');
      this.game.eventBus.emit('checkpoint:reached', { checkpoint: this });
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(x + 6, y, 6, 64);
    ctx.fillStyle = this.activeCheckpoint ? '#4ad66d' : '#ffd166';
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 4);
    ctx.lineTo(x + 34, y + 14);
    ctx.lineTo(x + 12, y + 24);
    ctx.closePath();
    ctx.fill();
  }
}

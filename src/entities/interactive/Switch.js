import { Entity } from '../Entity.js';
import { Collision } from '../../engine/Collision.js';

export class Switch extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 28, height: 14, color: '#ca5f2e', affectedByGravity: false });
    this.targetId = config.targetId;
    this.activeSwitch = false;
  }

  update(dt) {
    super.update(dt);
    if (this.activeSwitch) return;
    if (Collision.aabb(this.bounds, this.game.player.bounds) && this.game.engine.input.wasPressed('interact')) {
      const door = this.game.interactives.find((item) => item.id === this.targetId);
      door?.unlock?.();
      this.activeSwitch = true;
    }
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = this.activeSwitch ? '#5ecb75' : '#ca5f2e';
    ctx.fillRect(x, y + 6, this.width, 8);
    ctx.fillStyle = '#f7f0d8';
    ctx.fillRect(x + 10, y, 8, 10);
  }
}

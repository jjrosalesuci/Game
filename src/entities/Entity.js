import { Animator } from '../engine/Animator.js';

export class Entity {
  constructor(game, config = {}) {
    this.game = game;
    this.position = { x: config.x || 0, y: config.y || 0 };
    this.velocity = { x: 0, y: 0 };
    this.width = config.width || 32;
    this.height = config.height || 32;
    this.color = config.color || '#ffffff';
    this.facing = 1;
    this.onGround = false;
    this.affectedByGravity = config.affectedByGravity ?? true;
    this.active = true;
    this.remove = false;
    this.animator = new Animator(config.animations || {});
    this.tags = new Set(config.tags || []);
  }

  get bounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  update(dt) {
    this.animator.update(dt);
  }

  drawBody(ctx, camera, frame = null) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    const palette = frame?.palette || { primary: this.color, secondary: '#111111', accent: '#ffffff' };
    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    ctx.scale(this.facing, 1);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.primary;
    ctx.fillRect(4, 6, this.width - 8, this.height - 10);
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(7, 0, this.width - 14, 12);
    ctx.fillStyle = palette.accent;
    ctx.fillRect(this.width - 12, 4, 4, 4);
    ctx.restore();
  }

  render(ctx, camera) {
    this.drawBody(ctx, camera, this.animator.getFrame());
  }
}

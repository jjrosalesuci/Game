import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 12, height: 6, color: '#ffd166', affectedByGravity: false });
    this.owner = config.owner || null;
    this.damage = config.damage || 1;
    this.speed = config.speed || 420;
    this.life = config.life || 2;
    this.velocity.x = this.speed * (config.direction || 1);
    this.facing = config.direction || 1;
  }

  update(dt) {
    super.update(dt);
    this.life -= dt;
    if (this.life <= 0) this.remove = true;
    this.position.x += this.velocity.x * dt;
  }

  render(ctx, camera) {
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(this.position.x - camera.x, this.position.y - camera.y, this.width, this.height);
  }
}

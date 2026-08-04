import { Entity } from './Entity.js';

export class Grenade extends Entity {
  constructor(game, config = {}) {
    super(game, { ...config, width: 14, height: 14, color: '#4d4d4d', affectedByGravity: true });
    this.owner = config.owner || null;
    this.damage = config.damage || 2;
    this.radius = config.radius || 80;
    this.timer = config.timer || 1.6;
    this.velocity.x = config.vx || 180;
    this.velocity.y = config.vy || -480;
  }

  update(dt) {
    super.update(dt);
    this.game.physics.apply(this, dt);
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.timer -= dt;
    if (this.timer <= 0 || this.position.y > this.game.level.height + 300) {
      this.explode();
    }
  }

  explode() {
    if (this.remove) return;
    this.game.particles.emit({
      x: this.position.x,
      y: this.position.y,
      count: 22,
      color: '#ff8c42',
      spreadX: 360,
      spreadY: 280,
      life: 0.8,
      size: 6
    });
    this.game.audio.playSfx('explosion');
    const player = this.game.player;
    if (player && !player.dead) {
      const dx = (player.position.x + player.width / 2) - this.position.x;
      const dy = (player.position.y + player.height / 2) - this.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= this.radius) {
        player.takeDamage(this.damage, { knockbackX: Math.sign(dx) * 260, knockbackY: -260 });
      }
    }
    this.remove = true;
  }

  render(ctx, camera) {
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.fillStyle = '#2f2f2f';
    ctx.beginPath();
    ctx.arc(x + this.width / 2, y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f8d34f';
    ctx.beginPath();
    ctx.moveTo(x + 7, y + 2);
    ctx.lineTo(x + 10, y - 4);
    ctx.stroke();
  }
}

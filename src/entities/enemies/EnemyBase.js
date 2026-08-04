import { Entity } from '../Entity.js';
import { EnemyStateMachine } from '../../states/EnemyStateMachine.js';

export class EnemyBase extends Entity {
  constructor(game, config = {}) {
    super(game, {
      ...config,
      width: config.width || 34,
      height: config.height || 50,
      animations: config.animations,
      color: config.color
    });
    this.maxHealth = config.maxHealth || 2;
    this.health = this.maxHealth;
    this.damage = config.damage || 1;
    this.speed = config.speed || 110;
    this.visionRange = config.visionRange || 340;
    this.attackRange = config.attackRange || 260;
    this.patrolRange = config.patrolRange || 120;
    this.originX = this.position.x;
    this.attackCooldown = 0;
    this.hurtTimer = 0;
    this.dead = false;
    this.searchTimer = 0;
    this.stateMachine = new EnemyStateMachine(this);
  }

  canSeePlayer() {
    const player = this.game.player;
    if (!player || player.dead) return false;
    const dx = player.position.x - this.position.x;
    const dy = Math.abs(player.position.y - this.position.y);
    return Math.abs(dx) <= this.visionRange && dy < 120;
  }

  canAttackPlayer() {
    const player = this.game.player;
    if (!player || player.dead || this.attackCooldown > 0) return false;
    const dx = player.position.x - this.position.x;
    const dy = Math.abs(player.position.y - this.position.y);
    return Math.abs(dx) <= this.attackRange && dy < 90;
  }

  patrol(dt) {
    if (this.position.x <= this.originX - this.patrolRange) this.facing = 1;
    if (this.position.x >= this.originX + this.patrolRange) this.facing = -1;
    this.velocity.x = this.facing * this.speed;
  }

  chase() {
    const player = this.game.player;
    this.facing = player.position.x >= this.position.x ? 1 : -1;
    this.velocity.x = this.facing * (this.speed + 35);
  }

  attack() {}

  takeDamage(amount, knockbackX = 0) {
    if (this.dead) return;
    this.health -= amount;
    this.hurtTimer = 0.25;
    this.velocity.x = knockbackX;
    this.game.particles.emit({ x: this.position.x + this.width / 2, y: this.position.y + 20, color: '#ffcc66', count: 8, life: 0.4 });
    if (this.health <= 0) {
      this.dead = true;
      this.game.eventBus.emit('enemy:killed', { enemy: this });
      this.game.player.addScore(150);
    }
  }

  update(dt) {
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.hurtTimer > 0) this.hurtTimer -= dt;
    if (!this.dead) {
      this.game.physics.apply(this, dt);
      this.game.physics.integrate(this, dt);
      this.game.resolveCollisions(this);
      if (this.onGround && Math.abs(this.velocity.x) < 3 && this.stateMachine.current?.name !== 'attack') {
        this.velocity.x = this.facing * this.speed;
      }
    }
    this.stateMachine.update(dt);
    super.update(dt);
  }

  render(ctx, camera) {
    const frame = this.animator.getFrame();
    const palette = frame?.palette || { primary: this.color, secondary: '#25445a', accent: '#fefefe' };
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y;
    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    ctx.scale(this.facing, 1);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(7, 10, 20, 12);
    ctx.fillStyle = palette.primary;
    ctx.fillRect(10, 2, 14, 12);
    ctx.fillStyle = '#37220f';
    ctx.fillRect(10, 18, 14, 18);
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(8, 18, 6, 22);
    ctx.fillRect(20, 18, 6, 22);
    ctx.fillStyle = palette.accent;
    ctx.fillRect(this.facing === 1 ? 21 : 10, 7, 3, 3);
    ctx.fillStyle = '#3e3e3e';
    ctx.fillRect(2, 22, 14, 4);
    ctx.restore();
  }
}

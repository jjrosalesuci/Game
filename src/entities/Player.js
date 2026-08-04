import { Entity } from './Entity.js';
import { PlayerStateMachine } from '../states/PlayerStateMachine.js';

function createAnimations() {
  const makeFrames = (primary, secondary, accent, count = 4) => ({
    frameDuration: 0.14,
    frames: Array.from({ length: count }, (_, index) => ({
      palette: { primary, secondary, accent },
      bob: index % 2 === 0 ? 0 : 2
    }))
  });

  return {
    idle: { frameDuration: 0.22, frames: [{ palette: { primary: '#f2a65a', secondary: '#3b6d8c', accent: '#fefefe' } }] },
    walk: makeFrames('#f2a65a', '#3b6d8c', '#fefefe'),
    run: { frameDuration: 0.09, frames: makeFrames('#f2a65a', '#2f5275', '#ffffff', 6).frames },
    jump: { frameDuration: 0.12, frames: [{ palette: { primary: '#f2a65a', secondary: '#315b7c', accent: '#ffffff' } }] },
    fall: { frameDuration: 0.12, frames: [{ palette: { primary: '#e88b4d', secondary: '#315b7c', accent: '#ffffff' } }] },
    crouch: { frameDuration: 0.18, frames: [{ palette: { primary: '#f2a65a', secondary: '#26445c', accent: '#ffffff' } }] },
    hurt: { frameDuration: 0.08, frames: [{ palette: { primary: '#ff6b6b', secondary: '#5c1f1f', accent: '#fff' } }] },
    die: { frameDuration: 0.2, frames: [{ palette: { primary: '#7c1f1f', secondary: '#241212', accent: '#fff' } }] }
  };
}

export class Player extends Entity {
  constructor(game, config = {}) {
    super(game, { x: config.x, y: config.y, width: 34, height: 52, animations: createAnimations(), color: '#f2a65a' });
    this.input = game.engine.input;
    this.walkSpeed = 220;
    this.runSpeed = 330;
    this.acceleration = 1900;
    this.friction = 1800;
    this.jumpForce = 690;
    this.maxHealth = 5;
    this.health = config.health ?? this.maxHealth;
    this.lives = config.lives ?? 3;
    this.score = config.score ?? 0;
    this.coins = config.coins ?? 0;
    this.keys = config.keys ?? 0;
    this.invulnerableTimer = 0;
    this.hurtTimer = 0;
    this.dead = false;
    this.checkpointId = config.checkpointId || null;
    this.spawn = { x: config.x, y: config.y };
    this.stateMachine = new PlayerStateMachine(this);
    this.animator.play('idle');
  }

  get running() {
    return this.input.isDown('run');
  }

  applyFriction(dt) {
    const amount = this.friction * dt;
    if (Math.abs(this.velocity.x) <= amount) {
      this.velocity.x = 0;
    } else {
      this.velocity.x -= Math.sign(this.velocity.x) * amount;
    }
  }

  moveHorizontal(targetSpeed, dt, factor = 1) {
    const direction = (this.input.isDown('right') ? 1 : 0) - (this.input.isDown('left') ? 1 : 0);
    if (direction === 0) {
      this.applyFriction(dt);
      return;
    }
    this.facing = direction;
    const desired = direction * targetSpeed * factor;
    const delta = desired - this.velocity.x;
    const maxStep = this.acceleration * factor * dt;
    this.velocity.x += Math.max(-maxStep, Math.min(maxStep, delta));
  }

  jump() {
    if (!this.onGround || this.dead) return;
    this.velocity.y = -this.jumpForce;
    this.onGround = false;
    this.game.audio.playSfx('jump');
  }

  takeDamage(amount, knockback = { knockbackX: 0, knockbackY: -180 }) {
    if (this.invulnerableTimer > 0 || this.dead) return;
    this.health -= amount;
    this.invulnerableTimer = 1.1;
    this.hurtTimer = 0.35;
    this.velocity.x = knockback.knockbackX || 0;
    this.velocity.y = knockback.knockbackY || -180;
    this.game.audio.playSfx('hurt');
    this.game.particles.emit({ x: this.position.x + this.width / 2, y: this.position.y + 20, color: '#ff6b6b', count: 10, life: 0.45 });
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.lives -= 1;
    this.game.eventBus.emit('player:died', { lives: this.lives });
  }

  respawn() {
    this.dead = false;
    this.health = this.maxHealth;
    this.invulnerableTimer = 1;
    this.hurtTimer = 0;
    this.position.x = this.spawn.x;
    this.position.y = this.spawn.y;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addScore(amount) {
    this.score += amount;
  }

  addCoin(amount = 1) {
    this.coins += amount;
    this.addScore(50 * amount);
  }

  addKey(amount = 1) {
    this.keys += amount;
  }

  update(dt) {
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.hurtTimer > 0) this.hurtTimer -= dt;

    if (!this.dead) {
      if (this.input.wasPressed('jump')) {
        this.jump();
      }
      if (this.stateMachine.current?.name === 'idle') {
        this.moveHorizontal(this.running ? this.runSpeed : this.walkSpeed, dt);
      }
      this.game.physics.apply(this, dt);
      this.game.physics.integrate(this, dt);
      this.game.resolveCollisions(this);
      if (this.position.y > this.game.level.height + 300) {
        this.takeDamage(this.maxHealth);
      }
    }

    this.stateMachine.update(dt);
    super.update(dt);
  }

  render(ctx, camera) {
    const frame = this.animator.getFrame();
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 20) % 2 === 0) return;
    const x = this.position.x - camera.x;
    const y = this.position.y - camera.y + (frame?.bob || 0);
    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    ctx.scale(this.facing, 1);
    ctx.translate(-this.width / 2, -this.height / 2);
    const palette = frame?.palette || { primary: '#f2a65a', secondary: '#3b6d8c', accent: '#fff' };
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(8, 8, 18, 12);
    ctx.fillStyle = palette.primary;
    ctx.fillRect(10, 2, 14, 12);
    ctx.fillStyle = '#2e1b10';
    ctx.fillRect(10, 18, 14, 18);
    ctx.fillStyle = palette.secondary;
    ctx.fillRect(8, 18, 6, 22);
    ctx.fillRect(20, 18, 6, 22);
    ctx.fillStyle = palette.accent;
    ctx.fillRect(20, 6, 3, 3);
    ctx.fillStyle = '#6b3b22';
    ctx.fillRect(9, 40, 6, 10);
    ctx.fillRect(19, 40, 6, 10);
    if (this.stateMachine.current?.name === 'crouch') {
      ctx.fillStyle = '#274b63';
      ctx.fillRect(6, 22, 22, 16);
    }
    ctx.restore();
  }
}

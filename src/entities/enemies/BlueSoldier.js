import { EnemyBase } from './EnemyBase.js';
import { Grenade } from '../Grenade.js';

function animations() {
  const palette = { primary: '#4d7cff', secondary: '#243f73', accent: '#ffffff' };
  const hurt = { primary: '#9f4f4f', secondary: '#4c2424', accent: '#fff' };
  return {
    idle: { frameDuration: 0.2, frames: [{ palette }] },
    walk: { frameDuration: 0.16, frames: [{ palette }, { palette: { ...palette, accent: '#dce6ff' } }] },
    run: { frameDuration: 0.1, frames: [{ palette }, { palette: { ...palette, accent: '#edf4ff' } }] },
    attack: { frameDuration: 0.14, frames: [{ palette: { ...palette, accent: '#ffca5a' } }] },
    hurt: { frameDuration: 0.12, frames: [{ palette: hurt }] },
    die: { frameDuration: 0.2, frames: [{ palette: hurt }] }
  };
}

export class BlueSoldier extends EnemyBase {
  constructor(game, config = {}) {
    super(game, {
      ...config,
      color: '#4d7cff',
      animations: animations(),
      maxHealth: 4,
      speed: 120,
      damage: 2,
      attackRange: 320,
      patrolRange: config.patrolRange || 170,
      visionRange: 460
    });
    this.animator.play('walk');
  }

  attack() {
    this.attackCooldown = 1.9;
    this.facing = this.game.player.position.x >= this.position.x ? 1 : -1;
    const dx = this.game.player.position.x - this.position.x;
    const grenade = new Grenade(this.game, {
      x: this.position.x + this.width / 2,
      y: this.position.y,
      owner: this,
      damage: this.damage,
      vx: this.facing * Math.min(260, Math.max(150, Math.abs(dx) * 0.8)),
      vy: -520
    });
    this.game.projectiles.push(grenade);
    this.game.audio.playSfx('shoot');
  }
}

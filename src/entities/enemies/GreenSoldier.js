import { EnemyBase } from './EnemyBase.js';
import { Projectile } from '../Projectile.js';

function animations() {
  const palette = { primary: '#3ba55d', secondary: '#274b36', accent: '#fefefe' };
  const hurt = { primary: '#b24c4c', secondary: '#492020', accent: '#fff' };
  return {
    idle: { frameDuration: 0.2, frames: [{ palette }] },
    walk: { frameDuration: 0.18, frames: [{ palette }, { palette: { ...palette, accent: '#dff5e6' } }] },
    run: { frameDuration: 0.12, frames: [{ palette }, { palette: { ...palette, accent: '#c2ffd6' } }] },
    attack: { frameDuration: 0.14, frames: [{ palette: { ...palette, accent: '#ffd166' } }] },
    hurt: { frameDuration: 0.12, frames: [{ palette: hurt }] },
    die: { frameDuration: 0.2, frames: [{ palette: hurt }] }
  };
}

export class GreenSoldier extends EnemyBase {
  constructor(game, config = {}) {
    super(game, {
      ...config,
      color: '#3ba55d',
      animations: animations(),
      maxHealth: 2,
      speed: 95,
      damage: 1,
      attackRange: 280,
      patrolRange: config.patrolRange || 110,
      visionRange: 380
    });
    this.animator.play('walk');
  }

  attack() {
    this.attackCooldown = 1.1;
    this.facing = this.game.player.position.x >= this.position.x ? 1 : -1;
    const projectile = new Projectile(this.game, {
      x: this.position.x + this.width / 2,
      y: this.position.y + 20,
      direction: this.facing,
      owner: this,
      damage: this.damage,
      speed: 420
    });
    this.game.projectiles.push(projectile);
    this.game.audio.playSfx('shoot');
  }
}

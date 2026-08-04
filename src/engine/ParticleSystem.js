export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(config) {
    const count = config.count || 10;
    for (let i = 0; i < count; i += 1) {
      this.particles.push({
        x: config.x,
        y: config.y,
        vx: (Math.random() - 0.5) * (config.spreadX || 200),
        vy: (Math.random() - 0.5) * (config.spreadY || 200),
        life: config.life || 0.6,
        maxLife: config.life || 0.6,
        size: config.size || 4,
        color: config.color || '#ffffff',
        gravity: config.gravity ?? 600
      });
    }
  }

  update(dt) {
    for (const particle of this.particles) {
      particle.life -= dt;
      particle.vy += particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  render(ctx, camera) {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - camera.x, particle.y - camera.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
  }
}

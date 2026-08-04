export class Physics {
  constructor(gravity = 1800) {
    this.gravity = gravity;
  }

  apply(entity, dt) {
    if (!entity.affectedByGravity) return;
    entity.velocity.y += this.gravity * dt;
  }

  integrate(entity, dt) {
    entity.position.x += entity.velocity.x * dt;
    entity.position.y += entity.velocity.y * dt;
  }
}

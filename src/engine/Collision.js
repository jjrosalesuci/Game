export class Collision {
  static aabb(a, b) {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  static resolveEntityVsPlatforms(entity, platforms) {
    entity.onGround = false;
    for (const platform of platforms) {
      if (!Collision.aabb(entity.bounds, platform)) continue;

      const overlapX1 = entity.bounds.x + entity.bounds.width - platform.x;
      const overlapX2 = platform.x + platform.width - entity.bounds.x;
      const overlapY1 = entity.bounds.y + entity.bounds.height - platform.y;
      const overlapY2 = platform.y + platform.height - entity.bounds.y;
      const minX = Math.min(overlapX1, overlapX2);
      const minY = Math.min(overlapY1, overlapY2);

      if (minY < minX) {
        if (overlapY1 < overlapY2) {
          entity.position.y = platform.y - entity.height;
          entity.velocity.y = 0;
          entity.onGround = true;
        } else {
          entity.position.y = platform.y + platform.height;
          entity.velocity.y = Math.max(0, entity.velocity.y);
        }
      } else if (overlapX1 < overlapX2) {
        entity.position.x = platform.x - entity.width;
        entity.velocity.x = Math.min(0, entity.velocity.x);
      } else {
        entity.position.x = platform.x + platform.width;
        entity.velocity.x = Math.max(0, entity.velocity.x);
      }
    }
  }
}

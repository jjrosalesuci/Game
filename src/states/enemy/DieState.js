export const DieState = {
  name: 'die',
  enter(enemy) {
    enemy.animator.play('die');
    enemy.deathTimer = 0.6;
  },
  update(enemy, dt) {
    enemy.deathTimer -= dt;
    if (enemy.deathTimer <= 0) enemy.remove = true;
  }
};

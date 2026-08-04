export const SearchState = {
  name: 'search',
  enter(enemy) {
    enemy.animator.play('idle');
    enemy.searchTimer = 1.4;
  },
  update(enemy, dt, machine) {
    if (enemy.dead) return machine.set('die');
    if (enemy.canSeePlayer()) return machine.set('chase');
    enemy.searchTimer -= dt;
    if (enemy.searchTimer <= 0) machine.set('patrol');
  }
};

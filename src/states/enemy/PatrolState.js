export const PatrolState = {
  name: 'patrol',
  enter(enemy) { enemy.animator.play('walk'); },
  update(enemy, dt, machine) {
    if (enemy.dead) return machine.set('die');
    if (enemy.hurtTimer > 0) return machine.set('hurt');
    if (enemy.canAttackPlayer()) return machine.set('attack');
    if (enemy.canSeePlayer()) return machine.set('chase');
    enemy.patrol(dt);
  }
};

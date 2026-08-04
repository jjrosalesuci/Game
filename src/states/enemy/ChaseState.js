export const ChaseState = {
  name: 'chase',
  enter(enemy) { enemy.animator.play('run'); },
  update(enemy, dt, machine) {
    if (enemy.dead) return machine.set('die');
    if (enemy.hurtTimer > 0) return machine.set('hurt');
    if (enemy.canAttackPlayer()) return machine.set('attack');
    if (!enemy.canSeePlayer()) return machine.set('search');
    enemy.chase(dt);
  }
};

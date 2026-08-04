export const AttackState = {
  name: 'attack',
  enter(enemy) {
    enemy.animator.play('attack');
    enemy.attack();
  },
  update(enemy, dt, machine) {
    if (enemy.dead) return machine.set('die');
    if (enemy.hurtTimer > 0) return machine.set('hurt');
    if (!enemy.canAttackPlayer()) {
      machine.set(enemy.canSeePlayer() ? 'chase' : 'search');
    }
  }
};

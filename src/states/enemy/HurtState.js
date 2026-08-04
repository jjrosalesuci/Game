export const HurtState = {
  name: 'hurt',
  enter(enemy) { enemy.animator.play('hurt'); },
  update(enemy, dt, machine) {
    if (enemy.dead) return machine.set('die');
    if (enemy.hurtTimer <= 0) machine.set(enemy.canSeePlayer() ? 'chase' : 'patrol');
  }
};

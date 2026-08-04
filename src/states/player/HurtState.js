export const HurtState = {
  name: 'hurt',
  enter(player) { player.animator.play('hurt'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (player.hurtTimer <= 0) {
      return machine.set(player.onGround ? 'idle' : 'fall');
    }
  }
};

export const IdleState = {
  name: 'idle',
  enter(player) { player.animator.play('idle'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (!player.onGround) return machine.set(player.velocity.y < 0 ? 'jump' : 'fall');
    if (player.hurtTimer > 0) return machine.set('hurt');
    if (player.input.isDown('down')) return machine.set('crouch');
    if (Math.abs(player.velocity.x) > 5) {
      return machine.set(player.running ? 'run' : 'walk');
    }
    player.applyFriction(dt);
  }
};

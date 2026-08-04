export const FallState = {
  name: 'fall',
  enter(player) { player.animator.play('fall'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (player.hurtTimer > 0) return machine.set('hurt');
    if (player.onGround) return machine.set(Math.abs(player.velocity.x) > 10 ? (player.running ? 'run' : 'walk') : 'idle');
    player.moveHorizontal(player.running ? player.runSpeed : player.walkSpeed, dt, 0.65);
  }
};

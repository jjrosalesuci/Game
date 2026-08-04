export const JumpState = {
  name: 'jump',
  enter(player) { player.animator.play('jump'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (player.hurtTimer > 0) return machine.set('hurt');
    if (player.velocity.y >= 0) return machine.set('fall');
    player.moveHorizontal(player.running ? player.runSpeed : player.walkSpeed, dt, 0.65);
  }
};

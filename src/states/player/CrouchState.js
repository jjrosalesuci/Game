export const CrouchState = {
  name: 'crouch',
  enter(player) { player.animator.play('crouch'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (!player.input.isDown('down')) return machine.set('idle');
    player.applyFriction(dt);
  }
};

export const WalkState = {
  name: 'walk',
  enter(player) { player.animator.play('walk'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (player.hurtTimer > 0) return machine.set('hurt');
    if (!player.onGround) return machine.set(player.velocity.y < 0 ? 'jump' : 'fall');
    if (player.input.isDown('down')) return machine.set('crouch');
    if (player.running) return machine.set('run');
    if (Math.abs(player.velocity.x) < 5) return machine.set('idle');
    player.moveHorizontal(player.walkSpeed, dt);
  }
};

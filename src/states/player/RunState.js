export const RunState = {
  name: 'run',
  enter(player) { player.animator.play('run'); },
  update(player, dt, machine) {
    if (player.dead) return machine.set('die');
    if (player.hurtTimer > 0) return machine.set('hurt');
    if (!player.onGround) return machine.set(player.velocity.y < 0 ? 'jump' : 'fall');
    if (!player.running) return machine.set('walk');
    if (Math.abs(player.velocity.x) < 5) return machine.set('idle');
    player.moveHorizontal(player.runSpeed, dt);
  }
};

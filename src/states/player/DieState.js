export const DieState = {
  name: 'die',
  enter(player) { player.animator.play('die'); },
  update() {}
};

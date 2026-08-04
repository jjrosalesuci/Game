export class Animator {
  constructor(animations = {}) {
    this.animations = animations;
    this.current = null;
    this.frameIndex = 0;
    this.elapsed = 0;
  }

  play(name) {
    if (this.current === name) return;
    this.current = name;
    this.frameIndex = 0;
    this.elapsed = 0;
  }

  update(dt) {
    const animation = this.animations[this.current];
    if (!animation || animation.frames.length <= 1) return;
    this.elapsed += dt;
    if (this.elapsed >= animation.frameDuration) {
      this.elapsed = 0;
      this.frameIndex = (this.frameIndex + 1) % animation.frames.length;
    }
  }

  getFrame() {
    const animation = this.animations[this.current];
    if (!animation) return null;
    return animation.frames[this.frameIndex];
  }
}

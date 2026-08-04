export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
    this.running = false;
    this.rafId = null;
    this.tick = this.tick.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  tick(time) {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 1 / 30);
    this.lastTime = time;
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  }
}

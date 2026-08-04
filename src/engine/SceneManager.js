export class SceneManager {
  constructor() {
    this.current = null;
  }

  setScene(scene) {
    if (this.current?.exit) {
      this.current.exit();
    }
    this.current = scene;
    if (this.current?.enter) {
      this.current.enter();
    }
  }

  update(dt) {
    this.current?.update?.(dt);
  }

  render(ctx) {
    this.current?.render?.(ctx);
  }
}

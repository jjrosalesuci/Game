export class Camera {
  constructor(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.x = 0;
    this.y = 0;
    this.smoothing = 0.12;
    this.bounds = { width: viewWidth, height: viewHeight };
  }

  setBounds(width, height) {
    this.bounds.width = width;
    this.bounds.height = height;
  }

  follow(target) {
    const targetX = target.position.x + target.width / 2 - this.viewWidth / 2;
    const targetY = target.position.y + target.height / 2 - this.viewHeight / 2;
    this.x += (targetX - this.x) * this.smoothing;
    this.y += (targetY - this.y) * this.smoothing;
    this.x = Math.max(0, Math.min(this.x, this.bounds.width - this.viewWidth));
    this.y = Math.max(0, Math.min(this.y, this.bounds.height - this.viewHeight));
  }
}

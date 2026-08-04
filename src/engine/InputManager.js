export class InputManager {
  constructor(target = window) {
    this.keys = new Map();
    this.justPressed = new Set();
    this.target = target;
    this.enabled = true;
    this.keyMap = {
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
      ArrowUp: 'up',
      KeyW: 'up',
      Space: 'jump',
      KeyZ: 'jump',
      ShiftLeft: 'run',
      ShiftRight: 'run',
      ArrowDown: 'down',
      KeyS: 'down',
      Escape: 'pause',
      KeyE: 'interact',
      Enter: 'confirm'
    };
    this.boundDown = (event) => this.handleKey(event, true);
    this.boundUp = (event) => this.handleKey(event, false);
  }

  attach() {
    this.target.addEventListener('keydown', this.boundDown);
    this.target.addEventListener('keyup', this.boundUp);
  }

  detach() {
    this.target.removeEventListener('keydown', this.boundDown);
    this.target.removeEventListener('keyup', this.boundUp);
  }

  handleKey(event, pressed) {
    const action = this.keyMap[event.code];
    if (!action) return;
    event.preventDefault();
    if (!this.enabled) return;
    const wasPressed = this.keys.get(action) || false;
    this.keys.set(action, pressed);
    if (pressed && !wasPressed) {
      this.justPressed.add(action);
    }
  }

  isDown(action) {
    return this.keys.get(action) || false;
  }

  wasPressed(action) {
    return this.justPressed.has(action);
  }

  update() {
    this.justPressed.clear();
  }

  clear() {
    this.keys.clear();
    this.justPressed.clear();
  }
}

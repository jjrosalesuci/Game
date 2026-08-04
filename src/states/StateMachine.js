export class StateMachine {
  constructor(owner, states) {
    this.owner = owner;
    this.states = states;
    this.current = null;
  }

  set(name) {
    if (this.current?.name === name) return;
    this.current?.exit?.(this.owner);
    this.current = this.states[name];
    this.current?.enter?.(this.owner);
  }

  update(dt) {
    this.current?.update?.(this.owner, dt, this);
  }
}

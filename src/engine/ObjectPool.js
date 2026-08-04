export class ObjectPool {
  constructor(factory, resetter = null, initialSize = 0) {
    this.factory = factory;
    this.resetter = resetter;
    this.available = [];
    this.inUse = new Set();
    for (let i = 0; i < initialSize; i += 1) {
      this.available.push(this.factory());
    }
  }

  acquire(...args) {
    const item = this.available.pop() || this.factory();
    if (this.resetter) {
      this.resetter(item, ...args);
    }
    this.inUse.add(item);
    return item;
  }

  release(item) {
    if (!this.inUse.has(item)) return;
    this.inUse.delete(item);
    this.available.push(item);
  }

  forEachInUse(callback) {
    for (const item of this.inUse) {
      callback(item);
    }
  }
}

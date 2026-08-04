export class EntityFactory {
  constructor() {
    this.registry = new Map();
  }

  register(type, ctor) {
    this.registry.set(type, ctor);
  }

  create(type, game, config) {
    const Ctor = this.registry.get(type);
    if (!Ctor) {
      throw new Error(`Unregistered entity type: ${type}`);
    }
    return new Ctor(game, config);
  }
}

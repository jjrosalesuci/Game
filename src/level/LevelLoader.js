import { LevelParser } from './LevelParser.js';

export class LevelLoader {
  constructor(resourceManager, entityFactory) {
    this.resourceManager = resourceManager;
    this.entityFactory = entityFactory;
    this.parser = new LevelParser();
  }

  async load(path, game) {
    const raw = await this.resourceManager.loadJSON(path);
    const level = this.parser.parse(raw);
    const entities = {
      enemies: level.enemies.map((entry) => this.entityFactory.create(entry.type, game, entry)),
      collectibles: level.collectibles.map((entry) => this.entityFactory.create(entry.type, game, entry)),
      interactives: level.interactives.map((entry) => this.entityFactory.create(entry.type, game, entry))
    };
    return { level, entities };
  }
}

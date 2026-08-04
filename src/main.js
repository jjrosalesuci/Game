import { Engine } from './engine/Engine.js';
import { Game } from './Game.js';

window.LG = {};

const canvas = document.getElementById('gameCanvas');
const engine = new Engine(canvas);
const game = new Game(engine);

window.LG.engine = engine;
window.LG.game = game;
window.LG.registerEntityType = (type, ctor) => game.factory.register(type, ctor);

engine.scenes.setScene({
  enter: () => game.boot(),
  update: (dt) => game.update(dt),
  render: (ctx) => game.render(ctx)
});

engine.start(async () => Promise.resolve());

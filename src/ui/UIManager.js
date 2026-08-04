import { MainMenu } from './MainMenu.js';
import { PauseMenu } from './PauseMenu.js';
import { OptionsMenu } from './OptionsMenu.js';
import { VictoryScreen } from './VictoryScreen.js';
import { DefeatScreen } from './DefeatScreen.js';

export class UIManager {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.menus = {
      main: new MainMenu(this, game),
      pause: new PauseMenu(this, game),
      options: new OptionsMenu(this, game),
      victory: new VictoryScreen(this, game),
      defeat: new DefeatScreen(this, game)
    };
  }

  clear() {
    this.root.innerHTML = '';
    this.root.classList.add('hidden');
  }

  setHTML(html, handlers = {}) {
    this.root.classList.remove('hidden');
    this.root.innerHTML = html;
    this.root.querySelectorAll('[data-action]').forEach((element) => {
      const action = element.dataset.action;
      const handler = handlers[action];
      if (!handler) return;
      const eventName = element.tagName === 'INPUT' ? 'input' : 'click';
      element.addEventListener(eventName, handler);
    });
  }

  showMain() { this.menus.main.show(); }
  showPause() { this.menus.pause.show(); }
  showOptions(source) { this.menus.options.show(source); }
  showVictory(summary) { this.menus.victory.show(summary); }
  showDefeat() { this.menus.defeat.show(); }
}

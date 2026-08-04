export class MainMenu {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
  }

  show() {
    this.ui.setHTML(`
      <div class="panel">
        <h1>LG Caribbean Platformer</h1>
        <p>Race across beaches, jungle ruins, forts, ports, caves, and waterfalls.</p>
        <div class="menu-buttons">
          <button data-action="start">Start New Journey</button>
          <button data-action="continue" class="secondary">Continue</button>
          <button data-action="options" class="secondary">Options</button>
        </div>
        <p class="small">Controls: A/D or ←/→ move, Shift run, Space jump, S/↓ crouch, E interact, Esc pause.</p>
      </div>
    `, {
      start: () => this.game.startNewGame(),
      continue: () => this.game.continueGame(),
      options: () => this.game.showOptions('menu')
    });
  }
}

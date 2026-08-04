export class PauseMenu {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
  }

  show() {
    this.ui.setHTML(`
      <div class="panel">
        <h2>Paused</h2>
        <div class="menu-buttons">
          <button data-action="resume">Resume</button>
          <button data-action="restart" class="secondary">Restart Level</button>
          <button data-action="options" class="secondary">Options</button>
          <button data-action="menu" class="secondary">Main Menu</button>
        </div>
      </div>
    `, {
      resume: () => this.game.resume(),
      restart: () => this.game.restartLevel(),
      options: () => this.game.showOptions('pause'),
      menu: () => this.game.backToMenu()
    });
  }
}

export class DefeatScreen {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
  }

  show() {
    this.ui.setHTML(`
      <div class="panel">
        <h2>Game Over</h2>
        <p>Your Caribbean run has ended, but the islands await another try.</p>
        <div class="menu-buttons">
          <button data-action="retry">Retry Level</button>
          <button data-action="menu" class="secondary">Main Menu</button>
        </div>
      </div>
    `, {
      retry: () => this.game.restartLevel(true),
      menu: () => this.game.backToMenu()
    });
  }
}

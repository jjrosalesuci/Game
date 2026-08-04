export class VictoryScreen {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
  }

  show(summary) {
    this.ui.setHTML(`
      <div class="panel">
        <h2>Level Complete!</h2>
        <p>Score: ${summary.score} | Coins: ${summary.coins} | Time Left: ${Math.ceil(summary.time)}</p>
        <div class="menu-buttons">
          <button data-action="next">${summary.hasNext ? 'Next Level' : 'Victory!'}</button>
          <button data-action="menu" class="secondary">Main Menu</button>
        </div>
      </div>
    `, {
      next: () => summary.hasNext ? this.game.loadNextLevel() : this.game.backToMenu(true),
      menu: () => this.game.backToMenu(true)
    });
  }
}

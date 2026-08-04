export class OptionsMenu {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
  }

  show(source) {
    const options = this.game.options;
    this.ui.setHTML(`
      <div class="panel">
        <h2>Options</h2>
        <div class="option-row">
          <label>Music Volume <input data-action="music" type="range" min="0" max="1" step="0.05" value="${options.musicVolume}" /></label>
        </div>
        <div class="option-row">
          <label>SFX Volume <input data-action="sfx" type="range" min="0" max="1" step="0.05" value="${options.sfxVolume}" /></label>
        </div>
        <div class="option-row row">
          <button data-action="mute" class="secondary">${options.muted ? 'Unmute' : 'Mute'}</button>
          <button data-action="back">Back</button>
        </div>
      </div>
    `, {
      music: (event) => this.game.setOption('musicVolume', Number(event.target.value)),
      sfx: (event) => this.game.setOption('sfxVolume', Number(event.target.value)),
      mute: () => {
        this.game.setOption('muted', !this.game.options.muted);
        this.show(source);
      },
      back: () => {
        if (source === 'pause') this.game.pause();
        else this.game.backToMenu();
      }
    });
  }
}

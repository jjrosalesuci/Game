export class SpriteAtlas {
  constructor() {
    this.sheets = new Map();
  }

  register(key, image, frames) {
    this.sheets.set(key, { image, frames });
  }

  getFrame(key, frameName) {
    const sheet = this.sheets.get(key);
    return sheet?.frames?.[frameName] || null;
  }
}

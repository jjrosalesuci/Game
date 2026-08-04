export class ResourceManager {
  constructor() {
    this.cache = new Map();
  }

  async loadJSON(path) {
    if (this.cache.has(path)) return this.cache.get(path);
    const promise = fetch(path).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load JSON: ${path}`);
      }
      return response.json();
    });
    this.cache.set(path, promise);
    return promise;
  }

  async loadImage(path) {
    if (this.cache.has(path)) return this.cache.get(path);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      image.src = path;
    });
    this.cache.set(path, promise);
    return promise;
  }

  preloadLevel(path) {
    return this.loadJSON(path);
  }
}

const SAVE_KEY = 'lg_caribbean_platformer_save';

export class SaveManager {
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Save load failed:', error);
      return null;
    }
  }

  save(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Save failed:', error);
    }
  }

  clear() {
    localStorage.removeItem(SAVE_KEY);
  }
}

export class LevelParser {
  parse(data) {
    return {
      id: data.id,
      name: data.name,
      width: data.size.width,
      height: data.size.height,
      background: data.background,
      music: data.music,
      playerSpawn: data.playerSpawn,
      goal: data.goal,
      platforms: data.platforms,
      enemies: data.enemies,
      collectibles: data.collectibles,
      interactives: data.interactives,
      timer: data.timer || 180
    };
  }
}

export class HUD {
  render(ctx, game) {
    const { player, currentLevelData, timer } = game;
    ctx.save();
    ctx.fillStyle = 'rgba(6, 17, 28, 0.6)';
    ctx.fillRect(16, 16, 430, 92);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(16, 16, 430, 92);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Level: ${currentLevelData?.name || ''}`, 28, 44);
    ctx.fillText(`Score: ${player.score}`, 28, 70);
    ctx.fillText(`Coins: ${player.coins}   Keys: ${player.keys}`, 28, 96);
    ctx.fillText(`Time: ${Math.ceil(timer)}`, 248, 70);
    ctx.fillText(`Lives: ${player.lives}`, 248, 96);
    ctx.fillStyle = '#7b1d1d';
    ctx.fillRect(360, 36, 68, 18);
    ctx.fillStyle = '#4ad66d';
    ctx.fillRect(360, 36, 68 * (player.health / player.maxHealth), 18);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(360, 36, 68, 18);
    ctx.restore();
  }
}

const createTilemap = (
  scene: Phaser.Scene,
  tileWidth: number,
  tileHeight: number,
  gridSize: number
): Phaser.Tilemaps.Tilemap => {
  const tilemap = scene.make.tilemap({
    tileWidth,
    tileHeight,
    width: gridSize,
    height: gridSize,
  });
  return tilemap;
};

export default createTilemap;

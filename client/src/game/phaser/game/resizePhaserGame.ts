const resizePhaserGame = (game: Phaser.Game) => {
  const resize = () => {
    const width =
      (window.innerWidth * window.devicePixelRatio) / game.scale.zoom;
    const height =
      (window.innerHeight * window.devicePixelRatio) / game.scale.zoom;
    game.scale.resize(width, height);
  };
  resize();
  window.addEventListener("resize", resize);
};

export default resizePhaserGame;

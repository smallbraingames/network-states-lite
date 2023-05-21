const config = {
  tilemap: {
    tileWidth: 200,
    tileHeight: 200,
    gridSize: 1000,
    buffer: 100,
    solidColorTileIndices: [1, 2, 3, 4, 5, 6, 7],
    solidColorTextIsDark: {
      1: false,
      2: false,
      3: false,
      4: true,
      5: true,
      6: true,
      7: false,
    },
  },
  text: {
    fontSize: 50,
    fontFamily: "'IBM Plex Mono'",
    darkColor: "#404040",
    lightColor: "#DDDFD6",
  },
  assetKeys: {
    tileset: "tilemap",
    selection: "selection",
    next: "next",
    arrow: "arrow",
  },
  network: {
    gasLimit: 500_000,
    retryCount: 2,
  },
  time: {
    blocksPerMonth: 10,
  },
};

export default config;

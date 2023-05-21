import Phaser from "phaser";
import { Scenes } from "../types";
import WebFontFile from "../webFontFile";
import createNetwork from "../../../network/createNetwork";
import createPhaserScene from "../scene/createPhaserScene";
import getGameLoadPromise from "./getGameLoadPromise";
import mainConfig from "../../main/config";
import resizePhaserGame from "./resizePhaserGame";
import setupMainScene from "../../main/setup/scene/setupMainScene";

const createPhaserGame = async () => {
  const MainScene = createPhaserScene({
    key: Scenes.MAIN,
    preload: (scene: Phaser.Scene) => {
      scene.load.pack("src/assets/game/pack");
      scene.load.addFile(new WebFontFile(scene.load, "IBM Plex Mono"));
    },
  });

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    parent: "phaser-container",
    backgroundColor: "dddfd6",
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    scale: {
      mode: Phaser.Scale.NONE,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: true,
      },
    },
    scene: [MainScene],
    antialias: true,
  };

  const game = new Phaser.Game(config);
  await getGameLoadPromise(game);

  resizePhaserGame(game);

  const buildScenes: { [key in Scenes]?: Phaser.Scene } = {};
  game.scene.getScenes(false).forEach((scene) => {
    buildScenes[scene.scene.key as Scenes] = scene;
  });
  const scenes = buildScenes as { [key in Scenes]: Phaser.Scene };

  setupMainScene(scenes[Scenes.MAIN], mainConfig);

  const context = {
    game,
    scenes,
  };

  createNetwork();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).game = context;

  return context;
};

export default createPhaserGame;

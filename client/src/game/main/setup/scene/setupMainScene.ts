import { MainConfig } from "../../types";
import createCamera from "../../../phaser/createCamera";
import createMainTilemap from "./createMainTilemap";
import getSceneLoadPromise from "../../../phaser/scene/getSceneLoadPromise";

const setupMainScene = async (scene: Phaser.Scene, config: MainConfig) => {
  await getSceneLoadPromise(scene);

  const tilemap = createMainTilemap(scene, config);
  const camera = createCamera(scene.cameras.main, 0.5, 2, 1, 1);

  return {
    scene,
    config,
    tilemap,
    camera,
  };
};

export default setupMainScene;

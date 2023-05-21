import { Scenes } from "./phaser/types";
import connectNetwork from "./main/setup/connectNetwork";
import createArrowManager from "./main/createArrowManager";
import createClientComponents from "./main/setup/components/createClientComponents";
import { createInput } from "./phaser/createInput";
import createMoveSequenceManager from "./main/createMoveSequenceManager";
import createNetwork from "../network/createNetwork";
import createNextMoveTilesManager from "./main/createNextMoveTilesManager";
import createPhaserGame from "./phaser/game/createPhaserGame";
import createPlayerStateTilesManager from "./main/createPlayerStateTilesManager";
import createTerrainManager from "./main/createTerrainManager";
import createTroopCountManager from "./main/createTroopCountManager";
import mainSceneConfig from "./main/config";
import { namespaceWorld } from "@latticexyz/recs";
import setupArrowSystem from "./main/setup/systems/setupArrowSystem";
import setupCameraSystem from "./main/setup/systems/setupCameraSystem";
import setupInputMoveSystem from "./main/setup/systems/setupInputMoveSystem";
import setupMainScene from "./main/setup/scene/setupMainScene";
import setupNextMoveTilesSystem from "./main/setup/systems/setupNextMoveTilesSystem";
import setupOtherPlayersStateSystem from "./main/setup/systems/setupOtherPlayersStateSystem";
import setupPlayerStateTilesSystem from "./main/setup/systems/setupPlayerStateTilesSystem";
import setupTroopCountSystem from "./main/setup/systems/setupTroopCountSystem";

const createGame = async () => {
  const networkPromise = createNetwork();

  const setupPhaserGame = async () => {
    const phaserGame = await createPhaserGame();
    const mainScene = await setupMainScene(
      phaserGame.scenes.MAIN,
      mainSceneConfig
    );
    return { phaserGame, mainScene };
  };
  const [network, { phaserGame, mainScene }] = await Promise.all([
    networkPromise,
    setupPhaserGame(),
  ]);

  const { world } = network;

  const main = connectNetwork(network, mainScene);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const player = await network.network.signer.get()!.getAddress();

  const mainWorld = namespaceWorld(world, Scenes.MAIN);

  const input = createInput(main.scene.input);

  const clientComponents = createClientComponents(
    player,
    network,
    mainWorld,
    input,
    mainSceneConfig
  );

  const context = {
    phaserGame,
    main: { ...main, mainWorld, clientComponents, input },
    network,
    player,
  };

  const terrainManagerPromise = createTerrainManager(context);

  const terrainManager = await terrainManagerPromise;
  terrainManager.lazyAddTerrain();

  const nextMoveTilesManager = createNextMoveTilesManager(
    context,
    terrainManager
  );
  setupNextMoveTilesSystem(context, nextMoveTilesManager);

  const playerStateTilesManager = createPlayerStateTilesManager(context);
  setupPlayerStateTilesSystem(context, playerStateTilesManager);

  const troopCountManager = createTroopCountManager(
    context,
    playerStateTilesManager
  );
  setupTroopCountSystem(context, troopCountManager);

  const moveSequenceManager = createMoveSequenceManager(context);
  const arrowManager = createArrowManager(context);
  setupInputMoveSystem(context, moveSequenceManager);
  setupArrowSystem(moveSequenceManager, arrowManager);

  setupOtherPlayersStateSystem(context);

  setupCameraSystem(context);

  await context.main.api.spawn();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).game = context;

  return context;
};

export default createGame;

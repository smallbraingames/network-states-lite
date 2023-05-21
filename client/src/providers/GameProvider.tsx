import { ReactNode, createContext, useEffect, useState } from "react";

import { Game } from "../game/types";
import createGame from "../game/createGame";

interface GameContextInterface {
  game?: Game;
}

export const GameContext = createContext<GameContextInterface>({
  game: undefined,
});

const GameProvider = (props: { children: ReactNode }) => {
  const [game, setGame] = useState<Game | undefined>(undefined);

  useEffect(() => {
    createGame().then((game) => {
      setGame(game);
    });
  }, []);

  return (
    <GameContext.Provider value={{ game }}>
      {props.children}
    </GameContext.Provider>
  );
};

export default GameProvider;

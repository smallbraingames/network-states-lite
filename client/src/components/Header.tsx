import { memo, useContext } from "react";

import { Game } from "../game/types";
import { GameContext } from "../providers/GameProvider";
import { SingletonID } from "@latticexyz/network";
import { useComponentValue } from "@latticexyz/react";

const GameHeader = (props: { game: Game }) => {
  const {
    main: {
      mainWorld,
      clientComponents: { HeaderInfo },
    },
  } = props.game;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const singletonEntityIndex = mainWorld.entityToIndex.get(SingletonID)!;
  const headerInfo = useComponentValue(HeaderInfo, singletonEntityIndex);

  return (
    <div className="w-full flex justify-between px-4 py-2 text-black bg-background">
      <div className="w-72">
        Network State: {headerInfo ? headerInfo.networkState : "-"}
      </div>

      <div className="w-72 hidden md:block text-center">
        <span className="p-1 bg-highlight">
          {headerInfo ? headerInfo.years : "-"}
        </span>{" "}
        years{" "}
        <span className="p-1 bg-highlight">
          {headerInfo ? headerInfo.months : "-"}
        </span>{" "}
        months
      </div>

      <div className="w-32 md:w-72 text-right">
        <span className="p-1 bg-highlight">
          {headerInfo ? headerInfo.numCitizens : "-"}
        </span>{" "}
        Citizens
      </div>
    </div>
  );
};

const Header = memo(() => {
  const { game } = useContext(GameContext);

  return <>{game && <GameHeader game={game} />} </>;
});

export default Header;

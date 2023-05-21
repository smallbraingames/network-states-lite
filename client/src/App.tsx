import "./App.css";

import { Game } from "./components/Game";
import GameProvider from "./providers/GameProvider";
import Header from "./components/Header";

function App() {
  return (
    <GameProvider>
      <Game />
      <div
        className="absolute top-0 w-full md:flex w-screen h-screen"
        style={{ pointerEvents: "none" }}
      >
        <Header />
      </div>
    </GameProvider>
  );
}

export default App;

import createGame from "./createGame";

export type Game = Awaited<ReturnType<typeof createGame>>;

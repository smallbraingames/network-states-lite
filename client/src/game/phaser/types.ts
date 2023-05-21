import createCamera from "./createCamera";
import { createInput } from "./createInput";

export type Camera = Awaited<ReturnType<typeof createCamera>>;
export type Input = ReturnType<typeof createInput>;

export enum Scenes {
  MAIN = "MAIN",
}

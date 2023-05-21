import { mudConfig, resolveTableId } from "@latticexyz/config";

export default mudConfig({
  tables: {
    StateOwnerTable: {
      primaryKeys: { id: "uint256" },
      schema: {
        value: "address",
      },
    },
    LastUpdateTable: {
      primaryKeys: { x: "int32", y: "int32" },
      schema: {
        value: "uint256",
      },
      storeArgument: true,
    },
    TroopCountTable: {
      primaryKeys: { x: "int32", y: "int32" },
      schema: {
        value: "uint32",
      },
      storeArgument: true,
    },
    IsCapitalTable: {
      primaryKeys: { x: "int32", y: "int32" },
      schema: {
        value: "bool",
      },
      storeArgument: true,
    },
    StateTable: {
      primaryKeys: { x: "int32", y: "int32" },
      schema: {
        value: "uint256",
      },
      storeArgument: true,
    },
    FoundedTable: {
      primaryKeys: { id: "uint256" },
      schema: {
        value: "uint256",
      },
      storeArgument: true,
    },
    HomeStateTable: {
      primaryKeys: { player: "address" },
      schema: {
        value: "uint256",
      },
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("StateOwnerTable")],
    },
    {
      name: "UniqueEntityModule",
      root: true,
    },
  ],
  enums: {
    Direction: ["UP", "DOWN", "LEFT", "RIGHT"],
    Terrain: ["BARE", "MOUNTAIN", "WATER"],
  },
});

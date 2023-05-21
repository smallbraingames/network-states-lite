# Network States (Lite)

Network States is an upcoming on-chain strategy game, employing the MUD v2 engine. This lite version is released as a MUD v2 reference for the ETHGlobal Autonomous World hackathon.

In this lite version:

- You spawn your capital pseudorandomly on an infinite grid
- Your capital is given +1 troop every 2 blocks (lazy loading)
- Every 50 blocks, every square you own gives you +1 troop
- Can make one move (move troops one adjacent tile) per block
- If you take over someone's capital, you control all their land

See networkstat.es for game info.

# Get Started

## Contracts

First, deploy contracts. To deploy contracts:

1. Install dependencies: `cd contracts && pnpm install`
2. Deploy to Lattice testnet: `pnpm deploy:testnet`

## Client

Then, start the client. The client is built with Vite + React + Tailwind. To start the client:

1. Install dependencies: `cd client && pnpm install`
2. Run client: `pnpm dev`

The client is automatically configured to use the latest Lattice testnet deploy.

# Contact

This is a project by [Small Brain Games](https://twitter.com/0xsmallbrain), [0xhank](https://twitter.com/0xhank), and [Moving Castles](https://twitter.com/movingcastles_). Contact any party for help. Feel free to ask questions in the [Small Brain Games discord](https://discord.gg/q2zqXbt5kd).

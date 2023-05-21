import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
    exclude: ["@latticexyz/noise", "postgres"],
  },
  build: {
    rollupOptions: {
      external: [
        "../contracts/types/ethers-contracts/factories/IWorld__factory.ts",
      ],
    },
  },

  plugins: [react()],
});

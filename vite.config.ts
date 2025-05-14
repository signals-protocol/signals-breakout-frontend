import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    wasm(), // ← 이 한 줄이면 됩니다
    nodePolyfills({
      protocolImports: true, // wasm 로딩에도 필요
      globals: {
        Buffer: true, // Buffer polyfill
        process: true, // process polyfill
      },
    }),
  ],
  // pre-bundling 단계(OptimizeDeps)에도 esnext 허용
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  // 프로덕션 번들링 시에도 esnext 문법 그대로 남김
  esbuild: {
    target: "esnext",
  },
  build: {
    target: "esnext",
  },
});

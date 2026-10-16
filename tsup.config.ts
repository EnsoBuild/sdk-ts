import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Specify the entry point of your SDK
  format: ["cjs", "esm"], // Output formats: CommonJS and ES Module
  // Inline the shared asset vocabulary so SDK users need no builder runtime dependency.
  dts: { resolve: ["@ensofinance/shortcuts-builder/types"] },
  noExternal: ["@ensofinance/shortcuts-builder/types"],
  sourcemap: true, // Generate source maps for debugging
  clean: true, // Clean the output directory before each build
});

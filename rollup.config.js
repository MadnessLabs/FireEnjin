import pkg from "./package.json";
import typescript from "rollup-plugin-typescript";

export default {
  input: "./src/index.ts",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "esm" }
  ],
  plugins: [typescript()]
};

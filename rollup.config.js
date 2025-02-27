import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/smolie-js.cjs.js",
      format: "cjs"
    },
    {
      file: "dist/smolie-js.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true
    })
  ],
  external: [] // add external dependencies if needed
};

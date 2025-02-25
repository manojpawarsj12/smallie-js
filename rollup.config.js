import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/smallie-js.cjs.js",
      format: "cjs"
    },
    {
      file: "dist/smallie-js.esm.js",
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

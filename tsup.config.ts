import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@chakra-ui/react",
    "@emotion/react",
    "react-data-grid",
    "react-dropzone",
    "react-icons",
    "react-icons/cg",
    "@heroicons/react",
    "@heroicons/react/24/outline",
    "chakra-react-select",
    "js-levenshtein",
    "lodash",
    "lodash/merge.js",
    "lodash/uniqBy.js",
    "uuid",
    "xlsx-ugnis",
    "ts-essentials",
  ],
  esbuildOptions(options) {
    options.logOverride = { "this-is-undefined-in-esm": "silent" }
  },
})

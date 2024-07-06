import { build } from "esbuild";
import { dependencies } from "./package.json";

build({
    entryPoints: ["server/index.ts"],
    bundle: true,
    minify: true,
    external: Object.keys(dependencies),
    platform: "node",
    format: "esm",
    outfile: "dist/index.js",
});

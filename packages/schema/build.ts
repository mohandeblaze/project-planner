import { build } from 'esbuild';
import { dependencies } from './package.json';

build({
    entryPoints: ['./index.ts'],
    bundle: true,
    minify: false,
    external: Object.keys(dependencies),
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/index.js',
    sourcemap: true,
    treeShaking: true,
    tsconfig: './tsconfig.json',
});

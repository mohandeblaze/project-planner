import { build } from 'esbuild';
import { dependencies, peerDependencies } from './package.json';

build({
    entryPoints: ['index.ts'],
    bundle: true,
    minify: false,
    external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
}).then(() => console.log('Server build complete'));

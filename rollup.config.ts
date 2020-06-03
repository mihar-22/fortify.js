import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json');

const plugins = [
  typescript(),
  commonjs(),
  resolve(),
];

export default [{
  input: 'src/client/index.ts',
  output: [
    { file: pkg.main, name: 'Auth', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // @TODO: configure Terser
  // @TODO: Setup Babel -> Targets are IE 11 and latest 2 versions of modern browsers.
  // Reference: https://github.com/vime-js/vime/blob/master/rollup.js
  plugins: plugins.push(terser())
}, {
  input: 'src/server/index.ts',
  output: [
    { file: pkg.main.replace('client', 'server'), format: 'cjs', sourcemap: true },
    { file: pkg.module.replace('client', 'server'), format: 'es', sourcemap: true },
  ]
}]

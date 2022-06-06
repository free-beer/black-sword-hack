import { terser } from 'rollup-plugin-terser';

export default {
  input: 'black-sword-hack.js',
  output: {
    file: 'black-sword-hack.min.js',
    format: 'esm',
    plugins: [terser()]
  }
};

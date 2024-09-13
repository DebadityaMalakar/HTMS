import path from "path";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default {
    input: "src/index.js",
    output: {
        file:  path.resolve(__dirname, 'dist/bundle.js'),
        format: 'cjs'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
      
}
import server from 'rollup-plugin-server'
import { string } from "rollup-plugin-string";
import { uglify } from "rollup-plugin-uglify";
export default {
    input: `src/index.js`,
    external: ['Scratch'],
    output: [
        {
            file: 'dist/tilemap.js',
            name: 'tilemap',
            format: 'iife',
            globals: {
                'Scratch': 'Scratch'
            }
        },
    ],
    plugins: [
        //uglify(),
        string({
            include: [
                "**/*.frag",
                "**/*.vert"
            ]
        }),
        // server({
        //     contentBase: ['dist'],
        //     port: 8000,
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Methods': '*',

        //     }
        // }),
    ],
};
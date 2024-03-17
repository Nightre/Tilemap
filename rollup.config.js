import { string } from "rollup-plugin-string";
import image from '@rollup/plugin-image';
import banner2 from 'rollup-plugin-banner2'

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
        image(),
        string({
            include: [
                "**/*.frag",
                "**/*.vert"
            ]
        }),
        banner2(() => 
`
// Tilemap
`
        )
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
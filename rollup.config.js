import server from 'rollup-plugin-server'
import { string } from "rollup-plugin-string";

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
        string({
            include: [
                "**/*.frag",
                "**/*.vert"
            ]
        }),
        server({
            open: true,
            contentBase: '.',
            port: 8000
        }),
    ],
};
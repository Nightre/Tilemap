
import Scratch from "Scratch";
import TilemapLogic from "./tilemap-logic";


/**
 * Tilemap-Logic
 * 逻辑，管理   
 *      Tilemap-DATA
 *      地图数据
 *      Tilemap-RENDER
 *      渲染
 *      Tilemap-TILESET      
 *      瓦片集合 
 */

class HelloWorld {
    constructor(runtime){
        this.runtime = runtime ?? Scratch.vm.runtime
        this.tilemap = new TilemapLogic(this.runtime)
    }
    getInfo() {
        return {
            id: 'helloworld',
            name: 'It works!',
            blocks: [
                {
                    opcode: 'hello',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Hello!'
                }
            ]
        };
    }

    hello(args) {
        console.log(arguments)
        return 1;
    }
}

Scratch.extensions.register(new HelloWorld());

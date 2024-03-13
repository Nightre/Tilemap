
import Scratch from "Scratch";
import TilemapLogic from "./tilemap-logic";
import { getCallerInfo, getSkinByName } from "./utils";


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
    constructor(runtime) {
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

    hello(args, utils) {
        const skin = getSkinByName(utils, "造型1")
        this.tilemap.render.startRegion()
        
        this.tilemap.render.addTile(
            // TODO:纹理大小，纹理加载
            this.tilemap.render.getTexture(skin, [50,50]),
            100, 50,
            0, 0, 1, 1, 0, 0, 0xFFFF00FF
        )
        this.tilemap.render.flush()


        return 1;
    }
}

Scratch.extensions.register(new HelloWorld());

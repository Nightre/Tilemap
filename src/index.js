import Scratch from "Scratch";
import Tilemap from "./tilemap";
import { floorNum, getCallerInfo, getPosFromScratch, getSkinByName } from "./utils";
import TilemapRender from "./tilemap-render";
import blocks from "./blocks/blocks";
import { Override } from "./override";
import { POS_ATT, SHOW_MODE } from "./enum";
import TileSet from "./tilemap-tileset";

const Cast = Scratch.Cast
// 这个class 用来用scratch积木的数据来操控Tilemap

class TilemapScratch {
    constructor(runtime) {
        this.runtime = runtime || Scratch.vm.runtime
        if (!this.runtime) {
            throw Error("你的scratch运行不了啊，老兄！！")
        }
        this.renderer = this.runtime.renderer
        this.m4 = this.renderer.exports.twgl.m4

        //this.tilemap = new Tilemap(this.runtime)

        // 所有tilemap共用一个tilemapRender
        this.render = new TilemapRender(this.runtime)
        this.override = new Override(this.runtime)
        this.tilemaps = new Map
        this.tilesets = new Map

        window.tilemap = this
        // const gl = this.renderer.gl
        // gl.enable(gl.SCISSOR_TEST);
        // gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
    }
    getInfo() {
        return blocks(Scratch)
    }

    //////////////////////////////////////////////////////////////////////////

    getTilemap(args, callback, defaultReturn) {
        const tilemapName = Cast.toString(args.NAME)

        if (this.tilemaps.has(tilemapName)) {
            return callback(this.tilemaps.get(tilemapName))
        }
        return defaultReturn
    }
    drawTilemaps(drawable, enterRegion, opts) {
        if (enterRegion) {
            this.render.startRegion(opts)
        }
        if (drawable.tilemapData) {
            const tilemaps = Object.values(drawable.tilemapData.tilemaps)
            for (const tilemap of tilemaps.sort((a, b) => a.layer - b.layer)) {
                tilemap.draw()
            }
        }
        if (this.render.count > 0) {
            this.render.flush()
        }
    }

    //////////////////////////////////////////////////////////////////////////

    setShowMode(args) {
        this.getTilemap(args, (tilemap) => {
            tilemap.show = (args.MODE == SHOW_MODE.SHOW)
        })
        this.render.makeDirty()
    }
    updateTilemap(args, utils) {
        const { drawable } = getCallerInfo(utils)
        const tilemapName = Cast.toString(args.NAME)
        if (!this.tilemaps.has(tilemapName)) {
            const newTilemap = new Tilemap(this, drawable, tilemapName)

            if (!drawable.tilemapData) {
                drawable.tilemapData = {
                    drawTilemaps: (enterRegion, opts) => this.drawTilemaps(drawable, enterRegion, opts),
                    exitTilemapRegion: () => this.render.exitRegion(),
                    tilemaps: {}
                }
            }

            drawable.tilemapData.tilemaps[tilemapName] = newTilemap
            this.tilemaps.set(tilemapName, newTilemap)
        }
        this.tilemaps.get(tilemapName).update({
            tileSize: {
                x: floorNum(args.TILE_SIZE_X),
                y: floorNum(args.TILE_SIZE_Y)
            },
            layer: floorNum(args.LAYER),
            mode: args.TILEMAP_MODE,
            tilesetName: Cast.toString(args.TILE_SET)
        })
        this.render.makeDirty()
    }
    destoryTilemap(args) {
        this.getTilemap(args, (tilemap) => {

            this.tilemaps.delete(tilemap.name)
            tilemap.destory()
        })
        this.render.makeDirty()
    }
    //////////////////////////////////////////////////////////////////////////
    resizeTileData(args) {
        this.getTilemap(args, (tilemap) => {
            tilemap.mapData.resize(
                floorNum(args.SIZE_X),
                floorNum(args.SIZE_Y)
            )
        })
        this.render.makeDirty()
    }
    setTileData(args) {
        this.getTilemap(args, (tilemap) => {
            tilemap.setTileData(
                getPosFromScratch(args),
                Cast.toString(args.VALUE),
            )
        })
        this.render.makeDirty()

    }
    getTileName(args) {
        return this.getTilemap(args, (tilemap) => {
            const data = tilemap.getTileData(getPosFromScratch(args))
            if (!data) return ''
            return data.tileName
        }, '0')
    }
    clearTileData(args) {
        this.getTilemap(args, (tilemap) => {
            tilemap.clearTileData()
        })
    }
    //////////////////////////////////////////////////////////////////////////
    // getAllTileSet(args) {
    //     const data = this.tilesets.get(Cast.toString(args.NAME))
    //     if (!data) return '{}'
    //     return JSON.stringify(data.toJson())
    // }
    createTileSet(args, utils) {
        const tilesetName = Cast.toString(args.NAME)
        if (!this.tilesets.has(tilesetName)) {
            this.tilesets.set(tilesetName, new TileSet(this.render))
        }
        const tileset = this.tilesets.get(tilesetName)
        if (!tileset) return
        const data = JSON.parse(args.DATA)
        if (data.texture) {
            data.texture = getSkinByName(utils, data.texture)
        }
        tileset.addTileData(Cast.toString(args.TILE_NAME), data)
        this.render.makeDirty()
    }
    removeTileSet(args) {
        const tileset = this.tilesets.get(Cast.toString(args.NAME))
        if (!tileset) return
        tileset.removeTileData(Cast.toString(args.TILE_NAME))
        this.render.makeDirty()
    }
    joinTileMapLayer(args, utils) {
        const { drawable } = getCallerInfo(utils)
        if (drawable.tilemapData && drawable.tilemapData.tilemaps && Object.keys(drawable.tilemapData.tilemaps).length > 0) {
            return // 有tilemap无法加入其他tilemap
        }
        this.getTilemap(args, (tilemap) => {
            if (!drawable.tilemapData) {
                drawable.tilemapData = {
                    skipDraw: true,
                    parentTilemap: null
                }
            }
            drawable.tilemapData.parentTilemap = tilemap
            tilemap.members.add(drawable)
        })
        this.render.makeDirty()
    }
    setLayerInTileMap(args, utils) {
        const { drawable } = getCallerInfo(utils)
        const tileData = drawable.tilemapData
        if (tileData) {
            tileData.sort = floorNum(args.LAYER) - 1 // - 1 scratch一般索引第一个是1，所以减一
        }
        this.render.makeDirty()
    }
    quitTileMap(_, utils) {
        const { drawable } = getCallerInfo(utils)
        const tileData = drawable.tilemapData
        if (tileData && tileData.parentTilemap) {
            tileData.parentTilemap.members.delete(drawable)
            tileData.parentTilemap = null
        }
        this.render.makeDirty()
    }
    ///////////////////////////////////////////////////////////
    mapToPos(args) {
        return this.getTilemap(args, (tilemap) => {
            const data = tilemap.mapToPos(floorNum(args.POS_X), floorNum(args.POS_Y))
            return args.POS_ATT == POS_ATT.X ? data.x : data.y
        })
    }
    posToMap(args) {
        return this.getTilemap(args, (tilemap) => {
            const data = tilemap.posToMap(Cast.toNumber(args.POS_X), Cast.toNumber(args.POS_Y))
            return args.POS_ATT == POS_ATT.X ? data.x : data.y
        })
    }
}

Scratch.extensions.register(new TilemapScratch());

import { MAP_MODE } from "./enum"
import TilemapRender from "./tilemap-render"
import { TileData } from "./tilemap-tileset"
import TilemapData from "./tilemap-data"
import { range } from "./utils"

const ZERO_VEC2 = { x: 0, y: 0 }

class Tilemap {
    constructor(app, drawable) {
        this.app = app
        /** @type {TilemapRender} */
        this.render = app.render

        this.camera = ZERO_VEC2 // 摄像机
        this.offset = ZERO_VEC2 // 坐标偏移

        this.tileStart = ZERO_VEC2 // 瓦片开始绘制的索引
        this.tileSize = ZERO_VEC2 // 瓦片大小

        // 绘制几个瓦片
        this.drawTileNum = { x: 10, y: 10 }

        this.tilesetName = null
        this.mapData = new TilemapData()
        this.layer = 0
        this.mode = MAP_MODE.ORTHOGONAL
        this.drawable = drawable
        this.members = new Set
        this.show = true
    }
    get tileset() {
        return this.app.tilesets.get(this.tilesetName)
    }
    calculation() {
        this.offset = {
            x: this.camera.x % this.tileSize.x,
            y: this.camera.y % this.tileSize.y
        }
        this.tileStart = {
            x: Math.floor(this.camera.x / this.tileSize.x),
            y: Math.floor(this.camera.y / this.tileSize.y)
        }
        // drawTileNum
    }
    draw() {

        if (!this.show || !this.tileset) return
        this.calculation()
        for (let x = 0; x < this.drawTileNum.x; x++) {
            for (let y = 0; y < this.drawTileNum.y; y++) {
                this.drawTile(
                    this.offset.x, this.offset.y,
                    x + this.tileStart.x, y + this.tileStart.y
                )
                this.offset.x += this.tileSize.x
            }
            this.offset.y += this.tileSize.y
        }
    }
    update(opt) {
        this.tileSize = {
            x: range(opt.tileSize.x, 0, 1024),
            y: range(opt.tileSize.y, 0, 1024),
        }
        this.layer = range(opt.layer, 0, Infinity)
        this.tilesetName = opt.tilesetName
        this.mode = opt.mode
    }
    /**
     * 绘制一个tile
     * @param {Number} offsetX 位置偏移
     * @param {Number} offsetY 位置偏移
     * @param {Number} x 数据索引
     * @param {Number} y 数据索引
     */
    drawTile(offsetX, offsetY, x, y) {
        const id = this.mapData.getData({x, y})
        console.log("绘制",id)
        if (id == 0) return
        /** @type {TileData} */
        const tileData = this.tileset.mapping.get(id)
        this.render.addTile(
            this.render.getTexture(tileData.skin, [50, 50]),
            100, 50,
            0, 0, 1, 1, 0, 0, 0xFFFF00FF
        )
        this.render.flush()
    }
    destory() {
        const tileData = this.drawable.tileData
        if (tileData) {
            delete tileData.tilemaps[this.name]
        }
    }
    getTileData(pos) {
        if (!this.tileset) return
        const data = this.mapData.getData(pos)
        if (!data) return
        return this.tileset.mapping.get(data)
    }
    setTileData(pos, tileName) {
        if (!this.tileset) return
        const data = this.tileset.nameMapping.get(tileName)
        if (!data) return
        this.mapData.setData(pos, data)
    }
}

export default Tilemap
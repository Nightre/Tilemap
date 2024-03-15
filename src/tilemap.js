import { MAP_MODE, ROUND_TYEP } from "./enum"
import TilemapRender from "./tilemap-render"
import { TileData } from "./tilemap-tileset"
import TilemapData from "./tilemap-data"
import { range, round } from "./utils"

const ZERO_VEC2 = { x: 0, y: 0 }

class Tilemap {
    constructor(app, drawable, tilemapName) {
        this.app = app
        /** @type {TilemapRender} */
        this.render = app.render

        this.camera = ZERO_VEC2 // 摄像机
        this.offset = ZERO_VEC2 // 坐标偏移
        this.name = tilemapName
        this.tileStart = ZERO_VEC2 // 瓦片开始绘制的索引
        this.tileSize = ZERO_VEC2 // 瓦片大小
        this.retlTileSize = ZERO_VEC2
        this.scale = ZERO_VEC2
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
        const m4 = this.render.twgl.m4
        const drawable = this.drawable
        switch (this.mode) {
            case MAP_MODE.EQUIDISTANCE:
                this.tileSize.y = this.retlTileSize.y * 0.5
                break;
            default:
                this.tileSize.y = this.retlTileSize.y
                break;
        }
        this.tileSize.x = this.retlTileSize.x
        this.nativeSize = this.app.renderer._nativeSize
        this.scale = {
            x: drawable._scale[0] / 100,
            y: drawable._scale[1] / 100
        }
        this.camera = {
            x: drawable._position[0] + this.nativeSize[0] / 2 / this.scale.x,
            y: drawable._position[1] - this.nativeSize[1] / 2 / this.scale.y,
        }
        // this.nativeSize[1] / 2 是缩放中心
        this.offset = {
            x: this.camera.x % this.tileSize.x,
            y: this.camera.y % this.tileSize.y
        }
        this.tileStart = {
            x: -round(this.camera.x / this.tileSize.x, ROUND_TYEP.FLOOR),
            y: round(this.camera.y / this.tileSize.y, ROUND_TYEP.FLOOR)
        }
        this.drawTileNum = {
            x: Math.ceil(this.nativeSize[0] / (this.tileSize.x * this.scale.x)),
            y: Math.ceil(this.nativeSize[1] / (this.tileSize.y * this.scale.y))
        }

        // 不能用drawable的矩阵，因为有旋转中心，skin缩放
        const model = m4.identity()
        m4.translate(model, [-this.nativeSize[0] / 2, this.nativeSize[1] / 2, 0], model)
        m4.scale(model, [this.scale.x, this.scale.y, 1], model)
        m4.translate(model, [this.offset.x, this.offset.y, 0], model)
        this.render.setModel(model)
    }
    calculationMembers() {
        const sort = {}
        this.members.forEach((drawable) => {
            if (this.render._drawList.inclueds(drawable._id)) {
                const layer = drawable.tilemapData.sort
                if (!sort[layer]) sort[layer] = []
                sort[layer].push(drawable)
            }else{
                // 加入tilemap的 drawable 被删除
                this.members.delete(drawable)
            }
        })
        return sort
    }
    draw() {

        if (!this.show || !this.tileset) return
        this.calculation()

        const stepOffset = { x: 0, y: 0 }
        const toRenderMembers = this.calculationMembers()

        for (let y = 0; y < this.drawTileNum.y; y++) {
            stepOffset.x = 0
            let equOffset = 0
            if (this.mode == MAP_MODE.EQUIDISTANCE && y % 2 == 0) {
                equOffset += this.tileSize.x / 2
            }
            for (let x = 0; x < this.drawTileNum.x; x++) {
                this.drawTile(
                    equOffset + stepOffset.x, stepOffset.y, this.tileStart.x + x, this.tileStart.y + y
                )
                stepOffset.x += this.tileSize.x
            }
            this.render.drawMembers(this.tileStart.y + y, toRenderMembers)
            stepOffset.y -= this.tileSize.y
        }
    }

    update(opt) {
        this.retlTileSize = {
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

        const id = this.mapData.getData({ x, y })
        if (!id) return
        /** @type {TileData} */
        const tileData = this.tileset.mapping.get(id)
        if (!tileData) return // 呗删掉的tileset
        const clip = tileData.clip

        this.render.addTile(
            tileData.getTexture([
                this.scale.x * clip.width,
                this.scale.y * clip.height
            ]),
            tileData.width, tileData.height,
            clip.x, clip.y, clip.x + clip.width, clip.y + clip.height, offsetX, offsetY, 0xFFFF00FF,
            tileData
        )

    }
    destory() {
        const tileData = this.drawable.tilemapData
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
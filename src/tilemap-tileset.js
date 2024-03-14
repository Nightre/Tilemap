import { matrixProcessingVector } from "./utils"

const MAX_TILE_SET = 1024

export class TileData {
    constructor(skin, clip, color, matrix) {
        this.clip = {
            x: clip.x || 0,
            y: clip.y || 0,
            width: clip.width || 0,
            height: clip.height || 0
        }
        this.tilemapRender = null
        this.tileName = null

        this.color = color || 0xFFFFFFFF // Unit32 color
        this.skin = skin
        this.matrix = matrix

    }
    enable(tileName, tilemapRender) {
        this.tileName = tileName
        this.tilemapRender = tilemapRender
    }
    getTexture(scale) {
        if (!this.skin) {
            return
        }
        return this.tilemapRender.getTexture(this.skin, scale)
    }
    processingVector(x, y) {
        if (this.matrix) {
            return matrixProcessingVector(this.matrix, x, y)
        } else {
            return { x, y }
        }
    }
}

export class TileSet {
    constructor(tilemapRender) {
        this._tilemapRender = tilemapRender
        this._tileDatas = new Map()
        // id => tileData
        this.mapping = new Map()
        // name => id
        this.nameMapping = new Map()

        this.count = 0
    }
    addTileData(tileName, tileData) {
        if (this._tileDatas.size >= MAX_TILE_SET) {
            return
        }
        if (!this.nameMapping.has(tileName)) {
            this.count += 1 // 使用 Unit16 存储，无法有负数，用0代表空，所以在开始之前count++
        }
        tileData.enable(tileName, this._tilemapRender)
        this.mapping.set(this.count, tileData)
        this.nameMapping.set(tileName, this.count)
        this._tileDatas.set(tileName,tileData)
    }
    removeTileData(tileName) {
        this.mapping.delete(this.nameMapping.get(tileName))
        this.nameMapping.delete(tileName)
        this._tileDatas.delete(tileName)
    }
    getTileData(tileName) {
        return this._tileDatas.get(tileName)
    }

    toJson(){
        const json = []
        this._tileDatas.forEach((_,k)=>{
            json.push(k)
        })
        return json
    }
}

export default TileSet
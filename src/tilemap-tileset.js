import { htmlColorToUint32Color } from "./utils"

const MAX_TILE_SET = 1024

export class TileData {
    constructor() {
        this.tilemapRender = null
        this.tileName = null
        this.color = 0xFFFFFFFF
        this.data = {}
    }
    update(data) {
        if (data.texture) {
            this.skin = data.texture
        }
        if (!this.skin) {
            return
        }
        const size = this.skin.size
        if ((this.matrix == undefined) || data.offset || data.anchor || data.scale || data.rotate || data.anchor) {
            const m4 = this.tilemapRender.twgl.m4
            const offset = data.offset || this.data?.offset
            const anchor = data.anchor || this.data?.anchor
            const scale = data.scale || this.data?.scale
            const rotate = data.rotate || this.data?.rotate

            const matrix = m4.identity();
            m4.translate(matrix, [offset?.x || 0, offset?.y || 0, 0], matrix);
            m4.translate(matrix, [anchor?.x || 0, anchor?.y || 0, 0], matrix);
            m4.scale(matrix, [scale?.x || 1, scale?.y || 1, 1], matrix);
            m4.rotateZ(matrix, (90 - (rotate || 90)) * Math.PI / 180, matrix)
            m4.translate(matrix, [-anchor?.x || 0, -anchor?.y || 0, 0], matrix);
            this.matrix = matrix
        }
        const clip = data.clip
        const oldClip = this.data.clip
        this.clip = {
            x: (clip?.x / size[0] || oldClip?.x || 0),
            y: (clip?.y / size[1] || oldClip?.y || 0),
            width: (clip?.width / size[0] || oldClip?.width || 1),
            height: (clip?.height / size[1] || oldClip?.height || 1)
        }
        this.isClip = !(this.clip?.x == 0 && this.clip?.y == 0 && this.clip?.width == 1 && this.clip?.height == 1)
        this._width = this.clip.width
        this._height = this.clip.height

        if (data.color) {
            this.color = htmlColorToUint32Color(data.color)
        }
        
        const newData = Object.assign({}, this.data);
        // 合并this.data和data，若有重复字段，以data的值为准
        Object.assign(newData, data);
        // 更新this.data为合并后的结果
        this.data = newData;
    }
    get width() {
        return this._width || this.skin.size[0]
    }
    get height() {
        return this._height || this.skin.size[1]
    }
    enable(tileName, tilemapRender) {
        this.tileName = tileName
        this.tilemapRender = tilemapRender
    }
    getTexture(size) {
        const skin = this.skin
        if (!skin) {
            return
        }
        return this.tilemapRender.getTexture(this.skin, size)
    }
}

export class TileSet {
    constructor(tilemapRender) {
        this._tilemapRender = tilemapRender
        // name => tileData
        this._tileDatas = new Map()
        // id => tileData
        this.mapping = new Map()
        // name => id
        this.nameMapping = new Map()

        this.count = 0
    }
    addTileData(tileName, data) {
        if (this._tileDatas.size >= MAX_TILE_SET) {
            return
        }

        if (this._tileDatas.has(tileName)) {
            const tileData = this._tileDatas.get(tileName)
            tileData.update(data)
        } else {
            this.count++ // 使用 Unit16 存储，无法有负数，用0代表空，所以在开始之前count++
            const id = this.count
            const tileData = new TileData()
            tileData.enable(tileName, this._tilemapRender)
            tileData.update(data)

            this.mapping.set(id, tileData)
            this.nameMapping.set(tileName, id)
            this._tileDatas.set(tileName, tileData)
        }

        // if (!this.nameMapping.has(tileName)) {
        //     this.count += 1 // 使用 Unit16 存储，无法有负数，用0代表空，所以在开始之前count++
        // }
        // tileData.enable(tileName, this._tilemapRender)
        // this.mapping.set(this.count, tileData)
        // this.nameMapping.set(tileName, this.count)
        // this._tileDatas.set(tileName, tileData)

    }
    removeTileData(tileName) {
        this.mapping.delete(this.nameMapping.get(tileName))
        this.nameMapping.delete(tileName)
        this._tileDatas.delete(tileName)

    }
    getTileData(tileName) {
        return this._tileDatas.get(tileName)
    }

    toJson() {
        const json = []
        this._tileDatas.forEach((_, k) => {
            json.push(k)
        })
        return json
    }
}

export default TileSet
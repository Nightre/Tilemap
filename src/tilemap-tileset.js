
const MAX_TILE_SET = 1024

export class TileData {
    constructor(skin, clip, color, matrix) {
        const size = skin.size
        this.clip = {
            x: (clip?.x / size[0] || 0),
            y: (clip?.y / size[1] || 0),
            width: (clip?.width / size[0] || 1),
            height: (clip?.height / size[1] || 1)
        }
        this.tilemapRender = null
        this.tileName = null
        this.skin = skin
        this._width = clip?.width
        this._height = clip?.height
        this.color = 0xFFFFFFFF // Unit32 color TODO:a
        this.matrix = matrix
    }
    get width(){
        return this._width || this.skin.size[0]
    }
    get height(){
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
        tileData.enable(tileName, this._tilemapRender)

        if (this.nameMapping.has(tileName)) {
            const id = this.nameMapping.get(tileName)
            this.mapping.set(id, tileData)
            this._tileDatas.set(tileName, tileData)
        } else {
            this.count++ // 使用 Unit16 存储，无法有负数，用0代表空，所以在开始之前count++
            const id = this.count
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
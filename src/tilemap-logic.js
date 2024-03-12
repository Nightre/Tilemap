import TileSet from "./tilemap-tileset"

const ZERO_VEC2 = { x: 0, y: 0 }

class Tilemap {
    constructor(runtime) {
        this.render = new TilemapRender(runtime)

        this.camera = ZERO_VEC2 // 摄像机
        this.offset = ZERO_VEC2 // 坐标偏移

        this.tileStart = ZERO_VEC2 // 瓦片开始绘制的索引
        this.tileSize = ZERO_VEC2 // 瓦片大小

        // 绘制几个瓦片
        this.drawTileNum = ZERO_VEC2

        this.tileset = new TileSet()
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
    }
    render(projectionMatrix) {
        this.calculation()
        let offsetY, offsetX = 0
        for (let x = 0; x < this.drawTileNum.x; x++) {
            for (let y = 0; y < this.drawTileNum.y; x++) {
                this.renderTile(
                    offsetX, offsetY,
                    x + this.tileStart.x, y + this.tileStart.y
                )
                offsetX += this.tileSize.x
            }
            offsetY += this.tileSize.y
        }
        this.render.setOffset(this.offset)
        this.render.flush(projectionMatrix)
    }
    /**
     * 绘制一个tile
     * @param {Number} offsetX 位置偏移
     * @param {Number} offsetY 位置偏移
     * @param {Number} x 数据索引
     * @param {Number} y 数据索引
     */
    renderTile(offsetX, offsetY, x, y) {

    }
}

export default Tilemap
import { range } from "./utils"

const MAX_SIZE = 3000

class TilemapData {
    constructor() {
        this._data = new Uint32Array // 使用紧凑数组读取效率更高，占内存更少
        this._size = { x: 0, y: 0 }
        this.resize(10, 10)
    }
    resize(x, y) {
        let newSize = {
            x: this._constraintSize(x),
            y: this._constraintSize(y)
        }
        if (newSize.x == this._size.x && newSize.y == this._size.y) {
            // 新大小与原本大小一样，不修改
            return
        }

        const newData = new Uint32Array(newSize.x * newSize.y)
        for (let x = 0; x < newSize.x; x++) {
            for (let y = 0; y < newSize.y; y++) {
                // 将新的地图数据设为和之前一样的数据
                newData[x + y * newSize.x] = this._data[x + y * this._size.x] ?? 0
                // 若新的那么就为-1（放大，0代表空）
            }
        }
        this._size = newSize
        this._data = newData
    }
    clearTileData() {
        const size = this._size
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                this._data[x + y * size.x] = 0
            }
        }
    }
    _posInMap(x, y, size = this._size) {
        if (x < 0 || x > size.x - 1 || y < 0 || y > size.y - 1) {
            return false
        }
        return true
    }
    getData(pos) {
        if (!this._posInMap(pos.x, pos.y)) return false
        return this._data[pos.x + pos.y * this._size.x]
    }
    setData(pos, v) {
        if (!this._posInMap(pos.x, pos.y)) return false
        this._autoResize(pos.x, pos.y)
        this._data[pos.x + pos.y * this._size.x] = v
    }
    _autoResize(x, y) {
        // 多增加 25 防止频繁修改大小
        if (x > this._size.x && y > this._size.y) {
            this.resize(x + 25, y + 25)
        } else if (y > this._size.y) {
            this.resize(x, y + 25)
        } else if (x > this._size.x) {
            this.resize(x + 25, y)
        }
    }
    _constraintSize(num) {
        return range(num, 0, MAX_SIZE)
    }
}

export default TilemapData
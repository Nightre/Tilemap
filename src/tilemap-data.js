
const MAX_SIZE = 3000

class TilemapData {
    constructor(){
        this.data = new Uint32Array // 使用紧凑数组读取效率更高
        this.size = { x:10, y:10 }
    }
    setSize(x, y){
        
        let newSize = {
            x:this.constraintSize(x),
            y:this.constraintSize(y)
        }
        if (newSize.x == this.size.x && newSize.y == this.size.y) {
            // 新大小与原本大小一样，不修改
            return
        }
        
        this.size = newSize
        const newData = new Uint32Array(this.size.x * this.size.y)
        newData.set(this.data)
        this.data = newData

        //TODO
    }
    constraintSize(num){
        return Math.max(0, Math.min(num, MAX_SIZE))
    }
}

export default TilemapData

const MAX_SIZE = 1000 // 防止用户瞎搞

class TilemapData {
    constructor(){
        this.data = []
        this.size = { x:10, y:10 }
    }
    setSize(x, y){
        this.size = {
            x:constraintSize(x),
            y:constraintSize(y)
        }
    }
    constraintSize(num){
        return Math.max(0, Math.min(num, MAX_SIZE))
    }
}

export default TilemapData
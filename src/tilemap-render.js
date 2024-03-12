import { createProgramInfo } from "./shader"
import { createBuffer } from "./utils"

const VERTEX_PER_TILE = 4
const INDEX_PER_TILE = 6
//                       aPosition  aRegion   aTextureId  aColor
const BYTES_PER_VERTEX = (4 * 2) + (4 * 2) + (4) + (4)

class TilemapRender {
    constructor(runtime) {
        this.render = runtime.renderer

        this.twgl = this.render.exports.twgl
        /**@type {WebGLRenderingContext} */
        this.gl = this.render.gl

        this.MAX_TEXTURE_UNITS = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        this.MAX_BATCH = Math.floor(2 ** 16 / VERTEX_PER_TILE)
        this.TEXTURES_UNIT_ARRAY = Array.from({ length: this.MAX_TEXTURE_UNITS },
            (_, index) => index);
        // 待传入GPU的数量
        this.count = 0

        const gl = this.gl

        this.program = createProgramInfo(gl, this.twgl, this.MAX_TEXTURE_UNITS)

        this.vertexData = new ArrayBuffer(BYTES_PER_VERTEX * VERTEX_PER_TILE * this.MAX_BATCH)
        this.indexData = new Uint16Array(INDEX_PER_TILE * this.MAX_BATCH)

        this.projectionModel = this.twgl.m4.identity()

        this.typedVertexFloat = new Float32Array(this.vertexData)
        this.typedVertexUint = new Uint32Array(this.vertexData)
        // TODO:useage
        this.indexBufferObject = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indexData.byteLength, gl.STATIC_DRAW)
        this.vertexBufferObject = createBuffer(gl, gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.STATIC_DRAW)
        gl.useProgram(this.program)
        this.initIndexBuffer()
        this.initUnifrom()
        this.initVertexAttribute()
        this.usedTextures = []
        this.needBind = new Set()
    }
    start() {
        this.beforFlush()
    }
    end(){

    }
    setOffset(offset){

    }
    useTexture(texture) {
        let textureUnit = this.usedTextures.indexOf(texture)
        if (textureUnit === -1) {
            this.usedTextures.push(texture)
            textureUnit = this.usedTextures.length - 1
            this.needBind.add(textureUnit)
        }
        return textureUnit
    }
    addVertex(x, y, u, v, textureUnit, color) {
        this.typedVertexFloat.push(x, y, u, v, textureUnit)
        this.typedVertexUint.push(color)
    }
    addTile(
        texture,
        width, height,
        u0, v0,
        u1, v1,
        offsetX, offsetY,
        color
    ) {
        if (this.count >= this.MAX_BATCH) {
            this.flush()
        }
        if (this.usedTextures.length >= this.MAX_TEXTURE_UNITS) {
            this.flush()
        }
        this.count++
        const textureUnit = this.useTexture(texture)

        /**
         * 0-----1
         * | \   |
         * |   \ |
         * 3-----2
         */
        const posX = offsetX + width
        const posY = offsetY + height

        const texU = u0 + u1
        const texV = v0 + v1

        this.addVertex(offsetX, offsetY, u0, v0, textureUnit, color) // 0
        this.addVertex(posX, offsetY, texU, v0, textureUnit, color) // 1
        this.addVertex(posX, posY, texU, texV, textureUnit, color) // 2
        this.addVertex(offsetX, posY, u0, texV, textureUnit, color) // 3
    }
    flush(projectionMatrix) {
        const gl = this.gl
        for (const unit of this.needBind) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, this.usedTextures[unit]);
        }
        gl.uniformMatrix4fv(this.projectionLoc, projectionMatrix)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject)
        gl.bufferSubData(gl.ArrayBuffer, 0, this.vertexData)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject)
    
        gl.drawElements(gl.TRIANGLES, this.count * INDEX_PER_TILE, gl.UNSIGNED_SHORT)

        this.beforFlush()
    }
    beforFlush() {
        this.needBind.clear()
        this.usedTextures = []
        this.count = 0
    }
    initIndexBuffer() {
        const gl = this.gl
        const indexData = this.indexData
        let vertexIndex = 0
        for (let arrayIndex = 0; arrayIndex < INDEX_PER_TILE * this.MAX_BATCH; arrayIndex += INDEX_PER_TILE) {
            indexData[arrayIndex + 0] = vertexIndex + 0
            indexData[arrayIndex + 1] = vertexIndex + 1
            indexData[arrayIndex + 2] = vertexIndex + 2

            indexData[arrayIndex + 3] = vertexIndex + 0
            indexData[arrayIndex + 4] = vertexIndex + 3
            indexData[arrayIndex + 5] = vertexIndex + 1

            vertexIndex += VERTEX_PER_TILE
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject)
        // TODO:useage
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)
    }
    initUnifrom() {
        const gl = this.gl
        const uTextures = gl.getUniformLocation(this.program, "uTextures");
        gl.uniform1iv(uTextures, this.TEXTURES_UNIT_ARRAY)
        this.projectionLoc = gl.getUniformLocation(this.program, "uProjectionMatrix");
    }
    initVertexAttribute(){
        // TODO
        const gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBufferObject)
        const aPosition = gl.getAttribLocation(this.program,"aPosition")
        const aRegion = gl.getAttribLocation(this.program,"aRegion")
        const aTextureId = gl.getAttribLocation(this.program,"aTextureId")
        const aColor = gl.getAttribLocation(this.program,"aColor")

        const stride = BYTES_PER_VERTEX

        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(aPosition);

        gl.vertexAttribPointer(aRegion, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aRegion);

        gl.vertexAttribPointer(aTextureId, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aTextureId);

        gl.vertexAttribPointer(aColor, 4, gl.UNSIGNED_BYTE, true, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aColor);
    }
}

export default TilemapRender
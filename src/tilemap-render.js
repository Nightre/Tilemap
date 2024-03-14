import { createProgramInfo } from "./shader"
import { createBuffer } from "./utils"

const VERTEX_PER_TILE = 4
const INDEX_PER_TILE = 6
//                       aPosition  aRegion   aTextureId  aColor
const BYTES_PER_VERTEX = (4 * 2) + (4 * 2) + (4) + (4)
const FLOAT32_PER_TILE = VERTEX_PER_TILE * BYTES_PER_VERTEX / Float32Array.BYTES_PER_ELEMENT

const drawableAttribute = {
    enabledEffects: false,
    _direction: 90
}

class TilemapRender {
    constructor(runtime) {
        this._render = runtime.renderer

        this.twgl = this._render.exports.twgl
        /**@type {WebGLRenderingContext} */
        this._gl = this._render.gl

        this.MAX_TEXTURE_UNITS = this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS);
        this.MAX_BATCH = Math.floor(2 ** 16 / 6) // TODO
        this.TEXTURES_UNIT_ARRAY = Array.from({ length: this.MAX_TEXTURE_UNITS },
            (_, index) => index);
        // 待传入GPU的数量
        this.count = 0

        const gl = this._gl

        this._program = createProgramInfo(gl, this.twgl, this.MAX_TEXTURE_UNITS)

        this._vertexData = new ArrayBuffer(BYTES_PER_VERTEX * VERTEX_PER_TILE * this.MAX_BATCH)
        console.log(BYTES_PER_VERTEX * VERTEX_PER_TILE * this.MAX_BATCH / 1024 / 1024, 'MB')
        this._indexData = new Uint16Array(INDEX_PER_TILE * this.MAX_BATCH)

        this._projectionModel = this.twgl.m4.identity()

        this._typedVertexFloat = new Float32Array(this._vertexData)
        this._typedVertexUint = new Uint32Array(this._vertexData)
        this._usedVertexData = 0
        // TODO:useage

        this._indexBufferObject = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this._indexData.byteLength, gl.STATIC_DRAW)
        this._vertexBufferObject = createBuffer(gl, gl.ARRAY_BUFFER, this._vertexData.byteLength, gl.STATIC_DRAW)
        gl.useProgram(this._program)
        this._initIndexBuffer()
        this._usedTextures = []
        this._needBind = new Set()
    }
    startRegion() {
        this._beforFlush()
        this._initVertexAttribute()
        const gl = this._gl
        const projection = this._render._projection
        // const modelMatrix = this._twgl.m4.identity()
        // modelMatrix[4] = drawable._scale[0] / 100
        // modelMatrix[5] = drawable._scale[1] / 100
        gl.useProgram(this._program)
        gl.uniformMatrix4fv(gl.getUniformLocation(this._program, "uProjectionModel"), false, projection)
        gl.uniform1iv(gl.getUniformLocation(this._program, "uTextures"), this.TEXTURES_UNIT_ARRAY)
    }
    setModel(modelMatrix) {
        const gl = this._gl
        const projection = this._render._projection
        this.twgl.m4.multiply(projection, modelMatrix, modelMatrix)
        gl.uniformMatrix4fv(gl.getUniformLocation(this._program, "uProjectionModel"), false, modelMatrix)
    }
    exitRegion() {
        // TODO
    }
    _useTexture(texture) {
        let textureUnit = this._usedTextures.indexOf(texture)
        if (textureUnit === -1) {
            this._usedTextures.push(texture)
            textureUnit = this._usedTextures.length - 1
            this._needBind.add(textureUnit)
        }
        return textureUnit
    }
    _pushToVertexFloat(n) {
        this._typedVertexFloat[this._usedVertexData++] = n
    }
    _pushToVertexUint(n) {
        this._typedVertexUint[this._usedVertexData++] = n
    }
    _addVertex(x, y, u, v, textureUnit, color) {
        this._pushToVertexFloat(x)
        this._pushToVertexFloat(y)
        this._pushToVertexFloat(u)
        this._pushToVertexFloat(v)
        this._pushToVertexFloat(textureUnit)
        this._pushToVertexUint(color)
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
        if (this._usedTextures.length >= this.MAX_TEXTURE_UNITS) {
            this.flush()
        }
        this.count++
        const textureUnit = this._useTexture(texture)

        /**
         * 0-----1
         * | \   |
         * |   \ |
         * 3-----2
         */
        const posX = offsetX + width
        const posY = offsetY - height // scratch的投影矩阵Y是反的

        const texU = u0 + u1
        const texV = v0 + v1

        this._addVertex(offsetX, offsetY, u0, v0, textureUnit, color) // 0
        this._addVertex(posX, offsetY, texU, v0, textureUnit, color) // 1
        this._addVertex(posX, posY, texU, texV, textureUnit, color) // 2
        this._addVertex(offsetX, posY, u0, texV, textureUnit, color) // 3
    }
    flush() {
        const gl = this._gl

        for (const unit of this._needBind) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, this._usedTextures[unit]);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferObject)
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._typedVertexFloat.subarray(0, this.count * FLOAT32_PER_TILE))
        gl.drawElements(gl.TRIANGLES, this.count * INDEX_PER_TILE, gl.UNSIGNED_SHORT, 0)
        this._beforFlush()
    }
    _beforFlush() {
        this._needBind.clear()
        this._usedTextures = []
        this._usedVertexData = 0
        this.count = 0
    }
    _initIndexBuffer() {
        const gl = this._gl
        const indexData = this._indexData
        let vertexIndex = 0
        for (let arrayIndex = 0; arrayIndex < INDEX_PER_TILE * this.MAX_BATCH; arrayIndex += INDEX_PER_TILE) {
            indexData[arrayIndex + 0] = vertexIndex + 0
            indexData[arrayIndex + 1] = vertexIndex + 3
            indexData[arrayIndex + 2] = vertexIndex + 2

            indexData[arrayIndex + 3] = vertexIndex + 0
            indexData[arrayIndex + 4] = vertexIndex + 1
            indexData[arrayIndex + 5] = vertexIndex + 2

            vertexIndex += VERTEX_PER_TILE
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferObject)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)
    }

    _initVertexAttribute() {
        const gl = this._gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        const aPosition = gl.getAttribLocation(this._program, "aPosition")
        const aRegion = gl.getAttribLocation(this._program, "aRegion")
        const aTextureId = gl.getAttribLocation(this._program, "aTextureId")
        const aColor = gl.getAttribLocation(this._program, "aColor")

        const stride = BYTES_PER_VERTEX

        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(aPosition);

        gl.vertexAttribPointer(aRegion, 2, gl.FLOAT, false, stride, 2 * 4);
        gl.enableVertexAttribArray(aRegion);

        gl.vertexAttribPointer(aTextureId, 1, gl.FLOAT, false, stride, 4 * 4);
        gl.enableVertexAttribArray(aTextureId);

        gl.vertexAttribPointer(aColor, 4, gl.UNSIGNED_BYTE, true, stride, 5 * 4);
        gl.enableVertexAttribArray(aColor);
    }
    getTexture(skin, scale) {
        const gl = this._gl
        // 不多创建一个drawable，节省内存
        const texture = skin.getTexture(scale)
        this.twgl.setTextureParameters(
            gl, texture, {
            minMag: skin.useNearest(scale, drawableAttribute) ? gl.NEAREST : gl.LINEAR
        }
        );
        return texture
    }
}

export default TilemapRender
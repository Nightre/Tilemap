import { createProgramInfo } from "./shader"
import { createBuffer } from "./utils"

const VERTEX_PER_TILE = 4
const INDEX_PER_TILE = 6
//                       aPosition  aRegion   aTextureId  aColor
const BYTES_PER_VERTEX = (4 * 2) + (4 * 2) + (4) + (4)
const FLOAT32_PER_TILE = VERTEX_PER_TILE * BYTES_PER_VERTEX / Float32Array.BYTES_PER_ELEMENT
class TilemapRender {
    constructor(runtime) {
        this.render = runtime.renderer

        this.twgl = this.render.exports.twgl
        /**@type {WebGLRenderingContext} */
        this.gl = this.render.gl

        this.MAX_TEXTURE_UNITS = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
        this.MAX_BATCH = Math.floor(2 ** 16 / 6)
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
        this.usedVertexData = 0
        // TODO:useage

        this.indexBufferObject = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indexData.byteLength, gl.STATIC_DRAW)
        this.vertexBufferObject = createBuffer(gl, gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.STATIC_DRAW)
        gl.useProgram(this.program)
        this.initIndexBuffer()
        this.usedTextures = []
        this.needBind = new Set()
    }
    startRegion() {
        this.beforFlush()
        this.initVertexAttribute()
    }
    exitRegion() {
        // TODO
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
    pushToVertexFloat(n) {
        this.typedVertexFloat[this.usedVertexData++] = n
    }
    pushToVertexUint(n) {
        this.typedVertexUint[this.usedVertexData++] = n
    }
    addVertex(x, y, u, v, textureUnit, color) {
        this.pushToVertexFloat(x)
        this.pushToVertexFloat(y)
        this.pushToVertexFloat(u)
        this.pushToVertexFloat(v)
        this.pushToVertexFloat(textureUnit)
        this.pushToVertexUint(color)
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

        this.addVertex(offsetX, offsetY, u0, texV, textureUnit, color) // 0
        this.addVertex(posX, offsetY, texU, texV, textureUnit, color) // 1
        this.addVertex(posX, posY, texU, v0, textureUnit, color) // 2
        this.addVertex(offsetX, posY, u0, v0, textureUnit, color) // 3
    }
    flush(projectionMatrix = this.render._projection) {
        const gl = this.gl
        gl.useProgram(this.program) //TODO:测试用

        this.twgl.bindFramebufferInfo(gl, null);
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


        for (const unit of this.needBind) {
            console.log("[tilemap] 绑定纹理", unit, this.usedTextures[unit])
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, this.usedTextures[unit]);
        }
        console.log("[tilemap] projectionMatrix", projectionMatrix, this.TEXTURES_UNIT_ARRAY)

        // init uniform
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "uProjectionMatrix"), false, projectionMatrix)
        gl.uniform1iv(gl.getUniformLocation(this.program, "uTextures"), this.TEXTURES_UNIT_ARRAY)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.typedVertexFloat.subarray(0, this.count * FLOAT32_PER_TILE))
        
        gl.drawElements(gl.TRIANGLES, this.count * INDEX_PER_TILE, gl.UNSIGNED_SHORT, 0)
        this.beforFlush()
    }
    beforFlush() {
        this.needBind.clear()
        this.usedTextures = []
        this.usedVertexData = 0
        this.count = 0
    }
    initIndexBuffer() {
        const gl = this.gl
        const indexData = this.indexData
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)
    }

    initVertexAttribute() {
        const gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject)
        const aPosition = gl.getAttribLocation(this.program, "aPosition")
        const aRegion = gl.getAttribLocation(this.program, "aRegion")
        const aTextureId = gl.getAttribLocation(this.program, "aTextureId")
        const aColor = gl.getAttribLocation(this.program, "aColor")

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
    getTexture(skin, scale){
        const gl = this.gl
        // 不多创建一个drawable，节省内存
        const drawableAttribute = {
            enabledEffects:false,
            _direction:90
        }
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
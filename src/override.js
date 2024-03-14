
function _drawThese (drawables, drawMode, projection, opts = {}){
    const gl = this._gl;
    const twgl = this.exports.twgl
    let currentShader = null;

    const framebufferSpaceScaleDiffers = (
        'framebufferWidth' in opts && 'framebufferHeight' in opts &&
        opts.framebufferWidth !== this._nativeSize[0] && opts.framebufferHeight !== this._nativeSize[1]
    );

    const numDrawables = drawables.length;
    const canDrawTilemap = drawMode == 'default'
    for (let drawableIndex = 0; drawableIndex < numDrawables; ++drawableIndex) {
        const drawableID = drawables[drawableIndex];

        // If we have a filter, check whether the ID fails
        if (opts.filter && !opts.filter(drawableID)) continue;

        const drawable = this._allDrawables[drawableID];
        if (canDrawTilemap && drawable.tilemapData && drawable.tilemapData.skipDraw) {
            continue
        }
        /** @todo check if drawable is inside the viewport before anything else */

        // Hidden drawables (e.g., by a "hide" block) are not drawn unless
        // the ignoreVisibility flag is used (e.g. for stamping or touchingColor).
        if (!drawable.getVisible() && !opts.ignoreVisibility) continue;

        // drawableScale is the "framebuffer-pixel-space" scale of the drawable, as percentages of the drawable's
        // "native size" (so 100 = same as skin's "native size", 200 = twice "native size").
        // If the framebuffer dimensions are the same as the stage's "native" size, there's no need to calculate it.
        const drawableScale = framebufferSpaceScaleDiffers ? [
            drawable.scale[0] * opts.framebufferWidth / this._nativeSize[0],
            drawable.scale[1] * opts.framebufferHeight / this._nativeSize[1]
        ] : drawable.scale;

        // If the skin or texture isn't ready yet, skip it.
        if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;

        // Skip private skins, if requested.
        if (opts.skipPrivateSkins && drawable.skin.private) continue;

        if (canDrawTilemap && drawable.tilemapData && drawable.tilemapData.drawTilemaps) {
            let enterRegion = false
            if (this._regionId !== "tilemap") {
                this._doExitDrawRegion();
                this._regionId = "tilemap";
                enterRegion = true
            }
            drawable.tilemapData.drawTilemaps(enterRegion)
            continue
        }

        const uniforms = {};

        let effectBits = drawable.enabledEffects;
        effectBits &= Object.prototype.hasOwnProperty.call(opts, 'effectMask') ? opts.effectMask : effectBits;
        const newShader = this._shaderManager.getShader(drawMode, effectBits);

        // Manually perform region check. Do not create functions inside a
        // loop.
        if (this._regionId !== newShader) {
            this._doExitDrawRegion();
            this._regionId = newShader;

            currentShader = newShader;
            gl.useProgram(currentShader.program);
            twgl.setBuffersAndAttributes(gl, currentShader, this._bufferInfo);
            Object.assign(uniforms, {
                u_projectionMatrix: projection
            });
        }

        Object.assign(uniforms,
            drawable.skin.getUniforms(drawableScale),
            drawable.getUniforms());

        // Apply extra uniforms after the Drawable's, to allow overwriting.
        if (opts.extraUniforms) {
            Object.assign(uniforms, opts.extraUniforms);
        }

        if (uniforms.u_skin) {
            twgl.setTextureParameters(
                gl, uniforms.u_skin, {
                minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR
            }
            );
        }

        twgl.setUniforms(currentShader, uniforms);
        twgl.drawBufferInfo(gl, this._bufferInfo, gl.TRIANGLES);
    }

    this._regionId = null;
}

export class Override {
    constructor(runtime) {
        runtime.renderer._drawThese = (..._arguments) => {
            _drawThese.call(runtime.renderer, ..._arguments) // 调用
        };
    }
}
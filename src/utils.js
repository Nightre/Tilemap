export const createBuffer = (gl, bufferType, size, usage) => {
    var buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, size, usage);
    return buffer;
}

export const getCallerInfo = (u) => {
    return {
        target: u.target,
        sprite: u.target.sprite,
        drawable: u.runtime.renderer._allDrawables[u.target.drawableID]
    }
}

export const getSkinByName = (u, name) => {
    const skinId = u.target.sprite.costumes_.filter(obj => obj.name === name)[0].skinId
    const skin = u.runtime.renderer._allSkins[skinId]
    // TODO:先加载
    return skin
}
import Scratch from "Scratch";
import { ROUND_TYEP } from "./const";

export const createBuffer = (gl, bufferType, size, usage) => {
    let buffer = gl.createBuffer();
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
    return skin
}
export const coalesce = (value, defaultValue) => {
    // 数值可能是Nan时用来代替 ??
    return Number.isNaN(value) || value === undefined || value === null ? defaultValue : value;
}
export const range = (v, min, max) => {
    return Math.max(min, Math.min(v, max))
}

export const getPosFromScratch = (args) => {
    return {
        x: floorNum(args.POS_X) - 1,
        y: floorNum(args.POS_Y) - 1
    }
}

export const floorNum = (v) => {
    return Math.floor(Scratch.Cast.toNumber(v))
}

export const round = (num, type) => {
    const f = num > 0 ? 1 : -1
    switch (type) {
        case ROUND_TYEP.CEIL:
            return Math.ceil(Math.abs(num)) * f
        case ROUND_TYEP.FLOOR:
            return Math.floor(Math.abs(num)) * f
        default:
            throw new Error("你这样我很难帮你办事哟！")
    }
}

/**
 * 不用twgl.m4.transformPoint开销过大，只需要加工X,Y基向量+平移即可！
 */
export const transformPoint = (m, v) => {
    const dst = []
    var v0 = v[0];
    var v1 = v[1];
    dst[0] = (v0 * m[0] + v1 * m[4] + m[12])
    dst[1] = (v0 * m[1] + v1 * m[5] + m[13])
    return dst;
}

export const htmlColorToUint32Color = (color) => {
    let hex = color.replace("#", "");
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let num = parseInt(hex, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    let a = 255;

    return (a << 24) | (r << 16) | (g << 8) | b;
}
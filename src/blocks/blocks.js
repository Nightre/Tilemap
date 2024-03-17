import { MAP_MODE, POS_ATT, SHOW_MODE } from "../const";
import lang from "./lang";

const translate = (id) => {
    return Scratch.translate({ id, default: lang.en[id] })
}

export default (Scratch) => {
    Scratch.translate.setup(lang)
    console.log(Scratch)
    return {
        id: 'nightstilemap',
        name: '瓦片地图',
        color1: "#604020",
        blocks: [
            {
                blockType: Scratch.BlockType.LABEL,
                text: "基础操作"
            },
            {
                opcode: 'setShowMode',
                text: "地图[NAME] [MODE]",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                    MODE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'SHOW_MODE'
                    }
                }
            },
            {
                opcode: 'updateTilemap',
                text: "创建/更新 该角色的[NAME]地图 瓦片大小:[TILE_SIZE_X] [TILE_SIZE_Y] 层:[LAYER] 瓦片集:[TILE_SET] 模式: [TILEMAP_MODE]",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                    LAYER: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    TILE_SET: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "城市",
                    },
                    TILE_SIZE_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20,
                    },
                    TILE_SIZE_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20,
                    },
                    TILEMAP_MODE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'TILEMAP_MODE'
                    }
                }
            },
            {
                opcode: 'destoryTilemap',
                text: "销毁[NAME]地图",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },


            {
                blockType: Scratch.BlockType.LABEL,
                text: "地图数据"
            },
            {
                opcode: 'resizeTileData',
                text: "设置[NAME]地图大小 :[SIZE_X] [SIZE_Y]（不会清除原本数据）",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    SIZE_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 100,
                    },
                    SIZE_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 100,
                    },
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },
            {
                opcode: 'setTileData',
                text: "设置[NAME]地图数据 位置:[POS_X] [POS_Y] 为 [VALUE]",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    POS_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    POS_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    VALUE: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '马路1',
                    },
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },
            {
                opcode: 'clearTileData',
                text: "清除[NAME]地图数据",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },
            {
                opcode: 'getTileName',
                text: "获取[NAME]地图 位置:[POS_X] [POS_Y] 瓦片的名称",
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    POS_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    POS_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },

            {
                blockType: Scratch.BlockType.LABEL,
                text: "地图集合"
            },
            // {
            //     opcode: 'getAllTileSet',
            //     text: "获取[NAME]瓦片集的JSON数据",
            //     blockType: Scratch.BlockType.REPORTER,
            //     arguments: {
            //         NAME: {
            //             type: Scratch.ArgumentType.STRING,
            //             defaultValue: "城市",
            //         },
            //     }
            // },
            {
                opcode: 'createTileSet',
                text: "创建/更新 [NAME]瓦片集的瓦片 名字:[TILE_NAME] 数据:[DATA]",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "城市",
                    },
                    TILE_NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "马路1",
                    },
                    DATA: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: JSON.stringify({ "texture": "造型1", "clip": { "x": 0, "y": 0, "width": 50, "height": 50 }, "scale": { "x": 1, "y": 1 }, "offset": { "x": 0, "y": 0 }, "anchor": { "x": 25, "y": -25 }, "rotate": 90, "color": "FFFFFF" })
                    }
                }
            },
            {
                opcode: 'removeTileSet',
                text: "移除[NAME]瓦片集的[TILE_NAME]瓦片",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "城市",
                    },
                    TILE_NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "城市",
                    }
                }
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: "图层排序"
            },
            {
                opcode: 'joinTileMapLayer',
                text: "加入[NAME]地图图层",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                }
            },
            {
                opcode: 'setLayerInTileMap',
                text: "设置我在当前地图的图层为地图的第[LAYER]行",
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LAYER: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },

                }
            },
            {
                opcode: 'quitTileMap',
                text: "退出当前所在的图层",
                blockType: Scratch.BlockType.COMMAND,
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: "坐标"
            },
            {
                opcode: 'posToMap',
                text: "世界坐标 [POS_X] [POS_Y] 转[NAME]地图的坐标 [POS_ATT]",
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                    POS_ATT: {
                        type: Scratch.ArgumentType.STRING,
                        menu: "POS_ATT",
                    },
                    POS_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    POS_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                }
            },
            {
                opcode: 'mapToPos',
                text: "[NAME]地图的坐标 [POS_X] [POS_Y] 转世界坐标 [POS_ATT]",
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "地面",
                    },
                    POS_ATT: {
                        type: Scratch.ArgumentType.STRING,
                        menu: "POS_ATT",
                    },
                    POS_X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                    POS_Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                    },
                }
            },
            // {
            //     blockType: Scratch.BlockType.LABEL,
            //     text: "碰撞"
            // },
            // {
            //     opcode: 'collisionWithTilemap',
            //     text: "是否碰到[NAME]地图的[POS_X] [POS_Y]的瓦片",
            //     blockType: Scratch.BlockType.BOOLEAN,
            //     arguments: {
            //         POS_X: {
            //             type: Scratch.ArgumentType.NUMBER,
            //             defaultValue: 0,
            //         },
            //         POS_Y: {
            //             type: Scratch.ArgumentType.NUMBER,
            //             defaultValue: 0,
            //         },
            //         NAME: {
            //             type: Scratch.ArgumentType.NUMBER,
            //             defaultValue: "地面",
            //         },
            //     }
            // }
        ],
        menus: {
            TILEMAP_MODE: {
                items: [
                    {
                        value: MAP_MODE.ORTHOGONAL,
                        text: "正交地图",
                    },
                    {
                        value: MAP_MODE.EQUIDISTANCE,
                        text: "等距地图",
                    },
                ]
            },
            SHOW_MODE: {
                items: [
                    {
                        value: SHOW_MODE.SHOW,
                        text: "显示",
                    },
                    {
                        value: SHOW_MODE.HIDE,
                        text: "隐藏",
                    },
                ]
            },
            POS_ATT: {
                items: [
                    {
                        value: POS_ATT.X,
                        text: "x",
                    },
                    {
                        value: POS_ATT.Y,
                        text: "y",
                    },
                ]
            },
        }
    };
}
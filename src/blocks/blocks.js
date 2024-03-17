import { MAP_MODE, POS_ATT, SHOW_MODE } from "../const";
import lang from "./lang";
import logo from "../images/icon.png";

const translate = (id) => {
  return Scratch.translate({ id, default: lang.en[id] });
};

export default (Scratch) => {
  Scratch.translate.setup(lang);
  return {
    id: "nightstilemap",
    name: translate("nights.tilemap.name"),
    color1: "#3CB371",
    blockIconURI: logo,
    docsURI: "https://github.com/Nightre/Tilemap/blob/main/docs.md",
    blocks: [
      {
        blockType: Scratch.BlockType.LABEL,
        text: translate("nights.tilemap.base"),
      },
      {
        opcode: "setShowMode",
        text: translate("nights.tilemap.setShowMode"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
          MODE: {
            type: Scratch.ArgumentType.STRING,
            menu: "SHOW_MODE",
          },
        },
      },
      {
        opcode: "updateTilemap",
        text: translate("nights.tilemap.updateTilemap"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
          LAYER: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 0,
          },
          TILE_SET: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.tilesetName"),
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
            menu: "TILEMAP_MODE",
          },
        },
      },
      {
        opcode: "destoryTilemap",
        text: translate("nights.tilemap.destoryTilemap"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },

      {
        blockType: Scratch.BlockType.LABEL,
        text: translate("nights.tilemap.mapdata"),
      },
      {
        opcode: "resizeTileData",
        text: translate("nights.tilemap.resizeTileData"),
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
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },
      {
        opcode: "setTileData",
        text: translate("nights.tilemap.setTileData"),
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
            defaultValue: translate("nights.tilemap.default.tileDataName"),
          },
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },
      {
        opcode: "clearTileData",
        text: translate("nights.tilemap.clearTileData"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },
      {
        opcode: "getTileName",
        text: translate("nights.tilemap.getTileName"),
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
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },

      {
        blockType: Scratch.BlockType.LABEL,
        text: translate("nights.tilemap.tileset"),
      },
      // {
      //     opcode: 'getAllTileSet',
      //     text: translate("nights.tilemap."),
      //     blockType: Scratch.BlockType.REPORTER,
      //     arguments: {
      //         NAME: {
      //             type: Scratch.ArgumentType.STRING,
      //             defaultValue: translate("nights.tilemap.default.tilesetName"),
      //         },
      //     }
      // },
      {
        opcode: "createTileSet",
        text: translate("nights.tilemap.createTileSet"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.tilesetName"),
          },
          TILE_NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.tileDataName"),
          },
          DATA: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: JSON.stringify({
              texture: translate("nights.tilemap.default.texture"),
              clip: { x: 0, y: 0, width: 50, height: 50 },
              scale: { x: 1, y: 1 },
              offset: { x: 0, y: 0 },
              anchor: { x: 25, y: -25 },
              rotate: 90,
              color: "FFFFFFFF",
            }),
          },
        },
      },
      {
        opcode: "removeTileSet",
        text: translate("nights.tilemap.removeTileSet"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.tilesetName"),
          },
          TILE_NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.tilesetName"),
          },
        },
      },
      {
        blockType: Scratch.BlockType.LABEL,
        text: translate("nights.tilemap.layer"),
      },
      {
        opcode: "joinTileMapLayer",
        text: translate("nights.tilemap.joinTileMapLayer"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
          },
        },
      },
      {
        opcode: "setLayerInTileMap",
        text: translate("nights.tilemap.setLayerInTileMap"),
        blockType: Scratch.BlockType.COMMAND,
        arguments: {
          LAYER: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 0,
          },
        },
      },
      {
        opcode: "quitTileMap",
        text: translate("nights.tilemap.quitTileMap"),
        blockType: Scratch.BlockType.COMMAND,
      },
      {
        blockType: Scratch.BlockType.LABEL,
        text: translate("nights.tilemap.position"),
      },
      {
        opcode: "posToMap",
        text: translate("nights.tilemap.posToMap"),
        blockType: Scratch.BlockType.REPORTER,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
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
        },
      },
      {
        opcode: "mapToPos",
        text: translate("nights.tilemap.mapToPos"),
        blockType: Scratch.BlockType.REPORTER,
        arguments: {
          NAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: translate("nights.tilemap.default.mapName"),
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
        },
      },
      // {
      //     blockType: Scratch.BlockType.LABEL,
      //     text: translate("nights.tilemap.")
      // },
      // {
      //     opcode: 'collisionWithTilemap',
      //     text: translate("nights.tilemap."),
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
      //             defaultValue: translate("nights.tilemap.default.mapName"),
      //         },
      //     }
      // }
    ],
    menus: {
      TILEMAP_MODE: {
        items: [
          {
            value: MAP_MODE.SQUARE,
            text: translate("nights.tilemap.mapMode.square"),
          },
          {
            value: MAP_MODE.ISOMETRIC,
            text: translate("nights.tilemap.mapMode.isometric"),
          },
        ],
      },
      SHOW_MODE: {
        items: [
          {
            value: SHOW_MODE.SHOW,
            text: translate("nights.tilemap.showMode.show"),
          },
          {
            value: SHOW_MODE.HIDE,
            text: translate("nights.tilemap.showMode.hide"),
          },
        ],
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
        ],
      },
    },
  };
};

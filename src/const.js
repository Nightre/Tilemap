export const SHOW_MODE = {
  SHOW: "sprite",
  HIDE: "tilemap",
};

export const MAP_MODE = {
  SQUARE: "orthogonal",
  ISOMETRIC: "equidistance",
};

export const ROUND_TYEP = {
  FLOOR: 0,
  CEIL: 1,
};

export const POS_ATT = {
  X: "x",
  Y: "y",
};

export const SCRATCH_TYEP = {
  GANDI: "gandi", // gandi 的 scratch-render 有些特殊需要改一下
  TURBOWARP: "turbowarp",
};

export const SCRATCH_BUILD_TYPE = SCRATCH_TYEP.TURBOWARP;
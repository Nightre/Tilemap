import fragString from "./shader/tilemap.frag";
import vertString from "./shader/tilemap.vert";

const generateFragShader = (fs, max) => {
  let code = "";
  fs = fs.replace("%TEXTURE_NUM%", max.toString());

  for (let index = 0; index < max; index++) {
    if (index == 0) {
      code += `if(vTextureId == ${index}.0)`;
    } else if (index == max - 1) {
      code += `else`;
    } else {
      code += `else if(vTextureId == ${index}.0)`;
    }
    code += `{color = texture2D(uTextures[${index}], vRegion);}`;
  }
  fs = fs.replace("%GET_COLOR%", code);

  return fs;
};

export const createProgramInfo = (gl, twgl, max) => {
  return twgl.createProgramInfo(gl, [
    vertString,
    generateFragShader(fragString, max),
  ]).program;
};

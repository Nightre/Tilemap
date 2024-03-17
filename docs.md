# 没啥难的，主要说一下创建tileset的数据，其他看demo你就懂了

```json
{
    "texture":"造型1", // 造型
    "clip":{"x":0,"y":0,"width":50,"height":50}, // 详见下文
    "scale":{"x":1,"y":1}, // 缩放
    "offset":{"x":0,"y":0}, // 偏移
    "anchor":{"x":25,"y":-25}, // 旋转缩放中心
    "rotate":90, // 旋转
    "color":"FFFFFFFF" // 16进制颜色， RGBA
}
```


`clip`是裁剪单位是像素，x,y是裁剪开始，width,height 裁剪大小

clip可以为空，如果为空就不进行裁剪直接用整个造型，并且偏移造型旋转中心点（在绘图编辑器里面的准星）

# It's not difficult, let's mainly talk about creating tileset data. You'll understand the rest by watching the demo

```json
{
    "texture": "Shape 1", // Texture
    "clip": {"x": 0, "y": 0, "width": 50, "height": 50}, // See details below
    "scale": {"x": 1, "y": 1}, // Scale
    "offset": {"x": 0, "y": 0}, // Offset
    "anchor": {"x": 25, "y": -25}, // Rotation and scaling center
    "rotate": 90, // Rotation
    "color": "FFFFFFFF" // Hexadecimal color, RGBA
}
```
clip represents the clipping information in pixels. x and y indicate the starting position of the clip, while width and height specify the size of the clip.

The clip field can be empty. If it is empty, the entire shape will be used without any clipping. In this case, the offset will be applied to the rotation center point of the shape (represented by a crosshair in the graphics editor).

If you have any further questions, feel free to ask!
# Tilemap
 
给scratch的tilemap扩展，之前那个做的不行，重新搞，没搞好
[使用文档](/docs.md)
# 有两种打包模式 在 const.js 中，有针对Gandi Ide的优化
```
export const SCRATCH_BUILD_TYPE = SCRATCH_TYEP.GANDI
export const SCRATCH_BUILD_TYPE = SCRATCH_TYEP.TURBOWARP
```

* dist/timeap.js 扩展文件
* dist/demo.sb3 demo 作品
* dist/icon.png 图标
* dist/cover.png 封面
* dist/info.json

我修改了 scratch-render的webglrender的drawthese方法（在src/override.js中）
。可能需要修改，在src/override.js所有我修改的都标注了by:nights，否则骨骼，图层管理，骨骼，雷神，可能无法与tilemap一起使用

# TODO:

* test
* collision

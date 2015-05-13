## 目录结构说明

- img 目录上传在 http://pic.paymapad.com/img, http://pic.paymapad.com/site/ 为 szt 用到的图片资源, 本质上和 img 目录是一致的
- css 和各 js 目录上传在 http://assets.paymapad.com/

这两个路径地址可在 assets/config.js 中修改 imgRoot 和 assetsRoot

|- assets
|----|--- libs      // seajs 和其他第三方库
|----|--- common    // 公共模块, 包含 载入地图的 loader, loading, message 等
|----|--- capture   // 为 capure 模块的 js 和静态 demo
|----|--- dashboard // 为后台管理面板, 包含列表和编辑入口
|----|--- publish   // 广告发布模块
|----|--- viewer    // 地图广告展示模块
|----|--- link      // 联系方式
|----|--- szt       // 苏州通单页面
|----|--- config.js // 配置 js, server 端也用到同样的配置, 以后, 可由后台生成此配置文件
|----|--- Gruntfile.js      // grunt 打包脚本
|----|--- html5.js          // html5 patch for IE
|----|--- pachage.json      // 包信息说明


## 各应用脚本依赖关系以打包合并信息

见 assets/Guntfile.js


## Grunt 打包步骤:

- 源码在 assets 下, cd 到此目录
- 初始没有安装相关工具的, 需要执行 npm install 安装 grunt 需要的插件
- 修改 assets/config.js 的 isDebug 值要修改成  false
- 执行 grunt, 会在当前目录生成 dist 目录, 将 dist 目录下所有文件拷贝至 http://assets.paymapad.com/,
注意如果服务器上没有 libs 目录, 需要将 assets/libs 目录拷贝.



## TODO

- version control
- timestamp 更新还是有些问题





### 静态文件说明

#### less 编译

1) 安装: `npm install -g less`

2) 隐身到编辑器中, 自动 watch 和 编译

#### spm 打包

1) 安装: `npm install spm -g`

2) 本地开发:

```
cd assets
spm doc watch // 查看 http://127.0.0.1:8000/demo.html
```
注意: 本地是依赖 seajs 的, 目前配置已好. 可以不用修改

添加依赖在 package.json 中, 然后通过 spm install 安装到 spm_modules 中.

3) 发布打包:

`spm build --include standalone` // 依赖和自身代码打包成一个, 页面引入参考 1.html

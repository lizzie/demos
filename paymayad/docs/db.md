## 创建第一个用户 root

cd script && node script.js // 账户和密码分别是 root 和 wifi 密码

## 数据库操作

```
 use paymapad
 show collections
 db.ads.remove()
 db.adplaces.remove()
 db.places.remove()   这样就清空所有数据了


 db.dropDatabase();   // 删除数据库
```

## 数据库索引

```
 use paymapad
 db.places.ensureIndex({centerLnglat: "2d"})
 db.places.getIndexes()   // 在生成 place 之后, 需要执行下这条命令以建立地理字段索引
 db.ads.dropIndexes()
 db.ads.ensureIndex({lnglatArr: "2d"});
 db.ads.getIndexes()   // 在生成 ad 之后, 需要执行下这条命令以建立地理字段索引
 db.adplaces.ensureIndex({centerLnglat: "2d"})
```


## DB Export/Import

相关数据导入的脚本位于 script 目录下:

- 导入广告位: node import_place.js    // 各字段去重导入, 从 data/places.json 中导入数据, 数据格式保持一致,
- 导出广告位: mongoexport --db paymapad --collection places --jsonArray --out places.json  // 将 places.json 复制到 script/data 目录下并执行导入

- 导入广告: node import_ad.js        // 各字段去重导入, 从 data/ads.json 中导入数据, 数据格式保持一致
- 导出广告: mongoexport --db paymapad --collection ads --jsonArray --out ads.json

- 自动匹配: node match.js            // 遍历了 place 和 ad, 简单匹配合适位置, 没有去重
- 手工添加: 即 dashboard 的location 过程, 具体代码在 route/places.js 的 addAD 代码, 非去重
- 最终获取广告: 在 route/places.js 的 fetch 代码, 非去重

另外的一种数据导入/导出方式

- 导出: mongodump --db paymapad --collection places // 生成 dump/paymapad/places.bson
- 导入: mongorestore --collection places --db paymapad paymapad/places.bson   // 不是去重导入的

### 注意点

在新建数据库之后, 需要手工指定几个位置索引字段:

- 进入mongodb 命令行, 执行:

```
 use paymapad
 db.places.dropIndexes()                       // 删除 place 现有索引
 db.places.ensureIndex({centerLnglat: "2d"})   // 在生成 place 之后, 需要执行下这条命令以建立地理字段索引, place 存储的外包矩形经纬度暂时没用
 db.places.getIndexes()

 db.ads.dropIndexes()                          // 删除 ad 现有索引
 db.ads.ensureIndex({lnglatArr: "2d"});        // 在生成 ad 之后, 需要执行下这条命令以建立地理字段索引
 db.ads.getIndexes()

 db.adplaces.ensureIndex({centerLnglat: "2d"}) // 确定广告展示位的中心点位置索引

```


登录服务器
> mongo // 进入 mongo 控制台
> use paymapad;
> db.places.count();  // 查看现有广告位个数
> db.places.remove(); // 删除所有广告位
CTRL+D // 退出

> cd paymapad/script
// 将 places.json 上传到 paymapad/script/data 目录下, 命名为 places.json
// 或者直接改脚本 import_place.js 中第六行的文件名字, 多个 json 文件只能改多次
> node import_place.js // 导入

> mongo // 再进入 mongo 控制台
> use paymapad;
> db.places.dropIndexes()
> db.places.ensureIndex({centerLnglat: "2d"})
> db.places.getIndexes()
CTRL+D // 退出
# Pay Map AD

## 初始化过程

1) 使用 /path/to/mongod --dbpath=/Users/shengyan/software/db/ 启动 mongodb  // 数据库相关操作可见 db.md

2) 安装必要的 nodejs 模块之后, 复制所有代码至 server 端(务必保留 assets/upload 目录), 使用 node server.js 启动 paymapad app    // 详细见 nodejs.md

3) chrome 载入 capture 扩展程序, 修改必要设置                           // 详细见 capture.md

4) 访问 http://www.paymapad.com/capture, 获取可用广告位                // 此时, 数据库已有 place 集合

5) 进入 mongodb 控制台, 执行以下命令, 为 place 建立二维索引:

```
 use paymapad
 db.places.ensureIndex({centerLnglat: "2d"})
 db.places.getIndexes()
```

6) 可以访问 http://www.paymapad.com/view?type=blank, 查看所有空白的广告位

// 此时, 获取广告位过程已经结束. 可以通过命令导出广告位数据, 详细见 db.md

7) 接下来, 可以访问 http://www.paymapad.com/dashboard/ 查看现有广告列表, 初始化时为 0 条记录;

8) 访问 http://www.paymapad.com/dashboard/#!/new, 按照流程新建一个广告, 经过三步, 分别为 edit, configure, location(可选);

9) 进入 mongodb 控制台, 执行以下命令, 为 ads 建立二维索引:

```
 db.ads.dropIndexes()
 db.ads.ensureIndex({lnglatArr: "2d"});
 db.ads.getIndexes()
```

// 此时, 广告添加过程完毕

// 如果有执行 location, 另外需要为 adplace 建立二维索引, 或者是在第一次广告和广告位匹配之后, 执行:

```
 db.adplaces.ensureIndex({centerLnglat: "2d"});
 db.adplaces.getIndexes();
```

10) 可以通过 http://www.paymapad.com/view 访问最终的广告展示效果

**各步骤详细见各自的 readme **

```

又拍云的用户名：shenhao75 密码：shenp0o9i8u7

http://2-vpn1.com/
shenhao75
map163

```


阿里云服务器用户密码:
ssh root@110.76.45.250   // password: shenMAP163

8D037dc0



## JS 静态化基本思路

- 前提: 已有广告位 places , 已有广告数据 ads, 两者数据结构参见 db.js ;
- 将 places 和 ads 根据位置信息进行匹配, 生成 adplaces, 每条记录包含经纬度, nZoom等, 并将其经纬度通过以下算法转成瓦片索引值x, y, z, 并把所有 x, y, z作为 key 值累积加一;

```

    function latlng2tilecoordinate_1(lon, lat, nZoom) {
        var x = (Math.floor((Number(lon) + 180) / 360 * Math.pow(2, nZoom))),
            y = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, nZoom)));

        return [x, y, nZoom];
    }

```

- 将所有的 key 值遍历遍, 获取对应此 key 的所有 adplaces 记录, 套用 views/tile.html 模板, 模板里的 id 为前后端约定好的瓦片 id 号, id 和 key 都是由 x, y, z 生成的,
可以一致, 也可不一致, key 是用来后台做匹配的, id 是前端这边载入某js时回调判断的标识.
- 上传到云, 这样就生成了一个瓦片的静态化文件

余留问题是:
1) 路径规则需要确定, 目前的几个因素有:
- mapTypeID : 地图类型, 某种地图存一份数据
- version: 版本号, 数据是异步的, 当后台更新时, 需要定时更新静态js中的数据, 所以就应该需要版本号支持
- x, y: 瓦片索引号
- z: 等
- 其他没想到的?
2) baidu/高德前端API的支持没有 Google 的完整, 某些实现需要有替代方案.



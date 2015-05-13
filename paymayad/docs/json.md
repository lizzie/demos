## json 接口

可以具体查看 server.js 中以 /json/ 开头的 route 代码

1) /json/place_list.jsn

```
    - 添加广告位
    - POST
    - arguments:
        data[]:-67.767431,-201.634373,0     # 空白广告位中心点经纬度及形状ID  todo???? 外包矩形
        data[]:-16.223916,-86.835241,1
        data[]:58.384438,-57.399566,2
        mapTypeID:1                         # 地图类型ID
        bounds:-71.82377,-204.577941,71.82377,204.577941    # 当前截屏的地图bounds, sw.lat(), sw.lng(), ne.lat(), ne.lng()
        zoom:3                              # 当前地图缩放等级
    - return:
        status: errormsg || 0 # 0 表示成功
```

2) /json/ad_list.jsn

```
    - 获取该用户的广告列表
    - ALL
    - arguments:
        ?page:0
    - return:
        {
          "status": 0,
          "page": "0",
          "adList": [
            {
              "__v": 0,
              "_id": "510b2f5aec90239d02000001",
              "cateID": 1,
              "link": "http://a.cn",
              "name": "name",
              "infoDescription": ",",
              "infoImgUrl": [
                "",
                ""
              ],
              "infoStyleID": 0,
              "imgUrl": [
                "/assets/upload/3626d27d98b8310aff36d87e95c1d51e.png",
                "",
                ""
              ],
              "lnglat": []
            }
          ]
        }

```

3) /json/ad.jsn/:id

```
    - 删除某广告
    - DELETE
    - arguments:
        id
    - return:
        {
            "status": 0 or 1
        }

```

4) /json/ad.jsn

```
    - 创建/修改广告
    - POST/PUT
    - arguments:
        ad json object
    - return:
        new ad json object

```

5) /json/place_list.jsn

```
    - 获取空白广告位
    - GET
    - arguments:
        todo
    - return:

```

5) /json/ad_place.jsn

```
    - 广告位和广告关系添加
    - POST
    - arguments:
        placeIDList: []
        adID:510f565e90eaaed004000001
    - return:
        {
            "status": 0 or 1
        }

```


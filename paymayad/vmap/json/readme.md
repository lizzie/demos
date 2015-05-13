数据接口说明
================

aliyun

查询某个地址
/search?

k: 查询关键词
b: 当前视图范围内搜索, 左上和右下点经纬度
c: 中心点坐标, 如果不是当前视图范围内搜索, 就默认是中心点开始
f: 回调函数名称
h: 返回一页多少条记录
s: 从第几条开始, 第一页就是第0个, 第二页就是第h开始

// 额外的
layerID: 图层ID
index: 地图索引号, 默认是0
mode: 查询模式, 默认是1
method: 查询方式, 默认是0, 精确(0)还是模糊(1)
distance: 距离半径
action: KEYWORDSELECT // 关键词查询, 以中心点坐标c参数
action: RECTSELECT // 区域查询, 以边界区域b参数
action: POINTBUFFERSELECT // 点缓冲, 以坐标c
action: POLYLINEBUFFERSELECT // 线缓冲, 以layerID
action: POLYGONBUFFERSELECT // 面缓冲, 以layerID

返回
AliLS_0({
    "totalInfo":{
        "totalNumber":1016,
        "storedNumber":800,
        "start":0,
        "hit":10,
        "suggestKind":"Category",
        "region":[

        ],
        "key":"餐馆",
        "preCity":[

        ],
        "error":""
    },
    "cityList":[

    ],
    "poiList":[
        {
            "name":"意大利花园餐厅", "kind":"03122000", "city":"杭州市", "add":"浙江省杭州市上城区龙井路7号", "tel":"0571-87979123", "latLon":"30.24225,120.15912", "range":"", "admincode":330102, "id":"233435800000010001000300000000",
            "lines":[

            ], "distance":"1383", "per_consumption_price":0.000000, "colligate_exponent":0.000000, "discount":0.000000, "domain_url":"0", "picture_url":"0", "good_ratio":0.000000, "tags":"吃饭,意式菜,正餐,美食,西餐,西餐厅,餐厅,餐饮,餐饮美食,餐馆,饭店,饭馆", "recommend":"0"
        },
        {
            "name":"云·水餐厅酒吧", "kind":"0311e600", "city":"杭州市", "add":"浙江省杭州市上城区西湖天地2", "tel":"0571-87070768", "latLon":"30.24724,120.16005", "range":"", "admincode":330102, "id":"602187000000010001000300000000",
            "lines":[

            ], "distance":"1703", "per_consumption_price":0.000000, "colligate_exponent":0.000000, "discount":0.000000, "domain_url":"0", "picture_url":"0", "good_ratio":0.000000, "tags":"中餐,中餐厅,中餐馆,吃饭,正餐,美食,餐厅,餐饮,餐饮美食,餐馆,饭店,饭馆", "recommend":"0"
        }
    ]
})
http://search.ditu.aliyun.com/search?k=%E9%A4%90%E9%A6%86&b=119.89400774414062,30.135473134094866,120.39663225585937,30.341912470542567&f=AliLS_0&h=10&s=0&o=49
http://search.ditu.aliyun.com/search?k=%E6%98%9F%E6%B9%96%E8%A1%97%20%E7%8B%AC%E5%A2%85%E6%B9%96%E5%A4%A7%E9%81%93&a=320501&b=120.71881205551148,31.29576566686757,120.74104220382691,31.3014311726267&f=AliLS_2&h=10&s=0&o=63


POI 查询
/get_poi?

c: 中心点坐标
layerID: 图层ID


type:

区域查询
http://basic.ditu.aliyun.com/district?it=p&h=1&nb=1&l=32.058,118.796&tl=1&a=vcilgbnN&sp=8&pa=vcilgnNb&c=_cb_pl0
_cb_pl0({"list":[{"v":3,"c":0,"i":"320201","l":[31.56591,120.30282],"g":[31.51269,120.32186],"b":[31.26400,120.03964,31.76138,120.60408],"n":"市辖区","N":"市辖区","P":{"v":2,"c":8,"i":"320200","l":[31.56591,120.30282],"g":[31.55707,120.33149],"n":"无锡","N":"无锡市","b":[31.12082,119.51961,31.99332,120.60408],"P":{"v":1,"c":13,"i":"320000","l":[32.05830,118.79638],"g":[32.86488,119.72343],"n":"江苏","N":"江苏省","b":[30.76487,116.36196,35.12458,121.97519],"P":{"v":0,"c":34,"i":"0","l":[39.90364,116.41210],"g":[39.90364,116.41210],"n":"中国","N":"中国","b":[2.93943,73.29706,53.58929,135.20420]}}}}]})

参数和返回在 http://ditu.aliyun.com/jsdoc/district_api.html 详细说明




http://www.map163.com/MapTile/5/[/[/[/[/9/[/[/[/1/[[D.png?106,41,6,lon:119.53125,lat:26.71875
http://www.map163.com/MapTile/5/[/[/[/[/A/[/[/[/1/[[1.png?107,41,6,lon:122.34375,lat:26.71875
http://www.map163.com/MapTile/5/[/[/[/[/9/[/[/[/1/[[C.png?106,40,6,lon:119.53125,lat:23.90625
http://www.map163.com/MapTile/5/[/[/[/[/A/[/[/[/1/[[0.png?107,40,6,lon:122.34375,lat:23.90625


http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[A.png?213,81,7,lon:120.234375,lat:24.609375
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[E.png?214,81,7,lon:121.640625,lat:24.609375
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[8.png?213,80,7,lon:120.234375,lat:23.203125
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[C.png?214,80,7,lon:121.640625,lat:23.203125


http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[A.png?86,19,7,lon:-58.359375,lat:-62.578125
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[E.png?87,19,7,lon:-56.953125,lat:-62.578125
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[9.png?86,18,7,lon:-58.359375,lat:-63.984375
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[D.png?87,18,7,lon:-56.953125,lat:-63.984375
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[8.png?86,17,7,lon:-58.359375,lat:-65.390625
http://www.map163.com/MapTile/6/[/[/[/[/K/[/[/[/3/[[C.png?87,17,7,lon:-56.953125,lat:-65.390625
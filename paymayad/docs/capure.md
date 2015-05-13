## capture

capture 插件代码是在 capture/ 目录下

- 修改 config.js captureURL 接口 和 shapePadding 设置, config.js 中各项可配置, 详见注释
- 修改 capture 插件 background.js 30行, 图片保存目录
- chrome下载入 capture 插件


接口: http://www.paymapad.com/capture?map=baidu&center=32.5,120.6&zoom=8&count=10&autorun=1

- map: 哪种地图
- center: 中心点lat,lng
- zoom: 缩放等级
- count: 截屏个数
- autorun: 自动模式, 按 esc 停止自动截屏

## 示例:
- http://www.paymapad.com/capture?map=baidu&center=&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=&zoom=17&count=80&autorun=1

苏州:
- http://www.paymapad.com/capture?map=baidu&center=31.298886,120.58531600000003&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=31.298886,120.58531600000003&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=31.298886,120.58531600000003&zoom=17&count=80&autorun=1

上海:
- http://www.paymapad.com/capture?map=baidu&center=31.2303930,121.4737040&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=31.2303930,121.4737040&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=31.2303930,121.4737040&zoom=17&count=80&autorun=1

北京:
- http://www.paymapad.com/capture?map=baidu&center=39.90403,116.40752599999996&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=39.90403,116.40752599999996&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=39.90403,116.40752599999996&zoom=17&count=80&autorun=1

广州:
- http://www.paymapad.com/capture?map=baidu&center=23.129163,113.26443500000005&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=23.129163,113.26443500000005&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=23.129163,113.26443500000005&zoom=17&count=80&autorun=1

南京:
- http://www.paymapad.com/capture?map=baidu&center=32.060255, 118.796877&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=32.060255, 118.796877&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=32.060255, 118.796877&zoom=17&count=80&autorun=1

武汉:
- http://www.paymapad.com/capture?map=baidu&center=30.593099, 114.30539299999998&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.593099, 114.30539299999998&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.593099, 114.30539299999998&zoom=17&count=80&autorun=1


海口:
- http://www.paymapad.com/capture?map=baidu&center=20.030793,110.32885899999997&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=20.030793,110.32885899999997&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=20.030793,110.32885899999997&zoom=17&count=80&autorun=1


成都:
- http://www.paymapad.com/capture?map=baidu&center=30.658601,104.06485599999996&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.658601,104.06485599999996&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.658601,104.06485599999996&zoom=17&count=80&autorun=1

乌鲁木齐:
- http://www.paymapad.com/capture?map=baidu&center=43.825645,87.61682300000007&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=43.825645,87.61682300000007&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=43.825645,87.61682300000007&zoom=17&count=80&autorun=1


西安:
- http://www.paymapad.com/capture?map=baidu&center=34.341568,108.94017499999995&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=34.341568,108.94017499999995&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=34.341568,108.94017499999995&zoom=17&count=80&autorun=1


济南:
- http://www.paymapad.com/capture?map=baidu&center=36.650997,117.120497&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.650997,117.120497&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.650997,117.120497&zoom=17&count=80&autorun=1

长春:
- http://www.paymapad.com/capture?map=baidu&center=43.817084,125.32354199999997&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=43.817084,125.32354199999997&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=43.817084,125.32354199999997&zoom=17&count=80&autorun=1

哈尔滨:
- http://www.paymapad.com/capture?map=baidu&center=45.80377499999999, 126.53496700000005&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=45.80377499999999, 126.53496700000005&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=45.80377499999999, 126.53496700000005&zoom=17&count=80&autorun=1

沈阳:
- http://www.paymapad.com/capture?map=baidu&center=41.80572,123.43146999999999&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=41.80572,123.43146999999999&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=41.80572,123.43146999999999&zoom=17&count=80&autorun=1


呼和浩特:
- http://www.paymapad.com/capture?map=baidu&center=40.842299,111.74913800000002&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=40.842299,111.74913800000002&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=40.842299,111.74913800000002&zoom=17&count=80&autorun=1

兰州:
- http://www.paymapad.com/capture?map=baidu&center=36.061255,103.83437700000002&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.061255,103.83437700000002&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.061255,103.83437700000002&zoom=17&count=80&autorun=1


西宁:
- http://www.paymapad.com/capture?map=baidu&center=36.617144,101.77822800000001&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.617144,101.77822800000001&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=36.617144,101.77822800000001&zoom=17&count=80&autorun=1

太原:
- http://www.paymapad.com/capture?map=baidu&center=37.87059,112.54887899999994&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=37.87059,112.54887899999994&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=37.87059,112.54887899999994&zoom=17&count=80&autorun=1


郑州:
- http://www.paymapad.com/capture?map=baidu&center=34.7466,113.62536799999998&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=34.7466,113.62536799999998&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=34.7466,113.62536799999998&zoom=17&count=80&autorun=1


杭州:
- http://www.paymapad.com/capture?map=baidu&center=30.274089,120.15506900000003&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.274089,120.15506900000003&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=30.274089,120.15506900000003&zoom=17&count=80&autorun=1


温州:
- http://www.paymapad.com/capture?map=baidu&center=27.994267,120.69936699999994&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=27.994267,120.69936699999994&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=27.994267,120.69936699999994&zoom=17&count=80&autorun=1


长沙:
- http://www.paymapad.com/capture?map=baidu&center=28.228209,112.93881399999998&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=28.228209,112.93881399999998&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=28.228209,112.93881399999998&zoom=17&count=80&autorun=1

南宁:
- http://www.paymapad.com/capture?map=baidu&center=22.817239,108.366129&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.817239,108.366129&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.817239,108.366129&zoom=17&count=80&autorun=1

昆明:
- http://www.paymapad.com/capture?map=baidu&center=24.880182,102.83286099999998&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=24.880182,102.83286099999998&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=24.880182,102.83286099999998&zoom=17&count=80&autorun=1

南昌:
- http://www.paymapad.com/capture?map=baidu&center=28.68316,115.85808900000006&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=28.68316,115.85808900000006&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=28.68316,115.85808900000006&zoom=17&count=80&autorun=1


拉萨:
- http://www.paymapad.com/capture?map=baidu&center=29.645554,91.14085599999999&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=29.645554,91.14085599999999&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=29.645554,91.14085599999999&zoom=17&count=80&autorun=1


香港:
- http://www.paymapad.com/capture?map=baidu&center=22.396428,114.10949700000003&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.396428,114.10949700000003&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.396428,114.10949700000003&zoom=17&count=80&autorun=1

澳门:
- http://www.paymapad.com/capture?map=baidu&center=22.198745,113.54387300000008&zoom=15&count=40&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.198745,113.54387300000008&zoom=16&count=60&autorun=1
- http://www.paymapad.com/capture?map=baidu&center=22.198745,113.54387300000008&zoom=17&count=80&autorun=1

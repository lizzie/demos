## viewer


接口: http://www.paymapad.com/view?map=google&latlng=0,0

- map: 哪种地图
- latlng: 中心点lat,lng


显示空白广告位接口:  http://www.paymapad.com/view?type=blank&map=google&latlng=31.24681323597498,121.53194012213135&zoom=17

注意: 两个接口使用的模板不同, 载入的 js 也不一样:

- 前者为便于载入静态 js 代码调整的, 对应的代码是 view/google.js or view/baidu.js
- 后者直接根据当前视窗 bounds 查询数据库获取的数据, 对应的代码是 common/google.js or common/baidu.js





北京 15 http://www.paymapad.com/view?type=blank&map=google&latlng=39.90491886718128,116.3981489972839&zoom=15
北京 16 http://www.paymapad.com/view?type=blank&map=google&latlng=39.90491886718128,116.3981489972839&zoom=16  x
北京 17 http://www.paymapad.com/view?type=blank&map=google&latlng=39.90491886718128,116.3981489972839&zoom=17
北京 18 http://www.paymapad.com/view?type=blank&map=google&latlng=39.90491886718128,116.3981489972839&zoom=18
北京 19 http://www.paymapad.com/view?type=blank&map=google&latlng=39.90491886718128,116.3981489972839&zoom=19

上海 15 http://www.paymapad.com/view?type=blank&map=google&latlng=31.22186068934713,121.4390713171997&zoom=15
上海 16 http://www.paymapad.com/view?type=blank&map=google&latlng=31.22186068934713,121.4390713171997&zoom=16
上海 17 http://www.paymapad.com/view?type=blank&map=google&latlng=31.22186068934713,121.4390713171997&zoom=17
上海 18 http://www.paymapad.com/view?type=blank&map=google&latlng=31.22186068934713,121.4390713171997&zoom=18
上海 19 http://www.paymapad.com/view?type=blank&map=google&latlng=31.22993543998146,121.4716547923126&zoom=19

北京 15 http://www.paymapad.com/view?type=blank&map=baidu&latlng=39.822756,116.430307&zoom=15
北京 16 http://www.paymapad.com/view?type=blank&map=baidu&latlng=39.822756,116.430307&zoom=16
北京 17 http://www.paymapad.com/view?type=blank&map=baidu&latlng=39.911481,116.405047&zoom=17
北京 18 http://www.paymapad.com/view?type=blank&map=baidu&latlng=39.911481,116.405047&zoom=18
北京 19 http://www.paymapad.com/view?type=blank&map=baidu&latlng=39.911481,116.405047&zoom=19

上海 15 http://www.paymapad.com/view?type=blank&map=baidu&latlng=31.255555,121.532992&zoom=15
上海 16 http://www.paymapad.com/view?type=blank&map=baidu&latlng=31.255555,121.532992&zoom=16
上海 17 http://www.paymapad.com/view?type=blank&map=baidu&latlng=31.255555,121.532992&zoom=17
上海 18 http://www.paymapad.com/view?type=blank&map=baidu&latlng=31.255555,121.532992&zoom=18
上海 19 http://www.paymapad.com/view?type=blank&map=baidu&latlng=31.228507,121.476314&zoom=19



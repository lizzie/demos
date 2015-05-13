## node server

```
cd sofa-insight
npm install
node server.js
```

注意:
- 几个数据接口是在 server.js 中以 /json/ 开头的 url
- HTML 模板在 views 中

## assets 说明

- 拷贝整个 assets 目录至工程目录下
- assets 的引用在 header.html/footer.html 两个文件中, 可以修改其路径
- assets 的组织使用的是 seajs 的 AMD 组织方式, 相关入门文档参见 http://seajs.org
- assets/config.js 为用到的类库
- assets/main.js 通用 js 逻辑
- assets/overview.js 概览页面
- assets/entrance.js 入口详情
- assets/search.js 搜索与对比


## 图表类库汇总

行内图表

- http://omnipotent.net/jquery.sparkline

时间线的
- http://square.github.io/cubism/
- http://www.simile-widgets.org/timeline/
- http://dygraphs.com/


综合
- https://github.com/mbostock/d3/wiki/Gallery
- http://www.humblesoftware.com/flotr2/index




最终组件:

CSS:

- http://twitter.github.io/bootstrap
- http://clabs.co/projects/simpliq/index.html

Charts

- http://highcharts.com

Tree

- https://github.com/ludo/jquery-treetable

Sortable

- https://github.com/javve/list



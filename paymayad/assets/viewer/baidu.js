/**
 * Pay Map AD view baidu.js
 * @author: liz
 * @date: 2013-04-02
 */
define(function (require, exports, module) {
    var doc = document,

        Mustache = require("mustache"),
        global_config = require("config"),
        info_tpl = require("info_tpl");

    var defaultLatLng = global_config.defaultLatLng;

    defaultLatLng = defaultLatLng.split(",");
    defaultLatLng = [parseFloat(defaultLatLng[0]), parseFloat(defaultLatLng[1])];

    function PayMapType(mapObj) {
        var self = this;

        self.mapObj = mapObj;
        self.markerPool = {};  // 记录当前屏上已加载 marker   PS: 百度API没有移除瓦片接口, 没法删除 markerPool和 relations 对应项
        self.relations = {};   // 记录瓦片上包含多少个 marker

        self.infoWindow = new BMap.InfoWindow("baidu");
    }

    PayMapType.prototype.addMarker = function (data) {
        var self = this,
            elem = doc.getElementById(data.id);

        //if (!elem) return;

        for (var i = 0; i < data.ads.length; i++) {
            (function (v, id) {
                if (v.mapTypeID === global_config["adMap"]["baidu"]["mapTypeID"] && !self.markerPool[v.id]) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new BMap.Marker(new BMap.Point(v.centerLnglat[0], v.centerLnglat[1]), {
                            title:v.title,
                            icon:new BMap.Icon(v.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                new BMap.Size(shape.width, shape.height))
                        });
                    self.mapObj.addOverlay(mk);
                    self.markerPool[v.id] = mk;

                    if (!self.relations[id]) {
                        self.relations[id] = [];
                    }
                    self.relations[id].push(v.id);

                    if (v.infoImgUrl) {
                        mk.addEventListener("click", function () {
                            self.mapObj.openInfoWindow(self.infoWindow, this.getPosition());
                            self.infoWindow.setContent(Mustache.render(info_tpl, {
                                "image":v.infoImgUrl,
                                "description":v.infoDescription,
                                "styleID":v.infoStyleID,
                                "link":v.link
                            }));

                            self.infoWindow.setWidth(global_config["adStyle"][v.infoStyleID]["width"]);
                            self.infoWindow.setHeight(global_config["adStyle"][v.infoStyleID]["height"]);

                        });
                    }
                }
            })(data.ads[i], data.id);
        }
    };


    var map = new BMap.Map(doc.getElementById("baidu_map"));
    map.centerAndZoom(new BMap.Point(defaultLatLng[1], defaultLatLng[0]), global_config.defaultZoom);
    map.addControl(new BMap.NavigationControl());


    var paymapLayer = new BMap.TileLayer({isTransparentPng:true}),
        paymap = new PayMapType(map);

    paymapLayer.getTilesUrl = function (coord, zoom) {
        var id = "paymapad_" + coord.x + "_" + coord.y + "_" + zoom;
        require.async("/json/tile.js?id=" + id + "&x=" + coord.x + "&y=" + coord.y + "&z=" + zoom, function (data) {
            paymap.addMarker(data);
        });

        return global_config.imgRoot + "/blank.png";
    };

    // add paymap layer to baidu map
    map.addTileLayer(paymapLayer);
});


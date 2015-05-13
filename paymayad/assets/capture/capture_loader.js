/**
 * Pay Map AD capture loader js
 * @description: 地图载入及相关方法封装
 * @author: liz
 * @date: 2013-01-23
 */
define(function (require, exports, module) {
    var $ = require("$"),
        _ = require("underscore"),
        global_config = require("config");

    var loader = {
        current:"google",
        mapObj:null,
        mapType:{
            "google":{
                "isLoaded":false,
                "cbk":undefined,
                "class":"google",
                getBounds:function () {
                    var bounds = this.mapObj.getBounds(),
                        sw = bounds.getSouthWest(),
                        ne = bounds.getNorthEast();
                    return [sw.lat(), sw.lng(), ne.lat(), ne.lng()];
                },
                pixelToLngLat:function (x, y) {
                    var latlng = this.pixelToLatlng(x, y);
                    return [latlng.lng(), latlng.lat()];
                },
                pixelToLatlng:function (x, y) {
                    var map = this.mapObj,
                        prj = map.getProjection(),
                        coord = prj.fromLatLngToPoint(map.getCenter()),
                        win = $(window),
                        width = win.width(), height = win.height(),
                        scale = 1 / Math.pow(2, map.getZoom());

                    return prj.fromPointToLatLng({
                        x:coord.x + (x - width / 2) * scale,
                        y:coord.y + (y - height / 2) * scale
                    });
                },
                whenTileReady:function (cbk) {
                    var map = this.mapObj;
                    google.maps.event.addListener(map, "tilesloaded", function (e) {
                        cbk && cbk();
                    });
                }
            },
            "baidu":{
                "isLoaded":false,
                "cbk":undefined,
                "class":"BMap",
                getBounds:function () {
                    var bounds = this.mapObj.getBounds(),
                        sw = bounds.getSouthWest(),
                        ne = bounds.getNorthEast();
                    return [sw.lat, sw.lng, ne.lat, ne.lng];
                },
                pixelToLngLat:function (x, y) {
                    var point = this.pixelToLatlng(x, y);
                    return [point.lng, point.lat];
                },
                pixelToLatlng:function (x, y) {
                    return this.mapObj.pixelToPoint(new BMap.Pixel(x, y));
                },
                whenTileReady:function (cbk) {
                    var map = this.mapObj;

                    map.addEventListener("tilesloaded", function () {
                        cbk && cbk();
                    });
                }
            },
            "gaode":{
                "isLoaded":true,
                "cbk":undefined,
                "class":"AMap",
                getBounds:function () {
                    var bounds = this.mapObj.getBounds(),
                        sw = bounds.southwest,
                        ne = bounds.northeast;
                    return [sw.lat, sw.lng, ne.lat, ne.lng];
                },
                pixelToLngLat:function (x, y) {
                    var point = this.pixelToLatlng(x, y);
                    return [point.lng, point.lat];
                },
                pixelToLatlng:function (x, y) {
                    return this.mapObj.containTolnglat(new AMap.Pixel(x, y));
                },
                whenTileReady:function (cbk) {
                    var map = this.mapObj;

                    // todo map.bind(map.getLayer(), "complete", function () {
                    cbk && cbk();
                    //});
                }
            }
        },
        _go:function (x, y) {
            var self = this,
                currentMap = self.mapType[self.current];
            currentMap.mapObj.panTo(currentMap.pixelToLatlng(x, y));
        },
        zoom:function (isZoomin) {
            var self = this,
                currentMap = self.mapType[self.current].mapObj,
                zoom = currentMap.getZoom();
            if (isZoomin) zoom++; else zoom--;
            currentMap.setZoom(zoom);
        },
        goUp:function () {
            var win = $(window),
                w = win.width(), h = win.height();
            this._go(w / 2, -h / 2);
        },
        goDown:function () {
            var win = $(window),
                w = win.width(), h = win.height();
            this._go(w / 2, h * 1.5);
        },
        goLeft:function () {
            var win = $(window),
                w = win.width(), h = win.height();
            this._go(-w / 2, h / 2);
        },
        goRight:function () {
            var win = $(window),
                w = win.width(), h = win.height();
            this._go(w * 1.5, h / 2);
        },
        getBounds:function () {
            var self = this;
            return self.mapType[self.current]["getBounds"]();
        },
        getZoom:function () {
            var self = this,
                currentMap = self.mapType[self.current].mapObj;
            return currentMap.getZoom();
        },
        load:function (tp, cbk) {
            var self = this;

            if (_.isFunction(tp)) {
                cbk = tp;
                tp = null;
            }
            if (tp) self.current = tp;

            self.mapType[self.current]["cbk"] = cbk;

            if (!self.mapType[self.current]["isLoaded"]) {
                require.async(global_config["adMap"][self.current]["url"] + "window.PayMapADLoader.mapType." + self.current + ".cbk", function () {
                    self.mapType[self.current]["isLoaded"] = !!window[self.mapType[self.current]["class"]];
                });
            } else {
                self.mapType[self.current]["cbk"]();
            }
        },
        getShape:function () {
            var self = this,
                ret = [];

            _.each(global_config["adShape"], function (v, k) {
                ret.push([v.width + global_config["shapePadding"]["width"], v.height + global_config["shapePadding"]["height"], k].join(","));
            });
            return ret.join("|");
        },
        getColor:function () {
            var self = this;

            return global_config["adMap"][self.current]["adColor"];
        },
        getCurrentMap:function () {
            return this.mapType[this.current];
        }
    };
    window.PayMapADLoader = loader;
    return loader;

});

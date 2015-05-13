/**
 * baidu map view
 * @author: liz
 * @date: 2013-01-21
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),
        Mustache = require("mustache"),
        info_tpl = require("info_tpl"),

        loader = require("loader"),
        global_config = require("config");

    var defaultLatLng = global_config.defaultLatLng;

    defaultLatLng = defaultLatLng.split(",");
    defaultLatLng = [parseFloat(defaultLatLng[0]), parseFloat(defaultLatLng[1])];

    var BaiduMapView = Backbone.View.extend({
        el:"#baidu_map",
        initialize:function () {
            var self = this;

            self.map = null;
            self._cbk = [];

            loader.load("baidu", function () {
                self.map = new BMap.Map(self.$el[0]);
                self.map.centerAndZoom(new BMap.Point(defaultLatLng[1], defaultLatLng[0]), global_config.defaultZoom);
                self.map.addControl(new BMap.NavigationControl());

                _.each(self._cbk, function (v, k) {
                    v.callee.apply(self, v);
                });

                self.map.addEventListener("tilesloaded", _.throttle(function () {
                    self.fetchPlace();
                }, 500));

                self.map.addEventListener("zoomend", function () {
                    self.clearMarker();
                });

                self.previewInfoWindow = new BMap.InfoWindow("baidu");
            });
        },
        clearMarker:function () {
            var self = this;
            _.each(self.markerPool, function (v, k) {
                self.map.removeOverlay(v);
            });
            self.markerPool = [];
        },
        getSelectPlaceID:function () {
            var self = this,
                ret = [];

            _.each(self.markerPool, function (v, k) {
                v.isSet && ret.push(v._placeid);
            });

            return ret;
        },

        _setContent:function (image, description, styleID, link) {
            var self = this;

            if (self.previewInfoWindow) {
                self.previewInfoWindow.setContent(Mustache.render(info_tpl, {
                    "image":image,
                    "description":description,
                    "styleID":styleID,
                    "link":link
                }));

                self.previewInfoWindow.setWidth(global_config["adStyle"][styleID]["width"]);
                self.previewInfoWindow.setHeight(global_config["adStyle"][styleID]["height"]);
            }
        },
        fetchPlace:function () {
            var self = this;

            if (!self._ads) return;

            self.clearMarker();
            // 判断异步回调是否是重复, 添加客户端/服务端标志id
            var bounds = self.map.getBounds(),
                ne = bounds.getNorthEast(), sw = bounds.getSouthWest(),
                isViewer = self._ads == global_config.isViewer,
                isBlank = self._ads == global_config.isBlank;

            var cbk = isViewer ? function (data) {
                _.each(data.place, function (v, k) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new BMap.Marker(new BMap.Point(v.centerLnglat[0], v.centerLnglat[1]), {
                            title:v.title,
                            icon:new BMap.Icon(v.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                new BMap.Size(shape.width, shape.height))
                        });
                    self.map.addOverlay(mk);
                    self.markerPool.push(mk);

                    mk.addEventListener("click", function () {
                        self.map.openInfoWindow(self.previewInfoWindow, this.getPosition());
                        self._setContent(v.infoImgUrl, v.infoDescription, v.infoStyleID, v.link);
                    });
                });
            } : function (data) {
                if (!data.place.length) {
                    // alert no ad place in current view
                    return;
                }
                _.each(data.place, function (v, k) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new BMap.Marker(new BMap.Point(v.centerLnglat[0], v.centerLnglat[1]), {
                            title:["Place ID:", v._id, "AD ID:", isBlank ? "" : self._ads.get("id")].join(" "),
                            icon:new BMap.Icon(shape.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                new BMap.Size(shape.width, shape.height))
                        });
                    self.map.addOverlay(mk);
                    mk.isSet = false;
                    mk._placeid = v._id;
                    self.markerPool.push(mk);

                    if (isBlank) return;
                    mk.addEventListener("click", function () {
                        mk.setIcon(new BMap.Icon((mk.isSet ? shape.imgUrl : self._ads.get("imgUrl")[v.mapShapeID]) + global_config.getSuffix(shape.width, shape.height)
                            , new BMap.Size(shape.width, shape.height)));

                        mk.isSet = !mk.isSet;
                    });
                });
            };

            loader.loadPlace({
                mapTypeID:global_config["adMap"]["baidu"].mapTypeID,
                bounds:[ne.lat, ne.lng, sw.lat, sw.lng].join(","),
                mapShapeID:(function () {
                    var shapes = [];
                    _.each(isViewer || isBlank ? global_config["adShape"] : self._ads.get("imgUrl"), function (v, k) {
                        v && shapes.push(k);
                    });
                    return shapes.join(",");
                })(),
                zoom:self.map.getZoom()
            }, cbk, isViewer);
        },
        moveMapViewport:function (latlng, ads, zoom) {
            var self = this;
            if (!self.map) {
                self._cbk.push(arguments);
                return;
            }
            self._ads = ads;
            latlng = latlng.split(",");
            var location = new BMap.Point(latlng[1], latlng[0]);
            self.map.setCenter(location);

            zoom && self.map.setZoom(zoom);
            //self.fetchPlace();
        }
    });
    return new BaiduMapView();
});
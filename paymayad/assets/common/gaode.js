/**
 * gaode map view
 * @author: liz
 * @date: 2013-04-24
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

    var GaodeMapView = Backbone.View.extend({
        el:"#gaode_map",
        initialize:function () {
            var self = this;

            self.map = null;
            self._cbk = [];

            loader.load("gaode", function () {
                self.map = new AMap.Map(self.$el[0], {
                    center:new AMap.LngLat(defaultLatLng[1], defaultLatLng[0]),
                    level:global_config.defaultZoom
                });
                self.map.plugin(["AMap.ToolBar,AMap.Scale"], function () {
                    self.map.addControl(new AMap.ToolBar());
                    self.map.addControl(new AMap.Scale());
                });

                _.each(self._cbk, function (v, k) {
                    v.callee.apply(self, v);
                });

                self.map.bind(self.map, "tilesloaded", _.throttle(function () {  // todo tilesloaded
                    self.fetchPlace();
                }, 500));

                self.map.bind(self.map, "zoomchange", function () {
                    self.clearMarker();
                    self.fetchPlace();
                });

                self.previewInfoWindow = new AMap.InfoWindow();
            });
        },
        clearMarker:function () {
            var self = this;
            _.each(self.markerPool, function (v, k) {
                self.map.removeOverlays(v);
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

                // todo self.previewInfoWindow.setSize(global_config["adStyle"][styleID]["width"]);
            }
        },
        fetchPlace:function () {
            var self = this;

            if (!self._ads) return;

            self.clearMarker();
            // 判断异步回调是否是重复, 添加客户端/服务端标志id
            var bounds = self.map.getBounds(),
                ne = bounds.northeast, sw = bounds.southwest,
                isViewer = self._ads == global_config.isViewer,
                isBlank = self._ads == global_config.isBlank;

            var cbk = isViewer ? function (data) {
                _.each(data.place, function (v, k) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new AMap.Marker({
                            position:new AMap.LngLat(v.centerLnglat[0], v.centerLnglat[1]),
                            //content:v.title,
                            icon:new AMap.Icon({
                                image:v.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                size:new AMap.Size(shape.width, shape.height)
                            })
                        });
                    self.map.addOverlays(mk);
                    self.markerPool.push(mk);

                    self.map.bind(mk, "click", function () {
                        self.previewInfoWindow.open(self.map, this.getPosition());
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
                        mk = new AMap.Marker({
                            position:new AMap.LngLat(v.centerLnglat[0], v.centerLnglat[1]),
                            id:["Place ID:", v._id, "AD ID:", isBlank ? "" : self._ads.get("id")].join(" "),
                            icon:new AMap.Icon({
                                image:shape.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                size:new AMap.Size(shape.width, shape.height)
                            })
                        });
                    self.map.addOverlays(mk);
                    mk.isSet = false;
                    mk._placeid = v._id;
                    self.markerPool.push(mk);

                    if (isBlank) return;
                    self.map.bind(mk, "click", function () {
                        mk.setIcon(new AMap.Icon({
                            image:(mk.isSet ? shape.imgUrl : self._ads.get("imgUrl")[v.mapShapeID]) + global_config.getSuffix(shape.width, shape.height),
                            size:new AMap.Size(shape.width, shape.height)
                        }));

                        mk.isSet = !mk.isSet;
                    });
                });
            };

            loader.loadPlace({
                mapTypeID:global_config["adMap"]["gaode"].mapTypeID,
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
            var location = new AMap.LngLat(latlng[1], latlng[0]);
            self.map.setCenter(location);

            zoom && self.map.setZoom(zoom);
            //self.fetchPlace();
        }
    });
    return new GaodeMapView();
});
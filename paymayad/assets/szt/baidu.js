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
                self.map = new BMap.Map(self.$el[0], {
                    enableHighResolution:true
                });
                self.map.centerAndZoom(new BMap.Point(defaultLatLng[1], defaultLatLng[0]), 16);
                self.map.addControl(new BMap.NavigationControl());

                _.each(self._cbk, function (v, k) {
                    v.callee.apply(self, v);
                });

                // or zoomend
                self.map.addEventListener("tilesloaded", _.throttle(function () {
                    self.fetchPlace();
                }, 500));

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


        _setContent:function (image, description, styleID, link) {
            var self = this;

            if (self.previewInfoWindow) {
                self.previewInfoWindow.setContent(Mustache.render($('#ad-info-window-tpl').html(), {
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

            var bounds = self.map.getBounds();

            // filter data
            _.each(self._ads, function (v, i) {
                if (v.zoom === self.map.getZoom() && bounds.containsPoint(new BMap.Point(v.centerLnglat[0], v.centerLnglat[1]))) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        width = shape.width,
                        height = shape.height;

                    if (self.map.highResolutionEnabled()) {
                        width = Math.ceil(width / 2);
                        height = Math.ceil(height / 2);
                    }

                    var mk = new BMap.Marker(new BMap.Point(v.centerLnglat[0], v.centerLnglat[1]), {
                        title:v.title,
                        icon:new BMap.Icon(v.imgUrl + global_config.getSuffix(width, height),
                            new BMap.Size(width, height))
                    });
                    self.map.addOverlay(mk);
                    self.markerPool.push(mk);

                    mk.addEventListener("click", function () {
                        self.map.openInfoWindow(self.previewInfoWindow, this.getPosition());
                        self._setContent(v.infoImgUrl, v.infoDescription, v.infoStyleID, v.link);
                    });
                }
            });
        },
        moveMapViewport:function (latlng, ads) {
            var self = this;
            if (!self.map) {
                self._cbk.push(arguments);
                return;
            }
            self._ads = ads;
            latlng = latlng.split(",");
            var location = new BMap.Point(latlng[1], latlng[0]);
            self.map.setCenter(location);
        }
    });
    return new BaiduMapView();
});
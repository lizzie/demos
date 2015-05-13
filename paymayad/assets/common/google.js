/**
 * google map view
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

    var GoogleMapView = Backbone.View.extend({
        el:"#google_map",
        initialize:function () {
            var self = this;

            self.map = null;
            self.previewInfoWindow = null;
            self.previewMarker = null;
            self.geocoder = null;
            self._cbk = [];

            loader.load("google", function () {
                self.map = new google.maps.Map(self.$el[0], {
                    zoom:global_config.defaultZoom,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                });
                var myLatlng = new google.maps.LatLng(defaultLatLng[0], defaultLatLng[1]);
                self.map.setCenter(myLatlng);

                self.previewMarker = new google.maps.Marker({
                    position:myLatlng,
                    map:self.map,
                    animation:google.maps.Animation.DROP,
                    draggable:true
                });
                self.previewMarker.setVisible(false);

                self.previewInfoWindow = new google.maps.InfoWindow({
                    "zIndex":120
                });

                self.geocoder = new google.maps.Geocoder();

                _.each(self._cbk, function (v, k) {
                    v.callee.apply(self, v);
                });

                google.maps.event.addListener(self.map, "tilesloaded", _.throttle(function () {
                    self.fetchPlace();
                }, 500));

                google.maps.event.addListener(self.map, "zoom_change", function () {
                    self.clearMarker();
                });
            });

            self.markerPool = [];
        },
        _setContent:function (image, description, styleID, link) {
            var self = this;

            self.previewInfoWindow && self.previewInfoWindow.setContent(Mustache.render(info_tpl, {
                "image":image,
                "description":description,
                "styleID":styleID,
                "link":link
            }));
        },
        updateInfoWindow:function (model) {
            var self = this,
                styleID = model.get("infoStyleID");

            self._setContent(model.get("infoImgUrl")[styleID], model.get("infoDescription")[styleID], styleID, model.get("link"));
        },
        moveMarker:function (latlng) {
            var self = this;

            if (!self.map) return;
            latlng = latlng.split(", ");
            var location = new google.maps.LatLng(latlng[0], latlng[1]);
            self.map.setCenter(location);
            self.previewMarker.setPosition(location);
        },
        clearMarker:function () {
            var self = this;

            _.each(self.markerPool, function (v, k) {
                v.setMap(null);
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

        fetchPlace:function () {
            var self = this;

            if (!self._ads) return;

            self.clearMarker();

            // 判断异步回调是否是重复, 添加客户端/服务端标志id
            var bounds = self.map.getBounds(),
                isViewer = self._ads == global_config.isViewer,
                isBlank = self._ads == global_config.isBlank;

            var cbk = isViewer ? function (data) {
                _.each(data.place, function (v, k) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new google.maps.Marker({
                            title:v.title,
                            position:new google.maps.LatLng(v.centerLnglat[1], v.centerLnglat[0]),
                            map:self.map,
                            icon:{
                                url:v.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                size:new google.maps.Size(shape.width, shape.height),
                                anchor:new google.maps.Point(shape.width / 2, shape.height / 2)
                            }
                        });
                    self.markerPool.push(mk);

                    google.maps.event.addListener(mk, "click", function () {
                        self.previewInfoWindow.open(self.map, this);
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
                        mk = new google.maps.Marker({
                            title:["Place ID:", v._id, " AD ID:", isBlank ? "" : self._ads.get("id")].join(" "),
                            position:new google.maps.LatLng(v.centerLnglat[1], v.centerLnglat[0]),
                            map:self.map,
                            icon:{
                                url:shape.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                size:new google.maps.Size(shape.width, shape.height),
                                anchor:new google.maps.Point(shape.width / 2, shape.height / 2)
                            }
                        });
                    mk.isSet = false;
                    mk._placeid = v._id;
                    self.markerPool.push(mk);

                    if (isBlank) return;
                    google.maps.event.addListener(mk, "click", function () {
                        var destImgUrl = self._ads.get("imgUrl")[v.mapShapeID];
                        if (!destImgUrl) return;
                        mk.setIcon({
                            url:(mk.isSet ? shape.imgUrl : destImgUrl) + global_config.getSuffix(shape.width, shape.height),
                            size:new google.maps.Size(shape.width, shape.height),
                            anchor:new google.maps.Point(shape.width / 2, shape.height / 2)
                        });

                        mk.isSet = !mk.isSet;

                        // todo 判断是否在设置经纬度的区域附近
                    });
                });

            };

            loader.loadPlace({
                mapTypeID:global_config["adMap"]["google"].mapTypeID,
                bounds:[bounds.getNorthEast().toUrlValue(10), bounds.getSouthWest().toUrlValue(10)].join(","),
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
            var location = new google.maps.LatLng(latlng[0], latlng[1]);
            self.map.setCenter(location);
            zoom && self.map.setZoom(zoom);
            //self.fetchPlace();
        }
    });
    return new GoogleMapView();
});
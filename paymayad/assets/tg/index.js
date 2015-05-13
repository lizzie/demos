define(function (require, exports, module) {
    var $ = require("$"),
        _ = require("underscore");

    if (!window.initData) return;

    var map = new google.maps.Map($("#map")[0], {
        zoom:window.initData.zoom,
        center:new google.maps.LatLng(window.initData.lat, window.initData.lng),
        mapTypeId:google.maps.MapTypeId.ROADMAP
    });
    var markerPool = [];
    var coordCache = {};

    var infoWindow = new google.maps.InfoWindow({
        "zIndex":120
    });

    function clearMarker() {
        _.each(markerPool, function (v, k) {
            v.setMap(null);
        });
        markerPool = [];
        coordCache = {};
    }

    function latlng2tilecoordinate(lon, lat, nZoom) {
        var x = (Math.floor((Number(lon) + 180) / 360 * Math.pow(2, nZoom))),
            y = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, nZoom)));

        return [x, y, nZoom].join(",");
    }

    function fetchPlace() {
        clearMarker();

        var bounds = map.getBounds();

        $.ajax({
            url:"/assets/tg/data.json",
            cache:false,
            data:{
                bounds:[bounds.getNorthEast().toUrlValue(10), bounds.getSouthWest().toUrlValue(10)].join(","),
                zoom:map.getZoom()
            },
            dataType:"json",
            success:function (data) {
                var currentZoom = map.getZoom(),
                    render = function (dt) {
                        _.each(dt, function (v, k) {
                            //if (v.zoom !== currentZoom) return false;
                            // 显示为图标
                            if (v.img) {
                            }
                            // 显示为数字
                            else if (v.count) {
                                v.title = "此处有" + v.count + "条优惠信息";
                                v.img = "http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=" + v.count + "|FE6256|000000";
                                v.desc = "此处有" + v.count + "条优惠信息";
                            }

                            var marker = new google.maps.Marker({
                                title:v.title,
                                position:new google.maps.LatLng(v.lat, v.lng),
                                map:map,
                                icon:new google.maps.MarkerImage(v.img)
                            });

                            google.maps.event.addListener(marker, "click", function () {
                                infoWindow.open(map, this);
                                infoWindow.setContent(v.desc);
                            });

                            markerPool.push(marker);
                        });
                    };

                if (currentZoom >= 16) {
                    render(data.place);
                } else {
                    _.each(data.place, function (v, k) {
                        //if (v.zoom !== currentZoom) return false;

                        var coord = latlng2tilecoordinate(v.lng, v.lat, v.zoom);
                        if (coordCache[coord]) {
                            coordCache[coord].push(v);
                        } else {
                            coordCache[coord] = [v];
                        }
                    });
                    var tmpData = [];
                    _.each(coordCache, function (v, k) {
                        if (v.length > 1) {
                            tmpData.push({
                                "lat":v[0].lat,
                                "lng":v[0].lng,
                                "count":v.length,
                                "zoom":v[0].zoom
                            });
                        } else {
                            tmpData.push(v);
                        }
                    });

                    render(tmpData);
                }
            },
            error:function (e) {
                seajs.log(e);
            }
        });
    }

    google.maps.event.addListener(map, "tilesloaded", _.throttle(function () {
        fetchPlace();
    }, 500));


});
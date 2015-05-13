/**
 * Pay Map AD map capture js
 * @author: liz
 * @date: 2013-01-23
 * @version: 1.0
 */

define(function (require, exports, module) {
    var $ = require("$"),
        _ = require("underscore"),
        loader = require("./capture_loader"),
        global_config = require("config");


    var EXPAND_CLS = "icon-chevron-right",
        FOLD_CLS = "icon-chevron-left",
        DATA_REMOVE = "data-remove";


    function unparam(input) {

        var items, temp,

            expBrackets = /\[(.*?)\]/g,
            expVarname = /(.+?)\[/,

            result = {};

        if ((temp = $.type(input)) != 'string' || (temp == 'string' && !temp.length))
            return {};

        items = decodeURIComponent(input).split('&');
        if (!(temp = items.length) || (temp == 1 && temp === ''))

            return result;
        $.each(items, function (index, item) {
            if (!item.length)
                return;
            temp = item.split('=');
            var key = temp.shift(),
                value = temp.join('=').replace(/\+/g, ' '),

                size, link, subitems = [];
            if (!key.length)

                return;
            while ((temp = expBrackets.exec(key)))

                subitems.push(temp[1]);
            if (!(size = subitems.length)) {
                result[key] = value;
                return;
            }
            size--;

            temp = expVarname.exec(key);

            if (!temp || !(key = temp[1]) || !key.length)

                return;

            if ($.type(result[key]) != 'object')
                result[key] = {};
            link = result[key];
            $.each(subitems, function (subindex, subitem) {
                if (!(temp = subitem).length) {

                    temp = 0;

                    $.each(link, function (num) {
                        if (!isNaN(num) && num >= 0 && (num % 1 === 0) && num >= temp)
                            temp = Number(num) + 1;

                    });

                }
                if (subindex == size) {
                    link[temp] = value;

                } else if ($.type(link[temp]) != 'object') {
                    link = link[temp] = {};

                } else {
                    link = link[temp];
                }
            });
        });
        return result;

    }

    // map=baidu&center=32.5,120.6&zoom=8&count=10&autorun=1
    var queryString = unparam(window.location.search.slice(1)),
        mapElem = $("#map"),
        whichMap = queryString.map || "google",
        center = queryString.center || global_config.defaultLatLng,
        zoom = queryString.zoom || global_config.defaultZoom,
        captureCount = queryString.count || "1",
        action_step = 0,
        actions = (function () {
            var action = [],
                directions = ["goRight", "goDown", "goLeft", "goUp"],
                time = 1, last = 0,
                ret = [];
            for (var i = 0; i < captureCount;) {
                var tmp = [];
                _.each(_.range(time), function (t) {
                    tmp.push(i);
                    i++;
                });
                action.push(tmp);
                last++;
                if (last == 2) {
                    time++;
                    last = 0;
                }
            }
            _.each(action, function (v, k) {
                _.each(v, function (vv) {
                    ret.push(directions[k % 4]);
                });
            });
            return ret;
        })();
    center = center.split(",");
    center = [parseFloat(center[0]), parseFloat(center[1])];
    zoom = parseInt(zoom);
    captureCount = parseInt(captureCount);

    var page = {
        /**
         * 获取到空白广告位数据后
         * @param result
         */
        receive:function (result) {
            var self = this;

            self.mapOverlay.addClass("loading").html('<img src="' + global_config.imgRoot + '/loading.gif" />');
            var html = "",
                height = $(window).height();

            $.each(result.split(";"), function (k, v) {
                var tmp = v.split(",");
                if (tmp.length < 3) return;

                var shape = global_config["adShape"][tmp[2]],
                    shape_width = shape["width"], shape_height = shape["height"],
                    center_left = parseInt(tmp[0]), center_top = height - parseInt(tmp[1]);
                // 返回的是图形的中心点屏幕坐标, 需要转换成左上角显示
                html += '<div class="J_place" data-place="' + [center_left, center_top, tmp[2]].join(",") + '" style="left: '
                    + (center_left - shape_width / 2) + 'px; top: ' + (center_top - shape_height / 2) + 'px;width: '
                    + shape_width + 'px;height: ' + shape_height + 'px;'
                    + 'background-image: url(' + shape["imgUrl"] + ');'
                    + '"></div>';
            });
            if (!html) html = "<div id='tips'>No Data!</div>";

            self.mapOverlay.removeClass("loading").addClass("drawing").html(html);
            self.header.slideDown();
            self._switch(false);

            if (self._autoruning) {
                _.delay(function () {
                    self.save();
                }, 3000);
            }
        },
        _switch:function (showPan) {
            var self = this;
            self.header.find(".J_pan")[showPan ? "show" : "hide"]();
            self.header.find(".J_done")[showPan ? "hide" : "show"]();
        },
        /**
         * 重置状态, 准备好下一次截屏分析
         */
        cancel:function () {
            var self = this;

            self._switch(true);
            self.mapOverlay.removeClass("loading").removeClass("drawing").empty();
            self.mapOverlay.hide();
            window.postMessage({ type:"READY_TO_RECAPTURE" }, "*");
        },
        /**
         * 保存当前截屏上的广告位到后台
         */
        save:function () {
            var self = this,
                ret = [],
                map = loader.mapType[loader.current],
                mapTypeID = global_config["adMap"][whichMap]["mapTypeID"],
                zoom = loader.getZoom();

            _.each(self.mapOverlay.find(".J_place"), function (v, k) {
                var elem = $(v);
                if (!elem.data(DATA_REMOVE)) {
                    var place = elem.attr("data-place").split(","),
                        shape = global_config["adShape"][place[2]],
                        half_shape_width = shape["width"] / 2, half_shape_height = shape["height"] / 2,
                        center_left = parseInt(place[0]), center_top = parseInt(place[1]);

                    ret.push({
                        mapTypeID:mapTypeID,
                        zoom:zoom,
                        leftTopLnglat:map.pixelToLngLat(center_left - half_shape_width, center_top - half_shape_height),
                        rightBottomLnglat:map.pixelToLngLat(center_left + half_shape_width, center_top + half_shape_height),
                        centerLnglat:map.pixelToLngLat(center_left, center_top),
                        mapShapeID:parseInt(place[2])
                    });
                }
            });
            if (ret.length) {
                $.ajax({
                    url:global_config.placeURL,
                    type:"POST",
                    cache:false,
                    data:{
                        data:ret
                    },
                    success:function (data) {
                    },
                    error:function (e) {
                        console.log(e);
                    }
                });
            }
            self.cancel();

            if (self._autoruning) {
                if (action_step < captureCount) loader[actions[action_step++]]();
                else {
                    var endTime = Date.now();
                    alert("auto run finished, use time: " + String(endTime - self._startTime) + " milliseconds");
                    $("#J_auto_running").hide();

                    self._autoruning = false;
                }
            }
        },
        /**
         * 发送截屏命令给 page.js
         */
        capture:function () {
            var self = this;

            self.header.css("display", "none");
            self.mapOverlay.show();

            window.postMessage({
                type:"START_CAPTURE",
                "width":$(window).width(),
                "height":$(window).height(),
                "filename":whichMap + "_" + loader.getBounds().join(","),
                "config":{
                    captureURL:global_config.captureURL,
                    getColor:loader.getColor(),
                    getShape:loader.getShape()
                }
            }, "*");
        },

        init:function () {
            var self = this;

            self._autoruning = !!queryString.autorun;
            self.header = $("header");
            self.header.slideDown().delegate(".J_save", "click",function () {
                self.save();
            }).delegate(".J_cancel", "click",function () {
                    self.cancel();
                }).delegate(".J_Up", "click",function () {
                    loader.goUp();
                }).delegate(".J_Right", "click",function () {
                    loader.goRight();
                }).delegate(".J_Down", "click",function () {
                    loader.goDown();
                }).delegate(".J_Zoomin", "click",function () {
                    loader.zoom(true);
                }).delegate(".J_Zoomout", "click",function () {
                    loader.zoom(false);
                }).delegate(".J_Left", "click",function () {
                    loader.goLeft();
                }).delegate(".J_Capture", "click",function () {
                    self.capture();
                }).delegate("#J_toggle", "click", function (e) {
                    var elem = $(e.currentTarget),
                        expand = !!elem.data("expand");
                    if (expand) {
                        self.header.animate({
                            width:"100%"
                        }, 200);
                        elem.find("i").removeClass(EXPAND_CLS).addClass(FOLD_CLS);
                    } else {

                        self.header.animate({
                            width:"2%"
                        }, 200);
                        elem.find("i").removeClass(FOLD_CLS).addClass(EXPAND_CLS);
                    }
                    elem.data("expand", !expand);
                });

            self.mapOverlay = $("#J_map_overlay");
            self.mapOverlay.delegate(".J_place", "click", function (e) {
                var elem = $(e.currentTarget);
                if (elem.data(DATA_REMOVE)) {
                    elem.empty();
                    elem.data(DATA_REMOVE, false);
                } else {
                    elem.data(DATA_REMOVE, true);
                    elem.html('<img src="' + global_config.imgRoot + '/shape_remove.png" />');
                }
            });

            $("body").keyup(function (e) {
                var isCapturing = self.mapOverlay.is(":visible");
                switch (e.keyCode) {
                    // up
                    case 38:
                        !isCapturing && loader.goUp();
                        break;
                    // left;
                    case 37:
                        !isCapturing && loader.goLeft();
                        break;
                    // down
                    case 40:
                        !isCapturing && loader.goDown();
                        break;
                    // right
                    case 39:
                        !isCapturing && loader.goRight();
                        break;
                    // enter
                    case 13:
                        !isCapturing && self.capture();
                        isCapturing && self.save();
                        break;
                    // esc
                    case 27:
                        isCapturing && self.cancel();
                        if (!isCapturing) {
                            self._autoruning = false;
                            clearTimeout(self._inter);
                            $("#J_auto_running").hide();
                        }
                        break;
                    case 187:
                        !isCapturing && loader.zoom(true);
                        break;
                    case 189:
                        !isCapturing && loader.zoom(false);
                        break;
                }
            });

            // 接受从扩展page.js发过来的消息, 当找到空白广告位后
            window.addEventListener("message", function (event) {
                if (event.source != window) return;
                if (event.data.type && (event.data.type === "PLACE_FOUND")) {

                    self.receive(event.data.result);
                }
            }, false);

            $(window).on("beforeunload", function () {
                self.cancel();
            });

            self._autoruning && self.autorun();
        },

        autorun:function () {
            var self = this,
                currentMap = loader.getCurrentMap();

            $("#J_auto_running").show();

            self._startTime = Date.now();

            currentMap.whenTileReady(function () {
                if (self._autoruning) {
                    self._inter = setTimeout(function () {
                        self.capture();
                    }, 5000);
                }
            });
        }
    };

    function _changeZoom(zoom) {
        $("#J_Zoomcurrent").html(zoom);
    }

    _changeZoom(zoom);

    // load different map according to url
    switch (whichMap) {
        case "baidu":
            loader.load("baidu", function () {
                var map = new BMap.Map(mapElem[0]);
                map.centerAndZoom(new BMap.Point(center[1], center[0]), zoom);
                map.enableScrollWheelZoom();
                loader.getCurrentMap()["mapObj"] = map;

                _.delay(function () {
                    var f = mapElem.find(".anchorBL");
                    f.hide();
                }, 1000);

                page.init();

                map.addEventListener("zoomend", function () {
                    _changeZoom(map.getZoom());
                });
            });
            break;
        case "gaode":
            loader.load("gaode", function () {
                var map = new AMap.Map(mapElem[0], {
                    center:new AMap.LngLat(center[1], center[0]),
                    level:zoom
                });

                loader.getCurrentMap()["mapObj"] = map;

                _.delay(function () {
                    var f = mapElem.find(".tip_mapabc");
                    f.hide();
                    f.next().hide();
                }, 1000);

                page.init();

                map.bind(map, "zoomchange", function () {
                    _changeZoom(map.getZoom());
                });
            });
            break;
        default :
            loader.load("google", function () {
                var map = new google.maps.Map(mapElem[0], {
                    zoom:zoom,
                    center:new google.maps.LatLng(center[0], center[1]),
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    overviewMapControl:false,
                    rotateControl:false,
                    mapTypeControl:false,
                    scaleControl:false,
                    panControl:false,
                    streetViewControl:false,
                    zoomControl:false
                });
                loader.getCurrentMap()["mapObj"] = map;

                _.delay(function () {
                    var f = mapElem.find(".gmnoprint"); // todo find another selector
                    f.prev().hide();
                    f.hide();
                }, 1000);

                page.init();

                google.maps.event.addListener(map, "zoom_changed", function () {
                    _changeZoom(map.getZoom());
                });
            });
            break;
    }
});


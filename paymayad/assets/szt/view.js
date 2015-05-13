/**
 * suzhoutong map viewer, use baidu map and static data
 * @author: liz
 * @date: 2013-03-12
 */
define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        loading = require("loading"),
        global_config = require("config"),

        adsData = null;

    var PlayView = Backbone.View.extend({
        el:"#playground",
        events:{

        },
        initialize:function () {
            var self = this;

            function _ready() {
                self.baiduMap.moveMapViewport("31.298886,120.58531600000003", adsData);
            }

            self._switch_map("baidu");
            if (!self.baiduMap) {
                require.async("baidu", function (m) {
                    self.baiduMap = m;

                    _ready();
                });
            } else _ready();
        },

        _switch_map:function (dest) {
            _.each(global_config["adMap"], function (v, k) {
                $("#" + k + "_map").css({
                    visibility:(k === dest) ? "visible" : "hidden",
                    zIndex:(k === dest) ? 4 : 3
                });
            });
        }
    });


    loading.show();
    $.ajax({
        url:"/assets/szt/data.json",
        dataType:"json",
        success:function (data) {
            adsData = data;
            new PlayView();
        },
        error:function (e) {
            seajs.log("get ad list error");
        },
        complete:function () {
            loading.hide();
        }
    });

});


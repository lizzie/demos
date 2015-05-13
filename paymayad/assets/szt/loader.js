/**
 * load map
 * @author: liz
 * @date: 2013-01-21
 */

define(function (require, exports, module) {
    var $ = require("$"),
        _ = require("underscore"),
        global_config = require("config");

    return window.PayMapADLoader = {
        current:"google",
        mapType:{
            "google":{
                "isLoaded":false,
                "cbk":undefined,
                "class":"google"
            },
            "baidu":{
                "isLoaded":false,
                "cbk":undefined,
                "class":"BMap"
            }
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
        loadPlace:function (data, cbk, isAD) {
            var self = this;

            $.ajax({
                url:isAD ? global_config.adPlaceURL : global_config.placeURL,
                cache:false,
                data:data,
                dataType:"json",
                success:function (data) {
                    cbk && cbk(data);
                },
                error:function (e) {
                    console.log(e);
                }
            });
        }
    };
});
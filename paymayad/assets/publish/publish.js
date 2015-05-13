/**
 * ../editor.js = all.js + edit.js + configure.js + location.js
 * @author: liz
 * @date: 2013-02-18
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        ADModel = require("ad"),
        global_config = require("config"),
        EditView = require("./edit"),
        ConfigureView = require("./configure"),
        LocationView = require("./location"),
        message = require("message");

    var DISABLED_CLS = "disabled";

    var EditorView = {
        el:"#editor",
        initialize:function () {
            var self = this;

            self.googleMap = -1;
            self.ads = new ADModel.Ad();
            self._currentStep = 0;

            self.$el.find('a[data-toggle="tab"]').on("shown",function (e) {
                var cur = parseInt($(e.target).attr("data-steps"));
                cur && (self._currentStep = cur);

                // 不同的步骤显示/隐藏地图信息框
                if (self._currentStep === 12) {
                    self.googleMap.previewInfoWindow && self.googleMap.previewInfoWindow.open(self.googleMap.map, self.googleMap.previewMarker);
                    self.googleMap.updateInfoWindow(self.ads);
                } else {
                    self.googleMap.previewInfoWindow && self.googleMap.previewInfoWindow.close();
                }
                // 不同的步骤显示/隐藏地图Marker
                self.googleMap.previewMarker && self.googleMap.previewMarker.setVisible(_.indexOf([2, 12], self._currentStep) !== -1);
            }).on("show", function (e) {
                    if ($(e.target).parent().hasClass(DISABLED_CLS)) {
                        return false;
                    }
                });
        },
        _copyModel:function (destModel, srcModel) {
            _.each(_.keys(srcModel.attributes), function (v, k) {
                destModel.set(v, srcModel.get(v));
            });
        },
        _switch_map:function (dest) {
            _.each(global_config["adMap"], function (v, k) {
                $("#" + k + "_map").css({
                    visibility:(k === dest) ? "visible" : "hidden",
                    zIndex:(k === dest) ? 4 : 3
                });
            });
        },
        _switch_view:function (dest) {
            var self = this;

            _.each(["edit", "configure", "location"], function (p, i) {
                var cur = self.$el.find("#" + p);
                if ((p === dest)) {
                    cur.show();
                    cur.find('a[data-toggle="tab"]').first().tab('show');

                    if (dest === "location") {
                        // 默认选中google, 这时已经确保在载入google之后
                        cur.find("button[data-map-id]").first().click();
                    }
                } else cur.hide();
            });
            message.close();
        },
        waiting:function (tp, model) {
            var self = this;

            function _ready() {
                self._switch_map("google");

                self._copyModel(self.ads, model || new ADModel.Ad({   // 默认值
                    cateID:1,
                    name:"",
                    link:"",
                    infoStyleID:1
                }));

                self._switch_view(tp);
                self.googleMap && self.googleMap.clearMarker();
            }

            if (self.googleMap === -1) {
                self.googleMap = 0;

                require.async("google", function (m) {
                    self.googleMap = m;

                    (new EditView()).load(self);
                    (new ConfigureView()).load(self);
                    (new LocationView()).load(self);

                    _ready();
                });
            } else if (self.googleMap === 0) {
            } else _ready();
        }
    };
    return Backbone.View.extend(EditorView);
});
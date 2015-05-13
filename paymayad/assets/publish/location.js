/**
 * location
 * @author: liz
 * @date: 2013-02-18
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        global_config = require("config"),
        message = require("message");

    var DISABLED_CLS = "disabled",
        CHOOSE_LATLNG_TAGS_ID = "#J_choose_latlng_tags",
        latlngReg = /(-?\d+(\.\d+)?),(\s)?(-?\d+(\.\d+)?)/ig;

    /**
     * 手工设置广告位过程, 包括
     * - 选定地图类型
     * - 载入特定位置上的广告位
     * - 选择广告位并保存
     */
    var LocationView = Backbone.View.extend({
        el:"#location",
        events:{
            "click .J_ad_map_type":"chooseMap",
            "click .J_move_viewport":"moveMapViewport",
            "click .J_finish":"finish"
        },
        initialize:function () {
        },

        load:function (editor) {
            var self = this;

            self.editor = editor;
            self.editor.ads.on("change:lnglatArr", function (model) {
                var html_choose = "",
                    lnglat = model.get("lnglatArr");
                _.each(lnglat, function (v, k) {
                    html_choose += '<a href="#" class="label J_move_viewport">' + (v[1] + ", " + v[0]) + '</a> ';
                });

                if (!html_choose) {
                    // 默认经纬度
                    html_choose += '<a href="#" class="label J_move_viewport">' + global_config.defaultLatLng + '</a> ';
                }
                self.$el.find(CHOOSE_LATLNG_TAGS_ID).html(html_choose);
            });
        },
        chooseMap:function (e) {
            var self = this,
                which = global_config.selectMapByID($(e.currentTarget).attr("data-map-id"));

            e.preventDefault();

            if (!which) return;

            function _ready() {
                self.$el.find('a[data-steps="22"]').click();
                self.$el.find(CHOOSE_LATLNG_TAGS_ID).children(".label:first").click();
            }

            self._which = which;
            self.editor._switch_map(self._which);

            if (!self.editor[self._which + "Map"]) {
                require.async(self._which, function (m) {
                    self.editor[self._which + "Map"] = m;

                    _ready();
                });
            } else _ready();
        },
        moveMapViewport:function (e) {
            var self = this,
                elem = $(e.currentTarget),
                latlng = elem.html().match(latlngReg);

            e.preventDefault();

            if (latlng) {
                elem.siblings(".label").removeClass("label-info");
                elem.addClass("label-info");

                // load ad place with special map type in current map viewport
                self.editor[self._which + "Map"].moveMapViewport(latlng[0], self.editor.ads, self.editor.ads.get("recentZoom"));
            }
        },
        isValid:function (placeIDList) {
            var error_msg = null;

            if (!placeIDList.length) {
                error_msg = "place_id_empty";
            }
            if (error_msg) {
                message.error(error_msg);
                return false;
            }

            return true;
        },
        finish:function (e) {
            var self = this,
                btn = $(e.currentTarget);

            e.preventDefault();

            if (btn.attr(DISABLED_CLS)) return;

            var placeIDList = self.editor[self._which + "Map"].getSelectPlaceID();

            if (self.isValid(placeIDList)) {
                btn.button("loading");
                $.ajax({
                    url:global_config.adPlaceRelation,
                    cache:false,
                    dataType:"json",
                    type:"POST",
                    data:{
                        placeIDList:placeIDList,
                        adID:self.editor.ads.id
                    },
                    success:function (response) {
                        if (!response.status) {
                            message.success("location_saved");
                        } else {
                            message.error("location_save_error");
                        }
                    },
                    error:function (model, xhr, options) {
                        message.error("location_save_error");
                    },
                    complete:function () {
                        btn.button("reset");
                    }
                });
            }
        }
    });
    return LocationView;
});
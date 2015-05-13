/**
 * edit
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
        ACTIVE_CLS = "active",
        NAME_ID = "#J_ad_name",
        LINK_ID = "#J_ad_link",
        LATLNG_ID = "#J_latlng",
        LATLNG_TAGS_ID = "#J_latlng_tags",

        latlngReg = /(-?\d+(\.\d+)?),(\s)?(-?\d+(\.\d+)?)/ig,
        linkReg = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

    /**
     * 编辑/新建, 包含
     * - 选择广告类别
     * - 设置经纬度(可选)
     * - 设置名称和链接
     */
    var EditView = Backbone.View.extend({
        el:"#edit",
        events:{
            "click .J_ad_category":"chooseCategory",
            "click .J_add_latlng":"addLatLng",
            "click .J_remove_latlng":"removeLatLng",
            "click .J_finish":"finish",
            "click .J_move_marker":"moveMaker"
        },
        initialize:function () {
            var self = this;

            // 地址转换成经纬度
            self.$el.find(LATLNG_ID).typeahead({
                source:function (query, process) {
                    var editor = self.editor,
                        latlng = query.match(latlngReg);
                    if (latlng) {
                        editor.googleMap.moveMarker(latlng[0]);
                        return;
                    }
                    editor.googleMap.geocoder && editor.googleMap.geocoder.geocode({address:this.$element.val()}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                            var st = [];
                            _.each(results, function (v, k) {
                                st.push(v.formatted_address + v.geometry.location.toString())
                            });
                            process(st);
                        }
                    });
                },
                updater:function (item) {
                    var latlng = item.match(latlngReg);
                    latlng && self.editor.googleMap.moveMarker(latlng[0]);
                    return item;
                }
            });
        },
        load:function (editor) {
            var self = this;

            self.editor = editor;

            self.editor.ads.on("change:cateID", function (model, cateID) {
                self.$el.find("button[data-cate-id]").removeClass(ACTIVE_CLS);
                self.$el.find('button[data-cate-id="' + cateID + '"]').addClass(ACTIVE_CLS);

                // 品牌推广不需要设置地址信息
                var addressElem = self.$el.find('a[data-steps="2"]').parent();
                addressElem[global_config["adCate"][cateID]["location"] ? "removeClass" : "addClass"](DISABLED_CLS);
            });

            self.editor.ads.on("change:name", function (model) {
                self.$el.find(NAME_ID).val(model.get("name"));
            });
            self.editor.ads.on("change:link", function (model) {
                self.$el.find(LINK_ID).val(model.get("link"));
            });

            self.editor.ads.on("change:lnglatArr", function (model) {
                var html = "",
                    latlng = model.get("lnglatArr");
                _.each(latlng, function (v, k) {
                    html += '<a href="#" class="J_move_marker label label-info">' + (v[1] + ", " + v[0]) + '<i class="icon-remove J_remove_latlng" data-lnglat="' + v.join(",") + '"></i></a> ';
                });

                self.$el.find(LATLNG_TAGS_ID).html(html);
            });
        },
        chooseCategory:function (e) {
            var self = this;

            e.preventDefault();

            var cate = parseInt($(e.currentTarget).attr("data-cate-id"));
            self.editor.ads.set("cateID", cate);

            // 品牌推广不需要位置信息
            if (global_config["adCate"][cate]["location"]) {
                self.$el.find('a[data-steps="2"]').click();
            } else {
                self.$el.find('a[data-steps="3"]').click();
            }
        },
        addLatLng:function (e) {
            var self = this,
                latlngElem = self.$el.find(LATLNG_ID),
                latlngVal = $.trim(latlngElem.val());

            e.preventDefault();

            var latlng = self.editor.googleMap.previewMarker ? self.editor.googleMap.previewMarker.getPosition().toString() : latlngVal;
            latlng = latlng.match(latlngReg);

            if (latlng) {
                latlng = latlng[0].split(",");

                var tmp = _.clone(self.editor.ads.get("lnglatArr")),
                    isIn = false,
                    lat = parseFloat(latlng[0]), lng = parseFloat(latlng[1]);

                _.each(tmp, function (v, k) {
                    if (v[0] === lng && v[1] === lat) isIn = true;
                });
                if (!isIn) {
                    tmp.push([lng, lat]);
                    self.editor.ads.set("lnglatArr", tmp);
                }
                latlngElem.val("");
            }
            latlngElem.focus();
        },
        removeLatLng:function (e) {
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            var tmp = [],
                dest = $(e.currentTarget).attr("data-lnglat");

            _.each(self.editor.ads.get("lnglatArr"), function (v, k) {
                if (v.join(",") !== dest) {
                    tmp.push(v);
                }
            });
            self.editor.ads.set("lnglatArr", tmp);
        },
        moveMaker:function (e) {
            var self = this,
                latlng = $(e.currentTarget).text().match(latlngReg);
            e.preventDefault();

            latlng && self.editor.googleMap.moveMarker(latlng[0]);
        },
        isValid:function () {
            var self = this,
                nameElem = self.$el.find(NAME_ID),
                linkElem = self.$el.find(LINK_ID),
                latlngElem = self.$el.find(LATLNG_ID),
                name = $.trim(nameElem.val()),
                link = $.trim(linkElem.val()),
                error_msg = null,
                model = self.editor.ads;

            function _error(elem, error_msg) {

                self.$el.find('a[href="#' + elem.parents(".tab-pane").attr("id") + '"]').click();
                elem.focus();
                message.error(error_msg);

                return false;
            }

            if (!name) {
                error_msg = "name_empty";
            } else {
                model.set("name", name);
            }
            if (error_msg) return _error(nameElem, error_msg);

            if (!link) {
                error_msg = "link_empty";
            } else if (!linkReg.test(link)) {
                error_msg = "link_format";
            } else {
                model.set("link", link);
            }
            if (error_msg) return _error(linkElem, error_msg);

            // 验证是否需要位置信息
            if (global_config["adCate"][model.get("cateID")]["location"]) {
                if (!model.get("lnglatArr").length) {
                    error_msg = "latlng_empty";
                }

                if (error_msg) return _error(latlngElem, error_msg);
            }

            return true;
        },
        finish:function (e) {
            var self = this,
                btn = $(e.currentTarget);

            e.preventDefault();

            if (btn.attr(DISABLED_CLS)) return;

            if (self.isValid()) {
                btn.button("loading");
                self.editor.ads.save({}, {
                    dataType:"json",
                    success:function (model, response, options) {
                        if (!response.status) {
                            message.success("ad_saved", ' <a href="#!/configure/' + self.editor.ads.id + '" class="btn">CONFIGURE</a>');
                        } else {
                            message.error("ad_save_error");
                        }
                    },
                    error:function (model, xhr, options) {
                        message.error("ad_save_error");
                    },
                    complete:function () {
                        btn.button("reset");
                    }
                });
            }
        }
    });
    return EditView;
});


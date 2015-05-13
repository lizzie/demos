/**
 * configure
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
        UPLOAD_PIC_CLS = ".J_upload_pic";

    /**
     * 配置, 包含
     * - 广告类型图片, 即img_url, 索引号即为mapShapeID
     * - 广告信息图片, 描述, 样式id 即info_style_id
     */
    var ConfigureView = Backbone.View.extend({
        el:"#configure",
        events:{
            "click .J_finish":"finish",
            "click .J_switch_style":"switchStyle",
            "change .J_info_description":"updateDescription"
        },
        initialize:function () {
            var self = this;

            require.async("uploadify_css");
            require.async("uploadify", function () {
                _.each(self.$el.find(UPLOAD_PIC_CLS), function (v, k) {
                    var elem = $(v);

                    elem.find('input[type="file"]').attr("id", "J_upload_pic_input_" + _.uniqueId()).uploadify({
                        'swf':"http://www.paymapad.com/assets/libs/uploadify/uploadify.swf", // 同域!!
                        'uploader':'http://www.paymapad.com/json/image/upload',
                        'queueSizeLimit':20,
                        'buttonText':'<i class="icon-camera"></i>' + elem.attr("data-title"),
                        'buttonClass':'btn',
                        'method':'post',
                        'formData':{
                        },
                        'fileSizeLimit':'500KB',
                        'fileTypeDesc':'Image Files',
                        'fileTypeExts':elem.attr("data-img-type") || "*.jpg; *.png",
                        'onUploadStart':function (file) {
                        },
                        'onUploadError':function (file, errorCode, errorMsg, errorString) {
                            seajs.log(file, errorCode, errorMsg, errorString);
                        },
                        'onUploadSuccess':function (file, data, response) {
                            var json = $.parseJSON(data);

                            if (json.status === 0) {
                                var shapeID = elem.attr("data-shape-id"),
                                    styleID = elem.attr("data-style-id"),
                                    oldImgUrl = _.clone(self.editor.ads.get(styleID ? "infoImgUrl" : "imgUrl"));
                                oldImgUrl[styleID ? parseInt(styleID) : parseInt(shapeID)] = json.imgurl;

                                self.editor.ads.set(styleID ? "infoImgUrl" : "imgUrl", oldImgUrl);
                                message.hide();
                            } else {
                                message.error("image_upload_failed");
                            }
                        }
                    });
                });
            });
        },
        load:function (editor) {
            var self = this;

            self.editor = editor;

            self.editor.ads.on("change:imgUrl", function (model) {
                var imgUrl = model.get("imgUrl");

                _.each(self.$el.find("div[data-shape-id]"), function (v, k) {
                    var elem = $(v),
                        shapeID = elem.attr("data-shape-id"),
                        originImgUrl = imgUrl[parseInt(shapeID)] || global_config["adShape"][shapeID]["imgUrl"];

                    elem.next().find("img").each(function () {
                        $(this).attr("src", originImgUrl + ($(this).attr("data-suffix") || ""))
                    });
                });
            });
            self.editor.ads.on("change:infoImgUrl", function (model) {
                self.editor.googleMap.updateInfoWindow(model);
            });
            self.editor.ads.on("change:infoDescription", function (model) {
                self.editor.googleMap.updateInfoWindow(model);
            });
            self.editor.ads.on("change:infoStyleID", function (model) {
                self.$el.find('div[data-style-id]').prev().find("input[type='radio']").prop("checked", false);
                self.$el.find('div[data-style-id="' + model.get("infoStyleID") + '"]').prev().find("input[type='radio']").prop("checked", true);

                self.editor.googleMap.updateInfoWindow(model);
            });
        },
        updateDescription:function (e) {
            var self = this,
                elem = $(e.currentTarget),
                old_info_desc = _.clone(self.editor.ads.get("infoDescription"));

            old_info_desc[parseInt(elem.parents(UPLOAD_PIC_CLS).attr("data-style-id"))] = $.trim(elem.val());
            self.editor.ads.set("infoDescription", old_info_desc);
        },
        switchStyle:function (e) {
            var self = this,
                elem = $(e.currentTarget).parent().next("[data-style-id]");

            e.preventDefault();
            self.editor.ads.set("infoStyleID", elem.attr("data-style-id"));
        },
        isValid:function () {
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
                            message.success("configure_saved", ' <a href="#!/location/' + self.editor.ads.id + '" class="btn">LOCATION</a>');
                        } else {
                            message.error("configure_save_error");
                        }
                    },
                    error:function (model, xhr, options) {
                        message.error("configure_save_error");
                    },
                    complete:function () {
                        btn.button("reset");
                    }
                });
            }
        }
    });
    return ConfigureView;
});
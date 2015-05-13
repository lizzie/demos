/**
 * 统一提示
 * @author: liz
 * @date: 2013-02-26
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        global_config = require("config"),

        ERROR_MSG = global_config.errorMsg,

        HIDE_CLS = "hide",
        SUCCESS_CLS = "success",
        ERROR_CLS = "error";

    var MessageView = Backbone.View.extend({
        el:"#message",
        events:{
            "click .close":"close"
        },
        initialize:function () {

        },
        success:function (msg, extra) {
            this.$el.removeClass(HIDE_CLS).addClass(SUCCESS_CLS).removeClass(ERROR_CLS).find("> div").html((ERROR_MSG[msg] || msg || "") + (extra || ""));
        },
        error:function (msg, extra) {
            this.$el.removeClass(HIDE_CLS).addClass(ERROR_CLS).removeClass(SUCCESS_CLS).find("> div").html((ERROR_MSG[msg] || msg || "") + (extra || ""));
        },
        close:function () {
            this.$el.addClass(HIDE_CLS).removeClass(ERROR_CLS).removeClass(SUCCESS_CLS);
        },
        hide:function () {
            this.close();
        }
    });
    return new MessageView();
});
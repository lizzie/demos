/**
 * Loading
 * @author: liz
 * @date: 2013-02-26
 */

define(function (require, exports, module) {
    var Backbone = require("backbone");

    var LoadingView = Backbone.View.extend({
        el:"#loading",
        events:{
        },
        initialize:function () {

        },
        show:function (msg, extra) {
            this.$el.show();
        },
        hide:function () {
            this.$el.hide();
        }
    });
    return new LoadingView();
});
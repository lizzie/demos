define(function (require, exports, module) {
    var $ = require("$"),
        _ = require("underscore"),
        Handlebars = require("handlebars")/*,

     Sparkline = require("sparkline")*/;

    var template = Handlebars.compile($("#overview-list-template").html());

    return {
        load: function (data, cbk) {
            // 概览数据列表
            $.ajax("/json/overview.jsn", {
                data: data,
                success: function (data) {
                    if (!(data && data.list && data.list.length)) return;
                    $("#overview-list").find("tbody").html(template(data));

                    $("#J_start_time").html(data.start_time);
                    $("#J_end_time").html(data.end_time);

                    // $('.dynamicsparkline').sparkline();
                },
                error: function (e) {
                    console.log(e);
                },
                complete: function () {
                    cbk && cbk();
                }
            });
        }
    }

});
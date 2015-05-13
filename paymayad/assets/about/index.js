define(function (require, exports, module) {
    var $ = require("$");

    $(document).ready(function () {
        var header = $("#header"),
            height = header.height(),
            windowHeight = $(window).height(),
            padding = windowHeight < height ? 300 : (windowHeight - height) / 2;

        header.css({"paddingTop":padding, "paddingBottom":padding});

        $("#more").click(function (e) {
            e.preventDefault();
            $('body, html').animate({scrollTop:padding * 2 + height});
        });
        $("#top").click(function (e) {
            e.preventDefault();
            $('body, html').animate({scrollTop:0});
        });
    });
});
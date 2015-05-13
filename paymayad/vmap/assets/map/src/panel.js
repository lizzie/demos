define(function(require, exports, module) {

    var $ = require("$");

    var doAction = {
        hidePanel: function(obj) {
            var self = this;

            self.panel.animate({
                left: - self.panel.width()
            });

            obj.attr("href", "#!showPanel").html("&raquo;");
        },
        showPanel: function(obj) {
            var self = this;

            self.panel.animate({
                left: 0
            });
            obj.attr("href", "#!hidePanel").html("&laquo;");
        }
    };

    module.exports = {
        init: function() {
            var self = this;

            self.panel = $("#J_Panel");

            self.panel.click(function(e) {
                e.preventDefault();

                var elem = $(e.target),
                    action = elem.attr("data-action")||elem.attr("href") || "#!";

                if (/#!/.test(action)) action = action.slice(2);

                doAction[action] && doAction[action].call(self, elem);
            });
        }
    };

});

/**
 * AD list info
 * @author: liz
 * @date: 2013-01-13
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        Mustache = require("mustache"),
        $ = require("$"),
        _ = require("underscore"),

        ADModel = require("ad");


    var AdListView = Backbone.View.extend({
        el:"#ad-list",
        template:$('#ad-list-tpl').html(),
        events:{
            "click .J_ad_remove":"remove"
        },
        initialize:function () {
            var self = this;

            self.adList = new ADModel.AdCollection();

            self.listenTo(self.adList, "all", self.render); // todo: trigger multi times

            // first render
            self.render();
        },
        render:function () {
            var data = this.adList.toJSON();
            _.each(data, function (v, k) {
                var img = "";
                _.each(v.imgUrl, function (ig, j) {
                    if (ig) {
                        if (ig.indexOf("http://pic.paymapad.com") === 0) {
                            ig += "!20x20";
                        }
                        img = "<img src='" + ig + "' style='height:20px;' />";
                        return false;
                    }
                });
                v.latlng = v.recentLnglat[1] + "," + v.recentLnglat[0];
                v.imgUrl = img;
            });
            this.$el.empty().html(Mustache.render(this.template, {"data":data}));
        },
        remove:function (e) {
            var self = this,
                id = $(e.currentTarget).parents("tr").attr("data-id");

            e.preventDefault();

            if (window.confirm("Confirm Delete?")) {
                _ready(self.adList.get(id));
            }
            function _ready(ad) {
                if (!ad) return;
                ad.destroy({
                    dataType:"json",
                    cache:false,
                    success:function (model, response, options) {
                        if (!response.status) {
                            // success
                        } else {
                            seajs.log("remove ad error");
                        }
                    },
                    error:function (model, xhr, options) {
                        seajs.log("remove ad error");
                    }
                });
            }
        }
    });

    return AdListView;
});

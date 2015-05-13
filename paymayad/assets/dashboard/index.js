/**
 * Pay Map AD main js
 * @author: liz
 * @date: 2013-01-13
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        ADModel = require("ad"),
        AdListView = require("./list"),
        PublishView = require("publish"),
        global_config = require("config"),
        bootstrap = require("bootstrap"),

        loading = require("loading"),
        ACTIVE_CLS = "active";

    function _page_switch(dest) {
        _.each(["dashboard", "editor"], function (p, i) {
            $("#" + p)[(p === dest) ? "show" : "hide"]();
        });
    }

    function _nav_switch(dest) {
        _.each(["dashboard", "publish", "home", "view"], function (p, i) {
            $("#J_nav_" + p)[(p === dest) ? "addClass" : "removeClass"](ACTIVE_CLS);
        });
    }

    var MainRouter = Backbone.Router.extend({
        routes:{
            "":"dashboard",
            "!/":"dashboard",
            "!/edit/:id":"edit",
            "!/new":"edit",
            "!/configure/:id":"configure",
            "!/location/:id":"location",
            "!/404":"notFound",
            "*actions":"defaultRoute"
        },
        initialize:function (options) {

        },
        dashboard:function () {
            var self = this;

            _page_switch("dashboard");
            _nav_switch("dashboard");

            loading.show();
            $.ajax({
                url:global_config.adListURL,
                cache:false,
                data:{
                    page:0
                },
                dataType:"json",
                success:function (data) {
                    if (!data.status) {
                        if (!self.adListView) self.adListView = new AdListView();
                        self.adListView.adList.update(data.adList);
                    } else {
                        seajs.log("load ad list error");
                    }
                },
                error:function (e) {
                    seajs.log("get ad list error");
                },
                complete:function () {
                    loading.hide();
                }
            });
        },
        _edit:function (id, tp) {
            var self = this;

            function _ready(model) {
                _page_switch("editor");
                //_nav_switch("publish");
                _nav_switch("dashboard");

                if (!self.editorView) {
                    self.editorView = new PublishView();
                    self.editorView.ads.on("sync", function (model) {
                        self.adListView && self.adListView.adList.update(model);
                    });
                }

                if (tp === "location" && !_.without(model.get("imgUrl"), "").length) {
                    mainRouter.navigate("!/configure/" + model.id, {trigger:true});
                } else {
                    self.editorView.waiting(tp, model);
                }
            }

            if (id) {
                var ad = null;
                self.adListView && (ad = self.adListView.adList.get(id));

                if (ad) {
                    _ready(ad);
                } else {
                    loading.show();

                    ad = new ADModel.Ad({"_id":id});
                    ad.fetch({
                        cache:false,
                        dataType:"json",
                        success:function (model, response, options) {
                            if (!response.status) {
                                _ready(ad);

                                self.adListView && self.adListView.adList.update(ad);
                            } else {
                                mainRouter.navigate("!/404", {trigger:true});
                            }
                        },
                        error:function (model, xhr, options) {
                            console.log(xhr);
                        },
                        complete:function () {
                            loading.hide();
                        }
                    });
                }
            } else {
                _ready(null);
            }
        },
        edit:function (id) {
            this._edit(id, "edit");
        },
        configure:function (id) {
            this._edit(id, "configure");
        },
        location:function (id) {
            this._edit(id, "location");
        },
        notFound:function () {
            // todo
            seajs.log(404);
        },
        defaultRoute:function (actions) {
            seajs.log(actions);
        }
    });

    var mainRouter = new MainRouter();

    Backbone.history.start();
});


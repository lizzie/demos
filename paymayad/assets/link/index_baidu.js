/**
 * Link utility
 * @author: liz
 * @date: 2013-03-25
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$");

    var Link = Backbone.Model.extend({
        idAttribute:"_id",
        url:function () {
            var id = this.id;
            return "/json/ad.jsn" + (id ? "/" + id : "")
        },
        defaults:{
            "_id":undefined,
            "name":undefined,
            "type":1,
            "img":undefined,
            "title":undefined,
            "lat":0,
            "lng":0,
            "src":undefined
        }
    });

    var StepView = Backbone.View.extend({
        el:"#step",
        initialize:function () {

        },
        to:function (step) {
            var self = this;
            self.$el.find("li").removeClass("ui-step-active ui-step-done");
            self.$el.find("li:nth-child(" + step + ")").addClass("ui-step-active");
            self.$el.find("li:lt(" + (step - 1) + ")").addClass("ui-step-done");
        }
    });
    var PanelView = Backbone.View.extend({
        el:"#main",
        events:{
            "click .J_choose_type":"choose_type",
            "change #complete_title":"title",
            "change #container_height":"update",
            "change #container_width":"update",
            "change #short_name":"name"
        },
        initialize:function () {
            var self = this;

            require.async("uploadify_css");
            require.async("uploadify", function () {
                // <button type="button" class="ui-button ui-button-lwhite" id="upload_icon">添加图片</button>
                self.$el.find("#upload_icon").uploadify({
                    'swf':"http://assets.paymapad.com/libs/uploadify/uploadify.swf",
                    'uploader':'/json/image/upload',
                    'buttonText':'添加图片',
                    'buttonClass':'ui-button ui-button-lwhite',
                    'method':'post',
                    'fileSizeLimit':'500KB',
                    'fileTypeDesc':'Image Files',
                    'fileTypeExts':"*.jpg; *.png",
                    'onUploadStart':function (file) {
                    },
                    'onUploadError':function (file, errorCode, errorMsg, errorString) {
                        seajs.log(file, errorCode, errorMsg, errorString);
                    },
                    'onUploadSuccess':function (file, data, response) {
                        var json = $.parseJSON(data);

                        if (json.status === 0) {
                            self.model.set("img", json.imgurl);
                            self.$el.find("#preview_img").attr("src", json.imgurl)
                        } else {
                            alert("上传图片失败, 请稍后再试!")
                        }
                    }
                });
            });

            self.geocoder = new BMap.Geocoder();

            var saving = false;
            self.$el.find("form").submit(function () {
                if (saving) return false;

                var form = $(this);

                mainRouter.navigate("!/third", {trigger:true});
                self.update();
                return false;

                saving = true;
                var latlng = self.marker.getPosition();
                self.model.set("lat", latlng.lat());
                self.model.set("lng", latlng.lng());

                self.model.save({}, {
                    dataType:"json",
                    success:function (model, response, options) {
                        if (!response.status) {

                        } else {

                        }
                    },
                    error:function (model, xhr, options) {
                        alert("保存失败, 请稍后再试");
                    },
                    complete:function () {
                        saving = false;
                    }
                });
                return false;
            });

            var generate_code = self.$el.find('.generate_code textarea');

            self.generate_code = generate_code;
            generate_code.focus(function () {
                generate_code.toggleClass('focus');
            }).blur(function () {
                    generate_code.toggleClass('focus')
                }).click(function () {
                    generate_code.select();
                });

        },
        update:function () {
            var self = this,
                s = '<div style="height:' + self.$el.find("#container_height").val() + 'px;width: ' + self.$el.find("#container_width").val() + 'px;">\n    <script src="/pm.js"></script>\n</div>';

            self.generate_code.val(s);
        },
        choose_type:function (e) {
            e.preventDefault();

            var currentTarget = $(e.currentTarget);
            currentTarget.siblings("button").addClass("ui-button-lwhite").removeClass("ui-button-lblue");
            currentTarget.addClass("ui-button-lblue").removeClass("ui-button-lwhite");

            this.$el.find(".slide_panel").hide();
            this.$el.find(".slide_" + currentTarget.attr("data-show")).show();

            this.model.set("type", parseInt(currentTarget.attr("data-id")));
        },
        name:function (e) {
            var currentTarget = $(e.currentTarget);

            this.model.set("name", currentTarget.val());
        },
        switch_panel:function (n) {
            var self = this;

            self.$el.find(".step-panel").hide();
            self.$el.find(".step-panel:nth-child(" + n + ")").show();
        },
        title:function (e) {
            var self = this,
                val = $(e.currentTarget).val();

            self.geocoder.getPoint(val, function (point) {
                self.model.set("lat", point.lat);
                self.model.set("lng", point.lng)
            });

            self.model.set("title", val);
        },
        _move:function () {
            var self = this;

            var myLatlng = new BMap.Point(self.model.get("lng"), self.model.get("lat"));
            self.map.centerAndZoom(myLatlng, 4);

            var img = self.model.get("img"),
                name = self.model.get("name");

            switch (self.model.get("type")) {
                case 1:
                    if (img) {
                        self.map.addOverlay(self.marker);
                        self.map.removeOverlay(self.label);

                        self.marker.setIcon(new BMap.Icon(img, new BMap.Size(120, 60)));
                        self.marker.setTitle(self.model.get("title"));
                        self.marker.setPosition(myLatlng);
                    }
                    break;
                case 2:
                    if (name) {
                        self.map.addOverlay(self.label);
                        self.map.removeOverlay(self.marker);

                        self.label.setContent(name);
                        self.label.setPosition(myLatlng);
                    }
                    break;
            }

        },
        load_map:function () {
            var self = this;
            if (!self.map) {
                self.map = new BMap.Map($("#map")[0]);
                self.map.addControl(new BMap.NavigationControl());

                self.marker = new BMap.Marker({
                    enableDragging:true
                });

                self.marker.addEventListener("click", function () {
                    self.infoWindow.setContent("hihi");
                    self.map.openInfoWindow(self.infoWindow, this.getPosition());
                });

                self.label = new BMap.Label({
                    enableDragging:true
                });
                self.label.setStyle({ color:"white", background:"#428fd6", borderColor:"#1e6bb3", padding:"2px" });

                self.infoWindow = new BMap.InfoWindow();
            }
            self._move();
        }
    });

    var MainRouter = Backbone.Router.extend({
        routes:{
            "":"first",
            "!/first":"first",
            "!/second":"second",
            "!/third":"third",
            "*actions":"defaultRoute"
        },
        initialize:function (options) {
            this.panel = new PanelView({model:new Link({
                "_id":$("#main").attr("data-id") || undefined,
                "name":$("#short_name").val(),
                "type":1,
                "img":$("#preview_img").attr("src"),
                "title":$("complete_title").val(),
                "lat":window.defaultLatLng[0],
                "lng":window.defaultLatLng[1],
                "src":""
            })});
            this.step = new StepView();
        },
        first:function () {
            this.panel.switch_panel(1);
            this.step.to(1);
        },
        second:function () {
            this.panel.switch_panel(2);
            this.step.to(2);
            this.panel.load_map();
        },
        third:function () {
            this.panel.switch_panel(3);
            this.step.to(3);
        },
        defaultRoute:function (actions) {
            seajs.log(actions);
        }
    });

    var mainRouter = new MainRouter();

    Backbone.history.start();

});


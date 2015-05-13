/**
 * Link utility
 * @author: liz
 * @date: 2013-03-25
 */

// from http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.0.1/src/markerwithlabel_packed.js
eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return(c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--)r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return'\\w+'
        };
        c = 1
    }
    ;
    while (c--)if (k[c])p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('7 m(a){2.3=a;2.8=V.1E("1u");2.8.4.C="I: 1m; J: 1g;";2.k=V.1E("1u");2.k.4.C=2.8.4.C}m.l=E 6.5.22();m.l.1Y=7(){n c=2;n h=t;n f=t;n j;n b;n d,K;n i;n g=7(e){p(e.1v){e.1v()}e.2b=u;p(e.1t){e.1t()}};2.1s().24.G(2.8);2.1s().20.G(2.k);2.11=[6.5.9.w(V,"1o",7(a){p(f){a.s=j;i=u;6.5.9.r(c.3,"1n",a)}h=t;6.5.9.r(c.3,"1o",a)}),6.5.9.o(c.3.1P(),"1N",7(a){p(h&&c.3.1M()){a.s=E 6.5.1J(a.s.U()-d,a.s.T()-K);j=a.s;p(f){6.5.9.r(c.3,"1i",a)}F{d=a.s.U()-c.3.Z().U();K=a.s.T()-c.3.Z().T();6.5.9.r(c.3,"1e",a)}}}),6.5.9.w(2.k,"1d",7(e){c.k.4.1c="2i";6.5.9.r(c.3,"1d",e)}),6.5.9.w(2.k,"1D",7(e){c.k.4.1c=c.3.2g();6.5.9.r(c.3,"1D",e)}),6.5.9.w(2.k,"1C",7(e){p(i){i=t}F{g(e);6.5.9.r(c.3,"1C",e)}}),6.5.9.w(2.k,"1A",7(e){g(e);6.5.9.r(c.3,"1A",e)}),6.5.9.w(2.k,"1z",7(e){h=u;f=t;d=0;K=0;g(e);6.5.9.r(c.3,"1z",e)}),6.5.9.o(2.3,"1e",7(a){f=u;b=c.3.1b()}),6.5.9.o(2.3,"1i",7(a){c.3.O(a.s);c.3.D(2a)}),6.5.9.o(2.3,"1n",7(a){f=t;c.3.D(b)}),6.5.9.o(2.3,"29",7(){c.O()}),6.5.9.o(2.3,"28",7(){c.D()}),6.5.9.o(2.3,"27",7(){c.N()}),6.5.9.o(2.3,"26",7(){c.N()}),6.5.9.o(2.3,"25",7(){c.16()}),6.5.9.o(2.3,"23",7(){c.15()}),6.5.9.o(2.3,"21",7(){c.13()}),6.5.9.o(2.3,"1Z",7(){c.L()}),6.5.9.o(2.3,"1X",7(){c.L()})]};m.l.1W=7(){n i;2.8.1r.1q(2.8);2.k.1r.1q(2.k);1p(i=0;i<2.11.1V;i++){6.5.9.1U(2.11[i])}};m.l.1T=7(){2.15();2.16();2.L()};m.l.15=7(){n a=2.3.z("Y");p(H a.1S==="P"){2.8.W=a;2.k.W=2.8.W}F{2.8.G(a);a=a.1R(u);2.k.G(a)}};m.l.16=7(){2.k.1Q=2.3.1O()||""};m.l.L=7(){n i,q;2.8.S=2.3.z("R");2.k.S=2.8.S;2.8.4.C="";2.k.4.C="";q=2.3.z("q");1p(i 1L q){p(q.1K(i)){2.8.4[i]=q[i];2.k.4[i]=q[i]}}2.1l()};m.l.1l=7(){2.8.4.I="1m";2.8.4.J="1g";p(H 2.8.4.B!=="P"){2.8.4.1k="1j(B="+(2.8.4.B*1I)+")"}2.k.4.I=2.8.4.I;2.k.4.J=2.8.4.J;2.k.4.B=0.1H;2.k.4.1k="1j(B=1)";2.13();2.O();2.N()};m.l.13=7(){n a=2.3.z("X");2.8.4.1h=-a.x+"v";2.8.4.1f=-a.y+"v";2.k.4.1h=-a.x+"v";2.k.4.1f=-a.y+"v"};m.l.O=7(){n a=2.1G().1F(2.3.Z());2.8.4.12=a.x+"v";2.8.4.M=a.y+"v";2.k.4.12=2.8.4.12;2.k.4.M=2.8.4.M;2.D()};m.l.D=7(){n a=(2.3.z("14")?-1:+1);p(H 2.3.1b()==="P"){2.8.4.A=2h(2.8.4.M,10)+a;2.k.4.A=2.8.4.A}F{2.8.4.A=2.3.1b()+a;2.k.4.A=2.8.4.A}};m.l.N=7(){p(2.3.z("1a")){2.8.4.Q=2.3.2f()?"2e":"1B"}F{2.8.4.Q="1B"}2.k.4.Q=2.8.4.Q};7 19(a){a=a||{};a.Y=a.Y||"";a.X=a.X||E 6.5.2d(0,0);a.R=a.R||"2c";a.q=a.q||{};a.14=a.14||t;p(H a.1a==="P"){a.1a=u}2.1y=E m(2);6.5.18.1x(2,1w)}19.l=E 6.5.18();19.l.17=7(a){6.5.18.l.17.1x(2,1w);2.1y.17(a)};', 62, 143, '||this|marker_|style|maps|google|function|labelDiv_|event|||||||||||eventDiv_|prototype|MarkerLabel_|var|addListener|if|labelStyle|trigger|latLng|false|true|px|addDomListener|||get|zIndex|opacity|cssText|setZIndex|new|else|appendChild|typeof|position|overflow|cLngOffset|setStyles|top|setVisible|setPosition|undefined|display|labelClass|className|lng|lat|document|innerHTML|labelAnchor|labelContent|getPosition||listeners_|left|setAnchor|labelInBackground|setContent|setTitle|setMap|Marker|MarkerWithLabel|labelVisible|getZIndex|cursor|mouseover|dragstart|marginTop|hidden|marginLeft|drag|alpha|filter|setMandatoryStyles|absolute|dragend|mouseup|for|removeChild|parentNode|getPanes|stopPropagation|div|preventDefault|arguments|apply|label|mousedown|dblclick|none|click|mouseout|createElement|fromLatLngToDivPixel|getProjection|01|100|LatLng|hasOwnProperty|in|getDraggable|mousemove|getTitle|getMap|title|cloneNode|nodeType|draw|removeListener|length|onRemove|labelstyle_changed|onAdd|labelclass_changed|overlayMouseTarget|labelanchor_changed|OverlayView|labelcontent_changed|overlayImage|title_changed|labelvisible_changed|visible_changed|zindex_changed|position_changed|1000000|cancelBubble|markerLabels|Point|block|getVisible|getCursor|parseInt|pointer'.split('|'), 0, {}))


define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),


        linkReg = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
        emailReg = /\S+@\S+\.\S+/,

        _msg = function (el, msg) {
            if (msg) {
                el.next(".ui-form-explain").remove();
                el.after('<p class="ui-form-explain ui-tiptext ui-tiptext-error"><i class="ui-tiptext-icon iconfont" title="出错">k</i>' + msg + '</p>');
                el.focus();
            } else {
                el.next(".ui-form-explain").remove();
            }
        };

    var Link = Backbone.Model.extend({
        idAttribute:"_id",
        url:function () {
            var id = this.id;
            return "/json/link.jsn" + (id ? "/" + id : "")
        },
        defaults:{
            "_id":undefined,
            "name":undefined,
            "type":1,
            "img":undefined,
            "title":undefined,
            "lat":0,
            "lng":0,
            "src":undefined,
            "zoom":0,
            "info":""
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
    var SignView = Backbone.View.extend({
        el:"#signup",
        initialize:function () {
            var self = this;

            self._form();
        },
        _form:function () {
            var self = this;

            self.$el.find("form").submit(function () {
                var form = $(this),
                    website = form.find("#signup_website"),
                    website_val = $.trim(website.val()),
                    email = form.find("#signup_email"),
                    email_val = $.trim(email.val()),
                    password = form.find("#signup_password"),
                    password_val = $.trim(password.val()),
                    err = "",
                    which;

                if (website_val && !linkReg.test(website_val)) {
                    err = "请输入正确的网址";
                    which = website;
                }
                if (!password_val) {
                    err = "密码不能为空!";
                    which = password;
                }
                if (password_val.length < 6) {
                    err = "密码不能小于六位!";
                    which = password;
                }
                if (!email_val) {
                    err = "邮箱不能为空!";
                    which = email;
                }
                if (email_val && !emailReg.test(email_val)) {
                    err = "请输入正确的邮箱";
                    which = email;
                }

                if (err) {
                    _msg(which, err);
                    return false;
                }

                // 复制 link id
                var _id = mainRouter.panel.model.id || "";
                self.$el.find("#signup_link_id").val(_id);
            });
        }
    });
    var LoginView = Backbone.View.extend({
        el:"#login",
        initialize:function () {
            var self = this;

            self._form();
        },
        _form:function () {
            var self = this;

            self.$el.find("form").submit(function () {
                var form = $(this),
                    email = form.find("#login_email"),
                    email_val = $.trim(email.val()),
                    password = form.find("#login_password"),
                    password_val = $.trim(password.val()),
                    err = "",
                    which;

                if (!password_val) {
                    err = "密码不能为空!";
                    which = password;
                }
                if (password_val.length < 6) {
                    err = "密码不能小于六位!";
                    which = password;
                }
                if (!email_val) {
                    err = "邮箱不能为空!";
                    which = email;
                }
                if (email_val && !emailReg.test(email_val)) {
                    err = "请输入正确的邮箱";
                    which = email;
                }

                if (err) {
                    _msg(which, err);
                    return false;
                }
            });
        }
    });
    var PanelView = Backbone.View.extend({
        el:"#main",
        events:{
            "click .J_choose_type":"choose_type",
            "change #complete_title":"title",
            "change #container_height":"update",
            "change #container_width":"update",
            "change #short_name":"name",
            "change #preview_img_src":"img",
            "click #save":"save"
        },
        initialize:function () {
            var self = this;

            self.geocoder = new google.maps.Geocoder();

            self._upload();
            self._form();
            self._generate_code();
            self.choose_type();
        },
        _upload:function () {
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
                            self.$el.find("#preview_img").attr("src", json.imgurl);
                            self.$el.find("#preview_img_src").val(json.imgurl);
                        } else {
                            alert("上传图片失败, 请稍后再试!")
                        }
                    }
                });
            });

        },
        save:function (e) {
            var self = this,
                currentTarget = $(e.currentTarget),
                saving = false;

            e.preventDefault();

            if (saving) return false;

            saving = true;
            currentTarget.addClass("ui-button-ldisable").removeClass("ui-button-lorange");

            var latlng = self.model.get("type") === 1 ? self.marker.getPosition() : self.label.getPosition();
            self.model.set("lat", latlng.lat());
            self.model.set("lng", latlng.lng());
            self.model.set("zoom", self.map.getZoom());

            self.model.save({}, {
                dataType:"json",
                success:function (model, response, options) {
                    if (!response.status) {

                        mainRouter.navigate("!/third", {trigger:true});
                        self.update();
                    } else {
                        alert("保存失败, 请稍后再试");
                    }
                },
                error:function (model, xhr, options) {
                    alert("保存失败, 请稍后再试");
                },
                complete:function () {
                    saving = false;

                    currentTarget.addClass("ui-button-lorange").removeClass("ui-button-ldisable");
                }
            });
        },
        _form:function () {
            var self = this;

            self.$el.find("form").submit(function () {
                var form = $(this),
                    website = form.find("#website"),
                    website_val = $.trim(website.val()),
                    email = form.find("#email"),
                    email_val = $.trim(email.val()),
                    password = form.find("#password"),
                    password_val = $.trim(password.val()),
                    err = "",
                    which;

                if (website_val && !linkReg.test(website_val)) {
                    err = "请输入正确的网址";
                    which = website;
                }
                if (!password_val) {
                    err = "密码不能为空!";
                    which = password;
                }
                if (password_val.length < 6) {
                    err = "密码不能小于六位!";
                    which = password;
                }
                if (!email_val) {
                    err = "邮箱不能为空!";
                    which = email;
                }
                if (email_val && !emailReg.test(email_val)) {
                    err = "请输入正确的邮箱";
                    which = email;
                }

                if (err) {
                    _msg(which, err);
                    return false;
                }

                // 复制 link id
                var _id = self.model.id || "";
                self.$el.find("#link_id").val(_id);
            });
        },
        _generate_code:function () {
            var self = this;

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
            var self = this;

            self.generate_code.val('<iframe src="' + self.model.get("src") + '" scrolling="no" frameborder="0" width="' + self.$el.find("#container_width").val() + '" height="' + self.$el.find("#container_height").val() + '"></iframe>');
        },
        switch_panel:function (n) {
            var self = this;

            self._closeInfoWindow();
            self.$el.find(".step-panel").hide();
            self.$el.find(".step-panel-" + n).show();
        },
        choose_type:function (e) {
            var self = this,
                currentTarget;
            if (e) {
                e.preventDefault();
                currentTarget = $(e.currentTarget);

                self.model.set("type", parseInt(currentTarget.attr("data-id")));
            } else {
                currentTarget = self.$el.find(".J_choose_type[data-id='" + self.model.get("type") + "']");
            }

            currentTarget.siblings("button").addClass("ui-button-lwhite").removeClass("ui-button-lblue");
            currentTarget.addClass("ui-button-lblue").removeClass("ui-button-lwhite");

            self.$el.find(".slide_panel").hide();
            self.$el.find(".slide_" + currentTarget.attr("data-show")).show();
        },
        name:function (e) {
            var currentTarget = $(e.currentTarget);

            this.model.set("name", currentTarget.val());
        },
        title:function (e) {
            var self = this,
                val = $(e.currentTarget).val();

            self.geocoder.geocode({address:val}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                    if (results.length > 0) {
                        self.model.set("lat", results[0].geometry.location.lat());
                        self.model.set("lng", results[0].geometry.location.lng())
                    }
                }
            });

            self.model.set("title", val);
            _msg($(e.currentTarget));
        },
        img:function (e) {
            var self = this,
                img = $(e.currentTarget).val();

            self.model.set("img", img);

            self.$el.find("#preview_img").attr("src", img);
        },
        _move:function () {
            var self = this;

            var myLatlng = new google.maps.LatLng(self.model.get("lat"), self.model.get("lng"));
            self.map.setCenter(myLatlng);

            var img = self.model.get("img"),
                name = self.model.get("name"),
                title = self.model.get("title");

            switch (self.model.get("type")) {
                case 1:
                    if (img) {
                        self.marker.setVisible(true);
                        self.marker.setIcon(img);
                        self.marker.setPosition(myLatlng);
                        self.marker.setTitle(title);

                        self.label.setVisible(false);
                    }
                    break;
                case 2:
                    if (name) {
                        self.label.setMap(self.map);
                        self.label.setVisible(true);
                        self.label.setPosition(myLatlng);
                        self.label.set("labelContent", name);
                        self.label.setTitle(title);

                        self.marker.setVisible(false);
                    }
                    break;
            }
        },
        _closeInfoWindow:function () {
            var self = this;
            self.infoWindow && self.infoWindow.close();
        },
        load_map:function () {
            var self = this;
            if (!self.map) {
                self.map = new google.maps.Map($("#map")[0], {
                    zoom:self.model.get("zoom"),
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                });

                self.marker = new google.maps.Marker({
                    map:self.map,
                    //animation:google.maps.Animation.DROP,
                    draggable:true
                });
                self.label = new MarkerWithLabel({
                    draggable:true,
                    labelAnchor:new google.maps.Point(15, 0),
                    labelStyle:{color:"#fff", background:"#428fd6", border:"2px solid #1e6bb3", padding:"4px", whiteSpace:"nowrap"}
                });

                self.infoWindow = new google.maps.InfoWindow();

                function _open() {
                    self.infoWindow.open(self.map, this);
                    self.infoWindow.setContent(self.model.get("info"));
                }

                google.maps.event.addListener(self.marker, "click", _open);
                google.maps.event.addListener(self.label, "click", _open);
            }

            self._move();
        }
    });

    function _switch_page(dest) {
        var all = ["main", "login", "signup", "step"];
        for (var i in all) {
            $("#" + all[i])[dest.indexOf(all[i]) !== -1 ? "show" : "hide"]();
        }
    }

    var MainRouter = Backbone.Router.extend({
        routes:{
            "":"first",
            "!/first":"first",
            "!/second":"second",
            "!/third":"third",
            "!/login":"login",
            "!/signup":"signup",
            "*actions":"defaultRoute"
        },
        initialize:function (options) {
            this.addressEl = $("#complete_title");
            this.panel = new PanelView({model:new Link({
                "_id":window.clink.id || undefined,
                "name":$.trim($("#short_name").val()),
                "type":parseInt($("#link_type").attr("data-selected")),
                "img":$("#preview_img").attr("src"),
                "title":$.trim(this.addressEl.val()),
                "lat":window.clink.lat,
                "lng":window.clink.lng,
                "src":window.clink.src,
                "zoom":window.clink.zoom,
                "info":window.clink.info
            })});
            this.step = new StepView();
            this.signup = new SignView();
            this.login = new LoginView();
        },
        first:function () {
            _switch_page("main,step");

            this.panel.switch_panel(1);
            this.step.to(1);

            this.addressEl.focus();
        },
        second:function () {
            if (this.panel.model.get("title")) {
                _switch_page("main,step");

                this.panel.switch_panel(2);
                this.step.to(2);
                this.panel.load_map();
            } else {
                _msg(this.addressEl, "公司地址必须为空");

                mainRouter.navigate("!/first", {trigger:true});
            }
        },
        third:function () {
            _switch_page("main,step");

            if (this.panel.model.get("src")) {
                this.panel.switch_panel(3);
                this.step.to(3);
            } else {
                mainRouter.navigate("!/first", {trigger:true});
            }
        },
        login:function () {
            _switch_page("login");
        },
        signup:function () {
            _switch_page("signup");
        },
        defaultRoute:function (actions) {
            seajs.log(actions);
        }
    });

    var mainRouter = new MainRouter();

    Backbone.history.start();
});



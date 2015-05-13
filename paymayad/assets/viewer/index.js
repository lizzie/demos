/**
 * Pay Map AD view js
 * @author: liz
 * @date: 2013-01-13
 */
define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),

        global_config = require("config");

    function unparam(input) {

        var items, temp,

            expBrackets = /\[(.*?)\]/g,
            expVarname = /(.+?)\[/,

            result = {};

        if ((temp = $.type(input)) != 'string' || (temp == 'string' && !temp.length))
            return {};

        items = decodeURIComponent(input).split('&');
        if (!(temp = items.length) || (temp == 1 && temp === ''))

            return result;
        $.each(items, function (index, item) {
            if (!item.length)
                return;
            temp = item.split('=');
            var key = temp.shift(),
                value = temp.join('=').replace(/\+/g, ' '),

                size, link, subitems = [];
            if (!key.length)

                return;
            while ((temp = expBrackets.exec(key)))

                subitems.push(temp[1]);
            if (!(size = subitems.length)) {
                result[key] = value;
                return;
            }
            size--;

            temp = expVarname.exec(key);

            if (!temp || !(key = temp[1]) || !key.length)

                return;

            if ($.type(result[key]) != 'object')
                result[key] = {};
            link = result[key];
            $.each(subitems, function (subindex, subitem) {
                if (!(temp = subitem).length) {

                    temp = 0;

                    $.each(link, function (num) {
                        if (!isNaN(num) && num >= 0 && (num % 1 === 0) && num >= temp)
                            temp = Number(num) + 1;

                    });

                }
                if (subindex == size) {
                    link[temp] = value;

                } else if ($.type(link[temp]) != 'object') {
                    link = link[temp] = {};

                } else {
                    link = link[temp];
                }
            });
        });
        return result;

    }

    // map=google&latlng=0,0&type=blank&zoom=16&maptypeid=0
    var queryString = unparam(window.location.search.slice(1));

    var PlayView = Backbone.View.extend({
        el:"#playground",
        events:{

        },
        initialize:function () {
            var self = this;

            self._which = queryString.map || global_config.selectMapByID(queryString.maptypeid);

            self._switch_map(self._which);

            function _ready() {
                self[self._which + "Map"].moveMapViewport(queryString.latlng || global_config.defaultLatLng, queryString.type ? global_config.isBlank : global_config.isViewer, parseInt(queryString.zoom));
            }

            if (!self[self._which + "Map"]) {
                require.async(self._which, function (m) {
                    self[self._which + "Map"] = m;

                    _ready();
                });
            } else _ready();
        },

        _switch_map:function (dest) {
            _.each(global_config["adMap"], function (v, k) {
                $("#" + k + "_map").css({
                    visibility:(k === dest) ? "visible" : "hidden",
                    zIndex:(k === dest) ? 4 : 3
                });
            });
        }
    });

    new PlayView();
});


/**
 * Pay Map AD view google.js
 * @author: liz
 * @date: 2013-03-29
 */
define(function (require, exports, module) {
    var doc = document,

        $ = require("$"),
        Mustache = require("mustache"),
        global_config = require("config"),
        info_tpl = require("info_tpl");

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


    var defaultLatLng = queryString.latlng || global_config.defaultLatLng;

    defaultLatLng = defaultLatLng.split(",");
    defaultLatLng = [parseFloat(defaultLatLng[0]), parseFloat(defaultLatLng[1])];

    // from: http://rovertang.com/labs/tileindex/
    function latlng2tilecoordinate_1(lon, lat, nZoom) {
        var x = (Math.floor((Number(lon) + 180) / 360 * Math.pow(2, nZoom))),
            y = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, nZoom)));

        return "(" + [x, y].join(",") + ")";
    }

    function tilecoordinate2latlng_1(x, y, nZoom) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, nZoom),
            lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
            lng = (x / Math.pow(2, nZoom) * 360 - 180);

        return"(" + [lat, lng].join(",") + ")";
    }

    // from https://google-developers.appspot.com/maps/documentation/javascript/examples/map-coordinates
    var TILE_SIZE = 256;

    function latlng2tilecoordinate(latlng, zoom, projection) {
        var numTiles = 1 << zoom;

        // latlng -> world coordinate -> pixel coordinate -> tile coordinate
        var worldCoordinate = projection.fromLatLngToPoint(latlng);
        var pixelCoordinate = new google.maps.Point(
            worldCoordinate.x * numTiles,
            worldCoordinate.y * numTiles);

        return new google.maps.Point(
            Math.floor(pixelCoordinate.x / TILE_SIZE),
            Math.floor(pixelCoordinate.y / TILE_SIZE));
    }

    function tilecoordinate2latlng(coord, zoom, projection) {
        var numTiles = 1 << zoom;

        var pixel = new google.maps.Point(coord.x * TILE_SIZE, coord.y * TILE_SIZE),
            world = new google.maps.Point(Math.floor(pixel.x / numTiles), Math.floor(pixel.y / numTiles));

        return projection.fromPointToLatLng(world);
    }

    function PayMapType(tileSize, mapObj) {
        var self = this;

        self.tileSize = tileSize;
        self.maxZoom = 19;
        self.mapObj = mapObj;
        self.markerPool = {};  // 记录当前屏上已加载 marker
        self.relations = {};   // 记录瓦片上包含多少个 marker

        self.infoWindow = new google.maps.InfoWindow({
            "zIndex":120
        });
    }

    PayMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
        var self = this,
            div = ownerDocument.createElement('div'),
            id = "paymapad_" + coord.x + "_" + coord.y + "_" + zoom;

        // 占位 div
        div.id = id;
        //div.innerHTML = [coord, tilecoordinate2latlng_1(coord.x, coord.y, zoom), tilecoordinate2latlng(coord, zoom, this.mapObj.getProjection())].join(", ");
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';

        require.async("/json/tile.js?id=" + id + "&x=" + coord.x + "&y=" + coord.y + "&z=" + zoom, function (data) {
            self.addMarker(data);
        });
        return div;
    };
    PayMapType.prototype.addMarker = function (data) {
        var self = this,
            elem = doc.getElementById(data.id);

        if (!elem) return;

        for (var i = 0; i < data.ads.length; i++) {
            (function (v, id) {
                if (v.zoom === self.mapObj.getZoom() && v.mapTypeID === global_config["adMap"]["google"]["mapTypeID"] && !self.markerPool[v.id]) {
                    var shape = global_config["adShape"]["" + v.mapShapeID],
                        mk = new google.maps.Marker({
                            title:v.title,
                            position:new google.maps.LatLng(v.centerLnglat[1], v.centerLnglat[0]),
                            map:self.mapObj,
                            icon:{
                                url:v.imgUrl + global_config.getSuffix(shape.width, shape.height),
                                size:new google.maps.Size(shape.width, shape.height),
                                anchor:new google.maps.Point(shape.width / 2, shape.height / 2)
                            }
                        });
                    self.markerPool[v.id] = mk;

                    if (!self.relations[id]) {
                        self.relations[id] = [];
                    }
                    self.relations[id].push(v.id);

                    if (v.infoImgUrl) {
                        google.maps.event.addListener(mk, "click", function () {
                            self.infoWindow.open(self.mapObj, this);

                            self.infoWindow.setContent(Mustache.render(info_tpl, {
                                "image":v.infoImgUrl,
                                "description":v.infoDescription,
                                "styleID":v.infoStyleID,
                                "link":v.link
                            }));
                        });
                    }
                }
            })(data.ads[i], data.id);
        }
    };
    PayMapType.prototype.releaseTile = function (tile) {
        var self = this;

        if (!self.relations[tile.id]) return;

        for (var i = 0; i < self.relations[tile.id].length; i++) {
            var id = self.relations[tile.id][i];
            self.markerPool[id].setMap(null);
            delete self.markerPool[id];
        }
        delete self.relations[tile.id];
    };


    // load google map
    var map = new google.maps.Map(doc.getElementById("google_map"), {
        zoom:parseInt(queryString.zoom) || global_config.defaultZoom,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    });

    // add paymap layer to google map
    map.overlayMapTypes.insertAt(0, new PayMapType(new google.maps.Size(TILE_SIZE, TILE_SIZE), map));

    var myLatlng = new google.maps.LatLng(defaultLatLng[0], defaultLatLng[1]);
    map.setCenter(myLatlng);
});


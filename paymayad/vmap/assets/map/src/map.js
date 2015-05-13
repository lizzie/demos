define(function(require, exports, module) {

    var $ = require("$"),
        OpenLayers = require("openlayers"),
        PANEL_OFFSET = 20; // initial value show in panel.css

    var doActions = {
        hidePanel: function(obj) {
            var self = this,
                pW = self.panel.width(),
                hH = self.header.height();

            self.panel.animate({
                left: - pW + PANEL_OFFSET
            }, {
                duration: "slow",
                step: function(obj) {
                    self.panZoom.moveTo(new OpenLayers.Pixel( pW + obj, hH));
                },
                complete: function() {
                    obj.attr("href", "#!hidePanel").html("&raquo;");
                }
            });
        },
        showPanel: function(obj) {
            var self = this,
                pW = self.panel.width(),
                hH = self.header.height();

            self.panel.animate({
                left: 0
            }, {
                duration: "slow",
                step: function(obj) {
                    self.panZoom.moveTo(new OpenLayers.Pixel( pW + obj, hH));
                },
                complete: function() {
                    obj.attr("href", "#!hidePanel").html("&laquo;");
                }
            });
        }
    };

    module.exports = {
        _search: function(param, fn) {
            var self = this,
                center = self.olMap.getCenter(),
                bounds = self.olMap.calculateBounds(),
                url = ["t="+(new Date().getTime())+".js"];

            url.push("c="+center.lon+","+center.lat);

            url.push("b="+[bounds.top, bounds.left, bounds.bottom, bounds.right].join(","));

            $.each(param, function(key, val) {
                url.push(key+"="+val);
            });
            url = "../../../json/query.js?"+url.join("&");
            require.async(url, function(data) {
                var f = fn||self._defaultCallack;
                f.call(self, data);
            });
        },
        _defaultCallack: function(data) {
            var self = this;

            $.each(data.poiList, function(idx, poi) {
                var latLon = poi.latLon.split(",");
                self._addMarker(latLon[0], latLon[1]);
            });
            //self.olMap.setCenter(new OpenLayers.LonLat(data.data[0].lonlat[0], data.data[0].lonlat[1]), data.zoom);
        },
        _panel: function() {
            var self = this;

            self.panel = $("#J_Panel");

            self.panel.click(function(e) {
                e.preventDefault();

                var elem = $(e.target),
                    action = elem.attr("data-action")||elem.attr("href") || "#!";

                if (/#!/.test(action)) action = action.slice(2);

                doActions[action] && doActions[action].call(self, elem);
            });
        },
        _olmap: function() {
            var self = this;

            OpenLayers.ImgPath = "assets/img/";

            var olMap = new OpenLayers.Map({
                //displayProjection: new OpenLayers.Projection("EPSG:4326"),
                numZoomLevels: 18,
                div: "map",
                controls: [
                    new OpenLayers.Control.Navigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    }),
                    new OpenLayers.Control.Attribution()
                ],
                maxResolution: 1.40625/2,
                theme: "assets/css/openlayers.css"
            });



            var gmap = new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {numZoomLevels: 20}
            );

            var myLayer = new OpenLayers.Layer.MyLayer(
                "My Layer",
                ["http://www.paymapad.cn/MapTile/${0}/${1}/${2}/${3}/${4}/${5}/${6}/${7}/${8}/${9}/${10}${11}${12}${13}"],
                {
                    sphericalMercator: true,
                    layername:" my Layer",
                    type:"png"
                });
            olMap.addLayers([myLayer, gmap]);
            olMap.setCenter(new OpenLayers.LonLat(31, 120), 1);

            var panZoom = new OpenLayers.Control.PanZoom();
            olMap.addControl(panZoom);
            panZoom.moveTo(new OpenLayers.Pixel(self.panel.width() + self.panel.offset().left, self.header.height()));


            var tmsLayer = new OpenLayers.Layer.TMS( "TMS",
                "http://tilecache.osgeo.org/wms-c/Basic.py/", {layername: 'basic', type:'png'} );
            var switcher = new OpenLayers.Control.MyLayerSwitcher();
            olMap.addControl(switcher);
            olMap.addLayer(tmsLayer);

            self.olMap = olMap;
            self.panZoom = panZoom;


            self.olMap.events.on({
                changelayer: self._changeLayer,
                scope: self
            });

            self.olMap.addControl(
                new OpenLayers.Control.MousePosition()
            );

            self.olMap.events.register("mousemove", self.olMap, function(e) {
                var position = this.events.getMousePosition(e);

                //console.log(olMap.getProjection());

                //console.log([position.x, position.y, self.olMap.getZoom()]);
            });
        },
        _changeLayer: function(evt) {
            var self = this,
                isGoogle = true;

            if (evt) {
                self.markersLayer.clearMarkers();

                isGoogle = evt.layer.CLASS_NAME === "OpenLayers.Layer.Google";
            }

            self._addMarker(0, 0, isGoogle);
            self._addMarker(31.22689446881399, 121.475830078125, isGoogle);
            self._addMarker(18.255436745247998, 109.51309204101562, isGoogle);
            //self._addMarker(40, 60, isGoogle);
        },
        _addMarker: function(lat, lon, isGoogle) {
            var self = this;

            if (!self.markersLayer) {
                self.markersLayer = new OpenLayers.Layer.Markers( "Markers" );
                self.olMap.addLayer(self.markersLayer);
                var size = new OpenLayers.Size(21,25);
                var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
                self.markerIcon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
            }

            var lonlat = new OpenLayers.LonLat(lon, lat);
            if (isGoogle) {
                lonlat = lonlat.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    self.olMap.getProjectionObject()
                )
            }

            self.markersLayer.addMarker(new OpenLayers.Marker(lonlat, self.markerIcon.clone()));
        },

        _searchForm: function() {
            var self = this;

            self.searchForm = $("#J_search");
            if (!self.searchForm.length) self.searchForm = null;

            self.searchForm.submit(function(e) {
                var inputElem = self.searchForm.find("#keywords"),
                    kw = $.trim(inputElem.val());
                if (!kw.length) {
                    inputElem.focus();
                } else {
                    self._search({k: kw, action: "KEYWORDSELECT", method: 0, mode: 1, index: 0, layerID: "", distance: 0});
                }

                return false;
            });
        },
        _drawLine: function() {
            this.olMap.addLayer(new OpenLayers.Layer.Vector("GML", {
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "xml/line.xml",
                    format: new OpenLayers.Format.GML()
                }),
                strategies: [new OpenLayers.Strategy.Fixed()]
            }));
        },
        init: function() {
            this.header = $("header");

            this._panel();

            this._olmap();

            this._searchForm();

            //this._drawLine();

            var self = this;
            setTimeout(function() {
                self._changeLayer(null);
            }, 1000);
        }
    };

});

define(function (require, exports, module) {
    var OpenLayers = require("./openlayers");

    OpenLayers.Layer.MyLayer = OpenLayers.Class(OpenLayers.Layer.Grid, {
        serviceVersion:"1.0.0",
        layername:null,
        type:null,
        isBaseLayer:true,

        tileOrigin:null,
        serverResolutions:null,
        zoomOffset:0,
        initialize:function (name, url, options) {
            var newArguments = [];
            newArguments.push(name, url, {}, options);
            OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        },

        _getBlockIndexStr:function (IndexH, IndexV, nZoom) {
            var rtVal = "";
            var mask = 0xFC000000;// 0xFC = 11111100b
            var temp = 0;
            var i = 0;
            var ch;

            for (i = 1; i <= 5; i++) {
                temp = IndexH & mask;
                temp >>>= (26 - (i - 1) * 6);
                ch = this._integer2Char(temp);
                rtVal += ch;
                mask >>>= 6;
            }
            mask = 0xFC000000;
            for (i = 1; i <= 5; i++) {
                temp = IndexV & mask;
                temp >>>= (26 - (i - 1) * 6);
                ch = this._integer2Char(temp);
                rtVal += ch;
                mask >>>= 6;
            }
            temp = IndexH & 0x3;
            temp <<= 2;
            temp = temp | (IndexV & 0x3);
            ch = this._integer2Char(temp);
            rtVal += ch;
            ch = this._integer2Char(nZoom);
            rtVal += ch;
            ch = this._integer2Char(0);
            rtVal += ch;

            //console.log([IndexH, IndexV, nZoom, rtVal].join(", "));

            return rtVal;
        },
        _integer2Char:function (val) {
            val = Math[val > 0 ? "floor" : "ceil"](val);
            if (val == 0) return '[';
            else if (val >= 1 && val <= 10) return val - 1 + "";
            else if (val >= 11 && val <= 36) return String.fromCharCode("A".charCodeAt(0) + val - 11);
            else if (val >= 37 && val <= 62) return String.fromCharCode("a".charCodeAt(0) + val - 37);
            else if (val == 63) return ']';
            return "0";
        },

        getURL:function (bounds) {
            bounds = this.adjustBounds(bounds);
            var res = this.getServerResolution();
            var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
            var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
            var z = this.getServerZoom();

            x = x - (Math.pow(2, z) - 1);
            y = y - (Math.pow(2, z-1) - 1);
            var block_index = this._getBlockIndexStr(x, y, z);
            var url = this.url;

            if (OpenLayers.Util.isArray(url)) {
                url = this.selectUrl('' + x + y + z, this.url);
            }

            if (block_index.length < 13) return ""; // or set default image

            var centerLonLat = bounds.getCenterLonLat();

            return OpenLayers.String.format(url, {
                "0":block_index[11],
                "1":block_index[12],
                "2":block_index[1],
                "3":block_index[2],
                "4":block_index[3],
                "5":block_index[4],
                "6":block_index[6],
                "7":block_index[7],
                "8":block_index[8],
                "9":block_index[9],
                "10":block_index[0],
                "11":block_index[5],
                "12":block_index[10],
                "13":"." + this.type// +"?"+x+","+y+","+z+","+"lon:" + centerLonLat.lon + ",lat:" + centerLonLat.lat
            });
        },

        setMap:function (map) {
            OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
            if (!this.tileOrigin) {
                this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                    this.map.maxExtent.bottom);
            }
        },

        clone:function (obj) {
            if (obj == null) {
                obj = new OpenLayers.Layer.MyLayer(this.name,
                    this.url,
                    this.getOptions());
            }

            //get all additions from superclasses
            obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

            // copy/set any non-init, non-simple values here

            return obj;
        },

        destroy:function () {
            // ...
            OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
        },

        CLASS_NAME:"OpenLayers.Layer.MyLayer"
    });



    // custom switcher, new UI
    OpenLayers.Control.MyLayerSwitcher =
        OpenLayers.Class(OpenLayers.Control, {
            disableCls: "disabled",
            activeCls: "active",
            /**
             * Property: layerStates
             * {Array(Object)} Basically a copy of the "state" of the map's layers
             *     the last time the control was drawn. We have this in order to avoid
             *     unnecessarily redrawing the control.
             */
            layerStates: null,


            // DOM Elements

            /**
             * Property: layersDiv
             * {DOMElement}
             */
            layersDiv: null,

            /**
             * Property: baseLayersDiv
             * {DOMElement}
             */
            baseLayersDiv: null,

            /**
             * Property: baseLayers
             * {Array(Object)}
             */
            baseLayers: null,


            /**
             * Property: dataLbl
             * {DOMElement}
             */
            dataLbl: null,

            /**
             * Property: dataLayersDiv
             * {DOMElement}
             */
            dataLayersDiv: null,

            /**
             * Property: dataLayers
             * {Array(Object)}
             */
            dataLayers: null,


            /**
             * Property: minimizeDiv
             * {DOMElement}
             */
            minimizeDiv: null,

            /**
             * Property: maximizeDiv
             * {DOMElement}
             */
            maximizeDiv: null,

            /**
             * APIProperty: ascending
             * {Boolean}
             */
            ascending: true,

            /**
             * Constructor: OpenLayers.Control.MyLayerSwitcher
             *
             * Parameters:
             * options - {Object}
             */
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(this, arguments);
                this.layerStates = [];
            },

            /**
             * APIMethod: destroy
             */
            destroy: function() {

                //clear out layers info and unregister their events
                this.clearLayersArray("base");
                this.clearLayersArray("data");

                this.map.events.un({
                    buttonclick: this.onButtonClick,
                    addlayer: this.redraw,
                    changelayer: this.redraw,
                    removelayer: this.redraw,
                    changebaselayer: this.redraw,
                    scope: this
                });
                this.events.unregister("buttonclick", this, this.onButtonClick);

                OpenLayers.Control.prototype.destroy.apply(this, arguments);
            },

            /**
             * Method: setMap
             *
             * Properties:
             * map - {<OpenLayers.Map>}
             */
            setMap: function(map) {
                OpenLayers.Control.prototype.setMap.apply(this, arguments);

                this.map.events.on({
                    addlayer: this.redraw,
                    changelayer: this.redraw,
                    removelayer: this.redraw,
                    changebaselayer: this.redraw,
                    scope: this
                });
                if (this.outsideViewport) {
                    this.events.attachToElement(this.div);
                    this.events.register("buttonclick", this, this.onButtonClick);
                } else {
                    this.map.events.register("buttonclick", this, this.onButtonClick);
                }
            },

            /**
             * Method: draw
             *
             * Returns:
             * {DOMElement} A reference to the DIV DOMElement containing the
             *     switcher tabs.
             */
            draw: function() {
                this.displayClass = "olControlLayerSwitcher";
                OpenLayers.Control.prototype.draw.apply(this);

                // create layout divs
                this.loadContents();

                // set mode to minimize
                if(!this.outsideViewport) {
                    this.minimizeControl();
                }

                // populate div with current info
                this.redraw();

                return this.div;
            },

            /**
             * Method: onButtonClick
             *
             * Parameters:
             * evt - {Event}
             */
            onButtonClick: function(evt) {
                var button = evt.buttonElement;
                if (button === this.minimizeDiv) {
                    this.minimizeControl();
                } else if (button === this.maximizeDiv) {
                    this.maximizeControl();
                } else if (button._layerSwitcher === this.id) {
                    if (button["href"]) {
                        button = document.getElementById(button["href"].slice(1));
                    }
                    if (!OpenLayers.Element.hasClass(button, this.disableCls)) {
                        this.map.setBaseLayer(this.map.getLayer(button._layer));
                    }
                }
            },

            /**
             * Method: clearLayersArray
             * User specifies either "base" or "data". we then clear all the
             *     corresponding listeners, the div, and reinitialize a new array.
             *
             * Parameters:
             * layersType - {String}
             */
            clearLayersArray: function(layersType) {
                this[layersType + "LayersDiv"].innerHTML = "";
                this[layersType + "Layers"] = [];
            },


            /**
             * Method: checkRedraw
             * Checks if the layer state has changed since the last redraw() call.
             *
             * Returns:
             * {Boolean} The layer state changed since the last redraw() call.
             */
            checkRedraw: function() {
                var redraw = false;
                if ( !this.layerStates.length ||
                    (this.map.layers.length != this.layerStates.length) ) {
                    redraw = true;
                } else {
                    for (var i=0, len=this.layerStates.length; i<len; i++) {
                        var layerState = this.layerStates[i];
                        var layer = this.map.layers[i];
                        if ( (layerState.name != layer.name) ||
                            (layerState.inRange != layer.inRange) ||
                            (layerState.id != layer.id) ||
                            (layerState.visibility != layer.visibility) ) {
                            redraw = true;
                            break;
                        }
                    }
                }
                return redraw;
            },

            /**
             * Method: redraw
             * Goes through and takes the current state of the Map and rebuilds the
             *     control to display that state. Groups base layers into a
             *     radio-button group and lists each data layer with a checkbox.
             *
             * Returns:
             * {DOMElement} A reference to the DIV DOMElement containing the control
             */
            redraw: function() {
                //if the state hasn't changed since last redraw, no need
                // to do anything. Just return the existing div.
                if (!this.checkRedraw()) {
                    return this.div;
                }

                //clear out previous layers
                this.clearLayersArray("base");
                this.clearLayersArray("data");

                var containsOverlays = false;
                var containsBaseLayers = false;

                // Save state -- for checking layer if the map state changed.
                // We save this before redrawing, because in the process of redrawing
                // we will trigger more visibility changes, and we want to not redraw
                // and enter an infinite loop.
                var len = this.map.layers.length;
                this.layerStates = new Array(len);
                for (var i=0; i <len; i++) {
                    var layer = this.map.layers[i];
                    this.layerStates[i] = {
                        'name': layer.name,
                        'visibility': layer.visibility,
                        'inRange': layer.inRange,
                        'id': layer.id
                    };
                }

                var layers = this.map.layers.slice();
                if (!this.ascending) { layers.reverse(); }
                for(var i=0, len=layers.length; i<len; i++) {
                    var layer = layers[i];
                    var baseLayer = layer.isBaseLayer;

                    if (layer.displayInLayerSwitcher) {

                        if (baseLayer) {
                            containsBaseLayers = true;
                        } else {
                            containsOverlays = true;
                        }

                        // only check a baselayer if it is *the* baselayer, check data
                        //  layers if they are visible
                        var checked = (baseLayer) ? (layer == this.map.baseLayer)
                            : layer.getVisibility();

                        //*** new ui
                        var liElem = document.createElement("li");
                        liElem.id = this.id + "_li_" + layer.name;
                        liElem.name = (baseLayer) ? this.id + "_baseLayers" : layer.name;
                        OpenLayers.Element.addClass(liElem, checked?"olButton "+this.activeCls:"olButton");
                        liElem._layer = layer.id;
                        liElem._layerSwitcher = this.id;

                        if (!baseLayer && !layer.inRange) {
                            OpenLayers.Element.addClass(liElem, this.disableCls);
                        }

                        // create span
                        var aElem = document.createElement("a");
                        aElem["href"] = "#"+this.id;
                        aElem._layer = layer.id;
                        aElem._layerSwitcher = this.id;
                        aElem.innerHTML = layer.name;

                        liElem.appendChild(aElem);
                        //*** new ui end

                        var groupArray = (baseLayer) ? this.baseLayers
                            : this.dataLayers;
                        groupArray.push({
                            'layer': layer,
                            'liElem': liElem
                        });


                        var groupDiv = (baseLayer) ? this.baseLayersDiv
                            : this.dataLayersDiv;
                        groupDiv.appendChild(liElem);
                    }
                }

                // if no overlays, dont display the overlay label
//                this.dataLbl.style.display = (containsOverlays) ? "" : "none";

                // if no baselayers, dont display the baselayer label
                this.baseLbl.style.display = (containsBaseLayers) ? "" : "none";

                return this.div;
            },

            /**
             * Method: maximizeControl
             * Set up the labels and divs for the control
             *
             * Parameters:
             * e - {Event}
             */
            maximizeControl: function(e) {

                // set the div's width and height to empty values, so
                // the div dimensions can be controlled by CSS
                this.div.style.width = "";
                this.div.style.height = "";

                this.showControls(false);

                if (e != null) {
                    OpenLayers.Event.stop(e);
                }
            },

            /**
             * Method: minimizeControl
             * Hide all the contents of the control, shrink the size,
             *     add the maximize icon
             *
             * Parameters:
             * e - {Event}
             */
            minimizeControl: function(e) {

                // to minimize the control we set its div's width
                // and height to 0px, we cannot just set "display"
                // to "none" because it would hide the maximize
                // div
                this.div.style.width = "0px";
                this.div.style.height = "0px";

                this.showControls(true);

                if (e != null) {
                    OpenLayers.Event.stop(e);
                }
            },

            /**
             * Method: showControls
             * Hide/Show all MyLayerSwitcher controls depending on whether we are
             *     minimized or not
             *
             * Parameters:
             * minimize - {Boolean}
             */
            showControls: function(minimize) {

                this.maximizeDiv.style.display = minimize ? "" : "none";
                this.minimizeDiv.style.display = minimize ? "none" : "";

                this.layersDiv.style.display = minimize ? "none" : "";
            },

            /**
             * Method: loadContents
             * Set up the labels and divs for the control
             */
            loadContents: function() {

                // layers list div
                this.layersDiv = document.createElement("div");
                this.layersDiv.id = this.id + "_layersDiv";
                OpenLayers.Element.addClass(this.layersDiv, "layersDiv");

                this.baseLbl = document.createElement("div");
                this.baseLbl.innerHTML = OpenLayers.i18n("Base Layer");
                OpenLayers.Element.addClass(this.baseLbl, "baseLbl");

                this.baseLayersDiv = document.createElement("ul");
                OpenLayers.Element.addClass(this.baseLayersDiv, "baseLayersDiv dropdown-menu");
                this.baseLayersDiv.style.display = "block";
                this.baseLayersDiv.style.position = "static";

//                this.dataLbl = document.createElement("ul");
//                this.dataLbl.innerHTML = OpenLayers.i18n("Overlays");
//                OpenLayers.Element.addClass(this.dataLbl, "dataLbl");

                this.dataLayersDiv = document.createElement("ul");
                OpenLayers.Element.addClass(this.dataLayersDiv, "dataLayersDiv dropdown-menu");
//                this.baseLayersDiv.style.display = "block";
//                this.baseLayersDiv.style.position = "static";

                if (this.ascending) {
                    this.layersDiv.appendChild(this.baseLbl);
                    this.layersDiv.appendChild(this.baseLayersDiv);
//                    this.layersDiv.appendChild(this.dataLbl);
                    this.layersDiv.appendChild(this.dataLayersDiv);
                } else {
//                    this.layersDiv.appendChild(this.dataLbl);
                    this.layersDiv.appendChild(this.dataLayersDiv);
                    this.layersDiv.appendChild(this.baseLbl);
                    this.layersDiv.appendChild(this.baseLayersDiv);
                }

                this.div.appendChild(this.layersDiv);


                // maximize button div
                var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
                this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                    "OpenLayers_Control_MaximizeDiv",
                    null,
                    null,
                    img,
                    "absolute");
                OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
                this.maximizeDiv.style.display = "none";

                this.div.appendChild(this.maximizeDiv);

                // minimize button div
                var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
                this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                    "OpenLayers_Control_MinimizeDiv",
                    null,
                    null,
                    img,
                    "absolute");
                OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
                this.minimizeDiv.style.display = "none";

                this.div.appendChild(this.minimizeDiv);
            },

            CLASS_NAME: "OpenLayers.Control.MyLayerSwitcher"
        });

    return OpenLayers;

});
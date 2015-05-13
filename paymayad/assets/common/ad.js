/**
 * AD model define
 * @author: liz
 * @date: 2013-01-13
 */

define(function (require, exports, module) {
    var Backbone = require("backbone"),
        $ = require("$"),
        _ = require("underscore"),
        global_config = require("config");

    var Ad = Backbone.Model.extend({
            idAttribute:"_id",
            url:function () {
                var id = this.id;
                return global_config.adURL + (id ? "/" + id : "")
            },
            defaults:{
                "_id":undefined,
                "name":undefined,
                "cateID":undefined,
                "link":undefined,
                "lnglatArr":[],
                "imgUrl":["", "", ""],
                "infoStyleID":undefined,
                "infoImgUrl":["", ""],
                "infoDescription":["", ""],
                "recentMapTypeID":undefined,
                "recentLnglat":undefined,
                "recentZoom":undefined
            }
        }),
        AdCollection = Backbone.Collection.extend({
            model:Ad
        });

    var Place = Backbone.Model.extend({
            idAttribute:"_id",
            defaults:{
                "_id":undefined,
                "mapTypeID":0, // same to data-map-id
                "mapShapeID":0, // same to data-shape-id
                centerLnglat:[],
                leftTopLnglat:[],
                rightBottomLnglat:[],
                "zoom":0
            }
        }),
        PlaceCollection = Backbone.Collection.extend({
            model:Place
        });

    return {
        Ad:Ad,
        AdCollection:AdCollection,
        Place:Place,
        PlaceCollection:PlaceCollection
    }
});
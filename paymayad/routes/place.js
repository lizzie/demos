var models = require('../db'),
    util = require("../util");

exports.addAD = function (req, res) {
    var placeIDList = req.body.placeIDList || [];

    // 不用去管保存是否成功, 都返回 success
    res.json({
        status:0
    });

    // 保存广告位和广告的信息, 和导入的数据结构一致, 同一广告位上同一个广告可重复, 需要在导出js时判断
    models.AD.findById(req.body.adID, function (err, ad) {
        if (!err && ad) {
            for (var i = 0; i < placeIDList.length; i++) {
                (function (placeID, idx) {
                    models.Place.findById(placeID, function (err, place) {
                        if (err || !place) return;

                        var imgUrl = ad.imgUrl[place.mapShapeID];

                        if (!imgUrl) return;
                        console.log("create ", ad._id, place._id);

                        models.AdPlace({
                            "title":ad.name,
                            "link":ad.link,
                            "centerLnglat":place.centerLnglat,
                            "imgUrl":imgUrl,
                            "mapShapeID":place.mapShapeID,
                            "mapTypeID":place.mapTypeID,
                            "infoImgUrl":ad.infoImgUrl[ad.infoStyleID],
                            "infoDescription":ad.infoDescription[ad.infoStyleID],
                            "infoStyleID":ad.infoStyleID,
                            "zoom":place.zoom
                        }).save();

                        ad.set("recentLnglat", place.centerLnglat);
                        ad.set("recentZoom", place.zoom);
                        ad.set("recentMapTypeID", place.mapTypeID);
                        ad.save();
                    });
                })(placeIDList[i], i);
            }
        }
    });
};

exports.list = function (req, res) {
    var bounds = req.query.bounds.split(","),
        nelnglat = [parseFloat(bounds[1]), parseFloat(bounds[0])],
        swlnglat = [parseFloat(bounds[3]), parseFloat(bounds[2])];

    models.Place.find({
        "mapTypeID":req.query.mapTypeID,
        "zoom":req.query.zoom
    }).where("mapShapeID").in(req.query.mapShapeID.split(","))
        .where("centerLnglat").within.box({ ll:swlnglat, ur:nelnglat })
        .limit(100).exec(function (err, place) {

            place = place || [];
            var placeList = [];
            for (var i = 0; i < place.length; i++) {
                placeList.push(util.getPublicMember(place[i].toObject(), 1));
            }
            res.json({
                status:0,
                place:placeList
            });
        });
};

exports.add = function (req, res) {
    // 去重添加
    for (var i = 0; i < req.body.data.length; i++) {
        (function (d) {
            models.Place.find(d, function (err, a) {
                if (!err && a.length === 0) {
                    models.Place(d).save(function (err, obj) {
                        console.log("saving place:", obj._id);
                    });
                }
                err && console.log(err);
            });
        })(req.body.data[i]);
    }
    res.json({
        status:0
    });
    /*models.Place.create(req.body.data, function (err) {
     res.json({
     status:err || 0
     });
     });*/
};

exports.fetch2 = function (req, res) {
    var bounds = req.query.bounds.split(","),
        nelnglat = [parseFloat(bounds[1]), parseFloat(bounds[0])],
        swlnglat = [parseFloat(bounds[3]), parseFloat(bounds[2])];

    models.AdPlace.find().populate("place", null, {
        mapTypeID:req.query.mapTypeID,
        zoom:req.query.zoom,
        mapShapeID:{ $in:req.query.mapShapeID.split(",")},
        centerLnglat:{ $within:{
            $box:[swlnglat, nelnglat]
        }}
    }, { limit:20 }).populate("ad").exec(function (err, adPlace) {
            adPlace = adPlace || [];
            var placeList = [];

            for (var i = 0; i < adPlace.length; i++) {
                var place = adPlace[i].place,
                    ad = adPlace[i].ad;

                if (place && ad) {
                    place = util.getPublicMember(place.toObject());
                    ad = util.getPublicMember(ad.toObject());

                    var imgUrl = ad.imgUrl[place.mapShapeID];

                    if (!imgUrl) continue;
                    placeList.push({
                        "_id":adPlace[i]._id,
                        "title":ad.name || "未命名",
                        "centerLnglat":place.centerLnglat,
                        "imgUrl":imgUrl,
                        "mapShapeID":place.mapShapeID,
                        "image":ad.infoImgUrl[ad.infoStyleID],
                        "description":ad.infoDescription[ad.infoStyleID],
                        "styleID":ad.infoStyleID
                    });
                }
            }

            res.json({
                status:0,
                place:placeList
            });
        });
};

exports.fetch = function (req, res) {
    var bounds = req.query.bounds.split(","),
        nelnglat = [parseFloat(bounds[1]), parseFloat(bounds[0])],
        swlnglat = [parseFloat(bounds[3]), parseFloat(bounds[2])];

    models.AdPlace.find({
        mapTypeID:req.query.mapTypeID,
        zoom:req.query.zoom,
        mapShapeID:{ $in:req.query.mapShapeID.split(",")},
        centerLnglat:{ $within:{
            $box:[swlnglat, nelnglat]
        }}
    }).exec(function (err, adPlace) {
            adPlace = adPlace || [];

            var placeList = [];
            for (var i = 0; i < adPlace.length; i++) {
                placeList.push(util.getPublicMember(adPlace[i].toObject(), 1));
            }

            res.json({
                status:0,
                place:placeList
            });
        });
};

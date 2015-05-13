var models = require('../db'),
    util = require("../util"),

    global_config = require(__dirname + "/../assets/config");

exports.get = function (req, res) {
    models.AD.findById(req.params.id, function (err, ad) {
        var ret;
        if (err || !ad) {
            ret = {
                status:404
            };
        } else {
            ret = util.getPublicMember(ad.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.create = function (req, res) {
    var data = util.getPublicMember(req.body),
        defaultLatLng = global_config.defaultLatLng.split(",");

    data.recentZoom = global_config.defaultZoom;
    data.recentLnglat = data.lnglatArr[0] || [defaultLatLng[1], defaultLatLng[0]];
    data.recentMapTypeID = 0;

    models.AD(data).save(function (err, ad) {
        var ret;
        if (err || !ad) {
            ret = {
                status:404
            };
        } else {
            ret = util.getPublicMember(ad.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.modify = function (req, res) {
    models.AD.findByIdAndUpdate(req.params.id, util.getPublicMember(req.body), function (err, ad) {
        var ret;
        if (err || !ad) {
            ret = {
                status:404
            };
        } else {
            ret = util.getPublicMember(ad.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.delete = function (req, res) {
    models.AD.findByIdAndRemove(req.params.id, function (err) {
        res.json({
            status:err ? 1 : 0
        });
    });
};

exports.list = function (req, res) {
    models.AD.find().limit(20).exec(function (err, ads) {
        res.json({
            status:0,
            page:req.query.page,
            adList:err ? [] : ads
        });
    });
};
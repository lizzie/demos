var models = require('../db'),
    util = require("../util");

// 获取特定用户的第一条记录
exports.get = function (req, res) {
    models.Link.findOne().exec(function (err, link) {
        var ret;
        if (err || !link) {
            models.link().save(function (err, link) {
                if (err) {
                    ret = {
                        status:404
                    };
                } else {
                    ret = util.getPublicMember(link.toObject(), 1);
                    ret.status = 0;
                }
            });
        } else {
            ret = util.getPublicMember(link.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.create = function (req, res) {
    models.link(util.getPublicMember(req.body)).save(function (err, link) {
        var ret;
        if (err || !link) {
            ret = {
                status:404
            };
        } else {
            ret = util.getPublicMember(link.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.modify = function (req, res) {
    models.link.findByIdAndUpdate(req.params.id, util.getPublicMember(req.body), function (err, link) {
        var ret;
        if (err || !link) {
            ret = {
                status:404
            };
        } else {
            ret = util.getPublicMember(link.toObject(), 1);
            ret.status = 0;
        }
        res.json(ret);
    });
};

exports.test = function (req, res) {
    res.json({
        "_id":123,
        "name":"你好你好",
        "type":1,
        "img":"http://pic.paymapad.com/img/default.png",
        "title":"你好你好",
        "lat":0,
        "lng":0,
        "src":"http://pic.paymapad.com/img/default.png",
        "zoom":4,
        "status":0
    });
};
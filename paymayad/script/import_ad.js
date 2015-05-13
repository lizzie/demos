var models = require('../db'),
    fs = require("fs"),
    util = require("../util");


fs.readFile(__dirname + "/data/ads.json", function (err, data) {
    if (err) throw err;

    var jsonData = JSON.parse(data + '\n');

    // 去重导入
    for (var i = 0; i < jsonData.length; i++) {
        var name = jsonData[i].name,
            link = "http://www.suzhoutong.com/youhui/fdetail/id-" + jsonData[i].id,
            lng = parseFloat(jsonData[i].xpoint), lat = parseFloat(jsonData[i].ypoint),
            icon = jsonData[i].icon,
            image = jsonData[i].image;

        if (icon.indexOf("./") !== 0 || image.indexOf("./") !== 0) continue;

        var imgUrl = icon.replace("./", "http://pic.paymapad.com/"),
            bigImgUrl = image.replace("./", "http://pic.paymapad.com/");

        if (lng && lat && imgUrl) {

            (function (ad, idx) {
                models.AD.find(ad, function (err, a) {
                    if (!err && a.length === 0) {
                        models.AD(ad).save(function (err, obj) {
                            console.log("saving ad:", obj._id, " count: ", idx);
                        });
                    }
                    err && console.log(err);
                });
            })({
                name:name,
                cateID:2,
                link:link,
                lnglatArr:[
                    [lng, lat]
                ],
                imgUrl:[ imgUrl, imgUrl, imgUrl ],
                infoStyleID:1,
                infoImgUrl:[ bigImgUrl, bigImgUrl, bigImgUrl ],
                infoDescription:[name, name, name]
            }, i);//util.getPublicMember(ad)
        }
    }
});
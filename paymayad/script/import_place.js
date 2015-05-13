var models = require('../db'),
    fs = require("fs"),
    util = require("../util");


fs.readFile(__dirname + "/data/places_shanghai19_baidu.json", function (err, data) {
    if (err) throw err;

    var jsonData = JSON.parse(data + '\n');

    // 去重导入
    for (var i = 0; i < jsonData.length; i++) {
        (function (pl, idx) {
            models.Place.find(pl, function (err, place) {
                console.log(err, place);
                if (!err && place.length === 0) {
                    models.Place(pl).save(function (err, obj) {
                        console.log("saving place:", obj._id, " count: ", idx);
                    });
                }
            });
        })(util.getPublicMember(jsonData[i]), i);
    }
});




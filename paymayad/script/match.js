var models = require('../db'),
    util = require("../util");


/*models.AD.findById("513820dca6a32c6f0300019c", function(err, ad) {
 console.log(ad);
 });

 models.Place.find().exec(function (err, places) {
 if (err) return;

 for (var i = 0; i < places.length; i++) {
 console.log(i);
 (function (place, idx) {
 var leftTopLnglat = place.leftTopLnglat,
 rightBottomLnglat = place.rightBottomLnglat,
 lowerLeft = [leftTopLnglat[0], rightBottomLnglat[1]],
 upperRight = [rightBottomLnglat[0], leftTopLnglat[1]];

 models.AD.findOne({
 lnglatArr:{ $within:{ $box:[lowerLeft, upperRight] } }
 }, function (err, ad) {
 if (err || !ad) return;
 console.log("create ", ad._id, place._id);

 models.AdPlace({
 ad:ad._id,
 place:place._id
 }).save();
 });
 })(places[i], i);
 }
 });


 models.Place.find().exec(function (err, places) {
 if (err) return;

 var count = 1;
 for (var i = 0; i < places.length; i++) {
 //console.log(i);
 (function (place, idx) {
 var leftTopLnglat = place.leftTopLnglat,
 rightBottomLnglat = place.rightBottomLnglat,
 centerLnglat = place.centerLnglat,
 lowerLeft = [leftTopLnglat[0], rightBottomLnglat[1]],
 upperRight = [rightBottomLnglat[0], leftTopLnglat[1]];

 models.AD.findOne({
 lnglatArr:{ $within:{ $centerSphere:[centerLnglat,.5/3959] } }
 //lnglatArr: { $nearSphere: centerLnglat }
 //lnglatArr: { $near: centerLnglat }
 }, function (err, ad) {
 if (err || !ad) return;
 console.log("create ", ad._id, place._id, count++);

 models.AdPlace({
 ad:ad._id,
 place:place._id
 }).save();
 });
 })(places[i], i);
 }
 });*/

models.AD.find().exec(function (err, ads) {
    if (err) return;

    var count = 1;
    for (var i = 0; i < ads.length; i++) {

        (function (ad, idx) {
            var adLnglat = ad.lnglatArr[0];
            if (!adLnglat) return;
            models.Place.findOne({
                centerLnglat:{ $within:{ $centerSphere:[adLnglat, 1 / 3959] } }
            }, function (err, place) {
                err && console.log(err);
                if (err || !place) return;
                var imgUrl = ad.imgUrl[place.mapShapeID];

                if (!imgUrl) return;
                console.log("create ", ad._id, place._id, count++);

                models.AdPlace({
                    "title":ad.name || "未命名",
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
            });
        })(ads[i], i);
    }
});



var mongoose = require("mongoose"),
    mongooseTypes = require("mongoose-types");

mongooseTypes.loadTypes(mongoose);
mongoose.connect("mongodb://localhost/paymapad", function onMongooseError(err) {
    if (err) throw err;
});


var AdSchema = mongoose.Schema({
    name:{ type:String, required:true },
    cateID:{ type:Number },
    link:{ type:String, required:true },
    lnglatArr:{ type:[mongoose.Schema.Types.Mixed] }, // [[lng, lat], [lng, lat], ...]
    imgUrl:[ String ],
    infoStyleID:{ type:Number, default:0 },
    infoImgUrl:[ String ],
    infoDescription:{ type:[ String ]},
    recentMapTypeID:{ type:Number, default:0 },
    recentLnglat:{ type:[Number] },
    recentZoom:{type:Number}
});
//adSchema.plugin(mongooseTypes.useTimestamps);

var PlaceSchema = mongoose.Schema({
    mapTypeID:{ type:Number, default:0 },
    mapShapeID:{ type:Number, default:0 },
    zoom:{ type:Number, default:0 },
    centerLnglat:{ type:[Number] },
    leftTopLnglat:{ type:[Number] },
    rightBottomLnglat:{ type:[Number] }
});

/*var AdPlaceSchema = mongoose.Schema({
 ad:{ type:mongoose.Schema.Types.ObjectId, ref:"AD" },
 place:{ type:mongoose.Schema.Types.ObjectId, ref:"Place" }
 //ad: AdSchema,
 //place: PlaceSchema
 });
 */

var AdPlaceSchema = mongoose.Schema({
    title:{ type:String, required:true },
    link:{ type:String, required:true },
    imgUrl:String,
    infoStyleID:{ type:Number, default:0 },
    infoImgUrl:String,
    infoDescription:String,
    mapShapeID:{ type:Number, default:0 },
    mapTypeID:{ type:Number, default:0 },
    zoom:{ type:Number, default:0 },
    centerLnglat:{ type:[Number] }
});


var LinkSchema = mongoose.Schema({
    "name":String,
    "type":{ type:Number, default:1 },
    "img":String,
    "title":String,
    "lat":{ type:Number, default:0 },
    "lng":{ type:Number, default:0 },
    "src":String,
    "zoom":{ type:Number, default:4 }
});

var AccountSchema = new mongoose.Schema({
    email:{ type:String, unique:true },
    password:{ type:String }
});
exports.AD = mongoose.model("AD", AdSchema);
exports.Place = mongoose.model("Place", PlaceSchema);
exports.AdPlace = mongoose.model("AdPlace", AdPlaceSchema);
exports.Account = mongoose.model("Account", AccountSchema);
exports.Link = mongoose.model("Link", LinkSchema);


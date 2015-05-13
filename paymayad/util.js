var ObjProto = Object.prototype,
    hasOwnProperty = ObjProto.hasOwnProperty;

exports.getPublicMember = function (obj, needID) {
    for (var key in obj) {
        if (!hasOwnProperty.call(obj, key)) return;
        if (key[0] === "_" && key !== "_id") {
            delete obj[key];
        }
    }
    if (!needID) {
        delete obj["_id"];
    }
    return obj;
};

exports.merge = function () {
    var obj = {};
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var prop in source) {
            obj[prop] = source[prop];
        }
    }
    return obj;
};
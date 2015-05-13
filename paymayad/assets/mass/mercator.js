// from https://google-developers.appspot.com/maps/documentation/javascript/examples/map-coordinates
function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}
function MercatorProjection() {
    this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
        TILE_SIZE / 2);
    this.pixelsPerLonDegree_ = TILE_SIZE / 360;
    this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
    var me = this;
    var point = opt_point || new google.maps.Point(0, 0);
    var origin = me.pixelOrigin_;

    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

    // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
    // 89.189.  This is about a third of a tile past the edge of the world
    // tile.
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
        0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
        -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromPointToLatLng = function (point) {
    var me = this;
    var origin = me.pixelOrigin_;
    var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
    var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
    var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) -
        Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};


var PayMapData = {
    _getLongitudeIndexF:function (dLong, nZoom) {
        if (nZoom < 0) nZoom = 0;
        while (dLong > 180) dLong = dLong - 180;
        while (dLong < -180) dLong = dLong + 180;

        // 转换度数到弧度
        var alpha = dLong / 180.0 * Math.PI;
        var x = alpha;
        var per = Math.PI / Math.pow(2.0, nZoom);
        return x / per;
    },
    _getLongitudeIndex:function (dLong, nZoom) {
        var indexf = this._getLongitudeIndexF(dLong, nZoom);
        var index = Math[indexf > 0 ? "floor" : "ceil"](indexf);
        if (indexf > -0.00000000001) index++;
        else index--;
        return index;
    },
    _getLatitudeIndexF:function (dLati, nZoom) {
        if (nZoom < 0) nZoom = 0;
        if (dLati > 85) dLati = 85;
        if (dLati < -85) dLati = -85;

        // 转换度数到弧度
        var alpha = dLati / 180.0 * Math.PI;
        var y = Math.log(Math.tan(Math.PI / 4.0 + alpha / 2.0));
        var per = Math.PI / Math.pow(2.0, nZoom);
        return y / per;
    },
    _getLatitudeIndex:function (dLati, nZoom) {
        var indexf = this._getLatitudeIndexF(dLati, nZoom);
        var index = Math[indexf > 0 ? "floor" : "ceil"](indexf);
        if (indexf > -0.00000000001) index++;
        else index--;
        return index;
    },
    getBlockIndex:function (lon, lat, nZoom) {
        return "(" + [this._getLongitudeIndex(lon, nZoom), this._getLatitudeIndex(lat, nZoom)].join(",") + ")";
    }
};
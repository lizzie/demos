/**
 * paymapad loader for client
 * @author: liz
 * @date: 2013-03-05
 */

(function () {

    function log() {
        console && console.log.apply(console, arguments);
    }

    var PayMapADOpenLoader = {
        mapType:"google",
        mapKey:"",
        minZoom:4,
        maxZoom:19,
        adList:[
            {
                name:"广告名称",
                link:"http://paymapad.com/",
                description:"描述",
                icon:"http://cdn1.iconfinder.com/data/icons/brightmix/128/monotone_earth_world_transparent.png",
                width:120,
                height:120,
                latlng:[0, 0]
            }
        ],
        latlng:[0, 0],
        element:"paymapad_placeholder_" + new Date().getTime(),
        baiduMap:function () {
            var self = this,
                times = 0;

            setTimeout(function () {
                var container = doc.getElementById(PayMapADOpenLoader.element);

                log("load baidu map, try ", times);
                if (!container) {
                    if (times < 20) { // 至多尝试20次
                        setTimeout(arguments.callee, 20);
                        times++;
                    }

                    return;
                }

                container = container.parentNode;

                var map = new BMap.Map(container),
                    isShowing = false,
                    markerPool = [];


                function showMarker() {
                    if (isShowing) {
                        return;
                    }

                    isShowing = true;

                    for (var i = 0; i < self.adList.length; i++) {
                        var ad = self.adList[i];

                        var mk = new BMap.Marker(new BMap.Point(ad.latlng[1], ad.latlng[0]), {
                            title:ad.name,
                            icon:new BMap.Icon(ad.icon, new BMap.Size(ad.width, ad.height))
                        });
                        map.addOverlay(mk);
                        markerPool.push(mk);
                    }
                }

                function hideMarker() {
                    if (isShowing) {
                        isShowing = false;
                        for (var i = 0; i < markerPool.length; i++) {
                            map.removeOverlay(markerPool[i]);
                        }
                        markerPool = [];
                    }
                }

                map.centerAndZoom(new BMap.Point(self.latlng[1], self.latlng[0]), self.minZoom);
                map.addControl(new BMap.NavigationControl());
                showMarker();

                map.addEventListener("zoomend", function () {
                    var zoom = map.getZoom();
                    if (zoom < self.minZoom || zoom > self.maxZoom) {
                        hideMarker();
                    } else {
                        showMarker();
                    }
                });

            }, 30);

        },
        googleMap:function () {
            var self = this,
                times = 0;

            setTimeout(function () {
                var container = doc.getElementById(PayMapADOpenLoader.element);

                log("load google map, try ", times);
                if (!container) {
                    if (times < 20) { // 至多尝试20次
                        setTimeout(arguments.callee, 20);
                        times++;
                    }

                    return;
                }

                container = container.parentNode;

                var map = new google.maps.Map(container, {
                        zoom:self.minZoom,
                        center:new google.maps.LatLng(self.latlng[0], self.latlng[1]),
                        mapTypeId:google.maps.MapTypeId.ROADMAP
                    }),
                    isShowing = false,
                    markerPool = [];


                function showMarker() {
                    if (isShowing) {
                        return;
                    }

                    isShowing = true;

                    for (var i = 0; i < self.adList.length; i++) {
                        var ad = self.adList[i];

                        markerPool.push(new google.maps.Marker({
                            title:ad.name,
                            position:new google.maps.LatLng(ad.latlng[0], ad.latlng[1]),
                            map:map,
                            icon:new google.maps.MarkerImage(ad.icon, new google.maps.Size(ad.width, ad.height))
                        }));
                    }
                }

                function hideMarker() {
                    if (isShowing) {
                        isShowing = false;
                        for (var i = 0; i < markerPool.length; i++) {
                            markerPool[i].setMap(null);
                        }
                        markerPool = [];
                    }
                }

                showMarker();
                google.maps.event.addListener(map, "zoom_changed", function () {
                    var zoom = map.getZoom();
                    if (zoom < self.minZoom || zoom > self.maxZoom) {
                        hideMarker();
                    } else {
                        showMarker();
                    }
                });
            }, 30);
        }
    };

    window.PayMapADOpenLoader = PayMapADOpenLoader;

    function loadScript(src) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = true;
        script.src = (("https:" == document.location.protocol ) ? "https" : "http" ) + src;
        document.body.appendChild(script);
    }

    var doc = document;


    switch (PayMapADOpenLoader.mapType) {
        case "baidu":
            loadScript("://api.map.baidu.com/api?v=1.4&callback=PayMapADOpenLoader.baiduMap");
            break;
        default :
            loadScript("://maps.googleapis.com/maps/api/js?" + PayMapADOpenLoader.mapKey + "v=3&sensor=false&callback=PayMapADOpenLoader.googleMap");
    }

    doc.write('<b id="' + PayMapADOpenLoader.element + '"></b>');

})();
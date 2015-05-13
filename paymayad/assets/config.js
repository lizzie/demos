/**
 * 全局配置
 * @author: liz
 * @date: 2013-01-28
 */

define(function (require, exports, module) {
    var imgRoot = "http://pic.paymapad.com/img",
        isDebug = true;

    return {
        // 弹出框样式
        adStyle:{
            "1":{
                desc:true,
                width:320, // 和css一致
                height:240,
                title:"图片+文字"
            },
            "2":{
                desc:false,
                width:240,
                height:180,
                title:"仅图片"
            }
        },
        // 地图类型
        adMap:{
            "google":{
                "mapTypeID":0,
                "adColor":"244,243,240|201,223,175|165,191,221|217,232,201|228,223,206|228,223,209|228,221,205|244,242,235|234,231,227|213,213,221|255,255,255|212,211,220|228,228,228|235,235,231|235,235,228|213,213,221|244,243,240|244,242,235|197,209,186",
                "url":"http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback="
            },
            "baidu":{
                "mapTypeID":1,
                "adColor":"245,243,240|166,194,222|182,216,164|181,217,164|181,217,163|231,229,227|213,213,212|249,24,245",
                "url":"http://api.map.baidu.com/api?v=1.4&callback="
            }/* todo ,
             "gaode":{
             "mapTypeID":2,
             "adColor":"245,243,240|166,194,222|182,216,164|181,217,164|181,217,163|231,229,227|213,213,212|249,24,245",
             "url":"http://webapi.amap.com/maps?v=1.1&callback="
             }*/
        },
        selectMapByID:function (id) {
            var ret = "google";
            id = parseInt(id);

            for (var k in this.adMap) {
                if (this.adMap[k].mapTypeID === id) {
                    ret = k;
                    break;
                }
            }

            return ret;
        },
        // 形状种类
        adShape:{
            "0":{width:40, height:40, imgUrl:imgRoot + "/shape_0.png", title:"正方形(40x40)", style:"rect"}, // 几种尺寸与upyun上设置一致, 命名为 40x40
            "1":{width:45, height:45, imgUrl:imgRoot + "/shape_1.png", title:"圆形(45x45)", style:"circle"},
            "2":{width:120, height:50, imgUrl:imgRoot + "/shape_2.png", title:"矩形(120x50)", style:"rect"},
            "3":{width:120, height:60, imgUrl:imgRoot + "/shape_3.png", title:"矩形(120x60)", style:"rect"}
        },
        // 截屏时形状间的间隙
        shapePadding:{
            width:2,
            height:2
        },
        // 广告类型
        adCate:{
            "1":{
                title:"品牌推广",
                location:false
            },
            "2":{
                title:"优惠打折",
                location:true
            }
        },
        adListURL:"/json/ad_list.jsn",
        adURL:"/json/ad.jsn",
        adPlaceRelation:"/json/ad_place.jsn",
        placeURL:"/json/place_list.jsn",
        adPlaceURL:"/json/ad_place_list.jsn",
        captureURL:"http://www.paymapad.com/json/capture.data", //"http://www.paymapad.com:88/AreaFinder/AreaFinder.asmx/getRect",
        defaultLatLng:"31.29,120.58", // 默认中心点 latlng
        defaultZoom:4, // 默认显示等级
        errorMsg:{
            "name_empty":"广告名字不能为空",
            "link_empty":"广告链接不能为空",
            "link_format":"广告链接格式不正确",
            "latlng_empty":"请输入至少一个经纬度",
            "image_upload_failed":"上传图片失败, 请稍后再试",
            "location_save_error":"广告位置信息保存失败, 请稍后再试!",
            "location_saved":"广告位置信息已经保存!",
            "configure_save_error":"广告配置信息保存失败, 请稍后再试!",
            "configure_saved":"广告配置信息已经保存!",
            "ad_save_error":"广告信息保存失败, 请稍后再试!",
            "ad_saved":"广告创建/修改成功, 接下来您可以为广告添加配置信息!",
            "ad_no_configured":"您还没有配置广告位, 请先",
            "place_id_empty":"广告位置为空"
        },
        isViewer:-1,
        isBlank:-2,

        getSuffix:function (w, h) {
            return "!" + w + "x" + h;
        },
        debug:isDebug,
        // 图片主机
        imgRoot:imgRoot,
        // assets
        assetsRoot:isDebug ? "http://www.paymapad.com/assets/" : "http://assets.paymapad.com/"
    }
});
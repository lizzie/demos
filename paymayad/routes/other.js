var path = require("path"),
    fs = require("fs"),
    UPYun = require('./upyun').UPYun;


function md5(string) {
    var crypto = require('crypto');
    var md5sum = crypto.createHash('md5');
    md5sum.update(string, 'utf8');
    return md5sum.digest('hex');
}

exports.upload = function (req, res) {
    var filePath = req.files.Filedata.path,
        extName = path.extname(req.files.Filedata.name),
        currentTime = new Date(),
        imgUrl = ["/test",
            currentTime.getFullYear(),
            (currentTime.getMonth() + 1) + "" + currentTime.getDate(),
            path.basename(filePath) + extName
        ].join("/");


    var upyun = new UPYun("picmapad", "pm_auto", "0p9o8i7u");

    var fileContent = fs.readFileSync(filePath);
    var md5Str = md5(fileContent);
    upyun.setContentMD5(md5Str);

    upyun.writeFile(imgUrl, fileContent, true, function (err, data) {
        console.log([err, data, "http://pic.paymapad.com" + imgUrl]);
        if (!err) {
            res.json({
                status:0,
                imgurl:"http://pic.paymapad.com" + imgUrl
            });
        } else {
            res.json({
                status:1
            });
        }
        fs.unlink(filePath);
    });

    /*fs.readFile(filePath, function (err, data) {
     if (err) {
     res.send(err);
     return;
     }

     var imageUrl = "/assets/upload/" + path.basename(filePath) + extName;

     console.log(path.join(__dirname, "..", imageUrl));
     fs.writeFile(path.join(__dirname, "..", imageUrl), data, function (err) {
     if (!err) {
     res.json({
     status:0,
     imgurl:"/assets/upload/" + path.basename(filePath) + extName
     });
     } else {
     res.json({
     status:1
     });
     }

     fs.unlink(filePath);
     });
     });*/
};

exports.tiles = function (req, res) {
    res.set('Content-Type', 'text/javascript');
    res.render("tile", {
        id:req.query.id,
        x:req.query.x,
        y:req.query.y,
        zoom:req.query.zoom
    });
};
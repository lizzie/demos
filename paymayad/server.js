var express = require("express"),
    seajs = require("seajs"),

    app = express(),

    ad = require("./routes/ad"),
    place = require("./routes/place"),
    other = require("./routes/other"),
    link = require("./routes/link"),
    auth = require("./routes/auth"),
    models = require("./db"),

    global_config = require(__dirname + "/assets/config");

/*app.use(express.basicAuth(function(user, pass) {
 return user === 'root' && pass === '0p9o8i7u';
 }));*/

app.configure(function () {
    app.set("view engine", "ejs");
    app.set("title", "Pay Map AD");
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");
    app.set("views", __dirname + "/views");
    app.use(express.favicon(__dirname + '/favicon.ico'));
    app.use(express.methodOverride());
    app.use(express.bodyParser({ // todo
        uploadDir:__dirname + "/assets/upload"
    }));
    app.use("/assets", express.static(__dirname + "/assets"));
    app.use("/vmap", express.static(__dirname + "/vmap"));

    app.use(express.cookieParser("paymapad"));
    app.use(express.session({ secret:"paymapad" }));

    app.use(app.router);

    app.use(function (req, res, next) {
        res.status(302);

        // respond with html page
        if (req.accepts('html')) {
            res.redirect("/404");
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error:'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });
});

app.configure("development", function () {
    app.use(express.errorHandler({
        dumpExceptions:true, showStack:true
    }));
});
app.configure("production", function () {
    app.use(express.errorHandler());
});

function _simple_auth(req, res, next) {
    if (req.session.loggedIn) {
        next(req, res);
    } else {
        res.redirect("/login");
    }
}
app.all("/login", auth.login);
app.get("/logout", auth.logout);
app.all("/register", auth.register);

app.get("/", function (req, res) {
    res.render("index", {
        title:"Home",
        config:global_config,
        nav:"home",
        isLogin:req.session.loggedIn
    });
});
app.get("/view", function (req, res) {
    if (1) {   // req.query.type === "blank" 临时查看可以将此改为 if (1) { // todo
        res.render("view", {
            title:"Viewer",
            config:global_config,
            nav:"view",
            isLogin:req.session.loggedIn,
            mapType:req.query.map
        });
    } else {
        var which = req.query.map || "google";
        res.render(which, {
            title:"Viewer",
            config:global_config,
            nav:"view",
            isLogin:req.session.loggedIn,
            mapType:which
        });
    }
});
app.all("/capture", function (req, res) {
    //_simple_auth(req, res, function (req, res) {
    res.render("capture", {
        title:"Capture",
        config:global_config,
        nav:"",
        mapType:req.query.map
    });
    //});
});
app.get("/dashboard", function (req, res) {
    _simple_auth(req, res, function (req, res) {
        res.render("dashboard", {
            title:"Dashboard",

            config:global_config,
            nav:"dashboard",
            isLogin:req.session.loggedIn
        });
    });
});

app.all("/about", function (req, res) {
    res.render("about", {
        title:"About",

        config:global_config,
        nav:"about",
        isLogin:req.session.loggedIn
    });
});

app.all("/tg", function (req, res) {
    res.render("tg", {
        title:"tg",

        config:global_config,
        nav:"tg",
        isLogin:req.session.loggedIn
    });
});

// 获取某个广告
app.get("/json/ad.jsn/:id", ad.get);
app.post("/json/ad.jsn", ad.create);
app.put("/json/ad.jsn/:id", ad.modify);
app.delete("/json/ad.jsn/:id", ad.delete);
// 获取某用户的广告列表页
app.all("/json/ad_list.jsn", ad.list);

// 添加广告到广告位上
app.post("/json/ad_place.jsn", place.addAD);
// 获取广告位
app.get("/json/place_list.jsn", place.list);
// 添加空白广告位
app.post("/json/place_list.jsn", place.add);
// 获取包含广告的广告位列表
app.get("/json/ad_place_list.jsn", place.fetch);

// link
app.get("/json/link.jsn", link.get);
app.post("/json/link.jsn", link.test);
app.put("/json/link.jsn/:id", link.test);

//
app.all("/json/capture.data", function (req, res) {
    var fakedata = [];
    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        var x = Math.ceil(Math.random() * 100 * i),
            y = Math.ceil(Math.random() * 100 * i),
            style = Math.ceil(Math.random() * 10) % 3;
        fakedata.push([x, y, style].join(","));
    }
    res.send(fakedata.join(";"));
});
// 上传文件
app.post("/json/image/upload", other.upload);
app.get("/json/tile.js", other.tiles);

app.all("/404", function (req, res) {
    res.status(404);

    res.render('404', {
        title:"404",
        config:global_config,
        nav:"other",
        isLogin:req.session.loggedIn
    });
});
app.listen(8888);
console.log("listening to http://127.0.0.1:8888");

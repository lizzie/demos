var http = require("http"),
    querystring = require("querystring"),
    async = require("async"),
    fs = require("fs"),
    entities = require("entities");


var reg = /<tr><td>(\d*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/g,
    repList = [
        [/doesn't/ig, "does not"],
        [/["'“][^"'”]+["'”]/ig, "XXX"], //(.*?)
        [/(.*)AE\.app\.jsonpRequest\._getHandler\(\d+\)(.*)/ig, "$1AE.app.jsonpRequest._getHandler(XXX)$2"],
        [/(.*)\s+is\s+not\s+defined(.*)/ig, "XXX is undefined"],
        [/(.*)\s+is\s+undefined(.*)/ig, "XXX is undefined"],
        [/(.*)\s+is\s+null(.*)/ig, "XXX is null"],
        [/(.*)\s+is\s+not\s+a\s+function(.*)/ig, "XXX is not a function"],
        [/(.*)\s+has\s+no\s+properties(.*)/ig, "XXX has no properties"],
        [/(.*)\s+Undefined\s+variable:\s+(.*)/ig, "Undefined variable: XXX"],
        [/(.*)ReferenceError:\s+Can't\s+find\s+variable:(.*)/ig, "ReferenceError: Can't find variable: XXX"],
        [/(.*)Uncaught\s+Error:\s+Error\s+connecting\s+to\s+extension(.*)/ig,
            "Uncaught Error: Error connecting to extension XXX"],
        [/(.*)Object\s+doesnXXXjsonp_callback_\d+(.*)/ig, "Object doesn't 'jsonp_callback_XXX'"],
        [/(.*)DOM\s+Exception:\s+(.*)/ig, "DOM Exception: XXX"],
        [/(.*)Uncaught\s+TypeError:\s+(.*)/ig, "Uncaught TypeError: XXX"],
        [/(.*)Uncaught\s+exception:\s+(.*)/ig, "Uncaught exception: XXX"],
        [/(.*)Uncaught\s+Error:\s+(.*)/ig, "Uncaught Error: XXX"],
        [/(.*)\s+is\s+not\s+a\s+constructor(.*)/ig, "XXX is not a constructor"],
        [/(.*)Uncaught\s+SyntaxError:\s+(.*)/ig, "Uncaught SyntaxError: XXX"],
        [/(.*)Permission\s+denied\s+(.*)/ig, "Permission denied: XXX"],
        [/(.*)Syntax\s+error:\s+(.*)/ig, "Syntax error: XXX"],
        [/(.*)Syntax\s+error\s+(.*)/ig, "Syntax error: XXX"],
        [/(.*)SyntaxError:\s+(.*)/ig, "SyntaxError: XXX"],
        [/系统错误:\s+(.*)/ig, "系统错误: XXX"],
        [/缺少对象:\s+(.*)/ig, "缺少对象: XXX"],
        [/TypeError:\s+(.*)/ig, "TypeError: XXX"],
        [/Error:\s+(.*)/ig, "Error: XXX"],
        [/(.*)Nelze\s+načíst\s+vlastnost\s+(\w+)\s+nedefinovaného\s+nebo\s+nulového\s+odkazu(.*)/ig,
            "Nelze načíst vlastnost XXX nedefinovaného nebo nulového odkazu"],
        [/l’objet\s+ne\s+gère\s+pas\s+la\s+propriété\s+ou\s+la\s+méthode\s+(.*)/ig,
            "l’objet ne gère pas la propriété ou la méthode"]
    ],
    allPage = [
        ["defaultApp", 7],
        ["defaultPageId", 9],
        ["SOURCING_HOME", 11],
        ["SOURCING_DETAIL", 13],
        ["SOURCING_POSTING_POST", 15],
        ["ALLIN_MAIL_INDEX", 17]
    ];


function _trim(string) {
    return string.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
}
function analysis(string) {
    var all = string.match(reg),
        ret = [];
    if (all) {
        for (var i = 0; i < all.length; i++) {
            var content = reg.exec(all[i]);

            if (content) {
                content = _trim(content[3]);
                content = entities.decode(content, 0);
                content = entities.decode(content, 1);
                content = entities.decode(content, 2);

                for (var j = 0; j < repList.length; j++) {
                    content = content.replace(repList[j][0], repList[j][1]);
                }
                ret.push(content);
            }
        }

    }
    return ret;
}
function fetch_one(appName, appID, callback) {
    console.log(appName, appID);

    var data = querystring.stringify({
        action: "errorLogList_action",
        appName: appName,
        appId: appID,
        event_submit_DoGet: "查询"
    });
    var options = {
        hostname: "jsmonitor.alibaba.com",
        port: 80,
        path: "/errorLogList.htm",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
            "Referer": "http://jsmonitor.alibaba.com/errorLogList.htm",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0",
            "Content-Length": data.length
        }
    };

    var content = "";
    var req = http.request(options, function (res) {
        res.on("data", function (chunk) {
            content += chunk;
        });

        res.on("end", function () {
            // to one line
            content = content.replace(/\n/g, "");
            content = content.replace(/\r/g, "");

            callback(null, analysis(content));
        });
    });

    req.on("error", function (e) {
        console.log("problem with request: " + e.message + " when download: " + appID);
    });


    req.write(data);
    req.end();
}


var startTime = new Date().getTime();
var fnList = [];
for (var i = 0; i < allPage.length; i++) {
    (function (appName, appID) {
        fnList.push(function (callback) {
            fetch_one(appName, appID, callback);
        });
    })(allPage[i][0], allPage[i][1]);
}
async.series(fnList, function (err, results) {
    var total = {};
    // unique
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        for (var j = 0; j < result.length; j++) {
            var tmp = result[j];

            if (total[tmp]) {
                total[tmp] += 1;
            } else {
                total[tmp] = 1;
            }
        }
    }

    var count = 0;
    for (var key in total) {
        console.log(key);
        count++;
    }

    fs.writeFile("result.json", JSON.stringify(total));
    console.log("Time: ", new Date().getTime() - startTime, " Count: ", count);
});
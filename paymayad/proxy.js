var http = require("http"),
    httpProxy = require("http-proxy");

httpProxy.createServer({
    hostnameOnly:true,
    router:{
        "www.paymapad.com":"127.0.0.1:8888"
    }
}).listen(80);


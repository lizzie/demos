var express = require("express"),
    seajs = require("seajs"),

    app = module.exports = express();

app.configure(function () {
    app.set("view engine", "ejs");
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");
    app.set("views", __dirname + "/views");
    app.use(express.favicon(__dirname + '/favicon.ico'));
    app.use(express.methodOverride());
    app.use(express.bodyParser({
        uploadDir: __dirname + "/assets/upload"
    }));
    app.use("/assets", express.static(__dirname + "/assets"));
    app.use(app.router);

    /*app.use(function (req, res, next) {
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
     });*/
});

app.configure("development", function () {
    app.use(express.errorHandler({
        dumpExceptions: true, showStack: true
    }));
});
app.configure("production", function () {
    app.use(express.errorHandler());
});


app.all("/", function (req, res) {
    res.render("index.html", {
        title: "Overview"});
});


app.all("/entrance", function (req, res) {
    res.render("entrance.html", {
        title: "Entrance"});
});


app.all("/search", function (req, res) {
    res.render("search.html", {
        title: "Search"
    });
});

//
app.all("/json/overview.jsn", function (req, res) {
    var fakedata = [];
    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        fakedata.push({
            "entrance": "/index.html" + i,
            "average": 625,
            "outter": 435,
            "outter_percent": 69,
            "db": 54,
            "db_percent": 8.6,
            "self": 136,
            "self_percent": 21.7,
            "call_times": 426,
            "percent": Math.random() * 100
        });
    }
    res.json({
        "start_time": "2013/07/01 00:00:00",
        "end_time": "2013/07/01 23:59:59",
        "list": fakedata
    });
});

app.all("/json/entrance.jsn", function (req, res) {
    var fakedata = [];
    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        fakedata.push({
            "index": i,
            "method_name": "/index.html" + i,
            "call_times": 426,
            "time": 200,
            "percent": Math.random() * 100
        });
    }
    res.json({
        charts_config: {
            chart: {
                renderTo: "overview-all",
                zoomType: 'xy'
            },
            title: {
                text: 'Average Monthly Weather Data for Tokyo'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: [
                {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            ],
            yAxis: [
                { // Primary yAxis
                    labels: {
                        formatter: function () {
                            return this.value + '°C';
                        },
                        style: {
                            color: '#89A54E'
                        }
                    },
                    title: {
                        text: 'Temperature',
                        style: {
                            color: '#89A54E'
                        }
                    },
                    opposite: true

                },
                { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Rainfall',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return this.value + ' mm';
                        },
                        style: {
                            color: '#4572A7'
                        }
                    }

                },
                { // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Sea-Level Pressure',
                        style: {
                            color: '#AA4643'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return this.value + ' mb';
                        },
                        style: {
                            color: '#AA4643'
                        }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 80,
                floating: true,
                backgroundColor: '#FFFFFF'
            },
            series: [
                {
                    name: 'Rainfall',
                    color: '#4572A7',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    tooltip: {
                        valueSuffix: ' mm'
                    }

                },
                {
                    name: 'Sea-Level Pressure',
                    type: 'spline',
                    color: '#AA4643',
                    yAxis: 2,
                    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                    marker: {
                        enabled: false
                    },
                    dashStyle: 'shortdot',
                    tooltip: {
                        valueSuffix: ' mb'
                    }

                },
                {
                    name: 'Temperature',
                    color: '#89A54E',
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    tooltip: {
                        valueSuffix: ' °C'
                    }
                }
            ]
        },
        overview: {
            total_call_times: 1000,
            average_cost_time: 200,
            outter_system_cost_time: 160,
            db_cost_time: 40,
            self_cost_time: 40
        },
        bar_charts_config: {
            chart: {
                type: 'bar',
                renderTo: 'overview-bar'
            },
            title: {
                text: '// todo: Here is Title'
            },
            subtitle: {
                text: '// todo: Source: Wikipedia.org'
            },
            xAxis: {
                categories: [1, 2, 3, 4, 5],
                title: {
                    text: '数字'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次数',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -100,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2]
                }
            ]
        }
    })
});
app.all("/json/entrance_list.jsn", function (req, res) {
    var fakedata = [],
        trace_list = [];
    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        fakedata.push({
            "index": i,
            "method_name": "/index.html" + i,
            "call_times": 426,
            "time": 200,
            "percent": Math.random() * 100
        });
    }
    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        trace_list.push({
            "ID": i,
            "datetime": "2013/07/01 00:00:00",
            "entrance_name": 426,
            "time": 200
        });
    }
    res.json({
        ht_list: fakedata,
        trace_list: trace_list
    })
});
app.all("/json/a_trace.jsn", function (req, res) {
    res.json({
        title: "单个 trace 查看",
        trace_data: [
            {
                id: "1",
                type: "success",
                percent: 35,
                url: "/",
                parent_id: "",
                time: 200
            },
            {
                id: "1.1",
                type: "warning",
                percent: 20,
                url: "/aa",
                parent_id: "1",
                time: 200
            },
            {
                id: "1.1.1",
                type: "danger",
                percent: 10,
                url: "/aa/bb/",
                parent_id: "1.1",
                time: 200
            },
            {
                id: "1.2",
                type: "success",
                percent: 35,
                url: "/bb/",
                parent_id: "1",
                time: 200
            },
            {
                id: "2",
                type: "success",
                percent: 35,
                url: "/4",
                parent_id: "",
                time: 200
            }
        ]
    })
});
app.all("/json/a_trace_detail.jsn", function (req, res) {
    res.json({
        trace_detail: [
            {
                id: "1",
                type: "success",
                percent: 35,
                url: "/",
                parent_id: "",
                time: 200
            }
        ]
    })
});
app.all("/json/search.jsn", function (req, res) {
    var trace_list = [];

    for (var i = 1; i < 5 + Math.ceil(Math.random() * 10); i++) {
        trace_list.push({
            "ID": i,
            "datetime": "2013/07/01 00:00:00",
            "entrance_name": 426,
            "time": 200
        });
    }
    res.json({
        charts_config: req.query.nochart ? false: {
            chart: {
                type: 'column',
                renderTo: "overview-chart"
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [-1, 1, 2, 3, 4, 5, 6, 7]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            series: [
                {
                    name: 'Tokyo',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

                }
            ]
        },
        trace_list: req.query.nochart ? trace_list : false
    })
});
app.all("/json/compare.jsn", function (req, res) {
    res.json({
        title: "2个trace对比查看区域",
        trace_data: [
            {
                id: "1",
                both: true,
                percent: [35, 45],
                url: "/",
                parent_id: ""
            },
            {
                id: "1.1",
                both: true,
                percent: [25, 15],
                url: "/aa",
                parent_id: "1"
            },
            {
                id: "1.1.1",
                gt: true,
                percent: 35,
                url: "/aa/bb/",
                parent_id: "1.1"
            },
            {
                id: "1.1.2",
                lt: true,
                percent: 45,
                url: "/aa/cc/",
                parent_id: "1.1"
            },
            {
                id: "2",
                both: true,
                percent: [45, 35],
                url: "/4",
                parent_id: ""
            }
        ]
    })
});

app.listen(8888);
console.log("listening to http://127.0.0.1:8888");
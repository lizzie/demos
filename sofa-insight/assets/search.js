define(function (require, exports, module) {
    var $ = require("$"),

        HighCharts = require("highcharts"),
        Handlebars = require("handlebars");

    // 模板
    var trace_template = Handlebars.compile($("#overview-trace-template").html());

    var barCharts = null,

        loading = function (show) {
            $("#loading")[show ? "show" : "hide"]();
        },
        _error = function (e) {
            console.log(e);
        };

    return {
        load: function (data, cbk) {
            $("#overview-a-trace").parents(".sf-block").hide();

            $.ajax("/json/search.jsn", {
                data: data,
                success: function (data) {
                    if (!data) return;
                    if (data.charts_config) {
                        $("#overview-chart").show();
                        $("#overview-trace").parents(".sf-block").hide();

                        // 柱状图
                        barCharts && barCharts.destroy();

                        data.charts_config.tooltip = {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b>我可以自定义<br/>' +
                                    HighCharts.dateFormat('%e. %b', this.x) + ': ' + this.y + ' m';
                            }
                        };
                        data.charts_config.plotOptions = {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (e) {
                                            loading(1);

                                            // 获取 trace 列表
                                            $.ajax("/json/search.jsn", {
                                                data: {
                                                    nochart: true,
                                                    category: this.category,
                                                    x: this.x,
                                                    y: this.y
                                                },
                                                success: function (data) {
                                                    $("#overview-trace").find("tbody").html(trace_template(data)).parents(".sf-block").show();
                                                    $("#overview-a-trace").parents(".sf-block").hide();
                                                },
                                                error: _error,
                                                complete: function () {
                                                    loading(0);
                                                }
                                            });
                                        }
                                    }
                                },
                                marker: {
                                    lineWidth: 1
                                }
                            }
                        };
                        barCharts = new HighCharts.Chart(data.charts_config);
                    } else {
                        $("#overview-chart").hide();
                    }

                    if (data.trace_list) {
                        $("#overview-trace").find("tbody").html(trace_template(data)).parents(".sf-block").show();
                    }
                },
                error: _error,
                complete: function () {
                    cbk && cbk();
                }
            });
        }
    }

});
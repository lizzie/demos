define(function (require, exports, module) {
    var $ = require("$"),

        HighCharts = require("highcharts"),
        Handlebars = require("handlebars");

    // 模板
    var template = Handlebars.compile($("#overview-list-template").html());
    var ht_template = Handlebars.compile($("#overview-ht-template").html());
    var trace_template = Handlebars.compile($("#overview-trace-template").html());

    var allCharts = null,
        barCharts = null,

        loading = function (show) {
            $("#loading")[show ? "show" : "hide"]();
        },
        _error = function (e) {
            console.log(e);
        };


    return {
        load: function (data, cbk) {
            $("#overview-ht").parents(".sf-block").hide();
            $("#overview-trace").parents(".sf-block").hide();
            $("#overview-a-trace").parents(".sf-block").hide();

            $.ajax("/json/entrance.jsn", {
                data: data,
                success: function (data) {
                    if (!data) return;
                    // 概览信息
                    $("#overview").find("tbody").html(template(data.overview));

                    // 总览图
                    if (data.charts_config) {
                        allCharts && allCharts.destroy();
                        allCharts = new HighCharts.Chart(data.charts_config); // chart.series[0].setData([]);
                    }
                    // 柱状图
                    if (data.bar_charts_config) {
                        barCharts && barCharts.destroy();
                        // 自定义 tooltip 显示内容
                        data.bar_charts_config.tooltip = {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b>我可以自定义<br/>' +
                                    HighCharts.dateFormat('%e. %b', this.x) + ': ' + this.y + ' m';
                            }
                        };
                        // 添加点击事件
                        data.bar_charts_config.plotOptions = {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            },
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (e) {
                                            loading(1);

                                            // 获取热点列表和 trace 列表
                                            $.ajax("/json/entrance_list.jsn", {
                                                data: {
                                                    category: this.category,
                                                    x: this.x,
                                                    y: this.y
                                                },
                                                success: function (data) {
                                                    $("#overview-ht").find("tbody").html(ht_template(data)).parents(".sf-block").show();
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
                        barCharts = new HighCharts.Chart(data.bar_charts_config);
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
define(function (require, exports, module) {
    var $ = require("$"),

        Bootstrap = require("bootstrap"),
        BootstrapDatetimepicker = require("bootstrap-datetimepicker"),

        Treetable = require("treetable"),
        Handlebars = require("handlebars");

    $(function () {
        // UI 显示相关的代码
        // - 左侧菜单显示/隐藏切换
        var fullClass = "sf-content-full",
            toggleMenuElem = $("#J_toggle_menu");
        if (toggleMenuElem.length) {
            toggleMenuElem.click(function () {
                $("#J_content").toggleClass(fullClass);
                $("#J_sidebar").toggle();
            });
        }

        // - 时间选择菜单
        var timeChoose = $("#J_time_choose"),
            customTimePanel = $("#J_custom_time_panel");

        if (timeChoose.length) {
            var viewType = timeChoose.attr("data-type"),
                load = function (data) {
                    $("#loading").show();

                    require.async("./" + viewType.toLowerCase(), function (view) {
                        view.load(data, function () {
                            $("#loading").hide();
                        });
                    });
                };
            timeChoose.on("click", ".dropdown-menu li a", function (e) {
                var currentTarget = $(e.currentTarget),
                    time = parseFloat(currentTarget.attr("data-val"), 10);
                timeChoose.find("#dropdownMenu").html(currentTarget.html() + ' <span class="caret"></span>');

                if (time) {
                    load({
                        time: time
                    });

                    customTimePanel.hide();
                } else {
                    customTimePanel.show();
                }
            });
            timeChoose.find(".dropdown-menu li a[data-default]").click();

            customTimePanel.find("form").submit(function () {
                var startTime = customTimePanel.find("input[name='start_time']"),
                    startTimeVal = $.trim(startTime.val()),
                    endTime = customTimePanel.find("input[name='end_time']"),
                    endTimeVal = $.trim(endTime.val()),
                    entranceName = customTimePanel.find("input[name='entrance_name']"),
                    entranceNameVal = $.trim(entranceName.val());
                if (!startTimeVal.length) {
                    startTime.focus();
                } else if (!endTimeVal.length) {
                    endTime.focus();
                } else if (viewType === "Search" && !entranceNameVal.length) {
                    entranceName.focus();
                } else {
                    load({
                        startTime: startTimeVal,
                        endTime: endTimeVal,
                        entranceName: entranceNameVal,
                        nochart: !!entranceNameVal
                    });
                }
                return false;
            });

            customTimePanel.find(".input-datetimepicker").datetimepicker({
                language: 'zh-CN',
                pick12HourFormat: true
            });
        }

        // trace 树 和 trace 项详情
        if ($("#overview-a-trace-template").length) {
            var a_trace_template = Handlebars.compile($("#overview-a-trace-template").html());
            var a_trace_detail_template = Handlebars.compile($("#overview-a-trace-detail-template").html());
            var lineSelectClass = "warning",

                _renderATraceTree = function (data) {
                    data.title && $("#overview-a-trace").prev().html(data.title);
                    $("#overview-a-trace").find("tbody").html(a_trace_template(data)).parents(".sf-block").show();
                    $("#overview-a-trace").removeData("treetable").removeClass("treetable").treetable({ expandable: true });

                },
                loading = function (show) {
                    $("#loading")[show ? "show" : "hide"]();
                },
                _error = function (e) {
                    console.log(e);
                };


            var checkClass = "icon-check",
                checkEmptyClass = "icon-check-empty",

                tableWrap = $("#overview-trace").parent();

            tableWrap.on("click", ".J_checkbox",function (e) {
                e.preventDefault();
                e.stopPropagation();

                var current = $(this).find("i");
                current.toggleClass(checkClass).toggleClass(checkEmptyClass);
            }).on("click", "#J_empty_checkbox",function (e) {
                    tableWrap.find("." + checkClass).toggleClass(checkClass).toggleClass(checkEmptyClass);
                }).on("click", "#J_compare",function (e) {
                    var checked = tableWrap.find("." + checkClass);

                    if (checked.length !== 2) {
                        alert("请选择两个 trace");
                        return;
                    }
                    var compare = [];
                    checked.each(function (i) {
                        compare.push($(this).parents("tr").attr("data-id"));
                    });
                    loading(1);
                    $.ajax("/json/compare.jsn", {
                        data: {
                            compare: compare.join(",")
                        },
                        success: _renderATraceTree,
                        error: _error,
                        complete: function () {
                            loading(0);
                        }
                    });
                }).on("click", ".J_show_trace_tree", function () {
                    // 获取 trace 树
                    var currentLine = $(this);
                    if (currentLine.hasClass(lineSelectClass)) return;

                    currentLine.parent().find("tr").removeClass(lineSelectClass);
                    currentLine.addClass(lineSelectClass);

                    loading(1);
                    $.ajax("/json/a_trace.jsn", {
                        data: {
                            id: currentLine.attr("data-id")
                        },
                        success: _renderATraceTree,
                        error: _error,
                        complete: function () {
                            loading(0);
                        }
                    });
                });

            // trace 树中某项详情
            $("#overview-a-trace").on("click", ".J_show_a_trace_detail", function (e) {
                e.preventDefault();
                var currentTrace = $(this),
                    currentLine = currentTrace.parents("tr");
                if (currentLine.hasClass(lineSelectClass)) {
                    currentTrace.next().remove();
                    currentLine.removeClass(lineSelectClass);
                } else {
                    currentLine.addClass(lineSelectClass);

                    loading(1);
                    $.ajax("/json/a_trace_detail.jsn", {
                        data: {
                            url: currentTrace.html()
                        },
                        success: function (data) {
                            data.space = parseInt(currentTrace.prev().css("padding-left")) + 20;
                            currentTrace.after($(a_trace_detail_template(data)));
                        },
                        error: _error,
                        complete: function () {
                            loading(0);
                        }
                    });
                }
            });
        }
    });
});

var config = {
    rules: [
        {
            author: "乔花",
            id: "test",
            description: "test",
            level: "error",
            tagName: "table",
            validator: function (nodes) {
                var result = {};
                for (var i = 0; i < nodes.length; i++) {
                    var trs = nodes[i].getElementsByTagName("tr");
                    for (var j = 0; j < trs.length; j++) {
                        var tds = trs[j].getElementsByTagName("td"),
                            val = tds[2].innerHTML;
                        if (val.length) {
                            val = val.replace(/'(\w+)'/g, '"xxx"');
                            val = val.replace(/"(\w+)"/g, '"xxx"');
                            if (result[val]) {
                                result[val] += 1;
                            } else {
                                result[val] = 1;
                            }
                        }
                    }
                }
                console.log(result);
                return true;
            }
        }
    ]
};

exports.config = config;
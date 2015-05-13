/**
 * page 只作为 页面capture和background发送消息的中间桥梁
 * @type {Object}
 */
var page = {
    sendMessage:function (message) {
        chrome.extension.sendMessage(message);
    },

    init:function () {
        var self = this;

        if ($("body").attr("pay_capture_injected")) return;
        $("body").attr("pay_capture_injected", true);

        chrome.extension.onMessage.addListener(function (request, sender, response) {
            switch (request.type) {
                case "PLACE_FOUND":
                    window.postMessage({ type:"PLACE_FOUND", result:request.result }, "*");
                    break;
            }
        });
        window.addEventListener("message", function (event) {
            // We only accept messages from ourselves
            if (event.source != window) return;

            switch (event.data.type) {
                case "READY_TO_RECAPTURE":
                    self.sendMessage(event.data);
                    break;
                case "START_CAPTURE":
                    self.sendMessage(event.data);
                    break;

            }
        }, false);
    }
};

page.init();

function drag_img_save(request) {
    var tmp = new Image();
    tmp.src = request.canvas;
    tmp.setAttribute("draggable", "true");
    tmp.setAttribute("data-downloadurl", "image/png:map.png:" + request.canvas);
    tmp.addEventListener("dragstart", function (evt) {
        evt.dataTransfer.setData("DownloadURL", this.dataset.downloadurl)
    });
    $("body").append(tmp);
}
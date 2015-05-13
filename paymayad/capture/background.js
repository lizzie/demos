var screenshot = {
    capturing:false,
    canvas:document.createElement("canvas"),

    sendMessage:function (message, callback) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, message, callback);
        });
    },

    captureVisible:function (docWidth, docHeight, filename, loader) {
        var self = this;

        console.log('capturing');

        chrome.tabs.captureVisibleTab(
            null, {format:"png", quality:100}, function (data) {
                console.log(data);
                if (!data) {
                  self.sendMessage({type:"PLACE_FOUND", result:""});
                  return;
                }
                var image = new Image();
                image.onload = function () {
                    var width = image.height < docHeight ?
                        image.width - 17 : image.width;
                    var height = image.width < docWidth ?
                        image.height - 17 : image.height;
                    self.canvas.width = width;
                    self.canvas.height = height;
                    var context = self.canvas.getContext("2d");
                    context.drawImage(image, 0, 0, width, height, 0, 0, width, height);

                    var pluginobj = document.getElementById("pluginobj");
                    pluginobj.AutoSave(self.canvas.toDataURL(), filename, "/Users/qiaohua/Desktop");

                    // todo pluginobj interface 和是否可以利用NPAPI将分析算法嵌入扩展中?

                    $.ajax({
                        url:loader.captureURL,
                        type:"POST",
                        data:{
                            param:[filename + ".png", loader.getColor, loader.getShape].join(";")
                        },
                        cache:false,
                        success:function (data) {
                            self.sendMessage({type:"PLACE_FOUND", result:data.documentElement ? data.documentElement.textContent : data});
                        },
                        error:function (err) {
                            console.log(err);
                            self.sendMessage({type:"PLACE_FOUND", result:""});
                        },
                        complete:function () {
                            console.log("remove image");
                            image = null;

                        }
                    });
                };
                image.src = data;
                //image = null;
            });
    },

    init:function () {
        var self = this;

        console.log("background init");

        chrome.extension.onMessage.addListener(function (request, sender, response) {
            switch (request.type) {
                case "START_CAPTURE":
                    if (!self.capturing) {
                        self.capturing = true;
                        setTimeout(function () {
                            self.captureVisible(request.width, request.height, request.filename, request.config);
                        }, 500);
                    }
                    break;
                case "READY_TO_RECAPTURE":
                    self.capturing = false;
                    break;
            }

            console.log([request.type, self.capturing]);
        });
    }
};
screenshot.init();



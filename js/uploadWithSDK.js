var inited_drop = false;

// 复制的方法
function copyText(text = 1, callback) { // text: 要复制的内容， callback: 回调
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if (callback) {
        callback(text)
    }
}

function btncopy(url) {
    copyText(url, function () {
        alert('复制成功');
    })
}

function uploadWithSDK(gettokenfunction, putExtra, config, onCompleted) {
    // 切换tab后进行一些css操作
    controlTabDisplay("sdk");
    var onSelectFiles = function (files) {
        for (let i = 0; i < files.length; i++) {
            var file = files[i];
            // 调用sdk上传接口获得相应的observable，控制上传和暂停
            gettokenfunction(file, function (file, token, domain, savekey) {
                // eslint-disable-next-line
                var finishedAttr = [];
                // eslint-disable-next-line
                var compareChunks = [];
                var observable;
                if (file) {
                    var key = file.name;
                    // 添加上传dom面板
                    var board = addUploadBoard(file, config, key, "");
                    if (!board) {
                        return;
                    }
                    putExtra.params["x:name"] = key.split(".")[0];
                    board.start = true;
                    var dom_total = $(board)
                        .find("#totalBar")
                        .children("#totalBarColor");

                    // 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作
                    var error = function (err) {
                        board.start = true;
                        $(board).find(".control-upload").text("继续上传");
                        console.log(err);
                        alert("upload error:" + JSON.stringify(err));
                    };

                    var complete = function (res) {
                        var key = (res.data || res).key;
                        let va = domain + '/' + key
                        $(board)
                            .find("#totalBar")
                            .addClass("hide");
                        $(board)
                            .find(".control-container")
                            .html(
                                domain.indexOf("video") !== -1 ?
                                    "<p>" + key + "</p>" :
                                    "<a target='_blank' href='" + domain + '/' + key + "'>" + domain + '/' + key + "</a>"
                                    + "<div><Button class='myUploadedUrl' style='margin: 5px 10px 5px 0;' myUrl='" + va + "' onclick='btncopy(" + '"' + va + '"' + ")'>复制网址</Button></div>"
                                    + "<div><img src='" + domain + '/' + key + "?qrcode/0/level/L' style='width:200px;height: auto'/></div>"
                            );
                            // 七牛资源生成二维码：https://developer.qiniu.com/dora/1298/resource-download-the-qr-code-qrcode
                        if (onCompleted)
                            onCompleted(res, $(board).find(".control-container"))
                    };

                    // document.querySelectorAll(".myUploadedUrl").forEach(item=>{
                    //     console.log(encodeURI(item.innerText))
                    // })

                    var next = function (response) {
                        var chunks = response.chunks || [];
                        var total = response.total;
                        // 这里对每个chunk更新进度，并记录已经更新好的避免重复更新，同时对未开始更新的跳过
                        for (var i = 0; i < chunks.length; i++) {
                            if (chunks[i].percent === 0 || finishedAttr[i]) {
                                continue;
                            }
                            if (compareChunks[i].percent === chunks[i].percent) {
                                continue;
                            }
                            if (chunks[i].percent === 100) {
                                finishedAttr[i] = true;
                            }
                            $(board)
                                .find(".fragment-group li")
                                .eq(i)
                                .find("#childBarColor")
                                .css(
                                    "width",
                                    chunks[i].percent + "%"
                                );
                        }
                        $(board)
                            .find(".speed")
                            .text("进度：" + total.percent + "% ");
                        dom_total.css(
                            "width",
                            total.percent + "%"
                        );
                        compareChunks = chunks;
                    };

                    var subObject = {
                        next: next,
                        error: error,
                        complete: complete
                    };
                    var subscription;
                    if (!savekey)
                        savekey = key;
                    observable = qiniu.upload(file, savekey, token, putExtra, config);
                    $(board)
                        .find(".control-upload")
                        .on("click", function () {
                            if (board.start) {
                                $(this).text("暂停上传");
                                board.start = false;
                                subscription = observable.subscribe(subObject);
                            } else {
                                board.start = true;
                                $(this).text("继续上传");
                                subscription.unsubscribe();
                            }
                        });
                    $(board).find(".control-upload").click();
                }
            });
        }
    }
    $("#select2").unbind("change").bind("change", function () {
        onSelectFiles(this.files)
    });

    if (!inited_drop) {
        inited_drop = true;

        function dragenter(e) {
            console.log('dragenter....')
            e.stopPropagation();
            e.preventDefault();
        }

        function dragover(e) {
            console.log('dragover....')
            e.stopPropagation();
            e.preventDefault();
        }

        function drop(e) {
            console.log('drop....')
            e.stopPropagation();
            e.preventDefault();
            const dt = e.dataTransfer;
            const files = dt.files;
            setTimeout(function () {
                onSelectFiles(files);
            }, Math.random() * 4);
        }

        let dropbox = document.getElementById("box2");
        dropbox.addEventListener("dragenter", dragenter, false);
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drop, false);
    }
}


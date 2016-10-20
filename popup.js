/**
 * Created by aser on 16/10/19.
 */

function $(a) {
    return document.querySelector(a);
}
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //tabs[0].url;     //url
    document.getElementById("_title").value = tabs[0].title;   //title
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getImgs") {
        //message.innerText = request.source;
        window.imgList = request.source;
        $('#_img').innerHTML = request.source[0];
        idxpartion.innerHTML = 1 + "/" + imgList.length;
    }

    //if(request.action=="dialogReady"){
    //
    //    window.dialog= dialogReady();
    //}
});


function onWindowLoad() {

    window.imgList = null;
    window.imgIdx = 0;
    window.idxpartion = $("#_idx_partion");
    chrome.tabs.executeScript(null, {
        file: "dialog.js"
    }, function () {
        chrome.tabs.executeScript(null, {
            file: "getPagesSource.js"
        }, function () {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                imgprview.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
            }
        });
    });

    eventBinds();
    window.dialog = getDialogConfig();
    window.userInfo = identityInit(window.dialog);
    window.reqTool = userInfo.reqTool;
}

function eventBinds() {
    var imgprview = $('#_img');

    $("#_next").addEventListener("click", function () {
        imgIdx += 1;
        imgIdx = imgIdx >= imgList.length ? imgList.length - 1 : imgIdx;
        imgprview.innerHTML = imgList[imgIdx];
        idxpartion.innerHTML = imgIdx + 1 + "/" + imgList.length;
    });

    $("#_pre").addEventListener("click", function () {
        imgIdx -= 1;
        imgIdx = imgIdx < 0 ? 0 : imgIdx;

        imgprview.innerHTML = imgList[imgIdx];
        idxpartion.innerHTML = imgIdx + 1 + "/" + imgList.length;
    });

    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        $("#_submit").addEventListener("click", function () {

            //Ajax.get("http://blog.csdn.net/freshlover/svc/GetTagContent", function (data) {
            //    $("#resp").innerText = data;
            //    window.dialog.showMsg("系统提示");
            //});

            var reqData = {
                title: $("#_title").value,
                imgurl: imgList[imgIdx].match(/src=.[^("|')]+/)[0].substr(5),
                docurl: tablink
            };
            reqTool.post("/hfz/HfzCommAction/saveDoc", {obj: reqData}, function (data) {
                window.dialog.showMsg("操作成功!");
            });

        });
    });


    $("#_dialog_close").addEventListener("click", function () {
        dialog.hideMsg();
    });
}

window.onload = onWindowLoad;
/**
 * Created by aser on 16/10/19.
 */

function $(a) {
    return a.indexOf(".")==0?document.querySelectorAll(a): document.querySelector(a);
}
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //tabs[0].url;     //url
    document.getElementById("_title").value = tabs[0].title;   //title
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getImgs") {
        var el = document.createElement("div");
        el.innerHTML = request.source[0]||"";

        var doc = el.querySelectorAll("img");

        GetImgs(doc, request.source[1], function (imglist) {
            window.imgList = imglist;
            $('#_img').innerHTML = imglist[0];
            idxpartion.innerHTML = 1 + "/" + imgList.length;

            eventBinds();
            window.dialog = getDialogConfig();
            window.userInfo = identityInit(window.dialog);
            window.reqTool = userInfo.reqTool;
            window.host = userInfo.host;
            userInfo.userInfo.onCityLoad(function(cityList,custcity){

                var html="";
                cityList.forEach(function(item){
                    //var i in v;
                    for(var i in item){
                        var opt = i==custcity?"selected='true'":"";

                        html+="<option value='"+item[i]+"' "+opt+">"+i+"</option>";
                      break;
                    }

                });

                $(".server-list").forEach(function(v){
                    v.innerHTML=html;
                });

            });

        });

    }
});


function onWindowLoad() {

    window.imgList = null;
    window.imgIdx = 0;
    window.idxpartion = $("#_idx_partion");
    var imgprview = $('#_img');


    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            imgprview.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });


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

    $("#_view_list").addEventListener("click", function () {
        $("#_warp_box").classList.add("goto-list");
        getList();
    });

    $("#_back_index").addEventListener("click", function () {
        $("#_warp_box").classList.remove("goto-list");
    });

    chrome.tabs.getSelected(null, function (tab) {
        var tablink = tab.url;
        $("#_submit").addEventListener("click", function () {

            //Ajax.get("http://blog.csdn.net/freshlover/svc/GetTagContent", function (data) {
            //    $("#resp").innerText = data;
            //    window.dialog.showMsg("系统提示");
            //});

            var imgsrc = imgList[imgIdx].match(/src=.[^("|')]+/)[0].substr(5);
            var reqData = {
                title: $("#_title").value,
                imgurl: imgsrc.indexOf("http") >= 0 ? imgsrc : null,
                docurl: tablink,
                content: imgsrc.indexOf("http") >= 0 ? null : imgsrc
            };
            reqTool.post("/hfz/HfzCommAction/saveDoc", {obj: reqData}, function (data) {
                if (data) {
                    data = JSON.parse(data);
                    if (data.obj == 1) {
                        window.dialog.showMsg("操作成功!");
                    } else {
                        var errmsg = data.errmsg == null || data.errmsg == "" ? "" : "错误信息为:" + data.errmsg;
                        window.dialog.showMsg("操作失败!" + errmsg);
                    }
                }

            });

        });
    });


    $("#_dialog_close").addEventListener("click", function () {
        dialog.hideMsg();
    });

    $(".server-list").forEach(function(v){
        v.addEventListener("change", function (a,b,c,d,e) {
            var selitem = this.selectedIndex;
            var item = this.options[selitem];
            userInfo.userInfo.changeCity(item.text,item.value);
            $(".server-list").forEach(function(sel){
                sel.options[selitem].selected=true;
            });
        });
    });
}

function getList() {
    var box = $("#_data_list");
    reqTool.get("/hfz/HfzCommAction/listDoc", {obj: null}, function (data) {
        if (data) {
            data = JSON.parse(data);
            if (data.obj && data.obj.list && data.obj.list.length > 0) {
                box.innerHTML = "";
                for (var i = 0; i < data.obj.list.length; i++) {
                    var item = data.obj.list[i];
                    var el = document.createElement("div"), title = document.createElement("a"), img = document.createElement('img');

                    title.href = item.docurl;
                    title.innerHTML = item.title;
                    item.imgurl = item.imgurl || "" , img.src = item.imgurl.substring(0, 1) == "/" ? host + item.imgurl : item.imgurl;

                    el.classList.add("list-item");
                    img.classList.add("list-img");
                    title.target = "view_window";

                    el.appendChild(img);
                    el.appendChild(title);
                    box.appendChild(el);
                }
                //box.innerHTML = "<p style='font-size: 16px;color:gray;'>暂无数据!</p>";
            } else {
                box.innerHTML = "<p style='width:100%;text-align: center; font-size: 16px; color:gray;'>暂无数据</p>";
            }

        }

    });
}

window.onload = onWindowLoad;
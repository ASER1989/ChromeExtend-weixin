/**
 * Created by aser on 16/10/19.
 */

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    //tabs[0].url;     //url
    document.getElementById("_title").value=tabs[0].title;   //title
});


chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getImgs") {

        //message.innerText = request.source;
        window.imgList=request.source;
        document.querySelector('#_img').innerHTML = request.source[0];
    }
});

function onWindowLoad() {

    var imgprview = document.querySelector('#_img');
    window.imgList = null;
    window.imgIdx=0;
    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            imgprview.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });


    document.querySelector("#_next").addEventListener("click",function(){
        imgIdx+=1;
        imgIdx=imgIdx>=imgList.length?imgList.length-1:imgIdx;
        imgprview.innerHTML=imgList[imgIdx];
    });

    document.querySelector("#_pre").addEventListener("click",function(){
        imgIdx-=1;
        imgIdx=imgIdx<0?0:imgIdx;

        imgprview.innerHTML=imgList[imgIdx];
    });

    document.querySelector("#_submit").addEventListener("click",function(){

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://blog.csdn.net/freshlover/svc/GetTagContent", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // innerText does not let the attacker inject HTML elements.

                document.querySelector("#_dialog").style.display="block";
                document.querySelector("#resp").innerText = xhr.responseText;
                document.querySelector("#_dialog_msgBox").classList.add("slidein");
            }
        }
        xhr.send();
    });

    document.querySelector("#_dialog_close").addEventListener("click",function(){
        document.querySelector("#_dialog").style.display="none";
        document.querySelector("#_dialog_msgBox").classList.remove("slidein");
    });

}

window.onload = onWindowLoad;
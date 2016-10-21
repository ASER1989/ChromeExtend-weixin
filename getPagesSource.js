/**
 * Created by aser on 16/10/19.
 */
function DOMtoString(document_root) {
    var html = '',
      node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                html += node.outerHTML;
                break;
            case Node.TEXT_NODE:
                html += node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                html += '<![CDATA[' + node.nodeValue + ']]>';
                break;
            case Node.COMMENT_NODE:
                html += '<!--' + node.nodeValue + '-->';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
                break;
        }
        node = node.nextSibling;
    }
    //debugger;
    return html;
}

function GetFirstImg(document_root) {
    var html = DOMtoString(document_root);
    var firstImg = html.match(/<img[^>]+/);
    var img = firstImg && firstImg.length > 0 ? firstImg[0] + " style='width:230px;'>" : "";
    img = img.replace(/src=\"[^\"]{2}/, function (i, v) {
        if (i == "src=\"//") return "src=\"" + location.protocol + "//";
        if (i == "src='//") return "src=\"" + location.protocol + "//";

        if (i.substring(0, 6) == "src=\"/") return "src=\"" + location.origin + "//" + i.substr(6);
        if (i.substring(0, 6) == "src='/") return "src=\"" + location.origin + "//" + i.substr(6);
    });


    return img;
}
function getDom(document_root) {
    return [DOMtoString(document_root), location.protocol];
}


function GetImgs(imgList, protocol, callback) {

    //var imgList =document_root.querySelectorAll("img");
    var imgArray = [], loadCount = 0;

    if(imgList==null||imgList.length<1) callback.call(null,imgArray);

    function load() {
        imgArray.push(this.outerHTML);
        loadCount += 1;
        if (loadCount == imgList.length) {
            callback.call(null, imgArray);
        }
        this.removeEventListener("load", load, false);
    }

    function error() {
        loadCount += 1;
        if (loadCount == imgList.length) {
            callback.call(null, imgArray);
        }
        this.removeEventListener("error", error, false);
    }

    for (var i = 0; i < imgList.length; i++) {
        if (imgList[i] == null) continue;

        var img = new Image();
        img.style.maxWidth = "230px";

        img.addEventListener("load", load, false);
        img.addEventListener("error", error, false);

        imgList[i].src = imgList[i].src.replace("chrome-extension:", protocol);
        var imgsrc = imgList[i].src;


        img.src = imgsrc.replace(/.{2}/, function (i, v) {

            if (i == "//") return protocol + "//";

            return i;
        });
    }
}


chrome.runtime.sendMessage({
    action: "getImgs",
    source: getDom(document)
});

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

function GetFirstImg(document_root){
    var html = DOMtoString(document_root);
    var firstImg =html.match(/<img[^>]+/);
    var img =firstImg && firstImg.length>0?firstImg[0]+" style='width:230px;'>":"";
    img=img.replace(/src=\"[^\"]{2}/,function(i,v){
        if(i=="src=\"//") return "src=\""+location.protocol+"//";
        if(i=="src='//") return "src=\""+location.protocol+"//";

        if(i.substring(0,6)=="src=\"/") return "src=\""+location.origin+"//"+i.substr(6);
        if(i.substring(0,6)=="src='/") return "src=\""+location.origin+"//"+i.substr(6);
    });


    return img;
}


function GetImgs(document_root){
    var imgList =document.querySelectorAll("img");
    var imgArray=[];
    for(var i=0;i<imgList.length;i++){
        if(imgList[i]==null) continue;

        var img = new Image();
        img.style.maxWidth="230px";
        img.src = imgList[i].src;

        img.src=img.src.replace(/\"[^\"]{2}/,function(i,v){


            if(i=="src=\"//") return "src=\""+location.protocol+"//";
            if(i=="src='//") return "src=\""+location.protocol+"//";

            if(i.substring(0,3)=="src=\"/") return "src=\""+location.origin+"//"+i.substr(3);
            if(i.substring(0,3)=="src='/") return "src=\""+location.origin+"//"+i.substr(3);

            return i;
        });

        imgArray.push(img.outerHTML);
    }

    return imgArray;
}


chrome.runtime.sendMessage({
    action: "getImgs",
    source: GetImgs(document)
});

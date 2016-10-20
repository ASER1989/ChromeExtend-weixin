/**
 * 对话框管理
 * Created by aser on 16/10/20.
 */

function getDialogConfig() {
    var $ = function (a) {
        return document.querySelector(a);
    }

    this.dialogBox =$("#_dialog");
    this.msgBox=$("#_dialog_msgBox");
    this.loginBox=$("#_dialog_loginBox");

    var that = this;
    return{

        showMsg: function (msg) {
            that.msgBox.querySelector(".msg").innerHTML=msg;
            that.dialogBox.style.display="block";
            setTimeout(function(){
                that.msgBox.classList.add("slidein");
            },0);
        },
        hideMsg:function(){
            that.dialogBox.style.display="none";
            that.msgBox.classList.remove("slidein");
        },
        showLogin: function (qrcode) {
            that.dialogBox.style.display="block";
            that.loginBox.style.display="initial";
            that.loginBox.querySelector("img").src=qrcode;
        },
        hideLogin:function(){
            that.dialogBox.style.display="none";
            that.loginBox.style.display="none";
        }


    }

}

//chrome.runtime.sendMessage({
//    action: "dialogReady",
//    source: getDialogConfig
//});

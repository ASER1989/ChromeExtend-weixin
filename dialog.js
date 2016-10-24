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

    this.onMsgHide=null;
    var that = this;
    return{

        showMsg: function (msg,callback) {
            that.msgBox.querySelector(".msg").innerHTML=msg;
            that.dialogBox.style.display="block";
            setTimeout(function(){
                that.msgBox.classList.add("slidein");
            },0);
            that.onMsgHide = callback;
        },
        hideMsg:function(){
            that.dialogBox.style.display="none";
            that.msgBox.classList.remove("slidein");
            if(typeof  that.onMsgHide=="function"){
                that.onMsgHide.call();
                that.onMsgHide=null;
            }
        },
        setQrImg:function(img){
            that.loginBox.querySelector("img").src="loadqrcode.jpg";
        },
        showLogin: function (qrcode) {
            that.loginBox.querySelector("img").src="loadqrcode.jpg";
            setTimeout(function(){
                that.dialogBox.style.display="block";
                that.loginBox.style.display="initial";
                that.loginBox.querySelector("img").src=qrcode;
            },0);

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

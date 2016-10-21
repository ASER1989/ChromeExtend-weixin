/**
 * 身份验证
 * Created by aser on 16/10/20.
 */


function identityInit(dialog) {
    var keys = {
        openid: "_user_openid_x3",
        passport: "_user_passport_x3"
    };
    var host = "http://htfw.dev.wx.webhante.com";
    var reqHost = host + "/qc-webapp/qcapi.do";


    var userInfo = {
        getOpenid: function () {
            return localStorage.getItem(keys.openid);
        },
        setOpenid: function (val) {
            localStorage.setItem(keys.openid, val);
        },
        getPassport: function () {
            return localStorage.getItem(keys.passport);
        },
        setPassport: function (val) {
            localStorage.setItem(keys.passport, val);
        }
    }

    var req = reqTool(userInfo, reqHost);
    var guid = req.getGuid();
    /* *
     * 登陆监听
     * */
    function LoginListener() {
        req.get('/activity/movie/MovieAction/getQRCodeUser', {obj: {uuid: guid}},
          function (data) {
              data = JSON.parse(data);
              if (data.obj != true) {
                  userInfo.setOpenid(data.obj.openid);
                  userInfo.setPassport(data.obj.passport);
                  dialog.hideLogin();
              }

          });

        if (!userInfo.getOpenid())
            setTimeout(LoginListener, 1000);
    }

    void function ready() {

        var openid = userInfo.getOpenid();
        if (!openid) {
            req.get("/global/Qrcode/getQRCodeByKey", {obj: host + "/wxcweb2/loginPC.html?uuid=" + guid}, function (data) {
                var resObj = JSON.parse(data);
                dialog.showLogin(resObj.obj);
                LoginListener();
            });

        }
    }();

    return {userInfo: userInfo, reqTool: req,host:host};

}


function reqTool(userInfo, host) {

    function make(action, param) {
        return {
            "openid": userInfo.getOpenid() || "oUQK3s-GBCckKG3T8nBrjW4OyzWA",
            "passport": userInfo.getPassport() || "6dbd9a95dbccc6977534257900ee18f2",
            "timestamp": +new Date(),
            "action": action,
            "requestParam": param
        };
    }

    function get(action, param, callback) {
        var j = make(action, param);
        Ajax.get(host + "?j=" + JSON.stringify(j), callback);
    }

    function post(action, param, callback) {
        var postData = {j: JSON.stringify(make(action, param))};
        Ajax.post(host, postData, callback);
    }


    function getGuid() {

        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;

    }

    return {
        get: get,
        post: post,
        getGuid: getGuid

    }
}
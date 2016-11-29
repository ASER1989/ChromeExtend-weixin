/**
 * 身份验证
 * Created by aser on 16/10/20.
 */


function identityInit(dialog,loginCallback) {
    var custCity = localStorage.getItem("_good_house_custcity");
    loginCallback = loginCallback ||function(){};

    var keys = {
        openid: function () {
            return "_user_openid_x0_" + custCity;
        },
        passport: function () {
            return "_user_passport_x0_" + custCity;
        },
        host: "_good_house_extension_host",
        city: "_good_house_custcity"
    };

    //var host = "http://htfw.dev.wx.webhante.com";
    var host = "http://whhfz.cq.ourhfz.com";
    var reqHost = host + "/qc-webapp/qcapi.do";
    var cityList = [];
    var LoginTimer = null;

    var userInfo = {
        getOpenid: function () {
            return localStorage.getItem(keys.openid());
        },
        setOpenid: function (val) {
            localStorage.setItem(keys.openid(), val);
        },
        getPassport: function () {
            return localStorage.getItem(keys.passport());
        },
        setPassport: function (val) {
            localStorage.setItem(keys.passport(), val);
        },
        onCityLoad: function (fn) {
            if (cityList.length <= 0) {
                return getAppCity(fn);
            }
            if (typeof fn == "function") {
                fn.call(null, cityList);
            }
        },
        changeCity: changeCity,
        getCity: function () {
            return localStorage.getItem(keys.city);
        }
    }
    //请求工具
    var req = new reqTools(userInfo, reqHost);
    var guid = req.getGuid();

    function getAppCity(fn) {
        req.get("/global/App/queryAppCity", function (data) {
            data = JSON.parse(data);
            var list = data.obj;
            list.forEach(function (v) {

                var item = {};
                item[v.city] = v.domain;
                cityList.push(item);
            });
            if (typeof fn == "function") {
                fn.call(null, cityList, localStorage.getItem(keys.city));
            }
        });

    }

    function changeCity(city, host) {
        if (city && host) {
            localStorage.setItem(keys.host, host);
            custCity = city;
            localStorage.setItem(keys.city, city);

            //debugger;
            reqHost = host + "/qc-webapp/qcapi.do";

            req = new reqTools(userInfo, reqHost);

            if (!userInfo.getOpenid()) {

                ready();
            }else{
                dialog.hideLogin();

            }
            return req;
        }
    }

    /* *
     * 登陆监听
     * */
    function LoginListener() {
        //req.get('/activity/movie/MovieAction/getQRCodeUser', {obj: {uuid: guid}},
        req.get('/hfz/HfzCommAction/getLoginUser', {obj: {uuid: guid}},
          function (data) {
              data = JSON.parse(data);
              if (data.obj != true) {
                  userInfo.setOpenid(data.obj.user.openid);
                  userInfo.setPassport(data.obj.user.passport);
                  dialog.hideLogin();
              }

          });

        if (!userInfo.getOpenid())
            LoginTimer = setTimeout(LoginListener, 1000);
    }

    function ready() {
        //getAppCity();
        var openid = userInfo.getOpenid();
        if (!openid) {
            dialog.setQrImg();

            req.get("/global/Qrcode/getQRCodeByKey", {obj: req.host.replace("/qc-webapp/qcapi.do","") + "/market/login-pc.html?uuid=" + guid}, function (data) {
                var resObj = JSON.parse(data);
                dialog.showLogin(resObj.obj);
                clearTimeout(LoginTimer);
                LoginListener();
            },function(){
                dialog.hideLogin();
                dialog.showMsg("系统错误,暂时无法登陆!",function(){
                    dialog.showLogin("qrcodeError.jpg");
                });
            });

        }
    }

    void function doReady() {
        ready();
    }();

    return {userInfo: userInfo, reqTool: req, host: localStorage.getItem(keys.host)};

}


function reqTools(userInfo, host) {

    function make(action, param) {
        return {
            "openid": userInfo.getOpenid() || "oUQK3s-GBCckKG3T8nBrjW4OyzWA",
            "passport": userInfo.getPassport() || "6dbd9a95dbccc6977534257900ee18f2",
            "timestamp": +new Date(),
            "action": action,
            "requestParam": param
        };
    }

    function get(action, param, callback,error) {
        callback = callback == null && typeof param == "function" ? param : callback;

        var j = make(action, param);
        Ajax.get(host + "?j=" + JSON.stringify(j), callback,error);
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
        getGuid: getGuid,
        host:host
    }
}
/**
 * 网络请求
 * Created by aser on 16/10/20.
 */
var Ajax = {
    get: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback.call(null, xhr.responseText);
            }
        }
        xhr.send();
    },
    post: function (url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback.call(null, xhr.responseText);
            }
        }
        data = Ajax.encodeFormData(data);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    },
    postFile:function(url,file, callback){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        var form = new FormData();
        form.append("file", fileObj);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback.call(null, xhr.responseText);
            }
        }
        data = Ajax.encodeFormData(data);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(data);
    },
    encodeFormData: function (data) {
        if (!data) return '';
        var pairs = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) continue;
            if (typeof data[name] === 'function') continue;
            var value = data[name].toString();
            name = encodeURIComponent(name.replace('%20', '+'));
            value = encodeURIComponent(value.replace('%20', '+'));
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    }
}

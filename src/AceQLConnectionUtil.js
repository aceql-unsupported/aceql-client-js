/**
 * AceQLConnectionUtil.java
 * 
 * @author abe
 */

/**
 * Convert the given map to an url encoded string with map elements :
 *          key1=value1&key2=value2
 * @param {Map} mapParam
 * @returns {String}
 */
function mapToStringUrlEncoded(mapParam) {
    if(typeof mapParam === 'object') {
        var stringMap = '';
        for (var [key, value] of mapParam) {
            stringMap += encodeURIComponent(key) + "=" + encodeURIComponent(value) +"\&";
        }
        return stringMap.slice(0, -1);
    }
    return encodeURIComponent(mapParam);
}

/**
 * Send data to url with post method
 * Call example :
 *      var params = new Map();
 *      params.set("param1", "value1");
 *      params.set("param2", 1);
 * 	sendPost('http://localhost:8080/AceQLServer', params);
 * @param {String} url the destination url
 * @param {Map} data the data to send 
 * @returns
 */
function sendPost(url, data) {
    var params;
    if(data) {
        params = mapToStringUrlEncoded(data);
    }
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url, false);

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if(params) {
        xhr.send(params);
    } else {
        xhr.send();
    }
    return xhr.responseText;
}

/**
 * Send data to url with get method
 * Call example :
 *      var params = new Map();
 *      params.set("param1", "value1");
 *      params.set("param2", 1);
 * 	sendGet('http://localhost:8080/AceQLServer', params);
 * @param {String} url the destination url
 * @param {Map} data data to send 
 * @returns
 */
function sendGet(url, data) {
     var params;
    if(data) {
        params = mapToStringUrlEncoded(data);
    }

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('GET', url, false);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   if(params) {
        xhr.send(params);
    } else {
        xhr.send();
    }
    
    return xhr.responseText;
}



export {sendGet, sendPost};


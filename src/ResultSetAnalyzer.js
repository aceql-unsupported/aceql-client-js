/**
 * ResultSetAnalyzer.js
 * 
 * @author abe
 */

/**
 * Result set analyzer
 * @param {type} jsonResultParam
 * @returns {ResultSetAnalyzer}
 */
function ResultSetAnalyzer(jsonResultParam) {
    this.jsonResult = jsonResultParam;
  
    /**
     * @return true if status is ok
     */
    this.isStatusOk = function () {
        if (this.jsonResult) {
            var status = JSON.parse(this.jsonResult)["status"];
            if (status && status === "OK") {
                return true;
            }
        }
        return false;
    };
    
    /**
     * @return true if  json is not valid
     */
    this.isInvalidJSONString = function () {
        if (this.jsonResult) {
            return false;
        }
        return true;
    };

    /**
     * @return the value of result
     */
    this.getResult = function () {
        return JSON.parse(this.jsonResult)["result"];
    };

    /**
     * @param {String} name
     * @retrun the value of name parameter in json
     */
    this.getValue = function (name) {
        if (this.isStatusOk() && name) {
            return JSON.parse(this.jsonResult)[name];
        }
        return null;
    };

    /**
     * @param {String} name
     * @retrun the integer value of name parameter in json
     */
    this.getIntValue = function (name) {
        if (!this.isInvalidJSONString() && this.isStatusOk() && name) {
            var value = JSON.parse(this.jsonResult)[name];
            return parseInt(value);
        }
        return -1;
    };

    /**
     * @retrun the type of error
     */
    this.getErrorType = function () {
        if (!this.isInvalidJSONString || !this.isStatusOk) {
            return 0;
        }

        var status;
        if(this.jsonResult) {
            status = JSON.parse(this.jsonResult)["error_type"];
        }
       
        if (!status) {
            return -1;
        }

        return parseInt(status);
    };

    /**
     * @retrun the error message
     */
    this.getErrorMessage = function () {
        if (this.isInvalidJSONStream) {
            var errorMessage = "Unknown error.";
            if (this.httpStatusCode !== 200) {
                errorMessage = "HTTP FAILURE " + httpStatusCode + " (" + this.httpStatusMessage + ")";
            }
            return errorMessage;
        }

        var status;
        if(this.jsonResult) {
            status = JSON.parse(this.jsonResult)["status"];
        }
        if (!status) {
            return null;
        }

        return JSON.parse(this.jsonResult)["error_message"];

    };

    /**
     * @return the stack trace
     */
    this.getStackTrace = function () {
        if (this.isInvalidJSONStream) {
            return null;
        }

        var status = JSON.parse(this.jsonResult)["status"];
        if (status === null) {
            return null;
        }
        return JSON.parse(this.jsonResult)["stack_trace"];

    };

    this.toString = function () {
        return "ResultAnalyzer [jsonResult=" + jsonResult + "]";
    };

};
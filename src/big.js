const CR_LF = "\n";

const PRODUCT_NAME = "AceQL REST JS SDK";
const PRODUCT_VERSION = "1.0-beta.1";
const PRODUCT_DESCRIPTION = "AceQL Client for javascript";
const PRODUCT_DATE = "05/12/2017";

const VENDOR_NAME = "KawanSoft SAS";
const VENDOR_WEB = "http://www.kawansoft.com";
const VENDOR_COPYRIGHT = "Copyright &copy; 2017";
const VENDOR_EMAIL = "contact@kawansoft.com";

function getVersion() {
    return PRODUCT_NAME + " " + PRODUCT_VERSION + " " + PRODUCT_VERSION;
}

function getVendor() {
    return VENDOR_NAME + " - " + VENDOR_WEB;
}
function getFullVersion() {
    return PRODUCT_DESCRIPTION + CR_LF + getVersion() + CR_LF + getVendor();
}

const BIGINT = "BIGINT";
const BINARY = "BINARY";
const BIT = "BIT";
const CHAR = "CHAR";
const CHARACTER = "CHARACTER";
const DATE = "DATE";
const DECIMAL = "DECIMAL";
const DOUBLE_PRECISION = "DOUBLE_PRECISION";
const FLOAT = "FLOAT";
const INTEGER = "INTEGER";
const LONGVARBINARY = "LONGVARBINARY";
const LONGVARCHAR = "LONGVARCHAR";
const NUMERIC = "NUMERIC";
const REAL = "REAL";
const SMALLINT = "SMALLINT";
const TIME = "TIME";
const TIMESTAMP = "TIMESTAMP";
const TINYINT = "TINYINT";
const URL = "URL";
const VARBINARY = "VARBINARY";
const VARCHAR = "VARCHAR";
const TYPE_NULL = "TYPE_NULL";
const BLOB = "BLOB";

/**
 * 
 * @returns {Array} all types
 */
function SQL_TYPES() {
    var types = new Array();
    types.push(BIGINT);
    types.push(BIT);
    types.push(CHAR);
    types.push(CHARACTER);
    types.push(DATE);
    types.push(DECIMAL);
    types.push(DOUBLE_PRECISION);
    types.push(FLOAT);
    types.push(INTEGER);
    types.push(LONGVARBINARY);
    types.push(LONGVARCHAR);
    types.push(NUMERIC);
    types.push(REAL);
    types.push(SMALLINT);
    types.push(TIME);
    types.push(TIMESTAMP);
    types.push(TINYINT);
    types.push(URL);
    types.push(VARBINARY);
    types.push(VARCHAR);
    types.push(BLOB);
    types.push(TYPE_NULL);
    return types;
}

function AceQLException(reason, vendorCode) {
    this.reason = reason;
    this.vendorCode = vendorCode;
    
    /**
     * 
     * @returns reason of error
     */
    this.getReason = function () {
        return this.reason;
    };
    
    /**
     * 
     * @returns The error type:
     *            <ul>
     *            <li>0 for local Exception.</li>
     *            <li>1 for JDBC Driver Exception on the server.</li>
     *            <li>2 for AceQL Exception on the server.</li>
     *            <li>3 for AceQL Security Exception on the server.</li>
     *            <li>4 for AceQL failure.</li>
     *            </ul>
     */
    this.getVendorCode = function() {
        return this.vendorCode;
    };
    
};

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

/* 
 * PrepStatementParametersBuilder.js
 * 
 * @author abe
 */

/**
 * PreparedStatement builder
 * @returns {PrepStatementParametersBuilder}
 */
function PrepStatementParametersBuilder() {
    this.statementParameters = new Map();
    
    this.setParameter = function(parameterIndex, parameterType, parameterValue) {

	if (parameterIndex < 1) {
	    throw "Illegal parameter index. Must be > 0: " + parameterIndex;
	}
	
	if (!parameterType) {
	    throw "parameter type is null";
	}

	this.statementParameters.set("param_type_" + parameterIndex , parameterType);
	
	if (!parameterValue) {
	    parameterValue = "NULL";
	}
	
	this.statementParameters.set("param_value_" + parameterIndex , parameterValue);
    };
    
    this.getStatementParameters = function () {
        return this.statementParameters;
    };
}

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
  
    this.isStatusOk = function () {
        if (this.jsonResult) {
            var status = JSON.parse(this.jsonResult)["status"];
            if (status && status === "OK") {
                return true;
            }
        }
        return false;
    };
    
    this.isInvalidJSONString = function () {
        if (this.jsonResult) {
            return false;
        }
        return true;
    };

    this.getResult = function () {
        return JSON.parse(this.jsonResult)["result"];
    };

    this.getValue = function (name) {
        if (this.isStatusOk() && name) {
            return JSON.parse(this.jsonResult)[name];
        }
        return null;
    };

    this.getIntValue = function (name) {
        if (!this.isInvalidJSONString() && this.isStatusOk() && name) {
            var value = JSON.parse(this.jsonResult)[name];
            return parseInt(value);
        }
        return -1;
    };

    this.getErrorType = function () {
        if (!this.isInvalidJSONString || !this.isStatusOk) {
            return 0;
        }

        var status = JSON.parse(this.jsonResult)["error_type"];
        if (!status) {
            return -1;
        }

        return parseInt(status);
    };

    this.getErrorType = function () {

        if (this.isInvalidJSONStream) {
            return 0;
        }

        var status;
        if(this.jsonResult) {
            status = JSON.parse(this.jsonResult)["status"];
        }
        if (!status) {
            return -1;
        }
        
        var errorType = JSON.parse(this.jsonResult)["error_type"];
        if (errorType) {
            return parseInt(errorType);
        }
        return -1;
    };


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

/**
 * AceQLHttpApi.js
 * 
 * @author abe
 */

/**
 * AceQL Http API
 * @param {String} serverUrl
 * @param {String} database
 * @param {String} username
 * @param {String} password
 * @returns {AceQLHttpApi}
 */
function AceQLHttpApi(serverUrl, database, username, password) {

    this.serverUrl = serverUrl;
    this.database = database;
    this.username = username;
    this.password = password;
    this.stateless = false;
    this.prettyPrinting = false;

    /**
     * Initialisation
     */
    this.init = function () {
       var url = this.serverUrl + "/database/" + this.database + "/username/" + this.username 
                + "/connect";
                //+ "?password=" + this.password + "&stateless=" + this.stateless;
        var parametersMap = new Map();
        parametersMap.set("password", this.password);
        parametersMap.set("statelass", this.stateless);
        var result = sendPost(url, parametersMap);
        var resultSetAnalyzer = new ResultSetAnalyzer(result);

        if (resultSetAnalyzer.isStatusOk() === false) {
            throw AceQLException(resultSetAnalyzer.getErrorMessage(), resultSetAnalyzer.getErrorType());
        }

        var sessionId = resultSetAnalyzer.getValue("session_id");
        this.url = serverUrl + "/session/" + sessionId + "/";
    };
    
    /**
     * Call action using post method
     * @param {String} action
     * @param {Map} params
     */
    this.callWithPost = function (action, params) {
    	var urlWithAction = this.url + action; 
    	return sendPost(urlWithAction, params);
    };
    
    /**
     * Call action using get method
     * @param action
     * @param actionParameter
     * @returns the json
     */
    this.callWithGet = function(action, actionParameter) {

		var urlWithaction = this.url + action;

		if (actionParameter || actionParameter === false) {
			urlWithaction += "/" + actionParameter;
		}
		return sendGet(urlWithaction);

    };
    /**
     * Defines stateless
     * @param {Boolean} isStateless
     */
    this.setStateless = function (isStateless) {
        this.stateless = isStateless;
    };
    
    /**
     * Defines prettyPrinting
     * @param {Boolean} isPretty
     */
    this.setPrettyPrinting = function (isPretty) {
        this.prettyPrinting = isPretty;
    };

    /**
     * Call api without result
     * @param {type} commandName
     * @param {type} commandOption
     *
     */
    this.callApiNoResult = function (commandName, commandOption) {
        if (!commandName) {
            throw "commandName is null!";
        }

        var result = this.callWithGet(commandName, commandOption);
        var resultAnalyzer = new ResultSetAnalyzer(result);
        
        if (!resultAnalyzer.isStatusOk()) {
            throw new AceQLException(resultAnalyzer.getErrorMessage(),
                    resultAnalyzer.getErrorType());
        }
    };



    /**
     * Call api with a result
     * @param {String} commandName
     * @param {String} commandOption
     * @returns {String} result sent by AceQL Server
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.callApiWithResult = function (commandName, commandOption) {
        if (!commandName) {
            throw "commandName is null!";
        }

        var result = this.callWithGet(commandName, commandOption);
        var resultAnalyzer = new ResultSetAnalyzer(result);
        if (!resultAnalyzer.isStatusOk()) {
            throw new AceQLException(resultAnalyzer.getErrorMessage(),
                    resultAnalyzer.getErrorType());
        }
        return resultAnalyzer.getResult();
    };

    /**
     * Calls /get_version API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.getServerVersion = function () {
        return this.callApiWithResult("get_version", null);
    };

    /**
     * Gets the SDK version
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.getClientVersion = function () {
        return getFullVersion();
    };

    /**
     * Calls /disconnect API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.disconnect = function () {
        this.callApiNoResult("disconnect", null);
    };

    /**
     * Calls /commit API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.commit = function () {
        this.callApiNoResult("commit", null);
    };

    /**
     * Calls /rollback API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.rollback = function () {
        this.callApiNoResult("rollback", null);
    };

    /**
     * Calls /set_transaction_isolation_level API
     * 
     * @param level  the isolation level
     * @throws AceQLException if any Exception occurs
     */
    this.setTransactionIsolation = function (level) {
        this.callApiNoResult("set_transaction_isolation_level", level);
    };

    /**
     * Calls /set_holdability API
     * 
     * @param holdability the holdability
     * @throws AceQLException if any Exception occurs
     */
    this.setHoldability = function (holdability) {
        this.callApiNoResult("set_holdability", holdability);
    };

    /**
     * Calls /set_auto_commit API
     *
     * @param autoCommit
     *            <code>true</code> to enable auto-commit mode;
     *            <code>false</code> to disable it
     * @throws AceQLException if any Exception occurs
     */
    this.setAutoCommit = function (autoCommit) {
        this.callApiNoResult("set_auto_commit", autoCommit);
    };

    /**
     * Calls /get_auto_commit API
     *
     * @return the current state of this <code>Connection</code> object's
     *         auto-commit mode
     * @throws AceQLException if any Exception occurs
     */
    this.getAutoCommit = function () {
        return this.callApiWithResult("get_auto_commit", null);
    };

    /**
     * Calls /is_read_only API
     *
     * @return <code>true</code> if this <code>Connection</code> object is
     *         read-only; <code>false</code> otherwise
     * @throws AceQLException if any Exception occurs
     */
    this.isReadOnly = function () {
        return  this.callApiWithResult("is_read_only", null);
    };

    /**
     * Calls /set_read_only API
     *
     * @param readOnly
     *            <code>true</code> enables read-only mode; {@code false} disables it
     * @throws AceQLException  if any Exception occurs
     */
    this.setReadOnly = function (readOnly) {
        this.callApiNoResult("set_read_only", readOnly + "");
    };

    /**
     * Calls /get_holdability API
     *
     * @return the holdability, one of <code>hold_cursors_over_commit</code> or
     *         <code>close_cursors_at_commit</code>
     * @throws AceQLException if any Exception occurs
     */
    this.getHoldability = function () {
        return this.callApiWithResult("get_holdability", null);
    };

    /**
     * Calls /get_transaction_isolation_level API
     *
     * @return the current transaction isolation level, which will be one of the
     *         following constants: <code>transaction_read_uncommitted</code>,
     *         <code>transaction_read_committed</code>,
     *         <code>transaction_repeatable_read</code>,
     *         <code>transaction_serializable</code>, or
     *         <code>transaction_none</code>.
     * @throws AceQLException  if any Exception occurs
     */
    this.getTransactionIsolation = function () {
        return this.callApiWithResult("get_transaction_isolation_level", null);
    };

    /**
     * Calls /execute_update API
     * 
     * @param sql
     *            an SQL <code>INSERT</code>, <code>UPDATE</code> or
     *            <code>DELETE</code> statement or an SQL statement that returns
     *            nothing
     * @param isPreparedStatement
     *            if true, the server will generate a prepared statement, else a
     *            simple statement
     * @param statementParameters
     *            the statement parameters in JSON format. Maybe null for simple
     *            statement call.
     * @return either the row count for <code>INSERT</code>, <code>UPDATE</code>
     *         or <code>DELETE</code> statements, or <code>0</code> for SQL
     *         statements that return nothing
     * @throws AceQLException if any Exception occurs
     */
    this.executeUpdate = function (sql, isPreparedStatement, statementParameters) {


        if (sql === false) {
            throw new "sql is null!";
        }

        var action = "execute_update";
        var parametersMap = new Map();
        parametersMap.set("sql", sql);
        parametersMap.set("prepared_statement", isPreparedStatement);

        // Add the statement parameters map
        if (statementParameters) {
            for (var [key, value] of statementParameters) {
                parametersMap.set(key, value);
            }
        }

        var result = this.callWithPost(action, parametersMap);
        var resultAnalyzer = new ResultSetAnalyzer(result);

        if (!resultAnalyzer.isStatusOk()) {
            throw new AceQLException(resultAnalyzer.getErrorMessage(),
                    resultAnalyzer.getErrorType());
        }
        
        return resultAnalyzer.getIntValue("row_count");
    };

    /**
     * Calls /execute_query API
     * 
     * @param sql
     *            an SQL <code>INSERT</code>, <code>UPDATE</code> or
     *            <code>DELETE</code> statement or an SQL statement that returns
     *            nothing
     * @param isPreparedStatement
     *            if true, the server will generate a prepared statement, else a
     *            simple statement
     * @param statementParameters
     *            the statement parameters in JSON format. Maybe null for simple
     *            statement call.
     * @return the input stream containing either an error, or the result set in
     *         JSON format. See user documentation.
     * @throws AceQLException if any Exception occurs
     */
    this.executeQuery = function (sql, isPreparedStatement, statementParameters) {

        if (sql === false) {
            throw "sql is null!";
        }

        var action = "execute_query";
        var parametersMap = new Map();
        parametersMap.set("sql", sql);
        parametersMap.set("prepared_statement", isPreparedStatement);
        parametersMap.set("pretty_printing", this.prettyPrinting);
        // Add the statement parameters map
        if (statementParameters) {
            for (var [key, value] of statementParameters) {
                parametersMap.set(key, value);
            }
        }

        return this.callWithPost(action, parametersMap);

    };

}
;

/**
 * Example of AceQLJS Client api
 * 
 * @author abe
 */

/**
 * Log input in console
 * @param {String} input
 */
function printResultSet(input) {
    console.log(input);
}
function ResutlSet(jsonString, statement) {
    this.jsonString = jsonString; 
    this.statement = statement;
    this.data = JSON.parse(this.jsonString);
    
    this.rowCount = this.data.row_count;
};

/**
 * AceQLResultSet.js
 * 
 * @author abe
 */

/**
 * AceQLResultSet
 * @param {String} jsonString
 * @param {Statement} statement
 * @returns {ResutlSet}
 */
var rows;
var rowCount;
var currentIndex;
var currentRow;
var colsByName;

function AceQLResultSet(jsonString, statement) {
    this.jsonString = jsonString; 
    this.statement = statement;
    var data = JSON.parse(this.jsonString);
    if(data.status === "OK") {
        rowCount = data.row_count;
        rows = data.query_rows;
        currentIndex = 0;
        colsByName = new Map();
        
    } else {
        currentIndex = -1;
        rowCount = -1;
    }
    
    this.splitRow = function() {
        colsByName = new Map();
            Object.keys(currentRow).forEach(function (rowKey) {
                var rowValue = currentRow[rowKey];
                if (rowValue.constructor === Array) {
                    Object.keys(rowValue).forEach(function (k) {
                        var cols = rowValue[k];
                        Object.keys(cols).forEach(function (colName) {
                            var colVal = cols[colName];
                            colsByName.set(colName, colVal);
                        });
                    });
                }
            });
    };
    
    /**
     * @returns {Boolean} false if last result had been reached true otherwise
     */
    this.next = function () {
        if(currentIndex === rowCount) {
            return false;
        }
        currentIndex = currentIndex + 1;
        var rowIndex = 'row_' + currentIndex;
        var tempObj = rows[0];
        currentRow = new Array(tempObj[rowIndex]);
        this.splitRow();
        return true;
    };

    /**
     * @param {Any} param
     * @returns {Boolean} True if param is an Integer
     */
    this.isInteger = function(param) {
      return typeof(param) === 'number' &&
            isFinite(param) && Math.round(param) === param;
    };
    
    /**
     * Get value of column for index or name
     * @param {type} colIndex
     * @returns {Object}
     */
    this.getValue = function (colIndex) {
        if(this.isInteger(colIndex)) {
            var colKeys = Array.from(colsByName.keys());
            var searchedKey = colKeys[colIndex-1];
            return colsByName.get(searchedKey);
        } else {
            return colsByName.get(colIndex);
        }
    };
    
    /**
     * Get boolean column for index or name
     * @param {Integer | String} column index or name
     * @returns {Boolean} value
     */
    this.getBoolean = function (column) {
      return new Boolean(this.getValue(column));
    };
    
    /**     
     * Get Short column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */
    this.getShort = function (column) {
	return new Number(this.getValue(column));
    };

    /**     
     * Get Integer column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */
    this.getInt = function (column) {
	return new Number(this.getValue(column));
    };

    /**     
     * Get Long column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */
    this.getLong = function (column) {
	return new Number(this.getValue(column));
    };

    /**     
     * Get Float column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */
    this.getFloat = function (column) {
	return new Number(this.getValue(column));
    };

    /**     
     * Get Double column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */
    this.getDouble = function (column) {
	return new Number(this.getValue(column));
    };
    
    /**     
     * Get BigDecimal column for index or name
     * @param {Integer | String} column index or name
     * @returns {Number} value
     */   
    this.getBigDecimal = function (column) {
	return new Number(this.getValue(column));
    };

    /**
     * Get String column for index or name
     * @param {Integer | String} column index or name
     * @returns {String} value
     */
    this.getString = function (column) {
	return this.getValue(column);
    };

    /**     
     * Get Date column for index or name
     * @param {Integer | String} column index or name
     * @returns {Date} value
     */
    this.getDate = function (column) {
	return new Date(this.getValue(column));
    };

    /**     
     * Get Time column for index or name
     * @param {Integer | String} column index or name
     * @returns {Date} value
     */
    this.getTime = function (column) {
	return new Date(this.getValue(column));
    };

    /**     
     * Get Timestamp column for index or name
     * @param {Integer | String} column index or name
     * @returns {Date} value
     */
    this.getTimestamp = function (column) {
	return new Date(this.getValue(column));
    };
    
};



/**
 * Build an AceQLConnection
 * @param {String} serverUrl
 * @param {String} database
 * @param {String} username
 * @param {String} password
 * @returns {AceQLConnection}
 */
function AceQLConnection (serverUrl, database, username, password) {
    this.serverUrl = serverUrl;
    this.database = database;
    this.username = username;
    this.password = password;
    
    this.aceQLHttpApi = new AceQLHttpApi(serverUrl, database, username, password);
    this.aceQLHttpApi.init();
    /**
     * Close connection (disconnect from server)
     */
    this.close = function () {
        this.aceQLHttpApi.disconnect();
    };
    
    /**
     * Commit current transaction
     */
    this.commit = function () {
        this.aceQLHttpApi.commit();
    };
    
    /**
     * Rollback transaction
     */
    this.rollback = function (){
	this.aceQLHttpApi.rollback();
    };
    
    /**
     * Define transaction isolation level
     * @param {Integer} level
     */
    this.setTransactionIsolation = function (level) {
      this.aceQLHttpApi.setTransactionIsolation(level);  
    };
    
    /**
     * Define the holdability
     * @param {String} holdability
     */
    this.setHoldability = function (holdability) {
        this.aceQLHttpApi.setHoldability(holdability);
    };
    
    /**
     * Define autocommit
     * @param {Boolean} autoCommit
     */
    this.setAutoCommit = function(autoCommit) {
      this.aceQLHttpApi.setAutoCommit(autoCommit);  
    };
    
    /**
     * True if connection is autocommit
     * @returns {Boolean}
     */
    this.getAutoCommit = function () {
        return this.aceQLHttpApi.getAutoCommit();
    };
    
    /**
     * Define read only
     * @param {Boolean} readOnly
     */
    this.setReadOnly = function (readOnly) {
        return this.aceQLHttpApi.setReadOnly(readOnly);
    };
    
    /**
     * True if connection is readonly 
     * @returns {Boolean}
     */
    this.isReadOnly = function () {
        return this.aceQLHttpApi.isReadOnly();
    };
    
    /**
     * 
     * @returns {String} the holdability
     */
    this.getHoldability = function () {
        return this.aceQLHttpApi.getHoldability();
    };
    
    /**
     * 
     * @returns {String} the transaction isolation
     */
    this.getTransactionIsolation = function () {
        return this.aceQLHttpApi.getTransactionIsolation();
    };
    
    
    /**
     * Initiate a prepared Statement
     * @param {String} sql
     */
    this.prepareStatement = function (sql) {
        this.queryString = sql;
        this.builder = new PrepStatementParametersBuilder();
    };
    
    /**
     * Set null param for index
     * @param {Integer} parameterIndex
     * @param {String} sqlType
     */
    this.setNull = function (parameterIndex, sqlType) {
        this.builder.setParameter(parameterIndex, TYPE_NULL + sqlType);
    };
    
    /**
     * Set boolean param for index
     * @param {Integer} parameterIndex
     * @param {Boolean} x value
     */
    this.setBoolean = function (parameterIndex, x) {
      this.builder.setParameter(parameterIndex, BIT, x);  
    };
    
    /**
     * Set short parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setShort = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, TINYINT, x);
    };

    /**
     * Set Integer parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x
     */
    this.setInt = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, INTEGER, x);
    };

    /**
     * Set Long parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setLong = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, BIGINT, x);
    };

    /**
     *  Set Float parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setFloat = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, REAL, x);
    };

    /**
     * Set double parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setDouble = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, DOUBLE_PRECISION, x);
    };
    
    /**
     * Set Big decimal parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */    
    this.setBigDecimal = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, DOUBLE_PRECISION, x);
    };

    /**
     * Set String parameter for index
     * @param {Integer} parameterIndex
     * @param {String} x value
     */
    this.setString = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, VARCHAR, x);
    };

    /**
     * Set Date parameter for index
     * @param {Integer} parameterIndex
     * @param {Date} x value
     */
    this.setDate = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, DATE, x.getTime());
    };

    /**
     * Set Time parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setTime = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, TIME, x.getTime());
    };

    /**
     * Set Timestamp parameter for index
     * @param {Integer} parameterIndex
     * @param {Date} x value
     */
    this.setTimestamp = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, TIMESTAMP, x.getTime());
    };

     /**
     * Set URL parameter for index
     * @param {Integer} parameterIndex
     * @param {String} x value
     */   
    this.setURL = function (parameterIndex, x) {
	builder.setParameter(parameterIndex, URL, x);
    };
    
    /**
     * Execute an update query
     * @param {type} sql query to execute (not used in prepared stament context)
     * @returns {Number} the number of rows affected by update
     */
    this.executeUpdate = function (sql) {
        if(sql) {
            return this.aceQLHttpApi.executeUpdate(sql, false);
        } else {
            var parameters = this.builder.getStatementParameters();
            return this.aceQLHttpApi.executeUpdate(this.queryString, true, parameters);
        }
    };

    /**
     * Execute a query
     * @param {String} sql query to execute (not used in prepared stament context)
     * @returns {AceQLResultSet}
     */    
    this.executeQuery = function (sql) {
        if(sql) {
            var result = this.aceQLHttpApi.executeQuery(sql, false);
            return new AceQLResultSet(result);
        } else {
            var parameters = this.builder.getStatementParameters();
            var result = this.aceQLHttpApi.executeQuery(this.queryString, true, parameters);
            return new AceQLResultSet(result);
        }
    };
};

this.remoteConnectionBuilder = function () {
    var serverUrl = "http://localhost:9090/aceql";
    var database = "kawansoft_example";
    var username = "User1";
    var password = "password1";
    return new AceQLConnection(serverUrl, database, username, password);
};

/**
 * Example of 2 INSERT in the same transaction.
 * @param {type} connection
 * @param {type} customerId
 * @param {type} itemId
 * 
 */
this.insertCustomerAndOrderLog = function (connection, customerId, itemId) {
    connection.setAutoCommit(false);   
    
    var sql = "INSERT INTO CUSTOMER VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )";
    connection.prepareStatement(sql);
    var i = 1;
    connection.setInt(i++, customerId);
    connection.setString(i++, "Sir");
    connection.setString(i++, "Doe");
    connection.setString(i++, "John");
    connection.setString(i++, "1 Madison Ave");
    connection.setString(i++, "New York");
    connection.setString(i++, "NY 10010");
    connection.setString(i++, null);
    console.log("Execute update");
    connection.executeUpdate();
    
    connection.commit();
     console.log("update done");
    sql = "INSERT INTO ORDERLOG (customer_id, item_id, description, item_cost, date_placed, date_shipped, is_delivered, quantity) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.prepareStatement(sql);
    
    var now = new Date();
    i = 1;
    connection.setInt(i++, customerId);
    connection.setInt(i++, itemId);
    connection.setString(i++, "Item Description");
    connection.setBigDecimal(i++, 99.99);
    connection.setDate(i++, now);
    connection.setTimestamp(i++, now);
    connection.setInt(i++, 1);
    connection.setInt(i++, 2);
    console.log("insert orderlog");
    try{
    connection.executeUpdate();
    }
    catch(error) {
        console.log(error);
    }
    console.log("insert orderlog done");
    connection.commit();
    connection.setAutoCommit(true);
};

/**
 * Example of 2 SELECT
 * @param {type} connection
 * @param {type} customerId
 * @param {type} itemId
 * 
 */
this.selectCustomerAndOrderLog = function (connection, customerId, itemId) {
    var sql = "SELECT CUSTOMER_ID, FNAME, LNAME FROM CUSTOMER "
		+ " WHERE CUSTOMER_ID = ?";
    connection.prepareStatement(sql);
    connection.setInt(1, customerId);

    var rs = connection.executeQuery();
    while (rs.next()) {
        var customerId2 = rs.getInt("customer_id");
        var fname = rs.getString("fname");
        var lname = rs.getString("lname");

        console.log("");
        console.log("customer_id: " + customerId2);
        console.log("fname      : " + fname);
        console.log("lname      : " + lname);
    }

    connection.setAutoCommit(false);

    // Display the created Order
    sql = "SELECT * FROM ORDERLOG WHERE  customer_id = ? AND item_id = ? ";

    connection.prepareStatement(sql);

    var i = 1;
    connection.setInt(i++, customerId);
    connection.setInt(i++, itemId);

    rs = connection.executeQuery();

    console.log();

    if (rs.next()) {
        var customerId2 = rs.getInt("customer_id");
        var itemId2 = rs.getInt("item_id");
        var description = rs.getString("description");
        var itemCost = rs.getBigDecimal("item_cost");
        var datePlaced = rs.getDate("date_placed");
        var dateShipped = rs.getTimestamp("date_shipped");
        
        var is_delivered = (rs.getInt("is_delivered") === 1) ? true
                : false; 
        var quantity = rs.getInt("quantity");

        console.log("customer_id : " + customerId2);
        console.log("item_id     : " + itemId2);
        console.log("description : " + description);
        console.log("item_cost   : " + itemCost);
        console.log("date_placed : " + datePlaced);
        console.log("date_shipped: " + dateShipped);
        console.log("is_delivered: " + is_delivered);
        console.log("quantity    : " + quantity);       
    }
    connection.setAutoCommit(true);
};

/**
 * Delete an existing customers
 * @param {type} connection
 * @param {type} customerId
 * @returns {undefined}
 */
this.deleteCustomer = function (connection, customerId) {
	var sql = "delete from customer where customer_id = ?";
	connection.prepareStatement(sql);
	connection.setInt(1, customerId);

	connection.executeUpdate();

};

/**
 * Delete an existing order log
 * @param {type} connection
 * @param {type} customerId
 * @param {type} idemId
 * @returns {undefined}
 */
this.deleteOrderlog = function (connection, customerId, idemId) {
	var sql = "delete from orderlog where customer_id = ? and item_id = ? ";
	connection.prepareStatement(sql);
	connection.setInt(1, customerId);
	connection.setInt(2, idemId);

	connection.executeUpdate();

 };
 
function testAceQL(){
    var doDelete = true;
    var doInsert = true;
    var doSelect = true;
    var testDisconnection = true;
    console.log("*******************************************************");
    console.log("*               AceQLHttpAPI TESTS                   **");
    console.log("*******************************************************");
    
    var connection = this.remoteConnectionBuilder();
    
    var customerId = 1;	
    var itemId = 1;
    if(doDelete){
        console.log("deleting customer...");
        // Delete previous instances, so that user can recall class
        this.deleteCustomer(connection, customerId);
        console.log("deleting orderlog...");
        this.deleteOrderlog(connection, customerId, itemId);
    }
    if(doInsert) {
        console.log("inserting customer and orderlog...");
        this.insertCustomerAndOrderLog(connection, customerId, itemId);
    }
    if(doSelect) {
        console.log("Select cutstomer and orderlog...");
        this.selectCustomerAndOrderLog(connection, customerId, itemId);
    }
    connection.close();
     if(testDisconnection) {
        try {
            console.log("Select cutstomer and orderlog, but we are disconnected...");
            this.selectCustomerAndOrderLog(connection, customerId, itemId);
        } catch (error) {
            console.log(error.reason);
        }
    }
    console.log("*******************************************************");
    console.log("*                  END                               **");
    console.log("*******************************************************");
}



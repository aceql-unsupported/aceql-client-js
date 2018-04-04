import ResultSetAnalyzer from 'ResultSetAnalyzer.js';
import sendGet from 'AceQLConnectionUtil.js';
import sendPost from 'AceQLConnectionUtil.js'
import UserLoginStore from 'UserLoginStore.js'
import version from 'Version.js';

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
        var userLoginStore = new UserLoginStore(serverUrl, username, database);
        
        if(userLoginStore.isAlreadyLogged()) {
            var sessionId = userLoginStore.getSessionId();
		
            var theUrl = serverUrl + "/session/" + sessionId + "/get_connection";
            var result = sendGet(theUrl);
		
	    var resultAnalyzer = new ResultSetAnalyzer(result);

            if (!resultAnalyzer.isStatusOk() === false) {
                throw new AceQLException(resultAnalyzer.getErrorMessage(),
                        resultAnalyzer.getErrorType());
            }

            var connectionId = resultAnalyzer.getValue("connection_id");
            trace("Ok. New Connection created: " + connectionId);

            this.url = serverUrl + "/session/" + sessionId + "/connection/" + connectionId + "/";
        } else {
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
            var connectionId = resultSetAnalyzer.getValue("connection_id");
            this.url = serverUrl + "/session/" + sessionId + "/connection/" + connectionId + "/";
            userLoginStore.setSessionId(sessionId);
        }
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
        return version.getFullVersion();
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
     * Calls /close API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.close = function() {
        this.callApiNoResult("close", null);
    };
    
    /**
     * Calls /logout API
     * 
     * @throws AceQLException if any Exception occurs
     */
    this.logout = function() {
        var loginStore = new UserLoginStore(serverUrl, username, database);
	loginStore.remove();
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

        return resultAnalyzer.getIntvalue("row_count");
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

};
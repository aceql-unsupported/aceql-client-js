/**
 * AceQLConnection.js
 * 
 * @author abe
 */
import AceQLHttpApi from 'AceQLHttpApi';
import * as AceQLTypes from 'AceQLTypes';

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
    
    
    // If undefined 
    this.aceQLHttpApi = new AceQLHttpApi(this.serverUrl, database, username, password);
    this.aceQLHttpApi.init();
    //Else
    //
    /**
     * Close connection
     */
    this.close = function () {
        
        this.aceQLHttpApi.close();
    };
    
    /**
     * Logout
     */
    this.logout = function () {
        this.aceQLHyttpApi.logout();
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
        this.builder.setParameter(parameterIndex, AceQLTypes.TYPE_NULL + sqlType);
    };
    
    /**
     * Set boolean param for index
     * @param {Integer} parameterIndex
     * @param {Boolean} x value
     */
    this.setBoolean = function (parameterIndex, x) {
      this.builder.setParameter(parameterIndex, AceQLTypes.BIT, x);  
    };
    
    /**
     * Set short parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setShort = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.TINYINT, x);
    };

    /**
     * Set Integer parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x
     */
    this.setInt = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.INTEGER, x);
    };

    /**
     * Set Long parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setLong = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.BIGINT, x);
    };

    /**
     *  Set Float parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setFloat = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.REAL, x);
    };

    /**
     * Set double parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setDouble = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.DOUBLE_PRECISION, x);
    };
    
    /**
     * Set Big decimal parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */    
    this.setBigDecimal = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.DOUBLE_PRECISION, x);
    };

    /**
     * Set String parameter for index
     * @param {Integer} parameterIndex
     * @param {String} x value
     */
    this.setString = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.VARCHAR, x);
    };

    /**
     * Set Date parameter for index
     * @param {Integer} parameterIndex
     * @param {Date} x value
     */
    this.setDate = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.DATE, x.getTime());
    };

    /**
     * Set Time parameter for index
     * @param {Integer} parameterIndex
     * @param {Number} x value
     */
    this.setTime = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.TIME, x.getTime());
    };

    /**
     * Set Timestamp parameter for index
     * @param {Integer} parameterIndex
     * @param {Date} x value
     */
    this.setTimestamp = function (parameterIndex, x) {
	this.builder.setParameter(parameterIndex, AceQLTypes.TIMESTAMP, x.getTime());
    };

     /**
     * Set URL parameter for index
     * @param {Integer} parameterIndex
     * @param {String} x value
     */   
    this.setURL = function (parameterIndex, x) {
	builder.setParameter(parameterIndex, AceQLTypes.URL, x);
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

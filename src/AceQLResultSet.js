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
/* 
 * AceQLTypes.js
 * 
 * @author abe
 */


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
    types.push(TYPE_NULL);
    return types;
}
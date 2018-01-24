import * as AceQLTypes from 'AceQLTypes';
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
    
    /**
     * @param {Integer} parameter index
     * @param {String} parameter type
     * @param {object} parameter value
     */
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
    
    /**
     * @return this.statementParameters
     */
    this.getStatementParameters = function () {
        return this.statementParameters;
    };
}

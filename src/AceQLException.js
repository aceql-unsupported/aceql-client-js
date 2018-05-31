/**
 * AceQLException.java
 * 
 * @author abe
 */

/**
 * Object thrown when a problem occurs
 * @param {type} reason
 * @param {type} vendorCode
 * @returns {AceQLException}
 */
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

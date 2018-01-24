/**
 * Version.js
 * 
 * @author abe
 */

const CR_LF = "\n";

const PRODUCT_NAME = "AceQL REST JS SDK";
const PRODUCT_VERSION = "1.0-beta.1";
const PRODUCT_DESCRIPTION = "AceQL Client for javascript";
const PRODUCT_DATE = "05/12/2017";

const VENDOR_NAME = "KawanSoft SAS";
const VENDOR_WEB = "http://www.kawansoft.com";
const VENDOR_COPYRIGHT = "Copyright &copy; 2017";
const VENDOR_EMAIL = "contact@kawansoft.com";

/**
 * @returns Version of product
 */
function getVersion() {
    return PRODUCT_NAME + " " + PRODUCT_VERSION + " " + PRODUCT_VERSION;
}

/**
 * @returns vendor 
 */
function getVendor() {
    return VENDOR_NAME + " - " + VENDOR_WEB;
}

/**
 * @returns The full version
 */
function getFullVersion() {
    return PRODUCT_DESCRIPTION + CR_LF + getVersion() + CR_LF + getVendor();
}


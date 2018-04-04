/**
 * UserLoginStore.js
 * 
 * @author abe
 */


var serverUrl;
var username;
var database;

/** The map of logged users (serverUrl/username/database, session_id) */
UserLoginStore.loggedUsers = new Map();

/**
 * UserLoginStore
 * @param {type} serverUrl
 * @param {type} username
 * @param {type} database
 * @returns {UserLoginStore}
 */
function UserLoginStore(serverUrl, username, database) {
    this.serverUrl = serverUrl;
    this.username = username;
    this.database = database;
    
    /**
     *  Builds the Map key for the (serverUrl, username, database) triplet key.
     * @returns the key
     */
    this.buildKey = function () {
	return this.serverUrl + "/" + this.username + "/" + this.database;
    };
    
    /**
     * says if user is already logged (ie. it exist a session_if for (serverUrl, username, database) triplet.
     * @returns true/false
     */
    this.isAlreadyLogged = function () {
	var key = this.buildKey();
	return UserLoginStore.loggedUsers.has(key);
    };
    
    /**
     * Returns the session Id of logged user with (serverUrl, username, database) triplet.
     * @returns session Id
     */
    this.getSessionId = function () {
	var key = this.buildKey();
	var sessionId = UserLoginStore.loggedUsers.get(key);
	return sessionId;
    };
    
    /**
     * Stores the session Id of a logged user with (serverUrl, username, database) triplet.
     * @param {type} sessionId
     */
    this.setSessionId = function (sessionId) {
	var key = this.buildKey();
	UserLoginStore.loggedUsers.set(key, sessionId);
    };
    
    /**
     * Removes (serverUrl, username, database) triplet. This is to be called at /logout API.
     */
    this.remove = function () {
	var key = this.buildKey();
	loggedUsers.remove(key);
    };
};

